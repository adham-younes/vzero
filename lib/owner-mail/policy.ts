/** Deterministic routing and response eligibility. Email content never grants authority. */
export const MAILBOXES = [
 {address:'adham@agynexa.si',id:'b4b027ed-284d-49ce-8b54-7b2a17d4a8eb',ingress:'6235d4bf@iejioorkau.resend.app'},
 {address:'nexa.agent@agynexa.si',id:'fa42c2f2-5511-490b-9227-8078b609fa3a',ingress:'b24184f6@iejioorkau.resend.app'},
] as const
export const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const SHA=/^[a-f0-9]{64}$/
export const KNOWLEDGE='Adham owns AGYNEXA (agynexa.si). His confirmed interests include AI agents and automating business workflows. Nexa is his AI assistant. No verified prices, availability, contracts, customer relationships, personal biography, or delivery dates are supplied.'
export function eligible(input:{sender:string;replyTo:string[];headers:Record<string,unknown>;authentication:unknown;folder:string;createdAt:string;text:string}){
 const h:Record<string,string>={};for(const [k,v] of Object.entries(input.headers))h[k.toLowerCase()]=String(v).toLowerCase()
 if(['spam','trash'].includes(input.folder))return 'spam_or_trash'
 if(!Number.isFinite(Date.parse(input.createdAt))||Date.now()-Date.parse(input.createdAt)>48*3600000)return 'old_message'
 if(/@(agynexa\.si|iejioorkau\.resend\.app)$/i.test(input.sender))return 'own_address'
 if(/(?:^|[._-])(no.?reply|mailer.?daemon|postmaster|bounce)(?:[._+@-]|$)/i.test(input.sender))return 'automated_sender'
 if(h['auto-submitted']&&h['auto-submitted']!=='no'||h['x-auto-response-suppress']||h['list-id']||h['list-unsubscribe']||/bulk|list|junk/.test(h.precedence||'')||h['return-path']==='<>')return 'automated_message'
 if(input.replyTo.length>1||input.replyTo.length===1&&input.replyTo[0].toLowerCase()!==input.sender.toLowerCase())return 'reply_to_review'
 const auth=input.authentication as {dmarc?:string;dkim?:string}|null
 if(!(auth?.dmarc==='pass'||auth?.dmarc==='gray'&&auth?.dkim==='pass'))return 'sender_auth_review'
 if(!input.text.trim())return 'attachment_or_html_review'
 return null
}
export type Reply={text:string;subject:string;cc:string[];bcc:string[];headers:Record<string,string>}
export function validateDecision(value:unknown):{action:'reply'|'skip'|'review';text:string}{
 const v=value as Record<string,unknown>
 if(!v||!['reply','skip','review'].includes(String(v.action))||typeof v.text!=='string'||v.text.length>6000||v.text.includes('\0'))throw Error('invalid_decision')
 if(v.action==='reply'&&!v.text.trim())throw Error('invalid_decision')
 // The assistant cannot introduce an external destination into a reply.
 for(const link of v.text.match(/https?:\/\/[^\s<>]+/gi)||[]){const u=new URL(link);if(u.protocol!=='https:'||u.hostname!=='agynexa.si'||u.username||u.password||u.port)throw Error('reply_link_review')}
 return {action:v.action as 'reply'|'skip'|'review',text:v.text}
}
