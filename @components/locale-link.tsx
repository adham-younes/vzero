'use client'
import NextLink from 'next/link'
import {usePathname} from 'next/navigation'
import type {ComponentProps} from 'react'
export default function Link({href,...props}:ComponentProps<typeof NextLink>){
 const ar=usePathname().split('/')[1]==='ar'
 const localized=typeof href==='string'&&href.startsWith('/')&&!href.startsWith('//')&&!/^\/ar(?:\/|$)/.test(href)&&ar?`/ar${href==='/'?'':href}`:href
 return <NextLink href={localized} {...props}/>
}
