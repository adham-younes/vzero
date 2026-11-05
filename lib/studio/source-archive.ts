import 'server-only'
import {fromBufferPromise} from 'yauzl'
import type {Readable} from 'node:stream'
import {parser as xmlParser,type Tag,type SAXOptions} from 'sax'
import {InputError} from '@/lib/account-validation'

const maxExpandedBytes=24*1024*1024,maxEntryBytes=8*1024*1024
const complex=()=>new InputError('source_file_complex',413)
const unreadable=()=>new InputError('source_file_unreadable')
function attribute(tag:Tag,name:string){const value=tag.attributes[name];return typeof value==='string'?value:''}
function cellPosition(value:string){
 const match=/^\$?([A-Z]{1,3})\$?([1-9][0-9]{0,6})$/.exec(value)
 if(!match)throw unreadable()
 let column=0;for(const char of match[1])column=column*26+char.charCodeAt(0)-64
 const row=Number(match[2]);if(column>256||row>10000)throw complex()
 return {row,column}
}

/** Drain and validate every ZIP member before a document parser can expand it in memory. */
export async function inspectOfficeArchive(buffer:Buffer,format:'docx'|'xlsx',deadline:number,signal:AbortSignal){
 if(signal.aborted||Date.now()>deadline)throw new InputError('source_import_timeout',408)
 const zip=await fromBufferPromise(buffer,{lazyEntries:true,validateEntrySizes:true,strictFileNames:true})
 let activeStream:Readable|undefined
 // No error argument: abort can arrive before an async iterator attaches its error listener.
 const stop=()=>{activeStream?.destroy();zip.close()}
 const checkActive=()=>{if(signal.aborted||Date.now()>deadline){stop();throw new InputError('source_import_timeout',408)}}
 signal.addEventListener('abort',stop,{once:true})
 const paths=new Set<string>(),hiddenSheets=new Set<string>()
 let expanded=0,entries=0,elements=0,cells=0,rows=0,sheets=0,declaredSheets=0,sharedStrings=0,rectangles=0
 try{
  checkActive()
  for await(const entry of zip.eachEntry()){
   checkActive()
   const path=entry.fileName
   if(++entries>512||paths.has(path)||path.length>300)throw complex()
   paths.add(path)
   if(entry.isEncrypted())throw new InputError('source_file_encrypted')
   expanded+=entry.uncompressedSize
   if(!Number.isSafeInteger(expanded)||expanded>maxExpandedBytes||entry.uncompressedSize>maxEntryBytes||entry.uncompressedSize>Math.max(1024,entry.compressedSize)*200)throw complex()
   if(![0,8].includes(entry.compressionMethod))throw unreadable()
   if(path.endsWith('/'))continue
   const header=await zip.readLocalFileHeaderPromise(entry)
   checkActive()
   if(header.fileName.toString('utf8')!==path||header.compressionMethod!==entry.compressionMethod||header.generalPurposeBitFlag!==entry.generalPurposeBitFlag)throw unreadable()
   const isXml=/\.(?:xml|rels)$/i.test(path)
   let worksheet=false,depth=0,maxRow=0,maxColumn=0,actual=0
   const xml=isXml?xmlParser(true,{strictEntities:true,position:false} as SAXOptions & {strictEntities:boolean}):null
   if(xml){
    xml.onerror=()=>{throw unreadable()}
    xml.ondoctype=()=>{throw unreadable()}
    xml.onsgmldeclaration=()=>{throw unreadable()}
    xml.onopentag=node=>{
     const tag=node as Tag,name=tag.name.split(':').at(-1)
     if(++depth>128||++elements>300000)throw complex()
     if(format==='xlsx'){
      if(depth===1&&name==='worksheet'){worksheet=true;if(++sheets>20)throw complex()}
      if(path==='xl/workbook.xml'&&name==='sheet'){
       if(++declaredSheets>20)throw complex()
       const state=attribute(tag,'state'),name=attribute(tag,'name')
       if(state==='hidden'||state==='veryHidden')hiddenSheets.add(name)
      }
      if(name==='si'&&++sharedStrings>50000)throw complex()
      if(worksheet){
       if(name==='row'){
        if(++rows>20000)throw complex()
        const row=attribute(tag,'r');if(row&&(!/^[1-9][0-9]{0,4}$/.test(row)||Number(row)>10000))throw complex()
       }
       if(name==='c'){
        if(++cells>50000)throw complex()
        const position=cellPosition(attribute(tag,'r'));maxRow=Math.max(maxRow,position.row);maxColumn=Math.max(maxColumn,position.column)
        if(maxRow*maxColumn>200000)throw complex()
       }
       if(name==='dimension')for(const ref of attribute(tag,'ref').split(':'))if(ref)cellPosition(ref)
      }
     }
    }
    xml.onclosetag=()=>{depth--}
   }
   const stream=await zip.openReadStreamPromise(entry),decoder=new TextDecoder('utf-8',{fatal:true})
   activeStream=stream
   try{
    checkActive()
    for await(const chunk of stream){
     checkActive()
     actual+=chunk.length
     if(actual>entry.uncompressedSize||actual>maxEntryBytes)throw complex()
     if(xml)xml.write(decoder.decode(chunk,{stream:true}))
    }
    checkActive()
    if(actual!==entry.uncompressedSize)throw unreadable()
    if(xml)xml.write(decoder.decode()).close()
   }finally{activeStream=undefined;stream.destroy()}
   if(worksheet){rectangles+=maxRow*maxColumn;if(rectangles>500000)throw complex()}
  }
  checkActive()
  if(!paths.has('[Content_Types].xml')||!paths.has(format==='docx'?'word/document.xml':'xl/workbook.xml'))throw unreadable()
  if(format==='xlsx'&&!sheets)throw unreadable()
  return {hiddenSheets}
 }catch(error){
  if(signal.aborted||Date.now()>deadline)throw new InputError('source_import_timeout',408)
  throw error
 }finally{signal.removeEventListener('abort',stop);stop()}
}
