import 'server-only'
import {NEXA_IDENTITY,type MailCapabilities} from './types'
import {MailError} from './errors'
import {parseMailbox} from './inbound'
export function mailConfig(){
 const adminRaw=process.env.NEXA_MAIL_ADMIN_USER_IDS?.trim()||''
 const admins=adminRaw?adminRaw.split(',').map(s=>s.trim()):[]
 const valid=admins.length>0&&admins.every(s=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s))
 return {admins:valid?new Set(admins):new Set<string>(),apiKey:process.env.RESEND_API_KEY?.trim()||'',secret:process.env.RESEND_WEBHOOK_SECRET?.trim()||'',ingress:process.env.NEXA_MAIL_INGRESS_RECIPIENT?.trim()||'',receiveEnabled:process.env.NEXA_MAIL_RECEIVE_ENABLED==='true',sendEnabled:process.env.NEXA_MAIL_SEND_ENABLED==='true'}
}
// Routing candidate: fixed public mailbox stays separate from the isolated technical ingress.
function isolatedIngress(value:string){
 try{const address=parseMailbox(value).address;if(address!==value)return false;const domain=address.slice(address.lastIndexOf('@')+1);return domain==='receive.agynexa.si'||/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.resend\.app$/.test(domain)}catch{return false}
}
export function mailCapabilities():MailCapabilities{
 const c=mailConfig(),validIngress=isolatedIngress(c.ingress)
 return {receiveConfigured:c.receiveEnabled&&!!c.apiKey&&!!c.secret&&validIngress,sendEnabled:c.sendEnabled&&!!c.apiKey,autoSend:false,ownerMailboxDelegated:false,chatGPTConnected:false}
}
export function inboundConfig(){const c=mailConfig();if(!mailCapabilities().receiveConfigured)throw new MailError('mail_unavailable',503);return c}
export {NEXA_IDENTITY}
