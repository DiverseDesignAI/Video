import {Easing} from 'remotion';
import {realTimeV7,ramp,taps,routes} from './motionV7';
export * from './motionV7';

export const cardGeometry={x:39,y:198,w:324,h:169,r:18};
const freezeTap=taps.find(a=>a.page==='card'&&a.at<58)!;
const unfreezeTap=taps.find(a=>a.page==='card'&&a.at>58&&a.at<61)!;
export const cardTimes={freeze:realTimeV7(freezeTap.at)+.18,unfreeze:realTimeV7(unfreezeTap.at)+.18,duration:.28};
export type CardPhase='active'|'freezing'|'frozen'|'unfreezing';
export const cardStateV8=(t:number)=>{
 const real=realTimeV7(t),{freeze,unfreeze,duration}=cardTimes;
 const phase:CardPhase=real<freeze?'active':real<freeze+duration?'freezing':real<unfreeze?'frozen':real<unfreeze+duration?'unfreezing':'active';
 const amount=phase==='freezing'?ramp(real,freeze,freeze+duration):phase==='unfreezing'?1-ramp(real,unfreeze,unfreeze+duration):phase==='frozen'?1:0;
 // One material boundary owns the status, action and informational note.
 const frozen=phase==='frozen'||phase==='unfreezing';
 return {phase,amount,frozen,status:frozen?'Frozen':'Active',action:frozen?'Unfreeze':'Freeze',note:frozen};
};
export const receiptRouteStart=realTimeV7(routes.find(r=>r.page==='receipt')!.at);
export const receiptStart=receiptRouteStart+.24;
export const receiptDuration=.78;
const revealEase=Easing.bezier(.22,.08,.18,1);
export const receiptProgress=(t:number)=>ramp(realTimeV7(t),receiptStart,receiptStart+receiptDuration,0,1,revealEase);
export const receiptFocus=(t:number)=>{const real=realTimeV7(t);return ramp(real,receiptStart+.9,receiptStart+1.35)*(1-ramp(real,receiptStart+2.0,receiptStart+2.55));};

export const routeStateV8=(t:number)=>{
 let index=0;for(let i=1;i<routes.length;i++)if(t>=routes[i].at)index=i;
 const route=routes[index],previous=routes[Math.max(0,index-1)].page;
 const progress=index===0?1:ramp(t,route.at,route.at+(route.kind==='tab'?.32:.48));
 return {route,previous,progress,index};
};
