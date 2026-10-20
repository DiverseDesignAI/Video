import React from 'react';
import {Img,staticFile} from 'remotion';
import {Recipients,Slider,Settlement,Transaction} from './ScreensV7';
import {NativeControlV8,ControlV8} from './NativeControlV8';
import assets from './v8-assets.json';
import {Page,taps,ramp,pressAt,realTimeV7,cardGeometry,cardStateV8,routeStateV8,receiptStart,receiptProgress} from './motionV8';

const file=(name:string)=>staticFile('v5/'+name);
export const FullV5=({name,style={}}:{name:string;style?:React.CSSProperties})=><Img src={file(name)} style={{position:'absolute',inset:0,width:402,height:874,...style}}/>;
const Crop=({name,x,y,w,h,style={}}:{name:string;x:number;y:number;w:number;h:number;style?:React.CSSProperties})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',...style}}><Img src={file(name)} style={{position:'absolute',width:402,height:874,left:-x,top:-y,maxWidth:'none'}}/></div>;

const control=(key:string,x:number,y:number,w:number,h:number,r:number,kind:ControlV8['kind'],tapAt?:number):ControlV8=>({key,x,y,w,h,r,kind,tapAt});
const tapFor=(page:Page,test:(a:typeof taps[number])=>boolean=()=>true)=>taps.find(a=>a.page===page&&test(a))?.at;
export const controlsV8:Partial<Record<Page,ControlV8[]>>={
 home:[control('home-send',24,467.5,111.33,82,16,'accent',tapFor('home',a=>a.x===80)),control('home-receive',145.330078,467.5,111.33,82,16,'accent',tapFor('home',a=>a.x===201)),control('home-exchange',266.660156,467.5,111.33,82,16,'accent',tapFor('home',a=>a.x===322))],
 sent:[control('sent-home',24,727,354,52,15,'accent',tapFor('sent'))],
 'exchange-success':[control('view-receipt',24,788,354,46,14,'secondary',tapFor('exchange-success'))],
 receipt:[control('receipt-home',24,732,354,52,15,'accent',tapFor('receipt')),control('receipt-download',24,793,354,46,14,'secondary')],
 'transaction-current':[control('transaction-done',24,742,354,52,15,'accent',tapFor('transaction-current'))],
 profile:[control('profile-faceid',24,584,171,107,20,'row',tapFor('profile'))],
 faceid:[control('faceid-notnow',24,770,354,44,14,'secondary',tapFor('faceid'))],
 activity:[control('activity-row',24,463,354,66,17,'row',tapFor('activity',a=>a.y<700))],
 receive:[control('receive-back',24,64,42,42,21,'back',tapFor('receive'))],
 'card-details':[control('card-back',24,77,20,20,0,'back',tapFor('card-details'))],
};
const roundedPath=({x,y,w,h,r}:{x:number;y:number;w:number;h:number;r:number})=>`M${x+r} ${y}H${x+w-r}Q${x+w} ${y} ${x+w} ${y+r}V${y+h-r}Q${x+w} ${y+h} ${x+w-r} ${y+h}H${x+r}Q${x} ${y+h} ${x} ${y+h-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;
const bodyMask=(holes:{x:number;y:number;w:number;h:number;r:number}[])=>`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='402' height='874'><path fill='white' fill-rule='evenodd' d='M0 0H402V874H0Z ${holes.map(roundedPath).join(' ')}'/></svg>`)}")`;

const ReceiptV8=({t}:{t:number})=>{const p=receiptProgress(t);return <><Img src={staticFile('v8/receipt-base.svg')} style={{position:'absolute',inset:0,width:402,height:874}}/><div data-testid="receipt-paper-clip" style={{position:'absolute',left:36,top:160,width:330,height:551,overflow:'hidden'}}><div data-testid="receipt-paper-v8" data-progress={p} style={{position:'absolute',inset:0,overflow:'hidden',translate:`0 ${-(1-p)*523}px`}}><Img src={file('receipt.png')} style={{position:'absolute',width:402,height:874,left:-36,top:-160,maxWidth:'none'}}/></div></div></>;};

const CardV8=({t}:{t:number})=>{
 const state=cardStateV8(t),g=cardGeometry;const action=taps.find(a=>a.page==='card'&&a.y<700&&pressAt(t,a.at)>0),q=action?pressAt(t,action.at):0;
 // The card has one fixed silhouette. Normal and frozen materials occupy disjoint regions.
 return <div data-testid="card-state-v8" data-phase={state.phase} data-status={state.status} data-action={state.action} data-frost={state.amount} style={{position:'absolute',inset:0}}><FullV5 name="card-base.svg"/>
 <div data-testid="card-silhouette-v8" style={{position:'absolute',left:g.x,top:g.y,width:g.w,height:g.h,borderRadius:g.r,overflow:'hidden'}}>
 {state.amount<1&&<div data-testid="card-normal-material" style={{position:'absolute',inset:0,clipPath:`inset(0 0 0 ${state.amount*100}%)`}}><Img src={file('card.png')} style={{position:'absolute',width:402,height:874,left:-g.x,top:-g.y,maxWidth:'none'}}/></div>}
 {state.amount>0&&<div data-testid="card-frozen-material" style={{position:'absolute',inset:0,clipPath:`inset(0 ${(1-state.amount)*100}% 0 0)`}}><Img src={file('frost-original.png')} style={{position:'absolute',left:-100*g.w/1470,top:-94*g.h/766,width:1672*g.w/1470,height:941*g.h/766,maxWidth:'none'}}/></div>}
 </div>
 <div data-testid="card-glass-backdrop" style={{position:'absolute',left:10,top:337,width:382,height:169,borderRadius:27,backdropFilter:'blur(14px) saturate(112%)',WebkitBackdropFilter:'blur(14px) saturate(112%)',background:'rgba(35,34,55,.12)',border:'1px solid rgba(188,181,221,.12)',boxSizing:'border-box'}}/>
 <Img src={staticFile('v7/'+(state.frozen?'frozen':'active')+'-panel.svg')} style={{position:'absolute',left:10,top:337,width:382,height:169}}/>
 {[0,1,2].map(i=>{const pressed=action&&Math.abs(action.x-(80+i*121))<3?q:0;const key=i===0?'card-details':i===2?'card-settings':state.frozen?'card-unfreeze':'card-freeze';return <NativeControlV8 key={i} control={control(key,24+i*121,387,112,86,17,'accent')} q={pressed} scale={1-.02*pressed}/>;})}
 {state.note&&<Crop name="frozen.png" x={24} y={718} w={354} h={38}/>}
 </div>;
};

