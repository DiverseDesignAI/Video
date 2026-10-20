"""Rebalance the approved music and UI effects, then copy existing video packets."""
from pathlib import Path
import argparse,hashlib,json,subprocess,wave
import numpy as np
from scipy import signal
import pyloudnorm as pyln
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1];REPO=ROOT.parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--output-dir',required=True);parser.add_argument('--preview-gain',type=float,default=1.08)
args=parser.parse_args();OUT=Path(args.output_dir);OUT.mkdir(parents=True,exist_ok=True)
FF=imageio_ffmpeg.get_ffmpeg_exe();SR=48000
PROBE=ROOT/'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe'
def metadata(p):
 data=json.loads(subprocess.check_output([str(PROBE),'-v','error','-show_streams','-show_format','-of','json',str(p)]))
 v=next(s for s in data['streams'] if s['codec_type']=='video');a=next(s for s in data['streams'] if s['codec_type']=='audio')
 assert (v['width'],v['height'],v['r_frame_rate'],v['nb_frames'])==(2560,1440,'60/1','4080')
 assert abs(float(data['format']['duration'])-68)<.01 and a['sample_rate']=='48000' and a['channels']==2
 return {'duration':data['format']['duration'],'video':{k:v[k] for k in ['codec_name','pix_fmt','width','height','r_frame_rate','nb_frames']}}
def read(p):
 with wave.open(str(p)) as w:
  assert w.getframerate()==SR and w.getnchannels()==2 and w.getsampwidth()==2
  return np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,2).copy()
def write(p,pcm):
 p.parent.mkdir(parents=True,exist_ok=True)
 with wave.open(str(p),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.astype('<i2').tobytes())
def run(argv):return subprocess.check_output([FF,'-v','error',*map(str,argv)])
def sha(p):
 with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()

# Recreate the original unquantized, separate music/effect buses without running
# the old generator's file-writing/mastering tail. Preserve its deterministic RNG.
generator=ROOT/'tools/compose_v7_audio.py';namespace={'__file__':str(generator),'__name__':'v7_stem_reconstruction'}
prefix=generator.read_text(encoding='utf-8').split('mix=music+sfx\n',1)[0]
exec(compile(prefix,str(generator),'exec'),namespace)
music=namespace['music'];effects=namespace['sfx'];meter=pyln.Meter(SR)
compressed=np.tanh((music+effects)/.55)*.55
gain7=10**((-16-float(meter.integrated_loudness(compressed)))/20)
mastered=(compressed*gain7).astype(np.float32)
ceiling=10**(-1.8/20);peak=np.max(np.abs(signal.resample_poly(mastered,4,1,axis=0)))
if peak>ceiling:gain7*=ceiling/peak;mastered*=ceiling/peak
reference7=read(ROOT/'public/v7/soundtrack.wav')
generator_error=int(np.max(np.abs((mastered*32767).astype(np.int32)-reference7.astype(np.int32))))
print('V7 reconstruction maximum PCM error:',generator_error,flush=True)
assert generator_error<=1,'Original V7 generator reconstruction differs beyond PCM rounding'

