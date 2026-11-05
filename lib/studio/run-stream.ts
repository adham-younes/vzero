import 'server-only'
import {InputError} from '@/lib/account-validation'
import type {RunProgress} from './provider'

export function runStream(request:Request,execute:(signal:AbortSignal,progress:RunProgress)=>Promise<unknown>){
 const disconnected=new AbortController(),signal=AbortSignal.any([request.signal,disconnected.signal]),encoder=new TextEncoder()
 let ended=false,timer:ReturnType<typeof setInterval>|undefined
 const stream=new ReadableStream<Uint8Array>({
  async start(controller){
   const send=(event:string,data:unknown)=>{if(!ended)controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))}
   let last=''
   const progress:RunProgress=phase=>{if(phase!==last){last=phase;send('status',{phase})}}
   timer=setInterval(()=>{if(!ended)controller.enqueue(encoder.encode(': keepalive\n\n'))},15000)
   try{progress('preparing');const run=await execute(signal,progress);send('result',{run})}
   catch(error){send('error',{error:error instanceof InputError?error.code:'temporarily_unavailable'})}
   finally{if(timer)clearInterval(timer);if(!ended){ended=true;controller.close()}}
  },
  cancel(){ended=true;if(timer)clearInterval(timer);disconnected.abort()}
 })
 return new Response(stream,{headers:{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'private, no-store, no-transform','Pragma':'no-cache','X-Content-Type-Options':'nosniff','X-Accel-Buffering':'no'}})
}
