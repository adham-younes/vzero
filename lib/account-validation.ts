export class InputError extends Error {
 code: string
 status: number
 constructor(code: string, status = 400) { super(code); this.code=code; this.status=status }
}
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export function field(value: unknown, max: number, min = 1): string {
 if (typeof value !== 'string' || value.trim().length < min || value.length > max) throw new InputError('invalid_input')
 return value.trim()
}
export function credentials(body: Record<string, unknown>, registration = false) {
 const email = field(body.email, 254).toLowerCase()
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError('invalid_email')
 // Never trim passwords; spaces can be intentional.
 if (typeof body.password !== 'string' || body.password.length < (registration ? 12 : 1) || body.password.length > 128) throw new InputError('invalid_password')
 return {email, password: body.password}
}
export function briefInput(body: Record<string, unknown>) {
 if (body.consent !== true) throw new InputError('consent_required')
 const request_key = field(body.requestKey, 36)
 if (!uuidPattern.test(request_key)) throw new InputError('invalid_input')
 const email = field(body.email,254).toLowerCase()
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError('invalid_email')
 return {request_key, organization:field(body.organization,100), contact_email:email, service:field(body.service,200), problem:field(body.problem,1500), sources:field(body.sources,1500), acceptance:field(body.acceptance,1500)}
}
export async function readMutation(request: Request) {
 if (request.headers.get('origin') !== new URL(request.url).origin) throw new InputError('invalid_origin',403)
 if (!request.headers.get('content-type')?.startsWith('application/json')) throw new InputError('invalid_content_type',415)
 if (Number(request.headers.get('content-length')) > 20000) throw new InputError('body_too_large',413)
 const reader=request.body?.getReader();let size=0;const parts:Uint8Array[]=[]
 if (!reader) throw new InputError('invalid_input')
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>20000){await reader.cancel();throw new InputError('body_too_large',413)}parts.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length}
 let body: unknown
 try{body=JSON.parse(new TextDecoder().decode(bytes))}catch{throw new InputError('invalid_input')}
 if(!body||typeof body!=='object'||Array.isArray(body))throw new InputError('invalid_input')
 return body as Record<string,unknown>
}
