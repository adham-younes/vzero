import type {StudioAction} from '@/lib/studio/project-contract'
// Routes only an explicit USER request. Generated assistant text never enters this function.
export function reviewIntent(text:string):'agent'|'project'|'task'|null{
 const value=text.trim();const en=/^(?:(?:please|can you|could you|i want you to)\s+)?(?:create|build|make|set up)\s+(?:me\s+)?(?:a |an |new )?(assistant|agent|project|task)\b/i.exec(value)
 if(en)return en[1].toLowerCase()==='assistant'||en[1].toLowerCase()==='agent'?'agent':en[1].toLowerCase() as 'project'|'task'
 const ar=/^(?:من فضلك\s+)?(?:أنشئ|انشئ|اعمل|إنشاء)\s+(?:لي\s+)?(?:مساعد|وكيل|مشروع|مهمة)/.exec(value)
 return ar?(/مساعد|وكيل/.test(ar[0])?'agent':/مشروع/.test(ar[0])?'project':'task'):null
}
export function applySnapshot(action:Pick<StudioAction,'version'|'snapshot_hash'>){return {version:action.version,snapshotHash:action.snapshot_hash}}
