"""Validate encoded V9 deliveries, including every critical transition frame."""
from pathlib import Path
import json,subprocess,wave,hashlib
import numpy as np
from PIL import Image,ImageDraw
import pyloudnorm as pyln
from scipy.signal import resample_poly
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1];BASE=ROOT.parents[3];OUT=BASE/'outputs';WORK=BASE/'work'
FFMPEG=Path(imageio_ffmpeg.get_ffmpeg_exe());PROBE=ROOT/'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe'
def run(args):return subprocess.run([str(FFMPEG),'-hide_banner','-loglevel','error','-xerror',*map(str,args)],check=True,capture_output=True)
def probe(p):return json.loads(subprocess.check_output([str(PROBE),'-v','error','-show_streams','-show_format','-of','json',str(p)]))
source=json.loads((ROOT/'v9-render-source.json').read_text(encoding='utf-8'))
for name,digest in source['sourceHashes'].items():assert hashlib.sha256((ROOT/'src'/name).read_bytes()).hexdigest()==digest,('Source changed during render',name)
assert hashlib.sha256((ROOT/'public/v9/soundtrack.wav').read_bytes()).hexdigest()==source['audioHash']
report={'sourceCommit':source['commit'],'renderer':source['renderer'],'deliveries':{}}
for name in ['yuvio-walkthrough-v9.mp4','yuvio-walkthrough-v9-10bit.mp4']:
 p=OUT/name;data=probe(p);v=next(s for s in data['streams'] if s['codec_type']=='video');a=next(s for s in data['streams'] if s['codec_type']=='audio')
 assert (v['width'],v['height'],v['r_frame_rate'],v['nb_frames'])==(2560,1440,'60/1','4080')
 assert abs(float(data['format']['duration'])-68)<.02
 assert a['sample_rate']=='48000' and a['channels']==2
 if name.endswith('-10bit.mp4'):assert v['codec_name']=='hevc' and v['pix_fmt']=='yuv420p10le' and 20_000_000<int(v['bit_rate'])<30_000_000
 else:assert v['codec_name']=='h264' and 25_000_000<int(v['bit_rate'])<40_000_000
 run(['-i',p,'-map','0:v:0','-map','0:a:0','-c:v','rawvideo','-c:a','pcm_s16le','-f','null','-'])
 report['deliveries'][name]={'bytes':p.stat().st_size,'sha256':hashlib.file_digest(p.open('rb'),'sha256').hexdigest(),'duration':data['format']['duration'],'video':{k:v.get(k) for k in ['codec_name','profile','pix_fmt','width','height','r_frame_rate','nb_frames','bit_rate','color_space','color_transfer','color_primaries']},'fullDecode':'passed'}
 print(name,report['deliveries'][name],flush=True)
main=OUT/'yuvio-walkthrough-v9-10bit.mp4'
run(['-i',main,'-vn','-c:a','pcm_s16le','-y',WORK/'v9-encoded-audio.wav'])
with wave.open(str(WORK/'v9-encoded-audio.wav')) as w:sr=w.getframerate();audio=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,2).astype(np.float64)/32768
report['audio']={'sampleRate':sr,'integratedLUFS':float(pyln.Meter(sr).integrated_loudness(audio)),'truePeakDBTP':float(20*np.log10(np.max(np.abs(resample_poly(audio,4,1,axis=0)))))}
assert -16.5<report['audio']['integratedLUFS']<-15.5 and report['audio']['truePeakDBTP']<-1

# Decode every critical interval from the actual Main 10 HEVC delivery.
ranges=[(1035,1065),(1539,1563),(2289,2313),(3195,3219),(2349,2373),(3099,3123),(3435,3465),(2604,2844),(2061,2127)]
frames=sorted({f for a,b in ranges for f in range(a,b+1)})
select='+'.join(f'between(n,{a},{b})' for a,b in ranges)
raw=run(['-i',main,'-vf',f"select='{select}',scale=640:360",'-fps_mode','passthrough','-f','rawvideo','-pix_fmt','rgb24','-']).stdout
images=np.frombuffer(raw,dtype=np.uint8).reshape(-1,360,640,3);assert len(images)==len(frames),(len(images),len(frames))
card_checks=[]
for f,im in zip(frames,images):
 if 2604<=f<=2844:
  bright=int(np.count_nonzero(np.min(im[53:92,397:464],axis=2)>175));assert bright>35,('Encoded Card layer missing',f,bright)
  card_checks.append({'frame':f,'brightHeaderPixels':bright})
report['criticalFrameDecode']={'frames':len(frames),'ranges':ranges,'cardHeaderChecks':len(card_checks),'minimumHeaderPixels':min(c['brightHeaderPixels'] for c in card_checks),'status':'passed'}
print('Encoded critical-frame audit:',report['criticalFrameDecode'],flush=True)

# Inspect closed-icon interiors in every requested navigation frame at full
# delivery resolution, after actual HEVC encoding. Stream instead of retaining
# hundreds of megabytes of frames in memory.
plan=json.loads((ROOT/'v9-qa-plan.json').read_text(encoding='utf-8'))
navranges=[(2352,2370),(3102,3120),(3438,3462)]
navframes=sorted({f for a,b in navranges for f in range(a,b+1)})
select='+'.join(f'between(n,{a},{b})' for a,b in navranges)
proc=subprocess.Popen([str(FFMPEG),'-v','error','-i',str(main),'-vf',f"select='{select}'",'-fps_mode','passthrough','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
black_checks=[]
for f in navframes:
 raw=proc.stdout.read(2560*1440*3);assert len(raw)==2560*1440*3
 im=np.frombuffer(raw,dtype=np.uint8).reshape(1440,2560,3);p=plan['poses'][str(f)];s=p['scale'];count=0
 for x in [50,144,237,332]:
  x0=round(p['cx']+(14+x-215)*s);y0=round(p['cy']+(13+807-450)*s)
  region=im[y0:round(y0+19*s),x0:round(x0+18*s)]
  count+=int(np.count_nonzero(np.max(region,axis=2)<10))
 assert count==0,('Encoded black icon regression',f,count)
 black_checks.append({'frame':f,'blackPixels':count})
assert proc.wait()==0
report['encodedNavigation']={'frames':len(black_checks),'blackIconPixels':0,'delivery':'HEVC Main 10','status':'passed'}

times=[3.2,6.9,12.38,15.2,17.25,17.45,17.65,19.2,23.5,31.5,33.45,34.5,34.75,34.9,35.15,35.5,35.95,36.6,37.3,39.25,41.4,43.65,43.767,43.82,44,44.2,45.1,46.5,46.8,46.9,47.05,47.2,49.8,52.4,55.2,58.6,62.2,66.5]
thumbs=[]
for i,t in enumerate(times):
 p=WORK/f'v9-encoded-{i:02}.png';run(['-ss',t,'-i',main,'-frames:v','1','-y',p])
 im=Image.open(p).convert('RGB').resize((640,360));ImageDraw.Draw(im).text((12,12),f'{t:.3f}s',fill='white');thumbs.append(im)
sheet=Image.new('RGB',(1920,360*((len(thumbs)+2)//3)))
for i,im in enumerate(thumbs):sheet.paste(im,((i%3)*640,(i//3)*360))
sheet.save(WORK/'v9-export-contact.jpg',quality=94)
run(['-ss','66.5','-i',main,'-frames:v','1','-q:v','2','-y',OUT/'yuvio-walkthrough-v9-poster.jpg'])
report['sampledFrames']=times;report['status']='passed'
(ROOT/'v9-export-validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2),flush=True)
