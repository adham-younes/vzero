import type {Agent} from './settings'

export function replyLanguage(question:string,fallback:'ar'|'en'):'ar'|'en'{
 if(/[\p{Script=Arabic}]/u.test(question))return 'ar'
 if(/[a-z]/i.test(question))return 'en'
 return fallback
}
// Only whole social/identity messages bypass retrieval. Mixed factual questions
// and instructions must still go through the normal knowledge restrictions.
export function conversationalReply(question:string,agent:Pick<Agent,'name'|'language'>):string|null{
 const text=question.toLowerCase().normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/[?!؟.,،؛:]/g,' ').replace(/\s+/g,' ').trim()
 const identity=/^(من انت|انت مين|مين انت|عرف نفسك|ما اسمك|اسمك ايه|ماذا يمكنك ان تفعل|كيف تساعدني|who are you|what is your name|what can you do|how can you help me)$/.test(text)
 const greeting=/^(مرحبا|اهلا|اهلا بك|السلام عليكم|سلام|صباح الخير|مساء الخير|hello|hi|hey|good morning|good evening)$/.test(text)
 const thanks=/^(شكرا|شكرا لك|متشكر|thanks|thank you)$/.test(text)
 const ar=replyLanguage(question,agent.language)==='ar'
 if(thanks)return ar?'على الرحب والسعة. هل لديك سؤال آخر؟':"You're welcome. What else would you like to ask?"
 if(!identity&&!greeting)return null
 return ar?`${greeting?'أهلًا بك! ':''}أنا ${agent.name}، مساعدك على AGYNEXA. أساعدك في فهم المعلومات الموجودة في المصادر المضافة وأوضح لك مصادر الإجابات. اسألني عن موضوع من معرفتي، أو أضف مصدرًا لأساعدك فيه.`:`${greeting?'Hello! ':''}I'm ${agent.name}, your AGYNEXA assistant. I help you understand the information in my added sources and show the evidence behind answers. Ask me about that knowledge, or add a source to get started.`
}
export function missingKnowledgeReply(question:string,language:'ar'|'en',hasSources:boolean,owner:boolean){
 const ar=replyLanguage(question,language)==='ar'
 if(!hasSources)return ar?(owner?'لم تُضف مصادر معرفة لهذا الوكيل بعد. افتح «المعرفة» وأضف نصًا أو ملفًا، ثم اسألني عنه. يمكنك الآن سؤالي عن نفسي وكيف أساعدك.':'لا توجد معرفة متاحة للإجابة حاليًا. تواصل مع مسؤول هذا المساعد لإضافة المعلومات المطلوبة.'):(owner?'This agent has no knowledge sources yet. Open Knowledge, add text or a file, then ask me about it. You can already ask who I am and how I can help.':'There is no knowledge available to answer this yet. Please contact the assistant owner to add the needed information.')
 return ar?'لم أجد في المصادر المضافة معلومات تكفي للإجابة. جرّب سؤالًا أكثر تحديدًا أو أضف مصدرًا يتناول الموضوع.':'I could not find enough information in the added sources to answer. Try a more specific question or add a source covering this topic.'
}
