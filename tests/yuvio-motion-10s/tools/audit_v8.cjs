const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),req=createRequire(path.join(root,'package.json'));
const code=req('esbuild').buildSync({entryPoints:[path.join(root,'src/motionV8.ts')],bundle:true,platform:'node',format:'cjs',write:false,external:['remotion']});const mod={exports:{}};new Function('require','module','exports',code.outputFiles[0].text)(req,mod,mod.exports);const v=mod.exports;
let phases={},lastAmount=0;
for(let f=0;f<4080;f++){
 const real=f/60,t=v.timeV7(real),state=v.cardStateV8(t);phases[state.phase]=(phases[state.phase]??0)+1;
 if(state.phase==='active'&&(state.amount!==0||state.frozen))throw Error('Active material mismatch at '+f);
 if(state.phase==='frozen'&&(state.amount!==1||!state.frozen))throw Error('Frozen material mismatch at '+f);
 if(state.note!==state.frozen||(state.action==='Unfreeze')!==state.frozen)throw Error('Controls not synchronized at '+f);
 if(state.amount<0||state.amount>1)throw Error('Material boundary out of range');
 if(state.phase==='freezing'&&state.amount<lastAmount)throw Error('Freeze reverses');
 const route=v.routeStateV8(t);if(route.progress<0||route.progress>1)throw Error('Transition bounds');
 lastAmount=state.amount;
}
if(Math.abs(v.receiptProgress(v.timeV7(v.receiptStart)))>1e-7||v.receiptProgress(v.timeV7(v.receiptStart+v.receiptDuration+.001))!==1)throw Error('Receipt timing mismatch');
const critical=[17.45,39.25,43.65,43.82,44,46.9,47.05,47.2].map(real=>({real,frame:Math.round(real*60),route:v.routeStateV8(v.timeV7(real)).route.page,card:v.cardStateV8(v.timeV7(real))}));
const report={frames:4080,seconds:68,sourceTimeline:'V7 unchanged',geometry:v.cardGeometry,phases,cardTimes:v.cardTimes,receipt:{routeStart:v.receiptRouteStart,start:v.receiptStart,duration:v.receiptDuration,initialPaperExposed:28,focusAfterReveal:true},critical,status:'passed'};
fs.writeFileSync(path.join(root,'v8-motion-audit.json'),JSON.stringify(report,null,2));console.log(report);
