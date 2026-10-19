"""Original YUVIO V7 score and UI sounds. No third-party recordings or samples."""
from pathlib import Path
import json,wave
import numpy as np
from scipy import signal
import pyloudnorm as pyln
from scipy.interpolate import PchipInterpolator
ROOT=Path(__file__).resolve().parent.parent
SR=48000;DURATION=68;N=SR*DURATION
old=np.array([0,4,9,14,20,24,32,40,44,49,56,62,68,75,82,88],float)
now=np.array([0,5.3,8.45,12.65,17.65,20.4,26.1,32.1,34.8,38.6,43.5,48,51.4,57.1,63.7,68],float)
slopes=np.diff(old)/np.diff(now);m=np.r_[slopes[0],2/(1/slopes[:-1]+1/slopes[1:]),slopes[-1]]
from scipy.interpolate import CubicHermiteSpline
virtual=CubicHermiteSpline(now,old,m)
from scipy.optimize import brentq
def real(t):return 0.0 if t<=0 else 68.0 if t>=88 else brentq(lambda x:float(virtual(x))-t,0,68)
rng=np.random.default_rng(20261019)
music=np.zeros((N,2),np.float32);sfx=np.zeros_like(music)
def add(dst,at,s,gain=1,pan=0):
 i=int(at*SR)
 if i<0:return
 s=np.asarray(s,dtype=np.float32);n=min(len(s),N-i)
 if n<=0:return
 if s.ndim==1:s=np.column_stack((s*np.sqrt((1-pan)/2),s*np.sqrt((1+pan)/2)))
 dst[i:i+n]+=s[:n]*gain

def note(freq,dur=.22,attack=.008,decay=8,bright=.1):
 t=np.arange(int(dur*SR))/SR
 env=np.minimum(t/attack,1)*np.exp(-t*decay)*np.minimum((dur-t)/.03,1)
 return (np.sin(2*np.pi*freq*t)+bright*np.sin(4*np.pi*freq*t))*env
beat=60/108
# Em9 / Cmaj9 / Gmaj9 / D6. Crossfading voicings, no large drops.
chords=[[40,55,59,62,66],[36,55,59,62,64],[43,54,57,59,62],[38,54,57,59,64]]
for j,at in enumerate(np.arange(0,68,8*beat)):
 notes=chords[j%4];dur=8*beat+.9;t=np.arange(int(dur*SR))/SR
 env=np.minimum(t/.8,1)*np.minimum((dur-t)/.9,1)
 for k,midi in enumerate(notes):
  f=440*2**((midi-69)/12);s=np.column_stack((np.sin(2*np.pi*f*.99965*t),np.sin(2*np.pi*f*1.00035*t)))
  s+=.14*np.column_stack((np.sin(4*np.pi*f*t+.1),np.sin(4*np.pi*f*t-.1)))
  add(music,at,s*env[:,None],.019 if k else .025)
for j,at in enumerate(np.arange(3.5,66,beat)):
 root=chords[int(at/(8*beat))%4][0];f=440*2**((root-69)/12)
 if j%2==0:
  t=np.arange(int(.22*SR))/SR;phase=2*np.pi*(44*t+32*.018*(1-np.exp(-t/.018)));kick=np.sin(phase)*np.exp(-t*23)*np.minimum(t/.003,1)
  add(music,at,kick,.07)
 add(music,at,note(f,.28,.012,12,.12),.036)
 if j%4==2:
  t=np.arange(int(.095*SR))/SR;sn=rng.normal(0,1,len(t));sn=signal.sosfilt(signal.butter(2,1800,'highpass',fs=SR,output='sos'),sn)
  add(music,at,sn*np.exp(-t*70)*np.minimum(t/.002,1),.018,.1)
