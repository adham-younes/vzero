import {LegalContent} from '@/lib/legal-content'
import {pageMetadata} from '@/lib/site-routes'
export const metadata=pageMetadata(['privacy'],false)
export default function Page(){return <LegalContent kind="privacy" ar={false}/>}
