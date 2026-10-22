/** Public failures carry codes only, never upstream bodies or credentials. */
export class MailError extends Error {
 readonly code:string
 readonly status:number
 constructor(code:string,status:number){
  const safe=/^[a-z][a-z0-9_]{0,63}$/.test(code)&&Number.isInteger(status)&&status>=400&&status<=599
  super(safe?code:'temporarily_unavailable')
  this.name='MailError';this.code=this.message;this.status=safe?status:503
 }
}
