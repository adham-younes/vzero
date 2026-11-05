import 'server-only'
import type {adminClient} from '@/lib/supabase/server'
import {MailError} from '@/lib/nexa-email/errors'
import {UUID} from './policy'

export type MailKnowledgeKind='identity'|'project'|'goal'|'reference'
export type MailKnowledgeVisibility='public_reply'|'owner_private'
export type MailKnowledgeFact={id:string;title:string;content:string;kind:MailKnowledgeKind;source_label:string;updated_at:string}
export type MailKnowledgeRecord=MailKnowledgeFact&{visibility:MailKnowledgeVisibility;active:boolean;approved_at:string|null;created_at:string;updated_at:string;updated_by:string|null}
type DB=ReturnType<typeof adminClient>
const normalized=(value:string)=>value.normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670]/g,'')

/** Only explicitly shareable owner knowledge enters an externally addressed reply. */
export async function loadReplyKnowledge(db:DB,query:string):Promise<{facts:MailKnowledgeFact[];ids:string[];revisions:Record<string,string>}>{
 const result=await db.from('owner_mail_knowledge')
  .select('id,title,content,kind,source_label,updated_at')
  .eq('visibility','public_reply').eq('active',true).not('approved_at','is',null)
  .order('updated_at',{ascending:false}).limit(100)
 if(result.error)throw new MailError('mail_knowledge_unavailable',503)
 const tokens=[...new Set(normalized(query).split(/[^\p{L}\p{N}]+/u).filter(token=>token.length>2))].slice(0,100)
 const rows=(result.data||[]).filter((row):row is MailKnowledgeFact=>
  UUID.test(row.id)&&typeof row.title==='string'&&typeof row.content==='string'&&typeof row.source_label==='string'&&typeof row.updated_at==='string'&&Number.isFinite(Date.parse(row.updated_at))&&['identity','project','goal','reference'].includes(row.kind))
 const ranked=rows.map((fact,index)=>{
  const title=normalized(fact.title),body=normalized(fact.content)
  const score=(fact.kind==='identity'?1000:0)+tokens.reduce((sum,token)=>sum+(title.includes(token)?4:0)+(body.includes(token)?1:0),0)
  return {fact,score,index}
 }).sort((a,b)=>b.score-a.score||a.index-b.index)
 const facts:MailKnowledgeFact[]=[];let remaining=16000
 for(const {fact} of ranked){
  const size=fact.title.length+fact.content.length+fact.source_label.length
  if(size>remaining)continue
  facts.push(fact);remaining-=size
  if(facts.length>=16)break
 }
 return {facts,ids:facts.map(fact=>fact.id),revisions:Object.fromEntries(facts.map(fact=>[fact.id,fact.updated_at]))}
}
