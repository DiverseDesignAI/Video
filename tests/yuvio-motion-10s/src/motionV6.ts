import {window} from './motionV5';
// C1 monotone Hermite time map: edit out long holds without time discontinuities.
const old=[0,4,9,14,20,24,32,40,44,49,56,62,68,75,82,88];
const now=[0,3.5,6.7,10.9,15.9,18.9,24.9,30.9,33.9,37.9,42.4,47.4,51.9,57.9,63.9,68];
const slopes=old.slice(1).map((x,i)=>(x-old[i])/(now[i+1]-now[i]));
const m=old.map((_,i)=>i===0?slopes[0]:i===old.length-1?slopes[slopes.length-1]:2/(1/slopes[i-1]+1/slopes[i]));
export const timeV6=(t:number)=>{if(t<=0)return 0;if(t>=68)return 88;let i=0;while(t>now[i+1])i++;const h=now[i+1]-now[i],u=(t-now[i])/h;return (2*u**3-3*u**2+1)*old[i]+(u**3-2*u**2+u)*h*m[i]+(-2*u**3+3*u**2)*old[i+1]+(u**3-u**2)*h*m[i+1];};
export const realTimeV6=(t:number)=>{let a=0,b=68;for(let i=0;i<50;i++){let mid=(a+b)/2;if(timeV6(mid)<t)a=mid;else b=mid;}return(a+b)/2;};
export const cameraV6=(t:number)=>{
 // QR receives the single clearest zoom. Most other chapters use quiet holds or lateral drift.
 const qr=window(t,26,27.3,29.0,30.4),send=window(t,14.6,15.8,17.1,17.9),receipt=window(t,44.5,45.7,46.8,48),drift=window(t,32.9,34.2,37.5,38.3),detail=window(t,63,64.3,65.4,66.7),tx=window(t,71,72.2,73.3,74.1);
 return {scale:1.24+.085*qr+.025*send+.03*receipt,cx:1830-18*drift+12*detail-10*receipt,cy:744-8*detail-10*tx+4*qr};
};
