import React,{useId} from 'react';
import raw from './v8-assets.json';
type Stop={at:number;color:string;alpha:number};
type VectorAsset={svg:string;stops:Stop[];coords:number[];box:number[]};
const assets=raw as unknown as Record<string,VectorAsset>;
const rgb=(hex:string)=>hex.replace('#','').match(/.{2}/g)!.map(x=>parseInt(x,16));
const mixColor=(a:string,b:string,q:number)=>'#'+rgb(a).map((x,i)=>Math.round(x+(rgb(b)[i]-x)*q).toString(16).padStart(2,'0')).join('');
const sample=(stops:Stop[],at:number)=>{const right=stops.findIndex(s=>s.at>=at),i=Math.max(0,right<0?stops.length-1:right),a=stops[Math.max(0,i-1)],b=stops[i],p=b.at===a.at?1:Math.max(0,Math.min(1,(at-a.at)/(b.at-a.at)));return {color:mixColor(a.color,b.color,p),alpha:a.alpha+(b.alpha-a.alpha)*p};};
export type ControlV8={key:string;x:number;y:number;w:number;h:number;r:number;kind:'accent'|'secondary'|'row'|'back';tapAt?:number};
export const NativeControlV8=({control,q=0,opacity=1,scale=1}:{control:ControlV8;q?:number;opacity?:number;scale?:number})=>{
 const prefix='v8'+useId().replace(/[^a-z0-9]/gi,''),asset=assets[control.key];let svg=asset.svg;
 if(asset.stops.length){const [x,y,w,h]=asset.box,accent=control.kind==='accent',stops=[0,.42,.82,1],target=accent?['#AE9FFF','#806FE9','#6150CE','#45369A']:['#383349','#2d2c40','#212439','#1b2033'];const uniform=w/354;const targetCoords=accent?[x-44.7665*uniform,y+h/2+(20.9922-26)*uniform,x+32.1135*uniform,y+h/2+(184.941-26)*uniform]:asset.coords;
  const coords=asset.coords.map((n,i)=>n+(targetCoords[i]-n)*q);
  const gradient=`<linearGradient id="__surface__" gradientUnits="userSpaceOnUse" x1="${coords[0]}" y1="${coords[1]}" x2="${coords[2]}" y2="${coords[3]}">${stops.map((at,i)=>{const original=sample(asset.stops,at);return `<stop offset="${at}" stop-color="${mixColor(original.color,target[i],q)}" stop-opacity="${original.alpha+((accent?1:.44)-original.alpha)*q}"/>`;}).join('')}</linearGradient>`;
  svg=svg.replace('</svg>','<defs>'+gradient+'</defs></svg>');
 }else if(q>0){svg=svg.replace(/stroke="#[0-9a-f]{6}"/gi,`stroke="${mixColor('#F6F4FF','#C1B7FF',q)}"`);}
 svg=svg.replace(/id="([^"]+)"/g,(_,id)=>`id="${prefix}-${id}"`).replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#${prefix}-${id})`);
 return <div data-testid="native-control-v8" data-control={control.key} data-pressed={q>0} style={{position:'absolute',left:control.x,top:control.y,width:control.w,height:control.h,borderRadius:control.r,opacity,scale,pointerEvents:'none',backdropFilter:control.kind==='row'||control.kind==='secondary'?'blur(10px)':undefined}} dangerouslySetInnerHTML={{__html:svg}}/>;
};
