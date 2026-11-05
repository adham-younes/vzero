import {sectorIds,type AgentTools,type Sector,type Template} from './settings'

export const studioDraftKey='agynexa.studio.authoring-draft.v1'
export const studioLocaleHandoffEvent='agynexa:studio-locale-handoff'
export type StudioBuilderDraft={step:'describe'|'configure';name:string;instructions:string;language:'en'|'ar';template:Template;tools:AgentTools}
export type StudioAuthoringDraft={version:2;context:string;task:string;sector:Sector;builder?:StudioBuilderDraft}

function sector(value:unknown):Sector{return typeof value==='string'&&sectorIds.some(id=>id===value)?value as Sector:'general'}
function builder(value:unknown):StudioBuilderDraft|undefined{
 if(!value||typeof value!=='object')return undefined
 const input=value as Record<string,unknown>
 if(typeof input.name!=='string'||typeof input.instructions!=='string')return undefined
 const tools=input.tools&&typeof input.tools==='object'?input.tools as Record<string,unknown>:{}
 return {step:input.step==='configure'?'configure':'describe',name:input.name.slice(0,100),instructions:input.instructions.slice(0,6000),language:input.language==='ar'?'ar':'en',template:input.template==='knowledgegrid'?'knowledgegrid':'serviceflow',tools:{webSearch:tools.webSearch===true,codeInterpreter:tools.codeInterpreter===true}}
}

/** A handoff belongs to one route context, independent of display language. */
export function readStudioDraft(context:string):StudioAuthoringDraft|null{
 if(typeof window==='undefined')return null
 try{
  const raw=sessionStorage.getItem(studioDraftKey)
  if(!raw)return null
  const saved=JSON.parse(raw)
  if(!saved||saved.version!==2||saved.context!==context||typeof saved.task!=='string'){
   sessionStorage.removeItem(studioDraftKey)
   return null
  }
  return {version:2,context,task:saved.task.slice(0,1500),sector:sector(saved.sector),builder:builder(saved.builder)}
 }catch{return null}
}

export function saveStudioDraft(context:string,task:string,selectedSector:string,configuration?:StudioBuilderDraft){
 if(typeof window==='undefined')return
 try{sessionStorage.setItem(studioDraftKey,JSON.stringify({version:2,context,task:task.slice(0,1500),sector:sector(selectedSector),...(configuration?{builder:builder(configuration)}:{})}))}catch{}
}

export function clearStudioDraft(){if(typeof window!=='undefined')try{sessionStorage.removeItem(studioDraftKey)}catch{}}
