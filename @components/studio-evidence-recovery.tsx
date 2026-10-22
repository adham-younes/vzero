'use client'
import {Button} from '@/components/ui/button'

type EvidenceRun={status:string;historyState?:string;chat?:{schemaVersion:number;parts:{kind:string}[]}}

/** Private customer recovery only; facts, citations and follow-up questions stay untouched. */
export function MissingEvidenceRecovery({customer,run,ar,onOpenSources,disabled=false}:{customer:boolean;run:EvidenceRun;ar:boolean;onOpenSources:()=>void;disabled?:boolean}){
 if(!customer||run.status!=='succeeded'||(run.historyState&&run.historyState!=='available')||run.chat?.schemaVersion!==2||!run.chat.parts.some(part=>part.kind==='missing_evidence'))return null
 return <div className="border-t pt-3 grid gap-3">
  <p className="muted text-sm">{ar?'المعلومة الناقصة تحتاج نصًا معتمدًا ومحدّثًا. اطلب النص المتعلق بالمعلومة الناقصة من مسؤول المصدر، أو أضف نصًا مسموحًا لك باستخدامه. راجعه في «مصادر اختيارية» قبل الإضافة؛ لا يُضاف أو يُشارك شيء تلقائيًا.':'The missing point needs current approved text. Ask the source owner for the relevant text, or add text you are authorized to use. Review it in Optional sources before submitting; nothing is added or shared automatically.'}</p>
  <Button type="button" variant="outline" className="justify-self-start" disabled={disabled} onClick={onOpenSources}>{ar?'مراجعة مصدر معتمد':'Review an approved source'}</Button>
 </div>
}
