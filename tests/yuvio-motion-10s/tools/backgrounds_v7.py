"""Preserve approved V6 colour fields in 16-bit PNG sources (SDR, not HDR)."""
from pathlib import Path
import numpy as np
import struct,zlib
OUT=Path(__file__).resolve().parents[1]/'public/v7'
OUT.mkdir(exist_ok=True)
def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
def png16(path,rgb):
 h,w,_=rgb.shape
 scan=b''.join(b'\0'+row.tobytes() for row in rgb.astype('>u2'))
 path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,16,2,0,0,0))+chunk(b'sRGB',b'\0')+chunk(b'IDAT',zlib.compress(scan,6))+chunk(b'IEND',b''))
y,x=np.mgrid[0:1440,0:2560].astype(np.float64);x/=2560;y/=1440
# Static, identical mono dither in each field; no visible animated grain.
noise=np.random.default_rng(602).uniform(-.5,.5,(1440,2560,1))
base=np.array([5.,7.,13.])[None,None,:]+y[...,None]*np.array([3.,3.,12.])[None,None,:]
for name,power,cx,cy in [('intro',.42,.50,.54),('normal',.75,.76,.57),('qr',.92,.74,.53),('cold',.72,.77,.50),('outro',.96,.53,.68)]:
 g=np.exp(-(((x-cx)/.43)**2+((y-cy)/.65)**2)*1.55)[...,None]
 low=np.exp(-(((x-.58)/.75)**2+((y-1.1)/.7)**2)*1.3)[...,None]
 tint=np.array([30.,24.,78.]) if name!='cold' else np.array([22.,25.,72.])
 rgb=base+g*tint*power+low*np.array([6.,4.,20.])+noise
 png16(OUT/(name+'.png'),np.clip(np.round(rgb/255*65535),0,65535).astype('uint16'))
 print(name,(OUT/(name+'.png')).stat().st_size,flush=True)