# Attribute the existing shared soft compressor's interaction to the effects
# bus: compressed(music+effects) - compressed(music). Its residual also retains
# every approved V9 cue and PCM rounding. Music + effects reconstructs V9 exactly.
base=read(ROOT/'public/v7/soundtrack.wav').astype(np.float64)/32768
old_cue=json.loads((ROOT/'v8-audio.json').read_text(encoding='utf-8'))['receiptCue']['start']
t=np.arange(round(.78*SR))/SR;rng=np.random.default_rng(20261020)
noise=signal.sosfilt(signal.butter(2,[420,1900],btype='bandpass',fs=SR,output='sos'),rng.normal(size=len(t)))
cue=(.005*noise+.002*np.sin(2*np.pi*(340*t-70*t*t)))*(np.sin(np.pi*t/.78)**2*np.exp(-t*1.7))
old=base.copy();at=round(old_cue*SR);old[at:at+len(cue),0]+=cue*.94;old[at:at+len(cue),1]+=cue
gain9=10**((-16-float(meter.integrated_loudness(old)))/20)
music_pcm=np.rint((np.tanh(music/.55)*.55)*gain7*gain9*32767).astype(np.int32)
approved=read(ROOT/'public/v9/soundtrack.wav').astype(np.int32)
effects_pcm=approved-music_pcm
assert np.max(np.abs(effects_pcm))<32767 and np.max(np.abs(music_pcm))<32767
assert np.array_equal(music_pcm+effects_pcm,approved)
gain_music=.65;gain_effects=1.15
mix=(music_pcm.astype(np.float64)*gain_music+effects_pcm.astype(np.float64)*gain_effects)/32768
delivery=mix*args.preview_gain
truepeak=float(np.max(np.abs(signal.resample_poly(delivery,4,1,axis=0))))
assert truepeak<10**(-1/20),'Rebalanced audio exceeds -1 dBTP; do not normalize away requested gains'
public=ROOT/'public/v9/balance'
write(public/'music.wav',music_pcm);write(public/'ui-effects.wav',effects_pcm)
write(OUT/'delivery-audio.wav',np.rint(delivery*32768))

report={'musicMultiplier':gain_music,'effectsMultiplier':gain_effects,'musicDB':float(20*np.log10(gain_music)),'effectsDB':float(20*np.log10(gain_effects)),'existingPreviewGainPreserved':args.preview_gain,'durationSeconds':len(delivery)/SR,'integratedLUFS':float(meter.integrated_loudness(delivery)),'truePeakDBTP':float(20*np.log10(truepeak)),'sourceReconstruction':'Two PCM stems sum exactly to approved V9 soundtrack; shared-compressor interaction and receipt cue retained in effects','normalization':'None after requested balance changes','deliveries':{}}
previous=json.loads((ROOT/'v9-export-validation.json').read_text(encoding='utf-8'))['deliveries']
for name,data in previous.items():
 digest=data['sha256'];cached=REPO/'.git/lfs/objects'/digest[:2]/digest[2:4]/digest
 source=cached if cached.exists() else REPO/'deliverables'/name
 assert source.exists() and sha(source)==digest,('Missing/changed approved V9 input',name)
 dest=OUT/name.replace('v9-10bit','v9-audio-10bit').replace('v9.mp4','v9-audio.mp4')
 run(['-i',source,'-i',OUT/'delivery-audio.wav','-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','320k','-movflags','+faststart','-y',dest])
 # Hash the encoded video elementary stream, including every packet. Audio-only
 # remux must not alter a single coded video byte.
 stream_args=['-map','0:v:0','-c:v','copy','-f','hash','-hash','sha256','-']
 original_hash=run(['-i',source,*stream_args]).decode().strip();updated_hash=run(['-i',dest,*stream_args]).decode().strip()
 assert original_hash==updated_hash,('Video changed',name)
 run(['-xerror','-i',dest,'-map','0:v:0','-map','0:a:0','-f','null','-'])
 decoded=np.frombuffer(run(['-i',dest,'-vn','-f','f32le','-acodec','pcm_f32le','-']),dtype='<f4').reshape(-1,2)
 decoded_peak=float(20*np.log10(np.max(np.abs(signal.resample_poly(decoded,4,1,axis=0)))))
 assert decoded_peak<-1
 report['deliveries'][dest.name]={'bytes':dest.stat().st_size,'sha256':sha(dest),'videoElementaryStreamHash':updated_hash,'videoMatchesV9':True,'fullDecode':'passed','integratedLUFS':float(meter.integrated_loudness(decoded)),'truePeakDBTP':decoded_peak,**metadata(dest)}
 print(dest.name,report['deliveries'][dest.name],flush=True)
report['status']='passed'
(ROOT/'v9-audio-balance-validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2),flush=True)
