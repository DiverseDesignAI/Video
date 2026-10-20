const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),req=createRequire(path.join(root,'package.json'));
const result=req('esbuild').buildSync({entryPoints:[path.join(root,'src/motionV9.ts')],bundle:true,platform:'node',format:'cjs',write:false,external:['remotion']});
const mod={exports:{}};new Function('require','module','exports',result.outputFiles[0].text)(req,mod,mod.exports);const v=mod.exports;
const ranges=[[39.15,39.55],[51.65,52.05],[57.25,57.75],[25.65,26.05],[38.15,38.55],[53.25,53.65],[34.35,35.45],[43.4,44.2],[46.8,47.4]];
const frames=new Set();for(const [a,b] of ranges)for(let f=Math.floor(a*60);f<=Math.ceil(b*60);f++)frames.add(f);
for(const tap of v.taps){const f=Math.floor(v.realTimeV7(tap.at)*60);for(let i=f-1;i<=f+12;i++)frames.add(i);}
for(const c of v.captionData)frames.add(Math.round(v.realTimeV7((c.a+c.b)/2)*60));frames.add(3990);
const ordered=[...frames].sort((a,b)=>a-b);
const poses=Object.fromEntries(ordered.map(f=>{const t=v.timeV7(f/60),c=v.cameraV7(t),focus=v.receiptFocus(t);return [f,{cx:c.cx,cy:c.cy-6*focus,scale:c.scale+.045*focus,page:v.routeStateV8(t).route.page}];}));
const plan={frames:ordered,ranges,poses,renderer:'angle',expectedFrameCount:4080};
fs.writeFileSync(path.join(root,'v9-qa-plan.json'),JSON.stringify(plan,null,2));console.log(plan.frames.join(','));
