"""Preserve the approved V7 mix and add one restrained receipt-reveal cue."""
from pathlib import Path
import json,wave
import numpy as np
from scipy import signal
import pyloudnorm as pyln
ROOT=Path(__file__).resolve().parents[1];source=ROOT/'public/v7/soundtrack.wav'
with wave.open(str(source)) as w:
 sr=w.getframerate();mix=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,2).astype(np.float64)/32768
# Read the exact cue time exported by the shared V8 motion model.
cue=json.loads((ROOT/'v8-motion-audit.json').read_text(encoding='utf-8'))['receipt']['start']
duration=.78;t=np.arange(round(duration*sr))/sr;rng=np.random.default_rng(20261020)
noise=signal.sosfilt(signal.butter(2,[420,1900],btype='bandpass',fs=sr,output='sos'),rng.normal(size=len(t)))
envelope=np.sin(np.pi*np.minimum(t/duration,1))**2*np.exp(-t*1.7)
sound=(.005*noise+.002*np.sin(2*np.pi*(340*t-70*t*t)))*envelope
start=round(cue*sr);mix[start:start+len(sound),0]+=sound*.94;mix[start:start+len(sound),1]+=sound
meter=pyln.Meter(sr);mix=pyln.normalize.loudness(mix,meter.integrated_loudness(mix),-16)
peak=float(np.max(np.abs(signal.resample_poly(mix,4,1,axis=0))))
assert peak<10**(-1/20)
out=ROOT/'public/v8/soundtrack.wav'
with wave.open(str(out),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
stats={'seconds':len(mix)/sr,'sampleRate':sr,'integratedLUFS':float(meter.integrated_loudness(mix)),'truePeakDBTP':float(20*np.log10(peak)),'receiptCue':{'start':cue,'duration':duration,'source':'Original softly filtered synthesized noise and tonal glide, no external recording'},'music':'Approved V7 final mix preserved'}
(ROOT/'v8-audio.json').write_text(json.dumps(stats,indent=2),encoding='utf-8');print(stats)
