import {Easing,interpolate} from 'remotion';
export const smooth=Easing.bezier(.42,0,.22,1),dragEase=Easing.bezier(.42,0,.58,1);
export const ramp=(t:number,a:number,b:number,x=0,y=1,e=smooth)=>interpolate(t,[a,b],[x,y],{easing:e,extrapolateLeft:'clamp',extrapolateRight:'clamp'});
export const window=(t:number,a:number,b:number,c:number,d:number,n=1)=>ramp(t,a,b,0,n)*(1-ramp(t,c,d));
export type Page='home'|'recipient'|'send'|'sent'|'receive'|'exchange'|'exchange-success'|'receipt'|'card'|'card-details'|'activity'|'transaction-current'|'profile'|'faceid';
export type Route={at:number;page:Page;kind:'push'|'pop'|'tab'|'result';fromTab?:number;toTab?:number};
export const routes:Route[]=[
 {at:0,page:'home',kind:'result'},
 {at:8.65,page:'recipient',kind:'push'}, {at:13.8,page:'send',kind:'push'},
 {at:19.85,page:'sent',kind:'result'}, {at:23.5,page:'home',kind:'pop'},
 {at:25.1,page:'receive',kind:'push'}, {at:31.4,page:'home',kind:'pop'},
 {at:32.8,page:'exchange',kind:'push'}, {at:39.7,page:'exchange-success',kind:'result'},
 {at:43.55,page:'receipt',kind:'push'}, {at:48.5,page:'home',kind:'pop'},
 {at:49.85,page:'card',kind:'tab',fromTab:0,toTab:1},
 {at:61.85,page:'card-details',kind:'push'}, {at:67.45,page:'card',kind:'pop'},
 {at:68.45,page:'activity',kind:'tab',fromTab:1,toTab:2},
 {at:70.5,page:'transaction-current',kind:'push'}, {at:74.6,page:'activity',kind:'pop'},
 {at:75.35,page:'profile',kind:'tab',fromTab:2,toTab:3},
 {at:78.1,page:'faceid',kind:'push'}, {at:81.4,page:'profile',kind:'pop'},
];
export type Tap={at:number;page:Page;x:number;y:number;w:number;h:number;radius?:number};
export const taps:Tap[]=[
 {at:8.45,page:'home',x:80,y:506,w:112,h:82},
 {at:13.65,page:'recipient',x:201,y:355,w:227,h:227,radius:100},
 {at:23.3,page:'sent',x:201,y:753,w:354,h:52},
 {at:24.9,page:'home',x:201,y:506,w:112,h:82},
 {at:31.2,page:'receive',x:34,y:85,w:42,h:42,radius:22},
 {at:32.6,page:'home',x:322,y:506,w:112,h:82},
 {at:43.35,page:'exchange-success',x:201,y:811,w:354,h:46},
 {at:48.3,page:'receipt',x:201,y:758,w:354,h:52},
 {at:49.65,page:'home',x:154,y:820,w:90,h:52},
 {at:56.25,page:'card',x:201,y:430,w:112,h:84},
 {at:59.75,page:'card',x:201,y:430,w:112,h:84},
 {at:61.65,page:'card',x:80,y:430,w:112,h:84},
 {at:67.25,page:'card-details',x:34,y:87,w:40,h:40,radius:20},
 {at:68.25,page:'card',x:247,y:820,w:90,h:52},
 {at:70.3,page:'activity',x:201,y:495,w:354,h:66},
 {at:74.4,page:'transaction-current',x:201,y:768,w:354,h:52},
 {at:75.15,page:'activity',x:340,y:820,w:90,h:52},
 {at:77.9,page:'profile',x:109,y:637,w:171,h:107},
 {at:81.2,page:'faceid',x:201,y:792,w:354,h:44},
];
export const recipientDrags=[[10.05,10.65],[11,11.6],[11.95,12.55],[12.9,13.5]];
export const recipientProgress=(t:number)=>recipientDrags.reduce((p,[a,b])=>p+ramp(t,a,b,0,1,dragEase),0);
export const frostProgress=(t:number)=>ramp(t,56.45,57.4,0,1,dragEase)*(1-ramp(t,59.95,60.9,0,1,dragEase));
export const frozenState=(t:number)=>t>=56.45&&t<60.9;
export const captionData=[
 {a:4,b:8.95,title:['One wallet.','Every currency.'],sub:'Keep USD, RUB, and USDT in one clear view.'},
 {a:9,b:14.05,title:['Send to','the right person.'],sub:'Find a contact and start a transfer in seconds.'},
 {a:14.1,b:19.95,title:['Know the cost','before you send.'],sub:'See the rate, fees, and total upfront.'},
 {a:20,b:24.35,title:['Your transfer','is on its way.'],sub:'Track the payment while the recipient bank processes it.'},
 {a:24.4,b:32.35,title:['Receive money,','effortlessly.'],sub:'Share your account QR code in a moment.'},
 {a:32.4,b:39.95,title:['Exchange without','the guesswork.'],sub:'Convert between accounts with transparent rates.'},
 {a:40,b:44.05,title:['Converted.','Ready to use.'],sub:'Your exchanged funds are available in RUB.'},
 {a:44.1,b:49.5,title:['Every detail,','on record.'],sub:'Review and save your exchange receipt.'},
 {a:49.55,b:56.35,title:['Your card.','Your control.'],sub:'Manage spending and card security in one place.'},
 {a:56.4,b:59.85,title:['One tap.','Spending paused.'],sub:'Freeze your card and unfreeze it when needed.'},
 {a:59.9,b:62.1,title:['Your card.','Your control.'],sub:'Manage spending and card security in one place.'},
 {a:62.15,b:68.05,title:['Your details','stay protected.'],sub:'Verify your identity before revealing card information.'},
 {a:68.1,b:70.65,title:['Every transaction,','in view.'],sub:'Find payments, transfers, and exchanges in one place.'},
 {a:70.7,b:75.0,title:['Every payment.','Every detail.'],sub:'Review payment information, transaction status, and card details in one place.'},
 {a:75.05,b:78.25,title:['Your account,','your way.'],sub:'Manage your personal details and security settings.'},
 {a:78.3,b:82.25,title:['Security','at a glance.'],sub:'Set up Face ID for faster, protected access.'},
];
export const cameraV5=(t:number)=>{
 const qr=window(t,26.0,27.1,29.1,30.25),sendAmount=window(t,14.65,15.6,16.0,16.8),sendFees=window(t,16.8,17.65,17.85,18.4),exchange=window(t,33.4,34.4,35.25,36.15),preview=window(t,36.2,37.15,37.35,37.85),receipt=window(t,44.6,45.55,47.1,47.8),card=window(t,51,52.0,53.35,54.4),details=window(t,63,64.0,65.75,66.65),txHero=window(t,70.8,71.6,71.75,72.3),txRef=window(t,72.5,73.25,73.6,74.1),profile=window(t,75.7,76.55,76.75,77.5),face=window(t,78.55,79.4,79.7,80.5);
 return {scale:1.24+.14*qr+.07*sendAmount+.05*sendFees+.08*exchange+.06*preview+.09*receipt+.07*card+.07*details+.06*txHero+.04*txRef+.07*profile+.08*face,cx:1830+8*qr-8*receipt,cy:744+12*sendAmount-14*sendFees+5*qr+10*exchange-15*preview+7*card-12*details+6*txHero-18*txRef+12*profile+9*face};
};
