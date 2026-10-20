"""Validate actual deliveries, not just encoder arguments; write a reviewable report."""
from pathlib import Path
import json,subprocess,wave,hashlib,struct
import numpy as np
from PIL import Image,ImageDraw
import pyloudnorm as pyln
from scipy.signal import resample_poly
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT.parents[3]
OUT=BASE/'outputs';WORK=BASE/'work';BIN=ROOT/'node_modules/@remotion/compositor-win32-x64-msvc'
def run(args):return subprocess.run([str(BIN/'ffmpeg.exe'),'-hide_banner','-loglevel','error',*map(str,args)],check=True,capture_output=True)
def probe(p):return json.loads(subprocess.check_output([str(BIN/'ffprobe.exe'),'-v','error','-show_format','-show_streams','-of','json',str(p)]))
report={'sourceCommit':subprocess.check_output(['git','-C',str(ROOT),'rev-parse','HEAD'],text=True).strip(),'deliveries':{}}
report['renderSourceHashes']={name:hashlib.sha256((ROOT/'src'/name).read_bytes()).hexdigest() for name in ['index.tsx','YuvioV7.tsx','ScreensV7.tsx','motionV7.ts','CursorV7.tsx']}
report['cursorAudit']=json.loads((ROOT/'v7-cursor-audit.json').read_text(encoding='utf-8'))
assert report['cursorAudit']['status']=='passed'
for name in ['yuvio-walkthrough-v7.mp4','yuvio-walkthrough-v7-10bit.mp4']:
 p=OUT/name;data=probe(p);v=next(s for s in data['streams'] if s['codec_type']=='video')
 assert (v['width'],v['height'],v['r_frame_rate'],v['nb_frames'])==(2560,1440,'60/1','4080')
 assert abs(float(data['format']['duration'])-68)<.05
 if name=='yuvio-walkthrough-v7.mp4':assert 25_000_000<=int(v['bit_rate'])<=40_000_000
 else:assert v['pix_fmt']=='yuv420p10le'
 run(['-i',p,'-c:v','rawvideo','-c:a','pcm_s16le','-f','null','-'])
 report['deliveries'][name]={'bytes':p.stat().st_size,'duration':data['format']['duration'],'sha256':hashlib.file_digest(p.open('rb'),'sha256').hexdigest(),'video':{k:v.get(k) for k in ['codec_name','profile','width','height','pix_fmt','r_frame_rate','nb_frames','bit_rate','color_space','color_transfer','color_primaries']},'fullDecode':'passed'}
 print(name,report['deliveries'][name],flush=True)
main=OUT/'yuvio-walkthrough-v7.mp4'
run(['-i',main,'-vn','-c:a','pcm_s16le','-y',WORK/'v7-encoded-audio.wav'])
with wave.open(str(WORK/'v7-encoded-audio.wav')) as w:
 sr=w.getframerate();audio=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,w.getnchannels()).astype(np.float64)/32768
report['audio']={'sampleRate':sr,'integratedLUFS':float(pyln.Meter(sr).integrated_loudness(audio)),'truePeakDBTP':float(20*np.log10(np.max(np.abs(resample_poly(audio,4,1,axis=0)))))}
assert -16.5<report['audio']['integratedLUFS']<-15.5
assert report['audio']['truePeakDBTP']<-1
report['backgrounds']={}
for name in ['intro','normal','qr','cold','outro']:
 data=(ROOT/'public/v7'/f'{name}.png').read_bytes();w,h,depth,color=struct.unpack('>IIBB',data[16:26]);assert (w,h,depth,color)==(2560,1440,16,2)
 report['backgrounds'][name]={'width':w,'height':h,'sourceBitDepth':depth,'colorType':'RGB'}
times=[3.2,6.9,9.6,12.38,15.2,17.2,19.2,23.5,29.2,31.5,33.45,34.65,36.9,41.4,43.57,43.77,45.1,46.47,47.5,49.8,52.4,55.2,58.6,62.2,66.5]
thumbs=[]
for i,t in enumerate(times):
 p=WORK/f'v7-encoded-{i}.png';run(['-ss',t,'-i',main,'-frames:v','1','-y',p])
 im=Image.open(p).convert('RGB').resize((640,360));ImageDraw.Draw(im).text((12,12),f'{t:.2f}s',fill='white');thumbs.append(im)
sheet=Image.new('RGB',(1920,360*((len(thumbs)+2)//3)))
for i,im in enumerate(thumbs):sheet.paste(im,((i%3)*640,(i//3)*360))
sheet.save(WORK/'v7-export-contact.jpg',quality=94)
run(['-ss','66.5','-i',main,'-frames:v','1','-q:v','2','-y',OUT/'yuvio-walkthrough-v7-poster.jpg'])
report['sampledFrames']=times
(ROOT/'v7-export-validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2),flush=True)
