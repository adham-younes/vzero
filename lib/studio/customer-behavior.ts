import {InputError} from '../account-validation'
import {replyLanguage} from './conversation'
import type {RawProviderChatV2} from './chat-contract'
function clean(text:string){return text.normalize('NFKC').toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/[?!؟.,،؛:]/g,' ').replace(/\s+/g,' ').trim()}
function explicitLanguage(text:string):'ar'|'en'|null{
 const q=clean(text).replace(/^(?:can|could|would) you /,'').replace(/^please /,'').replace(/باللغة (العربية|الانجليزية)/g,'ب$1').replace(/بالعربى/g,'بالعربي').replace(/^تكلم /,'اتكلم ')
 if(/^(?:please )?(?:in )?(?:arabic|arabi|عربي|عربى|بالعربي|بالعربية|العربية)(?: please| من فضلك| لو سمحت)?$/.test(q)||/^(?:reply|respond|answer|continue|speak) (?:to me )?in arabic(?: please)?$/.test(q)||/^(?:رد|اجب|اكتب|كمل|اتكلم) (?:عربي|بالعربي|بالعربية)(?: من فضلك| لو سمحت)?$/.test(q))return 'ar'
 if(/^(?:please )?(?:in )?(?:english|انجليزي|بالانجليزي|بالانجليزية|الانجليزية)(?: please| من فضلك| لو سمحت)?$/.test(q)||/^(?:reply|respond|answer|continue|speak) (?:to me )?in english(?: please)?$/.test(q)||/^(?:رد|اجب|اكتب|كمل|اتكلم) (?:انجليزي|بالانجليزي|بالانجليزية)(?: من فضلك| لو سمحت)?$/.test(q))return 'en'
 return null
}
const identity=(text:string)=>/^(من انت|من انت وما مهاراتك|من انت وما هي مهاراتك|انت مين|مين انت|عرف نفسك|عرفني بنفسك|ما اسمك|اسمك ايه|انت اسمك ايه|ماذا يمكنك ان تفعل|كيف تساعدني|who are you|what is your name|what can you do|how can you help me)$/.test(clean(text))
export function customerTurn(question:string,turns:{userText:string}[],fallback:'ar'|'en',name:string){
 const explicit=explicitLanguage(question),previous=[...turns].reverse(),language=explicit||previous.map(t=>explicitLanguage(t.userText)).find(Boolean)||replyLanguage(question,fallback)
 const effectiveQuestion=explicit?(previous.find(t=>!explicitLanguage(t.userText))?.userText||question):question
 let localReply:string|null=null
 if(identity(effectiveQuestion))localReply=language==='ar'?`أنا ${name}، مساعد عمل على AGYNEXA. أساعدك في توضيح مهمة، وتنظيم المعلومات التي تقدمها، وإعداد مسودات للمراجعة. أجيب عن معلومات الشركة من المصادر المعتمدة مع الاستشهاد بها. أي إنشاء أو تغيير محفوظ يحتاج مراجعتك وموافقتك؛ لا أرسل بريدًا أو أنفّذ إجراءات خارجية تلقائيًا.`:`I'm ${name}, a business assistant on AGYNEXA. I help clarify a task, organize information you provide, and prepare drafts for review. I answer company-specific questions from approved sources with citations. Saved creations or changes need your review and approval; I do not send email or take external actions automatically.`
 else if(explicit&&effectiveQuestion===question)localReply=language==='ar'?'سأتابع بالعربية. اكتب المهمة التي تريد العمل عليها أو المعلومات التي تريد تنظيمها.':"I'll continue in English. Describe the task you want to work on or the information you want to organize."
 return {language:language as 'ar'|'en',effectiveQuestion,languageOnly:!!explicit,localReply}
}
export function wrongCustomerLanguage(answer:RawProviderChatV2,language:'ar'|'en'){
 const pieces=[...(Array.isArray(answer?.parts)?answer.parts.map(p=>p?.text):[]),answer?.nextQuestion,answer?.support?.title,answer?.support?.details].filter((v):v is string=>typeof v==='string'&&!!v.trim())
 return pieces.some(text=>{const prose=text.replace(/https?:\/\/\S+|`[^`]*`/g,'');const ar=(prose.match(/\p{Script=Arabic}/gu)||[]).length,en=(prose.match(/[a-z]/gi)||[]).length;return language==='ar'?(ar===0&&en>=8||en>ar*2+20):(ar>0&&ar>en)})
}
export async function customerLanguageReply<T extends {answer:RawProviderChatV2;usage:Record<string,unknown>}>(generate:(repair:boolean)=>Promise<T>,language:'ar'|'en'):Promise<T>{
 const first=await generate(false);if(!wrongCustomerLanguage(first.answer,language))return first
 const second=await generate(true);if(wrongCustomerLanguage(second.answer,language))throw new InputError('response_language_mismatch',502)
 const usage={...second.usage,language_repair:true}
 for(const key of ['input_tokens','output_tokens','estimated_cost_usd','latency_ms'])if(typeof first.usage[key]==='number'&&typeof second.usage[key]==='number')Object.assign(usage,{[key]:Number(first.usage[key])+Number(second.usage[key])})
 return {...second,usage}
}
