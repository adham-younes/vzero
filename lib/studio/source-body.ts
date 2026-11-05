import 'server-only'
import {InputError} from '@/lib/account-validation'
import {sourceMaxBytes,uploadMaxBytes} from './source-limits'

export function assertSourceOrigin(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)throw new InputError('invalid_origin',403)
}
async function boundedBody(request:Request,maxBytes:number,code:string){
 const advertised=request.headers.get('content-length')
 if(advertised&&(!/^\d+$/.test(advertised)||Number(advertised)>maxBytes))throw new InputError(code,413)
 const reader=request.body?.getReader();if(!reader)throw new InputError('invalid_input')
 const chunks:Uint8Array[]=[];let size=0
 try{
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new InputError(code,413)}chunks.push(value)}
 }finally{reader.releaseLock()}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
 return bytes
}
export async function readSourceMutation(request:Request){
 assertSourceOrigin(request)
 if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))throw new InputError('invalid_content_type',415)
 // JSON escaping can enlarge the reviewed text; only this endpoint gets the larger body allowance.
 const bytes=await boundedBody(request,sourceMaxBytes*3+16384,'source_text_too_large')
 let body:unknown
 try{body=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes))}catch{throw new InputError('invalid_input')}
 if(!body||typeof body!=='object'||Array.isArray(body))throw new InputError('invalid_input')
 return body as Record<string,unknown>
}
export async function readSourceUpload(request:Request){
 assertSourceOrigin(request)
 const contentType=request.headers.get('content-type')||''
 if(!/^multipart\/form-data\s*;/i.test(contentType))throw new InputError('invalid_content_type',415)
 // Leave room for a normal multipart envelope while staying below Vercel's request limit.
 const bytes=await boundedBody(request,uploadMaxBytes+65536,'source_file_too_large')
 let data:FormData
 try{data=await new Response(bytes,{headers:{'Content-Type':contentType}}).formData()}catch{throw new InputError('source_file_required')}
 const entries=[...data.entries()]
 if(entries.length!==1||entries[0][0]!=='file'||typeof entries[0][1]==='string')throw new InputError('source_file_required')
 const file=entries[0][1]
 if(!file.name||file.name.length>255)throw new InputError('source_file_required')
 if(file.size>uploadMaxBytes)throw new InputError('source_file_too_large',413)
 if(!file.size)throw new InputError('source_file_empty')
 return file
}
