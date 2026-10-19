const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'..'),req=createRequire(path.join(root,'package.json')),esbuild=req('esbuild');
const cache={};function load(name){if(cache[name])return cache[name];const js=esbuild.transformSync(fs.readFileSync(path.join(root,'src',name+'.ts'),'utf8'),{loader:'ts',format:'cjs'}).code;const m={exports:{}};new Function('require','module','exports',js)(n=>n.startsWith('./motion')?load(n.slice(2)):req(n),m,m.exports);return cache[name]=m.exports;}
const v=load('motionV7');let last=-1,bounds={top:Infinity,bottom:0,left:Infinity,right:0},maxScaleStep=0,lastScale=1.13;
for(let f=0;f<4080;f++){
 const real=f/60,t=v.timeV7(real),cam=v.cameraV7(t),intro=v.ramp(real,4.35,5.3),end=v.ramp(t,82,84);
 if(t<last)throw Error('Clock reverses at '+f);last=t;
 const cx=(cam.cx+100*(1-intro))*(1-end)+1280*end,cy=cam.cy*(1-end)+755*end,s=(1.13+(cam.scale-1.13)*intro)*(1-end)+end;
 maxScaleStep=Math.max(maxScaleStep,Math.abs(s-lastScale));lastScale=s;
 if(intro>.99){const b={top:cy-450*s,bottom:cy+450*s,left:cx-219*s,right:cx+219*s};if(b.top<65||b.bottom>1375||b.left<65||b.right>2495)throw Error('Device safe area at '+real);bounds.top=Math.min(bounds.top,b.top);bounds.bottom=Math.max(bounds.bottom,b.bottom);bounds.left=Math.min(bounds.left,b.left);bounds.right=Math.max(bounds.right,b.right);}
 if(v.frostProgress(t)>1e-8&&!v.frozenState(t))throw Error('Frost state contradicts controls');
}
for(const tap of v.taps){const at=v.realTimeV7(tap.at);if(v.pressAt(v.timeV7(at+.08),tap.at)<.99)throw Error('Missing press peak');if(v.pressAt(v.timeV7(at+.17),tap.at)!==0)throw Error('Stuck pressed');}
if(v.recipientDrags.length!==2||v.recipientProgress(13.5)!==2||v.recipientSlides[2].img!=='angelina')throw Error('Recipient selection mismatch');
for(const c of v.captionData){if(c.title.length>3||c.sub.length>2)throw Error('Too many lines');for(const line of c.title)if(/\b(and|or|the|to|a|at|in|of|with)$/i.test(line))throw Error('Dangling connective: '+line);}
const timeline=v.captionData.map(c=>({start:v.realTimeV7(c.a),end:v.realTimeV7(c.b),frame:Math.round(v.realTimeV7((c.a+c.b)/2)*60),title:c.title,description:c.sub}));
fs.writeFileSync(path.join(root,'v7-timeline.json'),JSON.stringify(timeline,null,2));
fs.writeFileSync(path.join(root,'v7-cues.json'),JSON.stringify({taps:v.taps.map(a=>({...a,real:v.realTimeV7(a.at)})),routes:v.routes.map(r=>({...r,real:v.realTimeV7(r.at)})),swipes:v.recipientDrags.map(([a,b])=>[v.realTimeV7(a),v.realTimeV7(b)])},null,2));
const report={frames:4080,seconds:68,introHold:[2.2,4.2],homeReady:5.3,pressSeconds:v.PRESS_SECONDS,contactSwitches:2,selectedRecipient:'Angelina Firsova',transactionFrame:'212:840',bounds,maxScaleStep,checks:'passed'};
fs.writeFileSync(path.join(root,'v7-motion-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));console.log('Caption QA frames:',timeline.map(x=>x.frame).join(','));
