// The private console has a dedicated origin. Authentication is still mandatory.
export function isMailConsoleHost(host:string|null){
 const expected=process.env.NEXA_MAIL_CONSOLE_HOST?.trim().toLowerCase()
 return !!expected&&expected==='mail.agynexa.si'&&host?.toLowerCase()===expected
}
