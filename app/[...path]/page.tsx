import {notFound} from 'next/navigation'
import ContentPage from '@/components/agynexa-pages'
import {headings,solutions} from '@/lib/agynexa'
import services from '@/lib/service-catalog.json'
import pages from '@/lib/program-pages.json'
export function generateStaticParams(){return [...Object.keys(headings).map(page=>({path:[page]})),...solutions.map(s=>({path:['solutions',s.slug]})),...services.map(s=>({path:['services',s.slug]})),{path:['services','solutions']}]}
function valid(path:string[]){return path.length===1&&path[0] in headings||path.length===2&&(path[0]==='solutions'&&solutions.some(s=>s.slug===path[1])||path[0]==='services'&&(path[1]==='solutions'||services.some(s=>s.slug===path[1])))}
export async function generateMetadata({params}:{params:Promise<{path:string[]}>}){
 const {path}=await params;if(!valid(path))return {title:'Not found'}
 const service=path[0]==='services'?services.find(s=>s.slug===path[1]):undefined
 const solution=path[0]==='solutions'?solutions.find(s=>s.slug===path[1]):undefined
 const program=pages[path[0] as keyof typeof pages]
 return {title:service?.title[0]||solution?.name[0]||program?.title[0]||headings[path[0]][0],description:service?.seo[0]||solution?.problem[0]||program?.intro[0]||'Scope an enterprise AI-agent implementation with AGYNEXA.',alternates:{canonical:`https://vzero-nine-beryl.vercel.app/${path.join('/')}`}}
}
export default async function Page({params}:{params:Promise<{path:string[]}>}){const {path}=await params;if(!valid(path))notFound();return <ContentPage page={path[0]} slug={path[1]}/>}