const PageContentV8=({page,t}:{page:Page;t:number})=>page==='recipient'?<Recipients t={t}/>:page==='send'?<FullV5 name="send-angelina.svg"/>:page==='exchange-success'?<Settlement t={t}/>:page==='receipt'?<ReceiptV8 t={t}/>:page==='card'?<CardV8 t={t}/>:page==='transaction-current'?<Transaction t={t}/>:<FullV5 name={page+'.png'}/>;
export const PageV8=({page,t}:{page:Page;t:number})=>{
 const controls=controlsV8[page]??[],slider=page==='send'||page==='exchange';const holes=[...controls,...(slider?[{x:24,y:page==='send'?780:790,w:354,h:54,r:17}]:[])];
 const receiptButtons=page==='receipt'?ramp(realTimeV7(t),receiptStart+.32,receiptStart+.78):1;
 return <div data-testid="page-v8" data-page={page} style={{position:'absolute',inset:0,background:'#090c16',overflow:'hidden'}}>
 {holes.length>0&&<Img src={staticFile(`v8/${page}-background.svg`)} style={{position:'absolute',inset:0,width:402,height:874}}/>}
 <div data-testid="page-content-v8" style={{position:'absolute',inset:0,maskImage:holes.length?bodyMask(holes):undefined}}><PageContentV8 page={page} t={t}/></div>
 {controls.map(c=><NativeControlV8 key={c.key} control={c} q={c.tapAt===undefined?0:pressAt(t,c.tapAt)} opacity={receiptButtons}/>)}
 {slider&&<Slider t={t} exchange={page==='exchange'}/>}
 </div>;
};

const NavigationV8=({from,to,p}:{from:number;to:number;p:number})=><div data-testid="navigation-v8" style={{position:'absolute',left:0,top:790,width:402,height:84,borderRadius:'28px 28px 0 0',background:'#171821',overflow:'hidden'}}>
 <div data-testid="navigation-selected-v8" style={{position:'absolute',left:15+93.4*(from+(to-from)*p),top:8,width:90,height:52,borderRadius:14,background:'linear-gradient(135deg,#a399ff,#5a4ac2)',border:'1px solid #bcb0ff66',boxSizing:'border-box'}}/>
 {assets.navigation.groups.map((group,i)=><svg key={i} width="402" height="84" viewBox="0 790 402 84" style={{position:'absolute',inset:0,color:i===to?'#f6f4ff':'#9291a8'}} dangerouslySetInnerHTML={{__html:group}}/>)}</div>;

const RoutedTransitionV8=({t}:{t:number})=>{
 const {route:r,previous:old,progress:p}=routeStateV8(t);if(p===1)return <PageV8 page={r.page} t={t}/>;
 if(r.kind==='push')return <><div data-testid="outgoing-page-v8" style={{position:'absolute',inset:0,clipPath:`inset(0 ${402*p}px 0 0)`}}><div style={{position:'absolute',inset:0,translate:`${-76*p}px 0`}}><PageV8 page={old} t={t}/></div></div><div data-testid="incoming-page-v8" style={{position:'absolute',inset:0,translate:`${402*(1-p)}px 0`}}><PageV8 page={r.page} t={t}/></div></>;
 if(r.kind==='pop')return <><div data-testid="incoming-page-v8" style={{position:'absolute',inset:0,clipPath:`inset(0 ${402*(1-p)}px 0 0)`}}><div style={{position:'absolute',inset:0,translate:`${-76*(1-p)}px 0`}}><PageV8 page={r.page} t={t}/></div></div><div data-testid="outgoing-page-v8" style={{position:'absolute',inset:0,translate:`${402*p}px 0`}}><PageV8 page={old} t={t}/></div></>;
 if(r.kind==='tab')return <><div style={{position:'absolute',inset:0,clipPath:'inset(0 0 84px 0)'}}><PageV8 page={r.page} t={t}/></div><NavigationV8 from={r.fromTab!} to={r.toTab!} p={p}/></>;
 // Results replace the previous page opaquely; there is never a readable UI crossfade.
 return <PageV8 page={r.page} t={t}/>;
};
export const RoutedPagesV8=({t}:{t:number})=>{const {route}=routeStateV8(t),page=route.page,source=page==='recipient'?'angelina.png':page==='send'?'send.png':page+'.png';return <><RoutedTransitionV8 t={t}/><Crop name={source} x={0} y={0} w={402} h={54}/><Crop name={source} x={0} y={852} w={402} h={22}/></>;};
