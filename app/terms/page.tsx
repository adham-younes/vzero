import {LegalContent} from '@/lib/legal-content'
import {pageMetadata,pageSchema} from '@/lib/site-routes'
export const metadata=pageMetadata(['terms'],false)
export default function Page(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(pageSchema(['terms'],false)).replace(/</g,'\\u003c')}}/><LegalContent kind="terms" ar={false}/></>}
