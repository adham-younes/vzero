import {notFound} from 'next/navigation'
import ContentPage from '@/components/agynexa-pages'
import {headings,solutions,nav} from '@/lib/agynexa'
export function generateStaticParams(){return [...Object.keys(headings).map(page=>({path:[page]})),...solutions.map(s=>({path:['solutions',s.slug]}))]}
function valid(path:string[]){return path.length===1&&path[0] in headings||path.length===2&&path[0]==='solutions'&&solutions.some(s=>s.slug===path[1])}
export async function generateMetadata({params}:{params:Promise<{path:string[]}>}){const {path}=await params;if(!valid(path))return {title:'Not found'};return {title:path[1]?solutions.find(s=>s.slug===path[1])?.name[0]:nav.find(n=>n[0]===path[0])?.[1]|| (path[0]==='start'?'Project brief':'AgentNexOS')}}
export default async function Page({params}:{params:Promise<{path:string[]}>}){const {path}=await params;if(!valid(path))notFound();return <ContentPage page={path[0]} slug={path[1]}/>}
