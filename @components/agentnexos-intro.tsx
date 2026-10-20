'use client'

import Breadcrumbs from './breadcrumbs'
import Image from 'next/image'
import pages from '@/lib/program-pages.json'
import {Action,useLanguage} from './agynexa-shell'
import styles from './agentnexos-intro.module.css'

export default function AgentNexosIntro() {
 const {t}=useLanguage()
 const data=pages.agentnexos
 return <section className={`container ${styles.intro}`}>
  <Image className={styles.art} src="/images/agentnexos-neural.webp" alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" preload/>
  <div className={styles.copy}>
   <Breadcrumbs/>
   <h1>{t(data.title)}</h1>
   <p className={styles.description}>{t(data.intro)}</p>
   <Action href="/architecture">{t(['Explore the architecture','استكشف البنية'])}</Action>
  </div>
 </section>
}
