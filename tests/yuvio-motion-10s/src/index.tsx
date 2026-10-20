import React from 'react';
import {Composition,registerRoot,staticFile,delayRender,continueRender,cancelRender} from 'remotion';
import {YuvioV8} from './YuvioV8';
if(typeof document!=='undefined'){
 const handle=delayRender('Load approved Onest typeface');
 new FontFace('Onest',`url(${staticFile('Onest.ttf')})`,{weight:'100 900'}).load().then(font=>{document.fonts.add(font);continueRender(handle)}).catch(cancelRender);
}
registerRoot(()=><Composition id="YuvioMotionTest" component={YuvioV8} width={2560} height={1440} fps={60} durationInFrames={4080}/>);
