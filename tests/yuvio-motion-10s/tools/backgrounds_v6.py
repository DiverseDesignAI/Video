"""Generate SDR YUVIO fields at delivery resolution; no resampled tiled grain."""
from pathlib import Path
import numpy as np
from PIL import Image
pub=Path(__file__).resolve().parent.parent/'public/v6';pub.mkdir(exist_ok=True)
y,x=np.mgrid[0:1440,0:2560].astype(np.float64);x/=2560;y/=1440
noise=np.random.default_rng(602).uniform(-.7,.7,(1440,2560,1))
base=np.array([5.,7.,13.])[None,None,:]+y[...,None]*np.array([3.,3.,12.])[None,None,:]
for name,power,cx,cy in [('intro',.42,.50,.54),('normal',.75,.76,.57),('qr',.92,.74,.53),('cold',.72,.77,.50),('outro',.96,.53,.68)]:
 g=np.exp(-(((x-cx)/.43)**2+((y-cy)/.65)**2)*1.55)[...,None]
 low=np.exp(-(((x-.58)/.75)**2+((y-1.1)/.7)**2)*1.3)[...,None]
 tint=np.array([30.,24.,78.]) if name!='cold' else np.array([22.,25.,72.])
 rgb=base+g*tint*power+low*np.array([6.,4.,20.])
 Image.fromarray(np.clip(np.floor(rgb+noise+.5),0,255).astype('uint8')).save(pub/(name+'.png'),compress_level=6)
