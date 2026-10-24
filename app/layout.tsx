import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Almarai } from 'next/font/google'
import Shell from '@/components/agynexa-shell'
import {headers} from 'next/headers'
import {siteUrl} from '@/lib/site-routes'
import Script from 'next/script'
const almarai = Almarai({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-arabic' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'AGYNEXA — Business Agent Builder Studio', template: '%s | AGYNEXA' },
  description: 'Configure AI agents around company knowledge and business workflows, with approved information and human review.',
  openGraph: {
    images: '/images/technology.jpg',
  },
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
      <head>
        <script id="heronsignal-config" dangerouslySetInnerHTML={{__html:`
  window.heronsignalConfig = {
    publicKey: "pk_dSrC6lnKvNFN9arrAC5KJ2VOnDzKqK1i"
  };
`}}/>
      </head>
      <body className={`${almarai.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'AGYNEXA',url:siteUrl,email:'adham@agynexa.si',founder:{'@type':'Person',name:'Adham Younes'}})}}/>
        <Shell>{children}</Shell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <SpeedInsights />
        <Script id="heronsignal-tracker" src="https://api.heronsignal.com/tracker.js" strategy="afterInteractive" async />
      </body>
    </html>
  )
}
