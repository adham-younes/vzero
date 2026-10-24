import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Almarai } from 'next/font/google'
import Shell from '@/components/agynexa-shell'
import {headers} from 'next/headers'
import {siteUrl} from '@/lib/site-routes'
import { HeronSignalProvider } from './heronsignal-provider'
const almarai = Almarai({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-arabic' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'AGYNEXA — Enterprise agent systems', template: '%s | AGYNEXA' },
  description: 'Enterprise AI agents, RAG and workflow automation with explicit permissions and acceptance criteria.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050505',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const ar=(await headers()).get('x-agynexa-locale')==='ar'
  return (
    <html lang={ar?'ar':'en'} dir={ar?'rtl':'ltr'} className="dark">
      <body className={`${almarai.variable} antialiased`}>
        <HeronSignalProvider />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'AGYNEXA',url:siteUrl,email:'adham@agynexa.si',founder:{'@type':'Person',name:'Adham Younes'}})}}/>
        <Shell>{children}</Shell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <SpeedInsights />
      </body>
    </html>
  )
}
