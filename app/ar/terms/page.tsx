import {LegalContent} from '@/lib/legal-content'
import {pageMetadata,pageSchema} from '@/lib/site-routes'
export const metadata=pageMetadata(['terms'],true)
export default function Page(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(pageSchema(['terms'],true)).replace(/</g,'\\u003c')}}/><LegalContent kind="terms" ar={true}/></>}
