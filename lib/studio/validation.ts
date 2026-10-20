import {field, InputError, uuidPattern} from '../account-validation'
import {modelIds, templates} from './settings'
export function agentId(value:string){if(!uuidPattern.test(value))throw new InputError('not_found',404);return value}
export function agentSettings(body:Record<string,unknown>,creating:boolean){
 const allowed=creating?['requestKey','template','name','instructions','language','model']:['revision','name','instructions','language','model']
 if(Object.keys(body).some(key=>!allowed.includes(key)))throw new InputError('invalid_input')
 const name=field(body.name,100);const instructions=field(body.instructions,6000)
 if(body.language!=='en'&&body.language!=='ar')throw new InputError('invalid_input')
 if(!modelIds.includes(body.model as typeof modelIds[number]))throw new InputError('unsupported_model')
 const settings={name,instructions,language:body.language,model:body.model as typeof modelIds[number]}
 if(creating){
  if(typeof body.template!=='string'||!Object.hasOwn(templates,body.template))throw new InputError('invalid_template')
  const key=field(body.requestKey,36);if(!uuidPattern.test(key))throw new InputError('invalid_input')
  return {...settings,template:body.template,request_key:key}
 }
 if(!Number.isSafeInteger(body.revision)||Number(body.revision)<1)throw new InputError('invalid_revision')
 return settings
}
