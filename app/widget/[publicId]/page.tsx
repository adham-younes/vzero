import {notFound} from 'next/navigation'
import {StudioWidget} from '@/components/studio-widget'
import {uuidPattern} from '@/lib/account-validation'
export const dynamic='force-dynamic'
export const metadata={title:'AGYNEXA assistant',robots:{index:false,follow:false}}
export default async function Page({params}:{params:Promise<{publicId:string}>}){const {publicId}=await params;if(!uuidPattern.test(publicId))notFound();return <StudioWidget publicId={publicId}/>}
