import {mailEndpoint} from '@/lib/nexa-email/admin'
import {importMail} from '@/lib/owner-mail/api'
export const runtime='nodejs'
export const maxDuration=60
export async function POST(request:Request){return mailEndpoint(()=>importMail(request))}
export async function GET(request:Request){return mailEndpoint(()=>importMail(request))}
