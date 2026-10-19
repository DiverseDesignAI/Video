import React from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile, delayRender, continueRender, cancelRender} from 'remotion';
import {Audio} from '@remotion/media';

if (typeof document !== 'undefined') {
 const handle=delayRender('Load original Onest typeface');
 new FontFace('Onest', `url(${staticFile('Onest.ttf')})`, {weight:'100 900'}).load().then(font=>{document.fonts.add(font);continueRender(handle)}).catch(cancelRender);
}
const ease=Easing.bezier(.22,1,.36,1);
const tween=(t:number,a:number,b:number,x=0,y=1)=>interpolate(t,[a,b],[x,y],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
const Tap=({t,at,x,y}:{t:number;at:number;x:number;y:number})=>{const age=t-at;if(age<0||age>.52)return null;const q=age/.52;return <div style={{position:'absolute',left:x-12,top:y-12,width:24,height:24,border:'1.2px solid #f6f4ff',borderRadius:'50%',background:`rgba(246,244,255,${.22*(1-q)})`,opacity:1-q,scale:1+q*1.6}}/>};
const Copy=({t,from,to,title,sub}:{t:number;from:number;to:number;title:string[];sub:string})=>{const enter=tween(t,from,from+.65);const exit=tween(t,to-.25,to);return <div style={{position:'absolute',left:180,top:430,opacity:enter*(1-exit),translate:`0 ${22*(1-enter)-18*exit}px`,width:1080}}><div style={{fontSize:102,fontWeight:500,letterSpacing:-4.2,lineHeight:1.08,color:'#F6F4FF'}}>{title.map((s,i)=><div key={s} style={{color:i===1?'#bcb2fc':undefined}}>{s}</div>)}</div><div style={{fontSize:28,lineHeight:1.5,color:'#B7B5CC',marginTop:36,maxWidth:740}}>{sub}</div></div>};
const Screen=({src,x=0,children}:{src:string;x?:number;children?:React.ReactNode})=><div style={{position:'absolute',inset:0,translate:`${x}px 0`,overflow:'hidden',borderRadius:36}}><Img src={staticFile(src)} style={{width:402,height:874,display:'block'}}/>{children}</div>;
const Swipe=({t}:{t:number})=>{const p=tween(t,8.15,9.25);return <div style={{position:'absolute',left:24,top:780,width:354,height:54,borderRadius:17,overflow:'hidden',border:'1px solid rgba(143,131,179,.42)',background:'linear-gradient(90deg,#27253e 0%,#211f36 52%,#181729 100%)',boxSizing:'border-box'}}><div style={{position:'absolute',left:5,top:5,width:317,height:44,borderRadius:12,background:'linear-gradient(90deg,#534b83,#19182a)'}}/><div style={{position:'absolute',left:108,top:17,fontSize:14,fontWeight:500,color:'#e4dff4',opacity:1-tween(t,8.3,8.75)}}>Slide right to confirm</div><div style={{position:'absolute',left:108,top:17,fontSize:13,color:'#e4dff4',opacity:tween(t,8.75,9.3)}}>{p>.99?'Transfer sent':'Keep sliding'}</div><div style={{position:'absolute',left:326,top:15,color:'#a99fc7',fontSize:18}}>РІСљвЂњ</div><Img src={staticFile('swipe-thumb.svg')} style={{position:'absolute',left:-1+p*300,top:-1,width:57,height:54}}/>{t>8.1&&t<9.4&&<div style={{position:'absolute',left:26+p*300-9,top:27-9,width:18,height:18,borderRadius:'50%',background:'rgba(246,244,255,.3)',border:'1px solid rgba(246,244,255,.8)',opacity:tween(t,8.1,8.25)*(1-tween(t,9.2,9.4))}}/>}</div>};
export const YuvioTest=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
 const slideA=tween(t,2.55,3.12);const slideB=tween(t,4.65,5.25);
 const camera=tween(t,0,1.5,1.02,1)+tween(t,5.5,7.1,0,.065)-tween(t,9.3,10,0,.025);
 const lift=tween(t,0,1,25,0)-tween(t,5.5,7.1,0,15);
 return <AbsoluteFill style={{background:'#05070D',fontFamily:'Onest',color:'#F6F4FF',overflow:'hidden'}}>
  <AbsoluteFill style={{background:`radial-gradient(ellipse 1200px 1100px at ${78+3*Math.sin(t*.22)}% ${61+6*Math.cos(t*.2)}%,rgba(97,75,183,.33),transparent 73%),radial-gradient(ellipse 1100px 850px at ${25+5*Math.sin(t*.19)}% 110%,rgba(72,61,140,.28),transparent 78%),linear-gradient(145deg,#05070D,#090C16 55%,#0E0E32)`}}/>
  <div style={{position:'absolute',left:180,top:125,display:'flex',alignItems:'center',gap:22,opacity:tween(t,0,.55)}}><Img src={staticFile('logo.svg')} style={{width:65,height:35,objectFit:'contain'}}/><span style={{fontSize:34,fontWeight:600,letterSpacing:1}}>YUVIO</span></div>
  <Copy t={t} from={0} to={2.65} title={['Your money.','In one place.']} sub="Three currencies. One clear view."/>
  <Copy t={t} from={2.7} to={4.8} title={['Choose who.','Make your move.']} sub="A familiar face. A direct connection."/>
  <Copy t={t} from={4.85} to={10.6} title={['Know the cost.','Stay in control.']} sub="The amount, the rate and the fee. Before you confirm."/>
  <div style={{position:'absolute',left:180,top:1100,opacity:tween(t,.6,1.2),color:'#9294A5',fontSize:20,letterSpacing:.4}}>Product design concept</div>
  <div style={{position:'absolute',left:1560,top:100+lift,width:402,height:874,scale:1.4*camera,transformOrigin:'50% 50%',translate:'0 175px',filter:'drop-shadow(0 30px 55px rgba(0,0,0,.44))'}}>
   <div style={{position:'absolute',inset:-5,borderRadius:41,border:'1px solid rgba(183,181,204,.25)',background:'#090c16'}}/>
   <div style={{position:'absolute',inset:0,borderRadius:36,overflow:'hidden'}}>
    {slideA<1&&<Screen src="home.png" x={-slideA*118}><Tap t={t} at={2.26} x={80} y={506}/>{t>2.26&&t<2.55&&<div style={{position:'absolute',left:24,top:468,width:112,height:82,borderRadius:18,background:`rgba(148,136,243,${.16*Math.sin((t-2.26)/.29*Math.PI)})`}}/>}</Screen>}
    {t>=2.55&&slideB<1&&<Screen src="recipient.png" x={(1-slideA)*402-slideB*118}><Tap t={t} at={4.37} x={200} y={360}/></Screen>}
    {t>=4.65&&<Screen src="send.png" x={(1-slideB)*402}>{t>=7.8&&<Swipe t={t}/>}</Screen>}
    {slideA>0&&slideA<1&&<div style={{position:'absolute',inset:0,pointerEvents:'none',background:'#05070d',opacity:Math.sin(slideA*Math.PI)*.08}}/>}
   </div>
  </div>
  <Audio src={staticFile('sound.wav')} volume={.7}/>
 </AbsoluteFill>
};
registerRoot(()=> <Composition id="YuvioMotionTest" component={YuvioTest} width={2560} height={1440} fps={60} durationInFrames={600}/>);
