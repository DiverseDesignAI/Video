import React from 'react';
import {AbsoluteFill,Audio,Img,staticFile,useCurrentFrame,useVideoConfig,interpolate,Easing} from 'remotion';

const out=Easing.bezier(.22,1,.36,1), cameraEase=Easing.bezier(.45,0,.2,1);
const v=(t:number,a:number,b:number,x=0,y=1,e=out)=>interpolate(t,[a,b],[x,y],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const focus=(t:number,a:number,b:number,c:number,d:number,n:number)=>v(t,a,b,0,n,cameraEase)*(1-v(t,c,d,0,1,cameraEase));
type ScreenName='home'|'receive'|'exchange'|'exchange-success'|'receipt'|'card'|'card-details'|'activity'|'transaction'|'profile'|'faceid';
type Route={at:number;screen:ScreenName;kind:'push'|'back'|'tab'|'result';fromTab?:number;toTab?:number};
const routes:Route[]=[
 {at:0,screen:'home',kind:'result'},
 {at:1,screen:'receive',kind:'push'}, {at:5.9,screen:'home',kind:'back'},
 {at:7.05,screen:'exchange',kind:'push'}, {at:14.1,screen:'exchange-success',kind:'result'},
 {at:18.25,screen:'receipt',kind:'push'}, {at:23.5,screen:'home',kind:'back'},
 {at:24.6,screen:'card',kind:'tab',fromTab:0,toTab:1},
 {at:30.85,screen:'card-details',kind:'push'}, {at:35.6,screen:'card',kind:'back'},
 {at:36.7,screen:'activity',kind:'tab',fromTab:1,toTab:2},
 {at:39.5,screen:'transaction',kind:'push'}, {at:43.5,screen:'activity',kind:'back'},
 {at:44.7,screen:'profile',kind:'tab',fromTab:2,toTab:3},
 {at:47.3,screen:'faceid',kind:'push'}, {at:51.3,screen:'profile',kind:'back'},
];
type Action={at:number;x:number;y:number;w:number;h:number;screen:ScreenName};
const actions:Action[]=[
 {at:.75,x:201,y:506,w:112,h:82,screen:'home'},
 {at:5.7,x:34,y:85,w:42,h:42,screen:'receive'},
 {at:6.85,x:322,y:506,w:112,h:82,screen:'home'},
 {at:18,x:201,y:811,w:354,h:46,screen:'exchange-success'},
 {at:23.3,x:201,y:758,w:354,h:52,screen:'receipt'},
 {at:24.4,x:154,y:820,w:90,h:52,screen:'home'},
 {at:27.2,x:201,y:430,w:112,h:84,screen:'card'},
 {at:29.3,x:201,y:430,w:112,h:84,screen:'card'},
 {at:30.65,x:80,y:430,w:112,h:84,screen:'card'},
 {at:35.4,x:34,y:87,w:40,h:40,screen:'card-details'},
 {at:36.5,x:247,y:820,w:90,h:52,screen:'card'},
 {at:39.3,x:201,y:495,w:354,h:66,screen:'activity'},
 {at:43.3,x:34,y:87,w:40,h:40,screen:'transaction'},
 {at:44.5,x:340,y:820,w:90,h:52,screen:'activity'},
 {at:47.1,x:109,y:637,w:171,h:107,screen:'profile'},
 {at:51.1,x:201,y:792,w:354,h:44,screen:'faceid'},
];
const imgStyle={width:402,height:874,display:'block'};
const Full=({name}:{name:string})=><Img src={staticFile(name)} style={imgStyle}/>;
// A crop retains the original Figma pixels; its wrapper is the independently animated layer.
const Crop=({name,x,y,w,h,style={}}:{name:string;x:number;y:number;w:number;h:number;style?:React.CSSProperties})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',...style}}><Img src={staticFile(name)} style={{position:'absolute',left:-x,top:-y,width:402,height:874,maxWidth:'none'}}/></div>;
const Ripple=({t,at,x,y}:{t:number;at:number;x:number;y:number})=>{const p=(t-at)/.42;return p<0||p>1?null:<div style={{position:'absolute',left:x-13,top:y-13,width:26,height:26,borderRadius:26,border:'1px solid #e9e1ff',opacity:.65*(1-p),scale:1+p*1.3}}/>};
const Feedback=({t,name}:{t:number;name:ScreenName})=><>{actions.filter(a=>a.screen===name&&t>=a.at&&t<a.at+.3).map(a=>{const q=(t-a.at)/.3;const press=Math.sin(q*Math.PI);const src=name==='card'?(t>28.25&&t<29.7?'frozen.png':'card.png'):name+'.png';return <React.Fragment key={a.at}><Crop name={src} x={a.x-a.w/2} y={a.y-a.h/2} w={a.w} h={a.h} style={{scale:1-.035*press,filter:`brightness(${1+.13*press})`,borderRadius:14}}/><Ripple t={t} at={a.at} x={a.x} y={a.y}/></React.Fragment>})}</>;

const ExchangeSlider=({t}:{t:number})=>{const p=v(t,12.4,13.6);return <div style={{position:'absolute',left:24,top:790,width:354,height:54,borderRadius:17,overflow:'hidden',boxSizing:'border-box',border:'1px solid #8f83b36b',background:'linear-gradient(90deg,#27253e,#211f36 52%,#181729)'}}><div style={{position:'absolute',left:5,top:5,width:317,height:44,borderRadius:12,background:'linear-gradient(90deg,#534b83,#19182a)'}}/><span style={{position:'absolute',left:128,top:17,fontSize:14,fontWeight:500,whiteSpace:'nowrap',color:'#e4dff4',opacity:1-v(t,12.38,12.56)}}>Slide right to confirm</span><span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'#e4dff4',opacity:v(t,13.6,13.85)}}>Exchange complete</span><svg width="18" height="18" viewBox="0 0 18 18" style={{position:'absolute',left:324,top:18,opacity:1-p}}><path d="m3 9 4 4 8-8" fill="none" stroke="#a99fc7" strokeWidth="1.6"/></svg><Img src={staticFile('swipe-thumb.svg')} style={{position:'absolute',left:-1+p*300,top:-1,width:57,height:54}}/><Ripple t={t} at={13.6} x={350} y={27}/></div>};
const Settlement=({t}:{t:number})=>{const age=t-14.1;return <><Full name="exchange-success-base.svg"/>{[{x:148,y:222,w:106,h:30,at:.5},{x:24,y:274,w:354,h:87,at:.65},{x:24,y:361,w:354,h:87,at:.85},{x:24,y:456,w:354,h:132,at:1.05}].map((b,i)=>{const p=v(age,b.at,b.at+.55);return <Crop key={i} name="exchange-success.png" x={b.x} y={b.y} w={b.w} h={b.h} style={{opacity:p,translate:`0 ${10*(1-p)}px`}}/>})}</>};
const Receipt=({t}:{t:number})=>{const p=v(t,18.8,20.1);return <><Full name="receipt-base.svg"/><div style={{position:'absolute',left:36,top:160,width:330,height:551*p,overflow:'hidden'}}><div style={{position:'absolute',left:0,top:-12*(1-p),width:330,height:551,filter:'drop-shadow(0 4px 5px #0003)'}}><Img src={staticFile('receipt.png')} style={{position:'absolute',width:402,height:874,left:-36,top:-160}}/></div></div><Crop name="receipt.png" x={37} y={159} w={328} h={5}/></>};
const Card=({t}:{t:number})=>{const f=v(t,27.4,28.25)*(1-v(t,29.45,30.15));const drift=focus(t,25.4,26.2,26.6,27.1,1);return <><Full name="card-base.svg"/><Crop name="card.png" x={39} y={198} w={324} h={169} style={{translate:`${-2*drift}px ${-4*drift}px`,transform:`perspective(1200px) rotateX(${2*drift}deg) rotateY(${-2*drift}deg)`,transformOrigin:'50% 100%'}}/><Crop name="card.png" x={10} y={337} w={382} h={169}/>{f>0&&<><Crop name="frozen.png" x={15} y={176} w={372} h={222} style={{maskImage:`radial-gradient(ellipse at 60% 0%,#000 ${f*165}%,transparent ${f*165+8}%)`}}/><Crop name="frozen.png" x={10} y={337} w={382} h={169} style={{opacity:v(f,.35,.95)}}/><Crop name="frozen.png" x={24} y={718} w={354} h={38} style={{opacity:v(f,.6,1)}}/></>}</>};
const SceneScreen=({name,t}:{name:ScreenName;t:number})=><div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:36}}>{name==='receipt'?<Receipt t={t}/>:name==='exchange-success'?<Settlement t={t}/>:name==='card'?<Card t={t}/>:<Full name={name+'.png'}/>}{name==='exchange'&&<><ExchangeSlider t={t}/><Crop name="exchange.png" x={176} y={310} w={50} h={50} style={{scale:1+focus(t,8.65,9.0,9.2,9.55,.06),filter:`brightness(${1+focus(t,8.65,9.0,9.2,9.55,.1)})`}}/></>}<Feedback t={t} name={name}/></div>;
const Navigation=({from,to,p}:{from:number;to:number;p:number})=><div style={{position:'absolute',left:0,top:790,width:402,height:84,borderRadius:'28px 28px 0 0',background:'#171821',overflow:'hidden'}}><div style={{position:'absolute',left:15+93.4*(from+(to-from)*p),top:8,width:90,height:52,borderRadius:14,background:'linear-gradient(135deg,#a399ff,#5a4ac2)',border:'1px solid #bcb0ff66',boxSizing:'border-box'}}/><Img src={staticFile(`nav-${from}.svg`)} style={{position:'absolute',inset:0,width:402,height:84,opacity:1-p}}/><Img src={staticFile(`nav-${to}.svg`)} style={{position:'absolute',inset:0,width:402,height:84,opacity:p}}/><div style={{position:'absolute',left:151,top:69,width:100,height:4,borderRadius:4,background:'#dddde3'}}/></div>;
const Screens=({t}:{t:number})=>{let i=0;for(let n=0;n<routes.length;n++)if(t>=routes[n].at)i=n;const r=routes[i],p=i===0?1:v(t,r.at,r.at+.6);const previous=routes[Math.max(0,i-1)].screen;return <>{p<1&&<div style={{position:'absolute',inset:0,translate:`${r.kind==='push'?-85*p:r.kind==='back'?-(1-p)*75:0}px 0`,opacity:r.kind==='result'||r.kind==='tab'?1-p:1,clipPath:r.kind==='tab'?'inset(0 0 84px 0)':undefined}}><SceneScreen name={previous} t={t}/></div>}<div style={{position:'absolute',inset:0,translate:r.kind==='push'?`${(1-p)*402}px 0`:r.kind==='back'?`${p<1?(1-p)*0:0}px 0`:r.kind==='result'?`0 ${16*(1-p)}px`:'0 0',opacity:r.kind==='back'||r.kind==='result'||r.kind==='tab'?p:1,clipPath:r.kind==='tab'&&p<1?'inset(0 0 84px 0)':undefined}}><SceneScreen name={r.screen} t={t}/></div>{r.kind==='back'&&p<1&&<div style={{position:'absolute',inset:0,translate:`${p*402}px 0`}}><SceneScreen name={previous} t={t}/></div>}{r.kind==='tab'&&p<1&&<Navigation from={r.fromTab!} to={r.toTab!} p={p}/>}</>};
const cursorKeys:number[][]=[[0,300,680]];
const cursorEvents=[...actions.map(a=>({at:a.at,x:a.x,y:a.y,drag:0})),{at:12.4,x:50,y:817,drag:1},{at:13.6,x:350,y:817,drag:2}].sort((a,b)=>a.at-b.at);
let previousX=300,previousY=680,previousTime=0;
for(const a of cursorEvents){if(a.drag===2){cursorKeys.push([a.at,a.x,a.y],[a.at+.15,a.x,a.y]);}else{cursorKeys.push([Math.max(previousTime,a.at-.6),previousX,previousY],[a.at-.08,a.x,a.y],[a.at+(a.drag===1?0:.15),a.x,a.y]);}previousX=a.x;previousY=a.y;previousTime=a.at+(a.drag===1?0:.15);}
const Cursor=({t}:{t:number})=>{let x=300,y=680;for(let i=1;i<cursorKeys.length;i++){if(t>=cursorKeys[i-1][0]){const a=cursorKeys[i-1],b=cursorKeys[i];x=v(t,a[0],b[0],a[1],b[1]);y=v(t,a[0],b[0],a[2],b[2]);}}const down=actions.some(a=>t>=a.at&&t<a.at+.16)||(t>=12.4&&t<=13.6);return <div style={{position:'absolute',left:x,top:y,opacity:v(t,.05,.55)*(1-v(t,51.7,52.5)),scale:down?.88:1,transformOrigin:'0 0',filter:'drop-shadow(0 2px 4px #0009)'}}><svg width="28" height="34" viewBox="0 0 28 34"><path d="M2 2 3 27 10 21 15 32 20 30 15 19 25 18Z" fill="#faf8ff" stroke="#777095" strokeWidth="1.2" strokeLinejoin="round"/></svg>{down&&<div style={{position:'absolute',left:-10,top:-10,width:20,height:20,borderRadius:20,border:'1px solid #e7dfff',background:'#b7a5ff33'}}/>}</div>};
const copy=[
 {a:0,b:.95,lines:['Your money.','In one place.'],sub:'Three currencies. One clear view.'},
 {a:1,b:6.55,lines:['Receive money.','Your QR code.'],sub:'Let someone scan this code to pay you.'},
 {a:6.65,b:14.4,lines:['Convert currencies.','USD to RUB.'],sub:'Exchange preview'},
 {a:14.45,b:18.5,lines:['Exchange complete.','USD to RUB.'],sub:''},
 {a:18.6,b:24.3,lines:['View receipt.','Currency exchange.'],sub:''},
 {a:24.4,b:31.05,lines:['Your virtual card.','Active. Frozen.'],sub:''},
 {a:31.1,b:36.5,lines:['Card details.','Hidden by design.'],sub:'Verify to reveal details'},
 {a:36.6,b:44.5,lines:['Activity.','Payment details.'],sub:''},
 {a:44.6,b:47.5,lines:['Profile.','Artem Petrov.'],sub:''},
 {a:47.6,b:52.9,lines:['Security.','Face ID.'],sub:'Face ID is currently off'},
];
const Captions=({t}:{t:number})=><>{copy.map((c,i)=>{const p=i===0?1:v(t,c.a,c.a+.55),exit=v(t,c.b-.2,c.b);return <div key={c.a} style={{position:'absolute',left:180,top:410,width:1190,opacity:p*(1-exit),translate:`0 ${20*(1-p)-14*exit}px`}}><div style={{fontSize:c.lines.some(l=>l.length>18)?103:120,fontWeight:650,letterSpacing:-4.2,lineHeight:1.08}}>{c.lines.map((l,j)=><div key={l} style={{color:j?'#bcb2fc':'#f6f4ff'}}>{l}</div>)}</div>{c.sub&&<div style={{marginTop:36,fontSize:32,lineHeight:1.5,color:'#b7b5cc',maxWidth:850}}>{c.sub}</div>}</div>})}</>;
const Device=({name,left,scale,opacity,angle}:{name:string;left:number;scale:number;opacity:number;angle:number})=><div style={{position:'absolute',left,top:110,width:402,height:874,translate:'0 175px',scale,opacity,transform:`perspective(2200px) rotateY(${angle}deg)`,filter:'drop-shadow(0 24px 45px #0006)'}}><div style={{position:'absolute',inset:-5,borderRadius:41,border:'1px solid #b7b5cc40',background:'#090c16'}}/><div style={{position:'absolute',inset:0,borderRadius:36,overflow:'hidden'}}><Full name={name}/></div></div>;
export const YuvioContinuation=()=>{const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;const ending=v(t,53,54.7,0,1,cameraEase);const z=1+focus(t,2.0,3.0,3.9,5.0,.32)+focus(t,8.0,8.8,9.5,10.3,.17)+focus(t,10.5,11.2,11.7,12.2,.11)+focus(t,15.2,15.8,16.8,17.4,.08)+focus(t,19.2,20.0,21.9,22.7,.14)+focus(t,25.4,26.1,26.6,27.0,.13)+focus(t,31.6,32.3,34.5,35.1,.13)+focus(t,37.5,38,38.2,38.7,.08)+focus(t,40.2,40.9,42.5,43,.13)+focus(t,45.4,46.1,46.3,46.8,.15)+focus(t,48.1,48.8,49.6,50.3,.2);
 const pan=focus(t,8,8.8,9.5,10.3,110)-focus(t,10.5,11.2,11.7,12.2,150)-focus(t,16,16.8,17.1,17.6,35)+focus(t,25.4,26.1,26.6,27,80)+focus(t,31.6,32.3,32.5,33.1,100)-focus(t,33.2,33.9,34.5,35.1,145)+focus(t,37.5,38,38.2,38.7,90)-focus(t,41.5,42.1,42.5,43,120)+focus(t,45.4,46.1,46.3,46.8,145)+focus(t,48.1,48.8,49.6,50.3,80);
 const deviceScale=1.428*z*(1-ending)+1.05*ending;
 return <AbsoluteFill style={{background:'#05070d',fontFamily:'Onest',color:'#f6f4ff',overflow:'hidden'}}><AbsoluteFill style={{background:`radial-gradient(ellipse 1200px 1100px at ${78+3*Math.sin((t+15)*.22)}% ${61+6*Math.cos((t+15)*.2)}%,rgba(97,75,183,.33),transparent 73%),radial-gradient(ellipse 1100px 850px at ${25+5*Math.sin((t+15)*.19)}% 110%,rgba(72,61,140,.28),transparent 78%),linear-gradient(145deg,#05070D,#090C16 55%,#0E0E32)`}}/><AbsoluteFill style={{backgroundImage:`url(${staticFile('dither.png')})`,opacity:.065,mixBlendMode:'soft-light'}}/>
 <div style={{position:'absolute',left:180,top:125,display:'flex',alignItems:'center',gap:22,opacity:1-v(t,53,54)}}><Img src={staticFile('logo.svg')} style={{width:65,height:35,objectFit:'contain'}}/><span style={{fontSize:34,fontWeight:600,letterSpacing:1}}>YUVIO</span></div><Captions t={t}/>
 <Device name="home.png" left={1079-479*v(t,53.5,55.2)} scale={.88} opacity={v(t,53.5,55.2)} angle={5}/><Device name="card.png" left={1079+471*v(t,53.65,55.35)} scale={.88} opacity={v(t,53.65,55.35)} angle={-5}/>
 <div style={{position:'absolute',left:1560-481*ending,top:85+pan*(1-ending),width:402,height:874,scale:deviceScale,transformOrigin:'50% 50%',translate:'0 175px',filter:'drop-shadow(0 30px 55px #0007)'}}><div style={{position:'absolute',inset:-5,borderRadius:41,border:'1px solid #b7b5cc40',background:'#090c16'}}/><div style={{position:'absolute',inset:0,borderRadius:36,overflow:'hidden'}}><Screens t={t}/></div><Cursor t={t}/></div>
 <div style={{position:'absolute',left:0,right:0,top:96,display:'flex',justifyContent:'center',alignItems:'center',gap:24,opacity:v(t,54.2,55.3),translate:`0 ${14*(1-v(t,54.2,55.3))}px`}}><Img src={staticFile('logo.svg')} style={{width:96,height:52,objectFit:'contain'}}/><span style={{fontSize:54,fontWeight:650,letterSpacing:2}}>YUVIO</span></div>
 <div style={{position:'absolute',left:0,right:0,top:1260,textAlign:'center',fontSize:64,fontWeight:500,letterSpacing:-1.5,opacity:v(t,55.2,56.3)}}>Money moves differently.</div><Audio src={staticFile('continuation.wav')} volume={.7}/></AbsoluteFill>;
};
