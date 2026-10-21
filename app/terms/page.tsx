import {LegalContent} from '@/lib/legal-content'
import {pageMetadata} from '@/lib/site-routes'
export const metadata=pageMetadata(['terms'],false)
export default function Page(){return <LegalContent kind="terms" ar={false}/>}
