import React from 'react';
import {taps,recipientDrags,ramp,dragEase,realTimeV7,pressAt} from './motionV7';

// Coordinates describe the visible tip, in the original 402 × 874 UI space.
export const cursorPose=(t:number)=>{
 const real=realTimeV7(t);
 const drags=[...recipientDrags.map(([a,b])=>({a,b,x:285,y:365,dx:-160})),{a:18.05,b:19.45,x:50,y:807,dx:300},{a:38,b:39.4,x:50,y:817,dx:300}];
 for(const d of drags){const a=realTimeV7(d.a),b=realTimeV7(d.b);if(real<a-.48||real>b+.16)continue;const approach=ramp(real,a-.48,a-.04),p=ramp(t,d.a,d.b,0,1,dragEase);return {x:d.x+32*(1-approach)+d.dx*p,y:d.y+36*(1-approach)-10*Math.sin(approach*Math.PI),opacity:ramp(real,a-.48,a-.32)*(1-ramp(real,b+.02,b+.16)),scale:1-.065*ramp(real,a-.04,a+.07)*(1-ramp(real,b,b+.12)),kind:'drag'};}
 for(const tap of taps){const at=realTimeV7(tap.at),age=real-at;if(age<-.5||age>.18)continue;const p=ramp(real,at-.5,at-.025);const targetX=tap.x+(tap.page==='card'&&tap.y<700?30:tap.w>=300?100:0),targetY=tap.y-(tap.page==='card'&&tap.y<700?10:0);return {x:targetX+34*(1-p),y:targetY+42*(1-p)-9*Math.sin(p*Math.PI),opacity:ramp(age,-.5,-.34)*(1-ramp(age,.1,.18)),scale:1-.065*pressAt(t,tap.at),kind:'tap'};}
 return null;
};
export const CursorV7=({t,cx,cy,scale}:{t:number;cx:number;cy:number;scale:number})=>{const p=cursorPose(t);if(!p)return null;const x=cx+(14+p.x-215)*scale,y=cy+(13+p.y-450)*scale;return <svg data-testid="yuvio-cursor" data-kind={p.kind} width="52" height="58" viewBox="0 0 52 58" style={{position:'absolute',left:x,top:y,overflow:'visible',opacity:p.opacity,scale:p.scale,transformOrigin:'0 0',pointerEvents:'none',filter:'drop-shadow(0 3px 3px rgba(7,5,22,.22))'}}><path d="M0 0 Q-.8-2 2.6-.3 L41.5 23.5 Q46 26.2 40.5 28.4 L24.8 33.8 L17.7 49 Q15.5 53.6 13.7 48.6 Z" fill="#C1B7FF" stroke="#9488F3" strokeWidth="1.1" strokeLinejoin="round"/></svg>;};
