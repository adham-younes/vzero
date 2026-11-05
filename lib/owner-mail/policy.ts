/** Deterministic routing and response eligibility. Email content never grants authority. */
export const MAILBOXES = [
 {address:'adham@agynexa.si',id:'b4b027ed-284d-49ce-8b54-7b2a17d4a8eb',ingress:'6235d4bf@iejioorkau.resend.app'},
 {address:'nexa.agent@agynexa.si',id:'fa42c2f2-5511-490b-9227-8078b609fa3a',ingress:'b24184f6@iejioorkau.resend.app'},
] as const
export const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const SHA=/^[a-f0-9]{64}$/
export const NEXA_SIGNATURE='NEXA — automated assistant for Adham'
export const KNOWLEDGE='Adham owns AGYNEXA (agynexa.si). His confirmed interests include AI agents and automating business workflows. Nexa is his AI assistant. No verified prices, availability, contracts, customer relationships, personal biography, or delivery dates are supplied.'
export type MailDecision={action:'reply'|'skip'|'review';text:string;reason:string;knowledgeIds:string[]}

/** Conservative pre-model gate. These messages stay private for owner review. */
export function sensitiveReason(subject:string,text:string):string|null{
 const value=(subject+'\n'+text).normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670]/g,'')
 const groups:[string,RegExp][]=[
  ['credentials',/\b(?:password|passcode|otp|one[ -]time (?:password|code)|verification code|authentication code|recovery code|secret key|private key|api[ _-]?key|access token|refresh token|seed phrase|mnemonic)\b|-----begin [^-]*private key-----|\b(?:sk-[a-z0-9_-]{20,}|ghp_[a-z0-9]{20,})\b|كلم[ةه] (?:المرور|السر)|رمز (?:التحقق|الدخول|التوثيق|الاسترداد)|مفتاح (?:سري|خاص)|عبار[ةه] الاسترداد/iu],
  ['financial',/\b(?:wire transfer|bank transfer|payment instructions?|bank account|account number|credit card|debit card|iban|swift code|sort code|approve (?:the )?payment|authorize (?:the )?payment)\b|تحويل (?:بنكي|مالي)|حساب(?:ي|ك)? (?:البنكي|المصرفي)|رقم الحساب|بطاق[ةه] (?:ائتمان|الائتمان|بنكي[ةه])|اعتماد (?:دفع|الدفع|تحويل)|تفويض (?:دفع|الدفع)|ايبان/iu],
  ['legal',/\b(?:legal notice|subpoena|lawsuit|court order|legal settlement|admit liability|power of attorney|sign (?:the |this |a )?contract|accept (?:the |this )?contract)\b|انذار (?:قانوني|قضائي)|دعوى قضائي[ةه]|حكم قضائي|تسوي[ةه] قانوني[ةه]|اقرار (?:بالمسؤولي[ةه]|مسؤولي[ةه])|توكيل رسمي|توقيع (?:العقد|عقد)|قبول (?:العقد|عقد)/iu],
  ['health',/\b(?:medical records?|medical diagnosis|diagnosis|prescription|patient records?|mental health|self[ -]harm|suicid(?:e|al)|pregnancy test|hiv status)\b|سجل(?:ي|ك)? (?:الطبي|طبي)|تشخيص|وصف[ةه] طبي[ةه]|ملف (?:المريض|مريض)|صح[ةه] نفسي[ةه]|ايذاء النفس|انتحار|نتيج[ةه] (?:تحليل|فحص) طبي/iu],
  ['personal',/\b(?:passport number|national id|social security|biometric|payroll|salary details|disciplinary|termination notice|dismissal notice)\b|رقم (?:جواز|الهوي[ةه]|قومي)|بيانات بيومتري[ةه]|كشف (?:راتب|رواتب)|تفاصيل (?:الراتب|راتب)|اجراء تاديبي|فصل (?:موظف|الموظف)|انهاء (?:خدم[ةه]|عقد عمل)/iu],
  ['security',/\b(?:security incident|data breach|disable (?:the )?(?:security|authentication|encryption)|grant (?:me |us )?(?:admin|administrator|root) access|change (?:account )?permissions)\b|حادث (?:امني|اختراق)|تسريب بيانات|تعطيل (?:الحماي[ةه]|المصادق[ةه]|التشفير)|منح صلاحيات|تغيير صلاحيات|الوصول (?:لحساب|الي حساب)/iu],
  ['instruction_override',/\b(?:ignore|disregard|override) (?:all |the |your )?(?:previous|prior|system|developer|safety) (?:instructions?|prompts?|rules?)\b|\b(?:reveal|print|disclose|repeat) (?:the |your )?(?:hidden |system |developer )(?:prompts?|instructions?)\b|تجاهل (?:كل |جميع )?(?:التعليمات|القواعد) (?:السابق[ةه]|الامني[ةه])|اكشف (?:تعليمات|رسال[ةه]) النظام/iu],
 ]
 for(const [category,pattern] of groups)if(pattern.test(value))return `sensitive_${category}_review`
 return null
}

