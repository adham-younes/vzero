import {json,failure} from '@/lib/supabase/server'
export const runtime='nodejs'
export const dynamic='force-dynamic'
import {field,InputError} from '@/lib/account-validation'
import {ownedAgent,mutate,dbError} from '@/lib/studio/runtime'
import {agentId} from '@/lib/studio/validation'
import {assertSourceOrigin,readSourceMutation} from '@/lib/studio/source-body'
import {reviewedSourceText} from '@/lib/studio/source-import'
type C={params:Promise<{agentId:string}>}
export async function GET(_r:Request,c:C){try{const {agentId:id}=await c.params;const ctx=await ownedAgent(id);const {data,error}=await ctx.client.from('knowledge_sources').select('id,title,status,public_approved,created_at').eq('agent_id',id).eq('status','ready').order('created_at',{ascending:false});dbError(error);return json({sources:data})}catch(e){return failure(e)}}
export async function POST(r:Request,c:C){try{assertSourceOrigin(r);const {agentId:id}=await c.params;await ownedAgent(id);const b=await readSourceMutation(r);const content=reviewedSourceText(b.content);if(Object.keys(b).some(key=>!['title','content','publicApproved','requestKey'].includes(key))||typeof b.publicApproved!=='boolean')throw new InputError('invalid_input');return json({source:await mutate(id,'source_add',{title:field(b.title,160),content,publicApproved:b.publicApproved,requestKey:agentId(field(b.requestKey,36))})},201)}catch(e){return failure(e)}}