for j,at in enumerate(np.arange(4.5,65,beat/2)):
 if j%8 not in [1,3,5,7]:continue
 chord=chords[int(at/(8*beat))%4];midi=chord[2+(j//2)%3]+12;f=440*2**((midi-69)/12)
 add(music,at,note(f,.3,.007,13,.12),.014,(-1 if j%4 else 1)*.45)
 add(music,at+beat*.75,note(f,.25,.008,16,.08),.004,(-1 if j%4==0 else 1)*.5)
 t=np.arange(int(.04*SR))/SR;hat=signal.sosfilt(signal.butter(2,6500,'highpass',fs=SR,output='sos'),rng.normal(0,1,len(t)))*np.exp(-t*110)
 add(music,at,hat,.008,.2)
# Slow arrangement lift, longer ending fade; music remains audible throughout scenes.
t=np.arange(N)/SR
arr=np.interp(t,[0,1.2,3.5,18.9,37.9,57.9,63.9,66,68],[0,.65,.9,.85,1,.85,1,.8,0])
music*=arr[:,None]
clicks=[8.45,13.65,23.3,24.9,31.2,32.6,43.35,48.3,49.65,56.25,59.75,61.65,67.25,68.25,70.3,74.4,75.15,77.9,81.2]
for at in clicks:
 destination=next((x for x in [8.65,13.8,19.85,23.5,25.1,31.4,32.8,39.7,43.55,48.5,49.85,61.85,67.45,68.45,70.5,74.6,75.35,78.1,81.4] if 0<x-at<.3),None)
 cue=real(destination)-.18 if destination else real(at)
 add(sfx,cue,note(740,.085,.002,60,.08),.055)
transitions=[8.65,13.8,19.85,23.5,25.1,31.4,32.8,39.7,43.55,48.5,49.85,61.85,67.45,68.45,70.5,74.6,75.35,78.1,81.4]
for at in transitions:
 at=real(at)
 tt=np.arange(int(.32*SR))/SR;n=rng.normal(0,1,len(tt));n=signal.sosfilt(signal.butter(2,[800,4500],'bandpass',fs=SR,output='sos'),n);env=np.sin(np.pi*tt/.32)**2
 add(sfx,at-.08,n*env,.012,-.2);add(sfx,at-.04,n*env,.008,.3)
for start,end in [(18.05,19.45),(38.0,39.4)]:
 start,end=real(start),real(end)
 tt=np.arange(int((end-start)*SR))/SR;f=310+260*tt/(end-start);s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/(end-start))**2
 add(sfx,start,s,.018)
 for d,fq in [(0,660),(.1,880)]:add(sfx,end+d,note(fq,.5,.008,8),.036)
for at,rev in [(56.45,False),(59.95,True)]:
 at=real(at)
 tt=np.arange(int(.8*SR))/SR;s=sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*(9+i*2)) for i,f in enumerate([1250,1830,2390]))/3
 if rev:s=s[::-1]*np.linspace(1,.4,len(s))
 add(sfx,at,s,.035)
for at,notes in [(20.0,[523.25,659.25,783.99]),(40.0,[440,659.25]),(82.5,[329.63,493.88,659.25])]:
 for i,f in enumerate(notes):add(sfx,real(at)+i*.12,note(f,.8,.015,5,.08),.028,(-.2+i*.2))
# Receipt and security tones, with no QR scan or false biometric success.
add(sfx,real(43.6),note(540,.5,.03,9,.05),.022)
add(sfx,real(78.3),note(390,.25,.015,15,.05),.025)
add(sfx,.12,note(329.63,.8,.02,5,.05),.018)
for st,en in [(10,10.8),(12.05,12.85)]:
 tt=np.arange(int((real(en)-real(st))*SR))/SR
 add(sfx,real(st),np.sin(2*np.pi*(280*tt+30*tt**2))*np.sin(np.pi*tt/tt[-1])**2,.008)
mix=music+sfx
# Gentle soft compression, integrated normalization, 4x true-peak check.
mix=np.tanh(mix/.55)*.55
meter=pyln.Meter(SR);before=float(meter.integrated_loudness(mix))
mix=pyln.normalize.loudness(mix,before,-16.0).astype(np.float32)
truepeak=float(np.max(np.abs(signal.resample_poly(mix,4,1,axis=0))))
ceiling=10**(-1.8/20)
if truepeak>ceiling:mix*=ceiling/truepeak
stats={'sampleRate':SR,'channels':2,'seconds':DURATION,'integratedLUFS':float(meter.integrated_loudness(mix)),'truePeakDBTP':float(20*np.log10(np.max(np.abs(signal.resample_poly(mix,4,1,axis=0))))),'license':'Original synthesized composition and effects; no third-party samples. Created for YUVIO portfolio publication.'}
def save(path,data):
 path.parent.mkdir(parents=True,exist_ok=True)
 with wave.open(str(path),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(data,-1,1)*32767).astype('<i2').tobytes())
save(ROOT/'public/v7/soundtrack.wav',mix)
save(ROOT/'assets/audio/v7/music.wav',music)
save(ROOT/'assets/audio/v7/ui-effects.wav',sfx)
(ROOT/'assets/audio/v7/mastering.json').write_text(json.dumps(stats,indent=2),encoding='utf-8')
print(json.dumps(stats,indent=2))
