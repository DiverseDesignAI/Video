const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');const root=path.resolve(__dirname,'..'),req=createRequire(path.join(root,'package.json'));
const out=req('esbuild').buildSync({entryPoints:[path.join(root,'src/motionV8.ts')],bundle:true,platform:'node',format:'cjs',write:false,external:['remotion']});const mod={exports:{}};new Function('require','module','exports',out.outputFiles[0].text)(req,mod,mod.exports);const v=mod.exports;
const frames=new Set();for(const [a,b] of [[17.25,17.75],[39.2,39.4],[43.4,44.2],[46.8,47.4],[v.receiptRouteStart-.1,v.receiptStart+1.05]])for(let f=Math.floor(a*60);f<=Math.ceil(b*60);f++)frames.add(f);
for(const tap of v.taps){const start=Math.floor(v.realTimeV7(tap.at)*60);for(let f=start-1;f<=start+11;f++)frames.add(f);}
for(const c of v.captionData)frames.add(Math.round(v.realTimeV7((c.a+c.b)/2)*60));frames.add(3990);
const plan={frames:[...frames].sort((a,b)=>a-b),criticalSeconds:[17.45,39.25,43.65,43.82,44,46.9,47.05,47.2],renderer:'angle',expectedFrameCount:4080};fs.writeFileSync(path.join(root,'v8-qa-plan.json'),JSON.stringify(plan,null,2));console.log(plan.frames.join(','));
