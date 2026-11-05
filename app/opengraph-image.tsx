import {ImageResponse} from 'next/og'

export const alt='AGYNEXA — Agent Builder Studio for business'
export const size={width:1200,height:630}
export const contentType='image/png'

export default function OpenGraphImage(){
 return new ImageResponse(
  <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'68px 76px',background:'#050505',color:'#ebebeb',fontFamily:'sans-serif'}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{display:'flex',fontSize:32,fontWeight:700,letterSpacing:-1}}>AGYNEXA<span style={{color:'#10b981'}}>.</span></div><span style={{fontSize:18,color:'#bfbfbf'}}>Agent Builder Studio</span></div>
   <div style={{display:'flex',flexDirection:'column',gap:18}}><span style={{color:'#10b981',fontSize:18,letterSpacing:4}}>BUILT AROUND YOUR WORK</span><div style={{fontSize:74,fontWeight:600,lineHeight:1.1,letterSpacing:-3,display:'flex',flexDirection:'column'}}><span>Your business.</span><span>Your agents.</span></div></div>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #353535',paddingTop:26}}><span style={{fontSize:20,color:'#bfbfbf'}}>Create · Configure · Test</span><span style={{fontSize:20,color:'#10b981'}}>agynexa.si</span></div>
  </div>,size,
 )
}
