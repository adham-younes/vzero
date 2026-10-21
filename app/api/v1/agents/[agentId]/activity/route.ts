import {json,failure,adminClient} from '@/lib/supabase/server'
import {ownedAgent,dbError} from '@/lib/studio/runtime'
import {storedRunFields,presentRun,runScope,isRunContentVisible} from '@/lib/studio/history-visibility'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(_r:Request,c:{params:Promise<{agentId:string}>}){try{
 const id=(await c.params).agentId,ctx=await ownedAgent(id),db=adminClient()
 const results=await Promise.all([db.from('agent_runs').select(storedRunFields).eq('org_id',ctx.agent.org_id).eq('agent_id',id).eq('actor_id',ctx.user.id).eq('access_kind','studio').order('created_at',{ascending:false}).limit(50),db.from('support_requests').select('*').eq('org_id',ctx.agent.org_id).eq('agent_id',id).eq('requested_by',ctx.user.id).order('created_at',{ascending:false}).limit(50),ctx.client.from('agent_versions').select('id,settings,created_at').eq('agent_id',id).order('created_at',{ascending:false}).limit(20),ctx.client.from('agent_publications').select('*').eq('agent_id',id).maybeSingle(),ctx.client.from('agent_api_keys').select('id,label,created_at,revoked_at,expires_at').eq('agent_id',id).order('created_at',{ascending:false}).limit(50)])
 results.forEach(x=>dbError(x.error))
 const runs=await Promise.all((results[0].data||[]).map(r=>presentRun({...runScope(r),identity:ctx.user.id},r,true)))
 const approvals=await Promise.all((results[1].data||[]).map(async p=>{const {data:r,error}=await db.from('agent_runs').select(storedRunFields).eq('org_id',ctx.agent.org_id).eq('agent_id',id).eq('actor_id',ctx.user.id).eq('access_kind','studio').eq('id',p.run_id).maybeSingle();dbError(error);const visibility=r?await isRunContentVisible({...runScope(r),identity:ctx.user.id},r):{visible:false};return visibility.visible?{...p,historyState:'available'}:{...p,title:'[Knowledge changed]',details:'[Knowledge changed]',status:'expired',historyState:'knowledge_changed'}}))
 return json({runs,approvals,versions:results[2].data,publication:results[3].data,keys:results[4].data})
}catch(e){return failure(e)}}
