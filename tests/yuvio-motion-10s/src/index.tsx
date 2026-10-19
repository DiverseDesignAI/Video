import React from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame, useVideoConfig, interpolate, Easing, Img, staticFile, delayRender, continueRender, cancelRender} from 'remotion';
import {Audio} from '@remotion/media';

if (typeof document !== 'undefined') {
 const handle=delayRender('Load original Onest typeface');
 new FontFace('Onest', `url(${staticFile('Onest.ttf')})`, {weight:'100 900'}).load().then(font=>{document.fonts.add(font);continueRender(handle)}).catch(cancelRender);
}
const ease=Easing.bezier(.22,1,.36,1);
const tween=(t:number,a:number,b:number,x=0,y=1)=>interpolate(t,[a,b],[x,y],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:ease});
const Tap=({t,at,x,y}:{t:number;at:number;x:number;y:number})=>{const q=(t-at)/.45;if(q<0||q>1)return null;return <div style={{position:'absolute',left:x-15,top:y-15,width:30,height:30,border:'1.2px solid #e2dbff',borderRadius:'50%',opacity:(1-q)*.75,scale:1+q*1.4}}/>};
const Copy=({t,from,to,title,sub}:{t:number;from:number;to:number;title:string[];sub:string})=>{const enter=tween(t,from,from+.6),exit=tween(t,to-.3,to);return <div style={{position:'absolute',left:180,top:410,opacity:enter*(1-exit),translate:`0 ${24*(1-enter)-16*exit}px`,width:1160}}><div style={{fontSize:120,fontWeight:500,letterSpacing:-4.2,lineHeight:1.08,color:'#F6F4FF'}}>{title.map((s,i)=><div key={s} style={{color:i===1?'#bcb2fc':undefined}}>{s}</div>)}</div><div style={{fontSize:32,lineHeight:1.5,color:'#B7B5CC',marginTop:36,maxWidth:850}}>{sub}</div></div>};
const Screen=({src,x=0,children}:{src:string;x?:number;children?:React.ReactNode})=><div style={{position:'absolute',inset:0,translate:`${x}px 0`,overflow:'hidden',borderRadius:36}}><Img src={staticFile(src)} style={{width:402,height:874,display:'block'}}/>{children}</div>;
const swipes=[[2.85,3.4],[3.8,4.35],[4.75,5.3]];
const carousel=(t:number)=>swipes.reduce((v,[a,b])=>v+tween(t,a,b),0);
const Recipients=({t}:{t:number})=>{const p=carousel(t);return <><div style={{position:'absolute',left:0,top:232,width:402,height:286,overflow:'hidden'}}>{['angelina','ilya','dmitriy','nikita'].map((n,i)=><div key={n} style={{position:'absolute',left:(i-p)*402,top:0,width:402,height:286}}><Img src={staticFile(n+'.png')} style={{position:'absolute',top:-232,width:402,height:874}}/></div>)}</div><div style={{position:'absolute',left:165,top:520,width:74,height:24,background:'#0e0d25',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>{[0,1,2,3,4].map(i=><div key={i} style={{width:6,height:6,borderRadius:6,background:'#464160'}}/>)}<div style={{position:'absolute',left:8+p*13,top:8,width:8,height:8,borderRadius:8,background:'#c4b5fd',boxShadow:'0 0 5px #9985e544'}}/></div><Tap t={t} at={5.75} x={201} y={357}/></>};
const Swipe=({t}:{t:number})=>{const p=tween(t,8,9.15);return <div style={{position:'absolute',left:24,top:780,width:354,height:54,borderRadius:17,overflow:'hidden',border:'1px solid rgba(143,131,179,.42)',background:'linear-gradient(90deg,#27253e,#211f36 52%,#181729)',boxSizing:'border-box'}}><div style={{position:'absolute',left:5,top:5,width:317,height:44,borderRadius:12,background:'linear-gradient(90deg,#534b83,#19182a)'}}/><div style={{position:'absolute',left:128,top:17,fontSize:14,fontWeight:500,color:'#e4dff4',whiteSpace:'nowrap',opacity:1-tween(t,7.96,8.13)}}>Slide right to confirm</div><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#e4dff4',opacity:tween(t,9.15,9.4)}}>Transfer sent</div><svg width="18" height="18" viewBox="0 0 18 18" style={{position:'absolute',left:324,top:18,opacity:1-p}}><path d="m3 9 4 4 8-8" fill="none" stroke="#a99fc7" strokeWidth="1.6"/></svg><Img src={staticFile('swipe-thumb.svg')} style={{position:'absolute',left:-1+p*300,top:-1,width:57,height:54}}/></div>};
const Cursor=({t}:{t:number})=>{const keys=[[0,350,620],[1.25,80,506],[1.8,80,506],[2.6,285,355],[2.85,285,355],[3.4,125,355],[3.72,285,355],[3.8,285,355],[4.35,125,355],[4.65,285,355],[4.75,285,355],[5.3,125,355],[5.65,201,357],[5.9,201,357],[7.55,50,807],[8,50,807],[9.15,350,807],[9.5,350,807],[10,390,850]];let x=keys[0][1],y=keys[0][2];for(let i=1;i<keys.length;i++){if(t>=keys[i-1][0]){x=tween(t,keys[i-1][0],keys[i][0],keys[i-1][1],keys[i][1]);y=tween(t,keys[i-1][0],keys[i][0],keys[i-1][2],keys[i][2]);}}const down=(t>=1.75&&t<1.95)||(t>=5.75&&t<5.92)||swipes.some(([a,b])=>t>=a&&t<=b)||(t>=8&&t<=9.15);return <div style={{position:'absolute',left:x,top:y,opacity:tween(t,.5,1)*(1-tween(t,9.6,10)),transform:`scale(${down?.88:1})`,transformOrigin:'0 0',filter:'drop-shadow(0 2px 4px #0009)'}}><svg width="28" height="34" viewBox="0 0 28 34"><path d="M2 2 3 27 10 21 15 32 20 30 15 19 25 18Z" fill="#faf8ff" stroke="#777095" strokeWidth="1.2" strokeLinejoin="round"/></svg>{down&&<div style={{position:'absolute',left:-10,top:-10,width:20,height:20,borderRadius:20,border:'1px solid #e7dfff',background:'#b7a5ff33'}}/>}</div>};
export const YuvioTest=()=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
 const slideA=tween(t,1.98,2.6);const slideB=tween(t,5.95,6.6);
 const camera=tween(t,0,1.5,1.02,1)+tween(t,6.6,7.8,0,.065)-tween(t,9.3,10,0,.025);
 const lift=tween(t,0,1,25,0)-tween(t,6.6,7.8,0,15);
 return <AbsoluteFill style={{background:'#05070D',fontFamily:'Onest',color:'#F6F4FF',overflow:'hidden'}}>
  <AbsoluteFill style={{background:`radial-gradient(ellipse 1200px 1100px at ${78+3*Math.sin(t*.22)}% ${61+6*Math.cos(t*.2)}%,rgba(97,75,183,.33),transparent 73%),radial-gradient(ellipse 1100px 850px at ${25+5*Math.sin(t*.19)}% 110%,rgba(72,61,140,.28),transparent 78%),linear-gradient(145deg,#05070D,#090C16 55%,#0E0E32)`}}/>
  <AbsoluteFill style={{backgroundImage:`url(${staticFile('dither.png')})`,opacity:.065,mixBlendMode:'soft-light',pointerEvents:'none'}}/>
  <div style={{position:'absolute',left:180,top:125,display:'flex',alignItems:'center',gap:22,opacity:tween(t,0,.55)}}><Img src={staticFile('logo.svg')} style={{width:65,height:35,objectFit:'contain'}}/><span style={{fontSize:34,fontWeight:600,letterSpacing:1}}>YUVIO</span></div>
  <Copy t={t} from={0} to={2.15} title={['Your money.','In one place.']} sub="Three currencies. One clear view."/>
  <Copy t={t} from={2.2} to={6.1} title={['Choose who.','Make your move.']} sub="A familiar face. A direct connection."/>
  <Copy t={t} from={6.15} to={10.6} title={['Know the cost.','Stay in control.']} sub="The amount, the rate and the fee. Before you confirm."/>
  <div style={{position:'absolute',left:1560,top:100+lift,width:402,height:874,scale:1.4*camera,transformOrigin:'50% 50%',translate:'0 175px',filter:'drop-shadow(0 30px 55px rgba(0,0,0,.44))'}}>
   <div style={{position:'absolute',inset:-5,borderRadius:41,border:'1px solid rgba(183,181,204,.25)',background:'#090c16'}}/>
   <div style={{position:'absolute',inset:0,borderRadius:36,overflow:'hidden'}}>
    {slideA<1&&<Screen src="home.png" x={-slideA*118}><Tap t={t} at={1.8} x={80} y={506}/>{t>1.8&&t<1.98&&<div style={{position:'absolute',left:24,top:468,width:112,height:82,borderRadius:18,background:`rgba(148,136,243,${.16*Math.sin((t-1.8)/.18*Math.PI)})`}}/>}</Screen>}
    {t>=1.98&&slideB<1&&<Screen src="angelina.png" x={(1-slideA)*402-slideB*118}><Recipients t={t}/></Screen>}
    {t>=5.95&&<Screen src="send.png" x={(1-slideB)*402}><div style={{position:"absolute",left:25,top:200,width:40,height:43,overflow:"hidden",borderRadius:24,background:"#17162a"}}><Img src={staticFile("nikita.png")} style={{position:"absolute",width:72.36,height:157.32,left:-15.84,top:-43.56}}/></div><Swipe t={t}/><Tap t={t} at={9.15} x={350} y={807}/></Screen>}
    {slideA>0&&slideA<1&&<div style={{position:'absolute',inset:0,pointerEvents:'none',background:'#05070d',opacity:Math.sin(slideA*Math.PI)*.08}}/>}
   </div>
   <Cursor t={t}/>
  </div>
  <Audio src={staticFile('sound.wav')} volume={.7}/>
 </AbsoluteFill>
};
registerRoot(()=> <Composition id="YuvioMotionTest" component={YuvioTest} width={2560} height={1440} fps={60} durationInFrames={600}/>);