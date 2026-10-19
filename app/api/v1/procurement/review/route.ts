import {parseReviewInput,reviewProcurement,ReviewInputError} from '@/lib/procurement'
export const runtime='nodejs'
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
function error(message:string,status:number){return Response.json({error:message},{status,headers})}
// Public, stateless calculator. Accepts bounded numeric sample data only; no accounts,
// external calls, storage, credentials, approval or purchase-order mutations.
export async function POST(request:Request){
 const origin=request.headers.get('origin')
 if(origin&&origin!==new URL(request.url).origin)return error('Cross-origin requests are not supported.',403)
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return error('Use application/json.',415)
 if(Number(request.headers.get('content-length'))>2048)return error('Request too large.',413)
 const reader=request.body?.getReader();if(!reader)return error('Body required.',400)
 let size=0;const chunks:Uint8Array[]=[]
 try{
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2048){await reader.cancel();return error('Request too large.',413)}chunks.push(value)}
  const body=Buffer.concat(chunks).toString('utf8')
  const input=parseReviewInput(JSON.parse(body))
  return Response.json(reviewProcurement(input),{headers})
 }catch(e){if(e instanceof SyntaxError||e instanceof ReviewInputError)return error(e instanceof ReviewInputError?e.message:'Invalid JSON.',400);return error('Could not review the request.',400)}
}
