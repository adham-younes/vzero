export async function register(){
 if(process.env.NEXT_RUNTIME!=='nodejs')return
 const {init}=await import('@heronsignal/node')
 init({
  token:process.env.HERONSIGNAL_SERVER_TOKEN!,
  service:'my-project',
  flushIntervalMs:process.env.VERCEL?0:2000,
 })
}
