import {NextRequest,NextResponse} from 'next/server'
import {isMailConsoleHost} from '@/lib/owner-mail/host'
export function proxy(request:NextRequest){
 const path=request.nextUrl.pathname,consoleMode=isMailConsoleHost(request.headers.get('host'))
 const privatePath=path==='/private-mail'||path.startsWith('/private-mail/')||path.startsWith('/api/private-mail/')
 if(!consoleMode&&privatePath)return new NextResponse('Not found',{status:404})
 if(consoleMode){
  if(path==='/')return NextResponse.redirect(new URL('/private-mail',request.url))
  if(!privatePath&&!['/favicon.ico','/icon.svg','/apple-icon.png','/icon-dark-32x32.png','/icon-light-32x32.png'].includes(path))return new NextResponse('Not found',{status:404})
 }
 const headers=new Headers(request.headers);headers.set('x-agynexa-locale',consoleMode||path.split('/')[1]==='ar'?'ar':'en')
 const response=NextResponse.next({request:{headers}})
 if(consoleMode){
  response.headers.set('X-Robots-Tag','noindex, nofollow, noarchive')
  response.headers.set('Cache-Control','private, no-store')
  response.headers.set('X-Frame-Options','DENY')
  response.headers.set('Referrer-Policy','no-referrer')
  response.headers.set('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'")
 }
 return response
}
export const config={matcher:['/((?!_next|_vercel).*)']}
