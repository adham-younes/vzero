import {notFound,permanentRedirect} from 'next/navigation'
import ContentPage from '@/components/agynexa-pages'
import Home from '../page'
import {parseSitePath,pageMetadata,pageSchema} from '@/lib/site-routes'
export async function generateMetadata({params}:{params:Promise<{path:string[]}>}){const parsed=parseSitePath((await params).path);return parsed.valid?pageMetadata(parsed.path,parsed.ar):{title:'Not found',robots:{index:false,follow:false}}}
export default async function Page({params}:{params:Promise<{path:string[]}>}){const {ar,path,valid}=parseSitePath((await params).path);if(!valid)notFound();if(path.join('/')==='services/solutions')permanentRedirect(`${ar?'/ar':''}/services`);return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(pageSchema(path,ar)).replace(/</g,'\\u003c')}}/>{path.length?<ContentPage page={path[0]} slug={path[1]}/>:<Home/>}</>}
