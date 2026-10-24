import {pageMetadata} from '@/lib/site-routes'
import {AuthPage} from '@/components/account-ui'
export const metadata={...pageMetadata(['login'],true),robots:{index:false,follow:false}}
export default function Page(){return <AuthPage mode="login"/>}
