import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Almarai } from 'next/font/google'
import Shell from '@/components/agynexa-shell'
const almarai = Almarai({ subsets: ['arabic'], weight: ['400', '700'], variable: '--font-arabic' })

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${almarai.variable} antialiased`}>
        <Shell>{children}</Shell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
