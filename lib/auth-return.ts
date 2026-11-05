import services from '@/lib/service-catalog.json'
import {solutions} from '@/lib/agynexa'

// Public entry identifiers only. Keep aligned with Studio's sector starting points.
const workflowIds=new Set(['knowledge','documents','sales','service','finance','logistics','procurement','receivables','customer-operations','healthcare','education','real-estate','technology','hr'])
const industryIds=new Set(['banking','insurance','retail','telecommunications','healthcare','travel','professional-services','logistics','energy','distribution',...workflowIds])

/** Keep only local product paths and recognized public context; discard arbitrary text and credentials. */
export function safeAuthReturn(value:string|null,ar:boolean){
 const fallback=ar?'/ar/studio':'/studio'
 if(!value||value.length>2048||!value.startsWith('/')||value.startsWith('//')||value.includes('\\'))return fallback
 try{
  const url=new URL(value,'https://agynexa.invalid')
  if(url.origin!=='https://agynexa.invalid'||!/^\/(?:ar\/)?(?:studio|account|start)$/.test(url.pathname))return fallback
  const query=new URLSearchParams(),service=url.searchParams.get('service'),solution=url.searchParams.get('solution')
  if(service&&services.some(item=>item.slug===service))query.set('service',service)
  if(solution&&solutions.some(item=>item.slug===solution))query.set('solution',solution)
  if(/\/(?:studio)$/.test(url.pathname)){
   const industry=url.searchParams.get('industry'),workflow=url.searchParams.get('workflow')
   if(industry&&industryIds.has(industry))query.set('industry',industry)
   if(workflow&&workflowIds.has(workflow))query.set('workflow',workflow)
  }
  return url.pathname+(query.size?'?'+query.toString():'')
 }catch{return fallback}
}
