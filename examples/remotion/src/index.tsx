import React from 'react';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
const Demo = () => {const f=useCurrentFrame();return <AbsoluteFill style={{background:'#17132e',color:'white',justifyContent:'center',alignItems:'center',fontSize:90,fontFamily:'sans-serif'}}><div style={{opacity:interpolate(f,[0,20],[0,1],{extrapolateRight:'clamp'}),transform:`translateY(${interpolate(f,[0,20],[35,0],{extrapolateRight:'clamp'})}px)`}}>YUVIO</div></AbsoluteFill>};
registerRoot(()=> <Composition id="YuvioDemo" component={Demo} width={1280} height={720} fps={30} durationInFrames={90}/>);
