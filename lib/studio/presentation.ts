// Product-facing modes; provider identifiers remain unchanged in server contracts.
export function modelLabel(id:string,ar:boolean){
 if(id==='openai/gpt-oss-120b')return ar?'متقدم':'Advanced'
 if(id==='openai/gpt-oss-20b')return ar?'سريع':'Fast'
 if(id==='qwen/qwen3.8-27b')return ar?'متعدد اللغات (معاينة)':'Multilingual (preview)'
 return ar?'نمط مخصص':'Custom mode'
}
export function runStatusLabel(status:string,ar:boolean){
 const labels:Record<string,[string,string]>={succeeded:['Completed','مكتمل'],running:['Answering…','جارٍ الرد…'],failed:['Could not complete','تعذر الإكمال'],cancelled:['Cancelled','ملغى']}
 return labels[status]?.[ar?1:0]||(ar?'غير متاح':'Unavailable')
}