export function eligible(input:{sender:string;replyTo:string[];headers:Record<string,unknown>;authentication:unknown;folder:string;createdAt:string;text:string;subject?:string}){
 const h:Record<string,string>={};for(const [k,v] of Object.entries(input.headers))h[k.toLowerCase()]=String(v).toLowerCase()
 if(['spam','trash'].includes(input.folder))return 'spam_or_trash'
 const age=Date.now()-Date.parse(input.createdAt)
 if(!Number.isFinite(age)||age>48*3600000)return 'old_message'
 if(age < -5*60000)return 'message_date_review'
 if(/@(agynexa\.si|iejioorkau\.resend\.app)$/i.test(input.sender))return 'own_address'
 if(/(?:^|[._-])(no.?reply|mailer.?daemon|postmaster|bounce)(?:[._+@-]|$)/i.test(input.sender))return 'automated_sender'
 if(h['auto-submitted']&&h['auto-submitted']!=='no'||h['x-auto-response-suppress']||h['list-id']||h['list-unsubscribe']||/bulk|list|junk/.test(h.precedence||'')||h['return-path']==='<>')return 'automated_message'
 if(input.replyTo.length>1||input.replyTo.length===1&&input.replyTo[0].toLowerCase()!==input.sender.toLowerCase())return 'reply_to_review'
 const auth=input.authentication as {dmarc?:string;dkim?:string}|null
 if(!(auth?.dmarc==='pass'||auth?.dmarc==='gray'&&auth?.dkim==='pass'))return 'sender_auth_review'
 if(!input.text.trim())return 'attachment_or_html_review'
 const sensitive=sensitiveReason(input.subject||'',input.text)
 if(sensitive)return sensitive
 return null
}
export type Reply={text:string;subject:string;cc:string[];bcc:string[];headers:Record<string,string>}
export function validateDecision(value:unknown,allowedKnowledgeIds:readonly string[]=[]):MailDecision{
 const v=value as Record<string,unknown>
 if(!v||!['reply','skip','review'].includes(String(v.action))||typeof v.text!=='string'||v.text.length>6000||v.text.includes('\0'))throw Error('invalid_decision')
 if(typeof v.reason!=='string'||!['routine','sensitive','uncertain','spam','automated','no_reply_needed'].includes(v.reason)||!Array.isArray(v.knowledgeIds)||v.knowledgeIds.length>16||v.knowledgeIds.some(id=>typeof id!=='string'||!allowedKnowledgeIds.includes(id)))throw Error('invalid_decision')
 if(v.action==='reply'&&v.reason!=='routine')return {action:'review',text:'',reason:'classification_review',knowledgeIds:[]}
 if(v.action==='reply'&&!v.text.trim())throw Error('invalid_decision')
 if(v.action==='reply'&&sensitiveReason('',v.text))return {action:'review',text:'',reason:'generated_sensitive_review',knowledgeIds:[]}
 // The assistant cannot introduce an external destination into a reply.
 for(const link of v.text.match(/https?:\/\/[^\s<>]+/gi)||[]){const u=new URL(link);if(u.protocol!=='https:'||u.hostname!=='agynexa.si'||u.username||u.password||u.port)throw Error('reply_link_review')}
 const text=v.action==='reply'?(v.text.trim().endsWith(NEXA_SIGNATURE)?v.text.trim():v.text.trim()+'\n\n'+NEXA_SIGNATURE):''
 if(text.length>6000)throw Error('invalid_decision')
 return {action:v.action as MailDecision['action'],text,reason:v.reason,knowledgeIds:[...new Set(v.knowledgeIds as string[])]}
}
