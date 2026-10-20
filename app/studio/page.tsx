import {Studio} from '@/components/studio'
import {studioEnabled} from '@/lib/studio/server'
export const dynamic='force-dynamic'
export const metadata={title:'AGYNEXA — Agent Studio',robots:{index:false,follow:false}}
export default function Page(){return <Studio enabled={studioEnabled()}/>}
