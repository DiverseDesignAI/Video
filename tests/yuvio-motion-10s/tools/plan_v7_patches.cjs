// Frame windows for the final caption/state refinement; every other master frame is retained.
const fs=require('fs'),path=require('path'),{createRequire}=require('module');
const root=path.resolve(__dirname,'..'),req=createRequire(path.join(root,'package.json')),esbuild=req('esbuild'),cache={};
function load(name){if(cache[name])return cache[name];const m={exports:{}};new Function('require','module','exports',esbuild.transformSync(fs.readFileSync(path.join(root,'src',name+'.ts'),'utf8'),{loader:'ts',format:'cjs'}).code)(n=>n.startsWith('./motion')?load(n.slice(2)):req(n),m,m.exports);return cache[name]=m.exports;}
const v=load('motionV7');const windows=[...v.captionData.map(x=>x.a),82.25].map(a=>({from:Math.max(0,Math.floor(v.realTimeV7(a)*60)-1),to:Math.min(4079,Math.ceil(v.realTimeV7(a+.44)*60)+1)}));
const frames=windows.flatMap(w=>Array.from({length:w.to-w.from+1},(_,i)=>w.from+i));
fs.writeFileSync(path.join(root,'v7-refinement-windows.json'),JSON.stringify({baseSourceCommit:'f2473ec',windows,frameCount:frames.length,frames},null,2));console.log('Refinement frames:',frames.length);
