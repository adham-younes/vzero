import {pageMetadata} from '@/lib/site-routes'
import {AccountPage} from '@/components/account-ui'
export const metadata={...pageMetadata(['account'],true),robots:{index:false,follow:false}}
export default function Page(){return <AccountPage/>}
