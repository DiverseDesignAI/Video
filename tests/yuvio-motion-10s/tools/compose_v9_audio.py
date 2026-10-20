"""Move only the existing receipt cue to the revised reveal start; preserve music."""
from pathlib import Path
import json,wave
import numpy as np
from scipy import signal
import pyloudnorm as pyln
ROOT=Path(__file__).resolve().parents[1]
with wave.open(str(ROOT/'public/v7/soundtrack.wav')) as w:
 sr=w.getframerate();base=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,2).astype(np.float64)/32768
old=json.loads((ROOT/'v8-audio.json').read_text(encoding='utf-8'))['receiptCue']['start']
cue=json.loads((ROOT/'v9-motion-audit.json').read_text(encoding='utf-8'))['receipt']['start']
duration=.78;t=np.arange(round(duration*sr))/sr;rng=np.random.default_rng(20261020)
noise=signal.sosfilt(signal.butter(2,[420,1900],btype='bandpass',fs=sr,output='sos'),rng.normal(size=len(t)))
envelope=np.sin(np.pi*np.minimum(t/duration,1))**2*np.exp(-t*1.7)
sound=(.005*noise+.002*np.sin(2*np.pi*(340*t-70*t*t)))*envelope
def add(at):
 mix=base.copy();start=round(at*sr);mix[start:start+len(sound),0]+=sound*.94;mix[start:start+len(sound),1]+=sound;return mix
meter=pyln.Meter(sr);old_mix=add(old);gain=10**((-16-meter.integrated_loudness(old_mix))/20)
mix=add(cue)*gain;out=ROOT/'public/v9/soundtrack.wav';out.parent.mkdir(exist_ok=True)
pcm=(np.clip(mix,-1,1)*32767).astype('<i2')
with wave.open(str(out),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(pcm.tobytes())
with wave.open(str(ROOT/'public/v8/soundtrack.wav')) as w:previous=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,2)
mask=np.ones(len(pcm),dtype=bool);mask[round(min(cue,old)*sr):round((max(cue,old)+duration)*sr)]=False
assert np.array_equal(pcm[mask],previous[mask]),'Music changed outside receipt cue'
report={'receiptCue':{'start':cue,'previousStart':old,'duration':duration},'musicOutsideCue':'bit-identical PCM to V8','integratedLUFS':float(meter.integrated_loudness(mix))}
(ROOT/'v9-audio.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(report)
