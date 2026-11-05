import {field, InputError, uuidPattern} from '../account-validation'
import {modelIds, templates, sectorIds, defaultTools, type AgentTools} from './settings'
export function agentId(value:string){if(!uuidPattern.test(value))throw new InputError('not_found',404);return value}
export function agentSettings(body:Record<string,unknown>,creating:boolean){
 const allowed=creating?['requestKey','template','name','instructions','language','model','builder','tools','sector']:['revision','name','instructions','language','model','tools','sector']
 if(Object.keys(body).some(key=>!allowed.includes(key)))throw new InputError('invalid_input')
 const name=field(body.name,100);const instructions=field(body.instructions,6000)
 if(body.language!=='en'&&body.language!=='ar')throw new InputError('invalid_input')
 if(!modelIds.includes(body.model as typeof modelIds[number]))throw new InputError('unsupported_model')
 if(body.sector!==undefined&&!sectorIds.includes(body.sector as typeof sectorIds[number]))throw new InputError('invalid_input')
 let tools:AgentTools|undefined
 if(body.tools!==undefined){
  const value=body.tools as Record<string,unknown>
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==2||Object.keys(value).some(k=>!['webSearch','codeInterpreter'].includes(k))||typeof value.webSearch!=='boolean'||typeof value.codeInterpreter!=='boolean')throw new InputError('invalid_input')
  tools={webSearch:value.webSearch,codeInterpreter:value.codeInterpreter}
 }
 const settings={name,instructions,language:body.language,model:body.model as typeof modelIds[number],...(creating||body.sector!==undefined?{sector:(body.sector||'general') as typeof sectorIds[number]}:{}),...(creating||tools?{tools:tools||defaultTools}:{})}
 if(creating){
  if(typeof body.template!=='string'||!Object.hasOwn(templates,body.template))throw new InputError('invalid_template')
  const key=field(body.requestKey,36);if(!uuidPattern.test(key))throw new InputError('invalid_input')
  if(body.builder!==undefined&&body.builder!==true)throw new InputError('invalid_input')
  return {...settings,template:body.template,request_key:key,...(body.builder===true?{chat_profile:'customer_v1'}:{})}
 }
 if(!Number.isSafeInteger(body.revision)||Number(body.revision)<1)throw new InputError('invalid_revision')
 return settings
}
