import 'server-only'
import {InputError,field} from '../account-validation'
import {agentId,agentSettings} from './validation'
import {studioSession,ownerWorkspace} from './server'
import {customerChatEnabled} from './chat-contract'
import type {StudioAction,StudioActionKind,ActionPayloads,StudioProject,StudioTask,ProjectActivity} from './project-contract'
const actionFields='id,kind,payload,version,snapshot_hash,status,result,created_at,applied_at'
const projectFields='id,name,description,status,revision,created_at,updated_at'
const taskFields='id,project_id,title,description,status,revision,created_at,updated_at'
function exact(value:unknown,keys:string[]):asserts value is Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==keys.length||Object.keys(value).some(k=>!keys.includes(k)))throw new InputError('invalid_input')}
function text(value:unknown,max:number,min=0){const s=field(value,max,min);if(s.includes('\0'))throw new InputError('invalid_input');return s}
function revision(value:unknown){if(!Number.isSafeInteger(value)||Number(value)<1||Number(value)>999999999)throw new InputError('invalid_input');return Number(value)}
function status(value:unknown,values:string[]){if(typeof value!=='string'||!values.includes(value))throw new InputError('invalid_input');return value}
export function parseWorkAction(body:Record<string,unknown>):{requestKey:string;kind:StudioActionKind;payload:ActionPayloads[StudioActionKind]}{
 exact(body,['requestKey','kind','payload']);const requestKey=agentId(field(body.requestKey,36)),kind=body.kind
 if(!['agent.create','project.create','project.set_status','task.create','task.set_status'].includes(String(kind)))throw new InputError('invalid_action')
 const p=body.payload;let payload:Record<string,unknown>
 if(kind==='agent.create'){
  exact(p,['name','instructions','language','template','model','builder']);if(p.builder!==true)throw new InputError('invalid_input')
  text(p.name,100,1);text(p.instructions,6000,1)
  const settings=agentSettings({...p,requestKey},true);if(!('template' in settings))throw new InputError('invalid_input')
  payload={name:settings.name,instructions:settings.instructions,language:settings.language,template:settings.template,model:settings.model,builder:true}
 }else if(kind==='project.create'){
  exact(p,['name','description']);payload={name:text(p.name,100,1),description:text(p.description,3000)}
 }else if(kind==='task.create'){
  exact(p,['projectId','title','description']);payload={projectId:agentId(field(p.projectId,36)),title:text(p.title,100,1),description:text(p.description,3000)}
 }else if(kind==='project.set_status'){
  exact(p,['projectId','status','expectedRevision']);payload={projectId:agentId(field(p.projectId,36)),status:status(p.status,['active','paused','completed']),expectedRevision:revision(p.expectedRevision)}
 }else{
  exact(p,['projectId','taskId','status','expectedRevision']);payload={projectId:agentId(field(p.projectId,36)),taskId:agentId(field(p.taskId,36)),status:status(p.status,['todo','in_progress','blocked','done']),expectedRevision:revision(p.expectedRevision)}
 }
 return {requestKey,kind:kind as StudioActionKind,payload:payload as ActionPayloads[StudioActionKind]}
}
export function parseWorkReview(body:Record<string,unknown>){exact(body,['version','snapshotHash']);if(body.version!==1||typeof body.snapshotHash!=='string'||!/^[a-f0-9]{64}$/.test(body.snapshotHash))throw new InputError('invalid_input');return {version:1,snapshotHash:body.snapshotHash}}
function db(error:{message?:string}|null){if(!error)return;const code=['sign_in_required','not_found','workspace_required','invalid_action','invalid_input','request_conflict','review_conflict','revision_conflict'].find(c=>error.message?.includes(c));throw new InputError(code||'temporarily_unavailable',code==='sign_in_required'?401:code==='not_found'?404:code?.endsWith('conflict')||code==='workspace_required'?409:code?400:503)}
async function context(){const session=await studioSession(),workspace=await ownerWorkspace(session);if(!workspace)throw new InputError('workspace_required',409);return {...session,workspace}}
export function projectOffset(value:string|null){if(value===null)return 0;if(!/^\d{1,5}$/.test(value)||Number(value)>10000)throw new InputError('invalid_cursor');return Number(value)}
function actionDTO(row:Record<string,unknown>){return Object.fromEntries(actionFields.split(',').map(key=>[key,row[key]])) as StudioAction}
export async function projectsPage(offset:number){const c=await context();const {data,error}=await c.client.from('studio_projects').select(projectFields).eq('org_id',c.workspace.id).eq('created_by',c.user.id).order('created_at',{ascending:false}).order('id',{ascending:false}).range(offset,offset+50);db(error);return {projects:(data||[]).slice(0,50) as StudioProject[],hasMore:(data||[]).length>50}}
export async function projectDetail(id:string,taskOffset:number,activityOffset:number){
 agentId(id);const c=await context();const {data:project,error}=await c.client.from('studio_projects').select(projectFields).eq('id',id).eq('org_id',c.workspace.id).eq('created_by',c.user.id).maybeSingle();db(error);if(!project)throw new InputError('not_found',404)
 const [tasks,activity]=await Promise.all([
  c.client.from('studio_tasks').select(taskFields).eq('org_id',c.workspace.id).eq('created_by',c.user.id).eq('project_id',id).order('created_at',{ascending:false}).order('id',{ascending:false}).range(taskOffset,taskOffset+50),
  c.client.from('studio_project_activity').select('id,project_id,task_id,kind,summary,created_at').eq('org_id',c.workspace.id).eq('created_by',c.user.id).eq('project_id',id).order('created_at',{ascending:false}).order('id',{ascending:false}).range(activityOffset,activityOffset+50),
 ]);db(tasks.error);db(activity.error)
 return {project:project as StudioProject,tasks:(tasks.data||[]).slice(0,50) as StudioTask[],activity:(activity.data||[]).slice(0,50) as ProjectActivity[],hasMore:(tasks.data||[]).length>50||(activity.data||[]).length>50}
}
export async function actionsPage(offset:number){const c=await context();const {data,error}=await c.client.from('studio_work_actions').select(actionFields).eq('org_id',c.workspace.id).eq('created_by',c.user.id).order('created_at',{ascending:false}).order('id',{ascending:false}).range(offset,offset+50);db(error);return {actions:(data||[]).slice(0,50).map(row=>actionDTO(row)),hasMore:(data||[]).length>50}}
export async function proposeWork(body:Record<string,unknown>){const action=parseWorkAction(body),c=await context();if(action.kind==='agent.create'&&!customerChatEnabled())throw new InputError('customer_chat_unavailable',503);const {data,error}=await c.client.rpc('studio_propose_work',{p_request_key:action.requestKey,p_kind:action.kind,p_payload:action.payload});db(error);return {action:actionDTO(data)}}
export async function applyWork(id:string,body:Record<string,unknown>){
 agentId(id);const review=parseWorkReview(body),c=await context();const {data:stored,error:readError}=await c.client.from('studio_work_actions').select('kind').eq('id',id).eq('org_id',c.workspace.id).eq('created_by',c.user.id).maybeSingle();db(readError);if(!stored)throw new InputError('not_found',404)
 if(stored.kind==='agent.create'&&!customerChatEnabled())throw new InputError('customer_chat_unavailable',503)
 const {data,error}=await c.client.rpc('studio_apply_work',{p_action_id:id,p_version:review.version,p_snapshot_hash:review.snapshotHash});db(error);const action=actionDTO(data);return {action,result:action.result}
}
