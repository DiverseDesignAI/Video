import React from 'react';
// Authored front-facing iPhone 16 Pro mockup. Screen aspect is exactly 402:874;
// body ratio follows Apple's 71.5 × 149.6 mm specifications (430 × 900 here).
export const IPhone16Pro=({children,cx=1830,cy=744,scale=1.24,opacity=1,angle=0}:{children:React.ReactNode;cx?:number;cy?:number;scale?:number;opacity?:number;angle?:number})=><div style={{position:'absolute',left:cx-215,top:cy-450,width:430,height:900,scale,opacity,transform:`perspective(2600px) rotateY(${angle}deg)`,transformOrigin:'50% 50%',boxShadow:'12px 26px 42px rgba(0,0,0,.28)',borderRadius:66}}>
 <div style={{position:'absolute',inset:0,borderRadius:66,background:'linear-gradient(110deg,#5d5e62 0%,#292a2d 2%,#101114 9%,#343539 48%,#121316 91%,#68696c 98%,#252629)',border:'1px solid #77787d',boxSizing:'border-box'}}/>
 <div style={{position:'absolute',inset:2,borderRadius:64,background:'linear-gradient(90deg,#2c2d30,#08090b 2%,#090a0c 98%,#393a3e)',border:'1px solid #111216'}}/>
 <div style={{position:'absolute',inset:6,borderRadius:60,border:'1px solid rgba(172,175,181,.22)',background:'#030405'}}/>
 {[[ -3,157,3,29],[-3,215,3,57],[-3,287,3,57],[430,230,3,88],[430,563,3,43]].map(([left,top,width,height],i)=><div key={i} style={{position:'absolute',left,top,width,height,borderRadius:3,background:'linear-gradient(90deg,#222327,#717277,#202125)',border:'1px solid #1b1c20',boxSizing:'border-box'}}/>)}
 <div style={{position:'absolute',left:14,top:13,width:402,height:874,borderRadius:53,overflow:'hidden',background:'#05070d'}}>{children}<div style={{position:'absolute',left:143,top:11,width:116,height:33,borderRadius:22,background:'#010203',boxShadow:'inset 0 0 0 1px #080a0e',pointerEvents:'none'}}><div style={{position:'absolute',right:13,top:12,width:8,height:8,borderRadius:8,background:'radial-gradient(circle at 38% 35%,#1a2536,#08101c 45%,#020407 80%)'}}/></div></div>
 <div style={{position:'absolute',inset:7,borderRadius:59,border:'1px solid rgba(210,213,222,.08)',background:'linear-gradient(115deg,rgba(230,235,255,.025),transparent 22%,transparent 90%,rgba(230,235,255,.02))',pointerEvents:'none'}}/>
</div>;
