import {LegalContent} from '@/lib/legal-content'
import {pageMetadata,pageSchema} from '@/lib/site-routes'
export const metadata=pageMetadata(['privacy'],false)
export default function Page(){return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(pageSchema(['privacy'],false)).replace(/</g,'\\u003c')}}/><LegalContent kind="privacy" ar={false}/></>}
