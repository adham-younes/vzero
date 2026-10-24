import {pageMetadata} from '@/lib/site-routes'
import {AuthPage} from '@/components/account-ui'
export const metadata={...pageMetadata(['signup'],true),robots:{index:false,follow:false}}
export default function Page(){return <AuthPage mode="register"/>}
