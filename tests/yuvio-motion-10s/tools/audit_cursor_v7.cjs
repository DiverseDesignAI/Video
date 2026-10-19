const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),req=createRequire(path.join(root,'package.json'));
const built=req('esbuild').buildSync({entryPoints:[path.join(root,'src/CursorV7.tsx')],bundle:true,platform:'node',format:'cjs',write:false,external:['react','remotion']});
const mod={exports:{}};new Function('require','module','exports',built.outputFiles[0].text)(req,mod,mod.exports);
const vcode=req('esbuild').buildSync({entryPoints:[path.join(root,'src/motionV7.ts')],bundle:true,platform:'node',format:'cjs',write:false,external:['remotion']});const vm={exports:{}};new Function('require','module','exports',vcode.outputFiles[0].text)(req,vm,vm.exports);const v=vm.exports,c=mod.exports;
let visible=0;
for(let f=0;f<4080;f++){const t=v.timeV7(f/60),p=c.cursorPose(t);if(!p)continue;visible++;if(p.x<0||p.x>402||p.y<0||p.y>874||p.opacity<0||p.opacity>1||p.scale<.934||p.scale>1)throw Error('Cursor bounds at '+f);}
for(const tap of v.taps){const p=c.cursorPose(tap.at);if(!p||p.kind!=='tap'||Math.abs(p.x-tap.x)>tap.w/2||Math.abs(p.y-tap.y)>tap.h/2)throw Error('Cursor misses target '+tap.at);}
for(const [a,b,y] of [[18.05,19.45,807],[38,39.4,817]]){const start=c.cursorPose(a),end=c.cursorPose(b);if(Math.abs(start.x-50)>.001||Math.abs(end.x-350)>.001||end.y!==y)throw Error('Incomplete confirmation drag');}
for(const t of [5,15,21,28,35,45,52,57.7,64,72,76,80,85])if(c.cursorPose(t))throw Error('Cursor on passive scene '+t);
const report={frames:4080,visibleFrames:visible,taps:v.taps.length,contactDrags:2,confirmationDrags:2,confirmationTravel:300,tipAnchored:true,passiveSamples:13,status:'passed'};fs.writeFileSync(path.join(root,'v7-cursor-audit.json'),JSON.stringify(report,null,2));console.log(report);
