const fs=require('node:fs');const path=require('node:path');const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'..');const req=createRequire(path.join(root,'package.json'));const esbuild=req('esbuild');
const src=fs.readFileSync(path.join(root,'src/motionV5.ts'),'utf8');const js=esbuild.transformSync(src,{loader:'ts',format:'cjs'}).code;const m={exports:{}};new Function('require','module','exports',js)(req,m,m.exports);const motion=m.exports;
let bounds={minLeft:Infinity,minTop:Infinity,maxRight:0,maxBottom:0},maxFrameScaleDelta=0,previousScale=null;
for(let frame=0;frame<5280;frame++){
 const t=frame/60,c=motion.cameraV5(t),intro=motion.ramp(t,2.6,4.05),end=motion.ramp(t,82,84);
 const cx=(c.cx+125*(1-intro))*(1-end)+1280*end,cy=c.cy*(1-end)+755*end,scale=(1.13+(c.scale-1.13)*intro)*(1-end)+end;
 if(intro>.99){const left=cx-219*scale,right=cx+219*scale,top=cy-450*scale,bottom=cy+450*scale;if(left<65||right>2495||top<65||bottom>1375)throw Error('Phone escapes safe bounds at '+t);bounds.minLeft=Math.min(bounds.minLeft,left);bounds.maxRight=Math.max(bounds.maxRight,right);bounds.minTop=Math.min(bounds.minTop,top);bounds.maxBottom=Math.max(bounds.maxBottom,bottom);}
 if(previousScale!==null)maxFrameScaleDelta=Math.max(maxFrameScaleDelta,Math.abs(scale-previousScale));previousScale=scale;
 const f=motion.frostProgress(t);if(f>1e-8&&!motion.frozenState(t))throw Error('Frost/control mismatch at '+t);
 if(f<-.0001||f>1.0001)throw Error('Frost overshoot');
}
const activeSources=['index.tsx','YuvioV5.tsx','ScreensV5.tsx','motionV5.ts','IPhone16Pro.tsx'].map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
if(/164:607|transaction\.png|Cursor|<path d="M2 2 3 27/.test(activeSources))throw Error('Outdated artwork or mouse pointer in active import graph');
const done=motion.taps.find(a=>a.page==='transaction-current');if(done.y!==768||done.at!==74.4)throw Error('Transaction must return through Done');
if(!motion.routes.some(a=>a.at===74.6&&a.page==='activity'&&a.kind==='pop'))throw Error('Wrong transaction return destination');
const report={frames:5280,phoneBounds:bounds,maxFrameScaleDelta,transactionFrame:'212:840',transactionReturn:'Done → Activity',cursor:'absent',frostStateFrames:'all 5280 checked'};
fs.writeFileSync(path.join(root,'v5-motion-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
