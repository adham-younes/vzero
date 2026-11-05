'use client'

import {Analytics} from '@vercel/analytics/next'
import {SpeedInsights} from '@vercel/speed-insights/next'

// Runs for every event, including navigation after the public page has mounted.
// Never report private routes or query parameters containing workspace references.
function publicEvent<T extends {url:string}>(event:T):T|null {
  try {
    const url=new URL(event.url)
    const path=url.pathname.replace(/^\/ar(?=\/|$)/,'')||'/'
    if(/^\/(studio|account|login|signup|register|reset-password|forgot-password|auth|api|admin|widget)(\/|$)/.test(path)) return null
    url.search='';url.hash=''
    return {...event,url:url.href}
  } catch {return null}
}

export default function PublicAnalytics(){return <><Analytics beforeSend={publicEvent}/><SpeedInsights beforeSend={publicEvent}/></>}
