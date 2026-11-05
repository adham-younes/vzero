import {notFound} from 'next/navigation'
import {headers} from 'next/headers'
import {isMailConsoleHost} from '@/lib/owner-mail/host'
import OwnerMailConsole from '@/components/owner-mail-console'
export const dynamic='force-dynamic'
export const metadata={title:'بريد NEXA الخاص',description:'مساحة البريد الخاصة بصاحب الحساب.',robots:{index:false,follow:false}}
export default async function PrivateMailPage(){
 if(!isMailConsoleHost((await headers()).get('host')))notFound()
 return <OwnerMailConsole/>
}
