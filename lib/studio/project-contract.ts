export type ProjectStatus='active'|'paused'|'completed'
export type TaskStatus='todo'|'in_progress'|'blocked'|'done'
export type StudioProject={id:string;name:string;description:string;status:ProjectStatus;revision:number;created_at:string;updated_at:string}
export type StudioTask={id:string;project_id:string;title:string;description:string;status:TaskStatus;revision:number;created_at:string;updated_at:string}
export type ProjectActivity={id:string;project_id:string;task_id:string|null;kind:string;summary:string;created_at:string}
export type StudioActionKind='agent.create'|'project.create'|'project.set_status'|'task.create'|'task.set_status'
export type StudioActionResult={kind:StudioActionKind;id:string;projectId?:string}
export type ActionPayloads={
 'agent.create':{name:string;instructions:string;language:'en'|'ar';template:'knowledgegrid'|'serviceflow';model:'openai/gpt-oss-20b'|'openai/gpt-oss-120b'|'qwen/qwen3.8-27b';builder:true}
 'project.create':{name:string;description:string}
 'project.set_status':{projectId:string;status:ProjectStatus;expectedRevision:number}
 'task.create':{projectId:string;title:string;description:string}
 'task.set_status':{projectId:string;taskId:string;status:TaskStatus;expectedRevision:number}
}
export type StudioAction={id:string;kind:StudioActionKind;payload:ActionPayloads[StudioActionKind];version:1;snapshot_hash:string;status:'proposed'|'applied';result:StudioActionResult|null;created_at:string;applied_at:string|null}
export type ProjectsResponse={projects:StudioProject[];hasMore:boolean}
export type ProjectDetailResponse={project:StudioProject;tasks:StudioTask[];activity:ProjectActivity[];hasMore:boolean}
