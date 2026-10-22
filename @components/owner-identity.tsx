'use client'
import {ownerIdentity} from '@/lib/owner-identity'
import {useLanguage} from './agynexa-shell'

export default function OwnerIdentity({showBio=false}:{showBio?:boolean}){
 const {t}=useLanguage()
 return <section className="panel min-w-0" aria-label={t(ownerIdentity.position)}>
  <h2 className="text-2xl text-foreground">{t(ownerIdentity.fullName)}</h2>
  <p className="text-primary mt-3">{t(ownerIdentity.position)}</p>
  <p className="muted mt-3">{t(ownerIdentity.professionalTitle)}</p>
  {showBio&&<p className="muted mt-5">{t(ownerIdentity.bio)}</p>}
  <dl className="grid gap-4 mt-6 text-sm">
   <div><dt className="muted">{t(['Official email','البريد الإلكتروني الرسمي'])}</dt><dd><a className="text-link break-all" dir="ltr" href={`mailto:${ownerIdentity.email}`}>{ownerIdentity.email}</a></dd></div>
   <div><dt className="muted">{t(['Phone / WhatsApp','الهاتف وواتساب'])}</dt><dd><a className="text-link" dir="ltr" href={`tel:${ownerIdentity.phone}`}>{ownerIdentity.phone}</a></dd></div>
  </dl>
  <a className="text-link mt-4" href="https://wa.me/201110093730">{t(['Open WhatsApp','فتح واتساب'])}</a>
 </section>
}
