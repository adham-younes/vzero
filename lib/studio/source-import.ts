import 'server-only'
import {InputError} from '@/lib/account-validation'
import {acceptedSourceExtensions,sourceMaxBytes,uploadMaxBytes,type SourceFormat} from './source-limits'
import {inspectOfficeArchive} from './source-archive'

export type ImportedSource={title:string;content:string;format:SourceFormat;notices:string[]}
const invalidControls=/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/
export function reviewedSourceText(value:unknown){
 if(typeof value!=='string')throw new InputError('invalid_input')
 // Preserve the reviewed bytes (including CRLF) so idempotent source-add replays stay exact.
 const content=value.trim()
 if(!content)throw new InputError('source_file_empty')
 if(Buffer.byteLength(content,'utf8')>sourceMaxBytes)throw new InputError('source_text_too_large',413)
 if(invalidControls.test(content))throw new InputError('source_file_unreadable')
 return content
}
function textCollector(){
 const parts:string[]=[];let bytes=0
 return {add(value:string){bytes+=Buffer.byteLength(value,'utf8');if(bytes>sourceMaxBytes)throw new InputError('source_text_too_large',413);parts.push(value)},text(){return parts.join('')}}
}
async function beforeDeadline<T>(operation:Promise<T>,deadline:number,signal:AbortSignal,onStop?:()=>void){
 let timer:ReturnType<typeof setTimeout>|undefined,abort:(()=>void)|undefined
 const stopped=new Promise<never>((_resolve,reject)=>{
  abort=()=>{onStop?.();reject(new InputError('source_import_timeout',408))}
  timer=setTimeout(abort,Math.max(1,deadline-Date.now()))
  if(signal.aborted)abort();else signal.addEventListener('abort',abort,{once:true})
 })
 try{return await Promise.race([operation,stopped])}finally{if(timer)clearTimeout(timer);if(abort)signal.removeEventListener('abort',abort)}
}
async function pdfText(buffer:Buffer,deadline:number,signal:AbortSignal){
 const {getResolvedPDFJS}=await import('unpdf'),{getDocument}=await getResolvedPDFJS()
 // Binary data only: no URL, external fonts/CMaps, JavaScript evaluation, image rendering or OCR.
 const task=getDocument({data:new Uint8Array(buffer),useSystemFonts:false,disableFontFace:true,useWorkerFetch:false,useWasm:false,disableAutoFetch:true,disableStream:true,maxImageSize:0,stopAtErrors:true,verbosity:0})
 const stop=()=>{void task.destroy().catch(()=>{})}
 try{
  const pdf=await beforeDeadline(task.promise,deadline,signal,stop)
  if(pdf.numPages>200)throw new InputError('source_file_complex',413)
  const out=textCollector();let items=0,hasText=false
  for(let number=1;number<=pdf.numPages;number++){
   const page=await beforeDeadline(pdf.getPage(number),deadline,signal,stop),reader=page.streamTextContent().getReader()
   try{
    while(true){
     const {done,value}=await beforeDeadline(reader.read(),deadline,signal,stop);if(done)break
     for(const item of value.items){
      if(++items>100000)throw new InputError('source_file_complex',413)
      if(typeof item.str==='string'){if(item.str.trim())hasText=true;out.add(item.str+(item.hasEOL?'\n':' '))}
     }
    }
    out.add('\n\n')
   }finally{await reader.cancel().catch(()=>{});reader.releaseLock();page.cleanup()}
  }
  if(!hasText)throw new InputError('source_pdf_scanned')
  return out.text()
 }catch(error){
  if(error&&typeof error==='object'&&'name'in error&&error.name==='PasswordException')throw new InputError('source_file_encrypted')
  throw error
 }finally{await task.destroy().catch(()=>{})}
}
function cellText(value:unknown){
 const text=value instanceof Date?value.toISOString():value===null||value===undefined?'':String(value)
 // TSV quotes retain cell boundaries when a cell itself contains a tab or newline.
 return /[\t\r\n"]/.test(text)?`"${text.replaceAll('"','""')}"`:text
}
export async function extractSourceFile(file:File,signal:AbortSignal):Promise<ImportedSource>{
 const extension='.'+(file.name.split('.').at(-1)||'').toLowerCase()
 if(!acceptedSourceExtensions.includes(extension as typeof acceptedSourceExtensions[number]))throw new InputError('source_file_unsupported',415)
 if(file.size>uploadMaxBytes)throw new InputError('source_file_too_large',413)
 if(!file.size)throw new InputError('source_file_empty')
 const format=extension.slice(1) as SourceFormat,buffer=Buffer.from(await file.arrayBuffer()),deadline=Date.now()+25000,notices:string[]=[]
 let content:string
 try{
  if(format==='pdf'){
   if(!buffer.subarray(0,1024).includes(Buffer.from('%PDF-')))throw new InputError('source_file_unsupported',415)
   content=await pdfText(buffer,deadline,signal);notices.push('pdf_layout_review')
  }else if(format==='docx'||format==='xlsx'){
   // Encrypted OOXML uses an OLE container instead of a normal ZIP package.
   if(buffer.subarray(0,8).equals(Buffer.from('d0cf11e0a1b11ae1','hex')))throw new InputError('source_file_encrypted')
   if(buffer.readUInt32LE(0)!==0x04034b50)throw new InputError('source_file_unsupported',415)
   const preflightStop=new AbortController(),preflightSignal=AbortSignal.any([signal,preflightStop.signal])
   const {hiddenSheets}=await beforeDeadline(inspectOfficeArchive(buffer,format,deadline,preflightSignal),deadline,signal,()=>preflightStop.abort())
   if(format==='docx'){
    const mammoth=await import('mammoth')
    if(signal.aborted||Date.now()>deadline)throw new InputError('source_import_timeout',408)
    // Buffer-only raw-text conversion uses Mammoth's default disabled external-file access.
    const result=await beforeDeadline(mammoth.extractRawText({buffer}),deadline,signal)
    if(result.messages.some(message=>message.type==='error'))throw new InputError('source_file_unreadable')
    content=result.value;notices.push('docx_layout_review')
   }else{
    // ArrayBuffer path reads the ZIP central directory, matching the bounded preflight.
    // The streaming Node entry point can also see unindexed local ZIP entries, so it is not used.
    const {default:readWorkbook}=await import('read-excel-file/universal')
    if(signal.aborted||Date.now()>deadline)throw new InputError('source_import_timeout',408)
    const sheets=await beforeDeadline(readWorkbook(new Uint8Array(buffer).buffer),deadline,signal),out=textCollector();let values=0
    if(sheets.length>20)throw new InputError('source_file_complex',413)
    for(const sheet of sheets){
     if(hiddenSheets.has(sheet.sheet))continue
     if(sheet.data.length>10000)throw new InputError('source_file_complex',413)
     const rows=sheet.data.filter(row=>row.some(value=>value!==null&&value!==''))
     if(!rows.length)continue
     out.add(`[Sheet: ${sheet.sheet}]\n`)
     for(const row of rows){
      if(row.length>256)throw new InputError('source_file_complex',413)
      values+=row.filter(value=>value!==null&&value!=='').length
      if(values>50000)throw new InputError('source_file_complex',413)
      out.add(row.map(cellText).join('\t')+'\n')
     }
     out.add('\n')
    }
    content=out.text();notices.push('xlsx_values_only');if(hiddenSheets.size)notices.push('xlsx_hidden_sheets_omitted')
   }
  }else{
   content=new TextDecoder('utf-8',{fatal:true}).decode(buffer)
   content=reviewedSourceText(content)
   if(format==='json')JSON.parse(content)
  }
  if(signal.aborted||Date.now()>deadline)throw new InputError('source_import_timeout',408)
  const title=file.name.split(/[\\/]/).at(-1)!.slice(0,-extension.length).replace(/[\u0000-\u001F\u007F]/g,'').trim().slice(0,160)||'Imported document'
  return {title,content:reviewedSourceText(content),format,notices}
 }catch(error){if(error instanceof InputError)throw error;throw new InputError('source_file_unreadable')}
}
