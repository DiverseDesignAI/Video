import {ramp,window,dragEase,routes,taps as tapsV5,frozenState as frozenV5} from './motionV5';
export {ramp,window,dragEase,routes,frostProgress,frozenState} from './motionV5';
export type {Page,Route,Tap} from './motionV5';
export const DURATION_V7=68;
export const oldClock=[0,4,9,14,20,24,32,40,44,49,56,62,68,75,82,88];
export const realClock=[0,5.3,8.45,12.65,17.65,20.4,26.1,32.1,34.8,38.6,43.5,48,51.4,57.1,63.7,68];
const slopes=oldClock.slice(1).map((x,i)=>(x-oldClock[i])/(realClock[i+1]-realClock[i]));
const m=oldClock.map((_,i)=>i===0?slopes[0]:i===oldClock.length-1?slopes[slopes.length-1]:2/(1/slopes[i-1]+1/slopes[i]));
export const timeV7=(t:number)=>{if(t<=0)return 0;if(t>=DURATION_V7)return 88;let i=0;while(t>realClock[i+1])i++;const h=realClock[i+1]-realClock[i],u=(t-realClock[i])/h;return (2*u**3-3*u**2+1)*oldClock[i]+(u**3-2*u**2+u)*h*m[i]+(-2*u**3+3*u**2)*oldClock[i+1]+(u**3-u**2)*h*m[i+1];};
export const realTimeV7=(t:number)=>{let a=0,b=DURATION_V7;for(let i=0;i<50;i++){const mid=(a+b)/2;if(timeV7(mid)<t)a=mid;else b=mid;}return(a+b)/2;};
// Reactions have an actual 160 ms duration, independent of the editorial clock.
export const PRESS_SECONDS=.16;
export const taps=tapsV5.map(tap=>{const destination=routes.find(r=>r.at>tap.at&&r.at-tap.at<.3);const at=destination?timeV7(realTimeV7(destination.at)-.18):tap.at;return {...tap,at};});
export const pressAt=(t:number,at:number)=>{const age=realTimeV7(t)-realTimeV7(at);return age>=0&&age<PRESS_SECONDS?Math.sin(age/PRESS_SECONDS*Math.PI):0;};
export const cardPressAt=(t:number,at:number)=>frozenV5(t)===frozenV5(at)?pressAt(t,at):0;
export const recipientSlides=[{img:'dmitriy',name:'Dmitriy Pestov'},{img:'nikita',name:'Nikita Zhuravlev'},{img:'angelina',name:'Angelina Firsova'}];
export const recipientDrags=[[10.0,10.8],[12.05,12.85]];
export const recipientProgress=(t:number)=>recipientDrags.reduce((p,[a,b])=>p+ramp(t,a,b,0,1,dragEase),0);
export const cameraV7=(t:number)=>{
 const important=window(t,14.1,15.1,23.3,24.3),card=window(t,49.8,51,61.1,62),qr=window(t,25.9,27,29.3,30.6);
 const lateral=window(t,33,34.2,37.4,38.4),detail=window(t,63,64,65.8,66.8),tx=window(t,71.1,72,73.4,74.2);
 return {scale:1.25+.14*Math.max(important,card)+.09*qr,cx:1840-16*lateral+10*detail,cy:730-6*tx};
};
export const captionData=[
 {a:4,b:8.95,title:['Three currencies.','One wallet.'],sub:['Manage USD, RUB and USDT in one place.']},
 {a:9,b:14.05,title:['Choose','the right person.'],sub:['Find a contact and start your transfer.']},
 {a:14.1,b:19.95,title:['Know the cost','before you send.'],sub:['See the exchange rate, fees','and total upfront.']},
 {a:20,b:24.35,title:['Your transfer','is on its way.'],sub:['Track the payment while','the recipient bank processes it.']},
 {a:24.4,b:32.35,title:['Receive','with QR.'],sub:['Share your code to receive money.']},
 {a:32.4,b:39.95,title:['Exchange','with clarity.'],sub:['See the rate and fees before confirming.']},
 {a:40,b:44.05,title:['Converted.','Ready to use.'],sub:['Your exchanged funds are available in RUB.']},
 {a:44.1,b:49.5,title:['Every detail,','on record.'],sub:['Review and save your exchange receipt.']},
 {a:49.55,b:56.35,title:['Your card.','Your control.'],sub:['Manage your virtual card and spending.']},
 {a:56.4,b:59.85,title:['Freeze your card.','Keep control.'],sub:['Pause card payments','and unfreeze when needed.']},
 {a:59.9,b:62.1,title:['Your card.','Your control.'],sub:['Manage your virtual card and spending.']},
 {a:62.15,b:68.05,title:['Card details,','protected.'],sub:['Verify your identity before revealing','sensitive information.']},
 {a:68.1,b:70.65,title:['Every transaction,','in view.'],sub:['Explore payments, transfers and exchanges.']},
 {a:70.7,b:75,title:['Every payment.','Every detail.'],sub:['Review the amount, status','and payment information.']},
 {a:75.05,b:78.25,title:['Your account.','Your settings.'],sub:['Manage personal details and security.']},
 {a:78.3,b:82.25,title:['Security','at a glance.'],sub:['Set up Face ID for faster, protected access.']},
];
