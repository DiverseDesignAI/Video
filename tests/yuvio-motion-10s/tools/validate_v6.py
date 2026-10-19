from pathlib import Path
import json, subprocess, wave
import numpy as np
from PIL import Image, ImageOps, ImageDraw
import pyloudnorm as pyln
from scipy.signal import resample_poly
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT.parents[3]
OUT=BASE/'outputs'
WORK=BASE/'work'
BIN=ROOT/'node_modules/@remotion/compositor-win32-x64-msvc'
def run(args): return subprocess.run([str(BIN/'ffmpeg.exe'),'-hide_banner','-loglevel','error',*map(str,args)],check=True,capture_output=True)
report={}
for name in ['yuvio-walkthrough-v6.mp4','yuvio-walkthrough-v6-10bit.mp4']:
 p=OUT/name
 data=json.loads(subprocess.check_output([str(BIN/'ffprobe.exe'),'-v','error','-show_format','-show_streams','-of','json',str(p)]))
 v=next(s for s in data['streams'] if s['codec_type']=='video')
 assert (v['width'],v['height'],v['r_frame_rate'],v['nb_frames'])==(2560,1440,'60/1','4080')
 assert abs(float(data['format']['duration'])-68)<.1
 run(['-i',p,'-c:v','rawvideo','-c:a','pcm_s16le','-f','null','-'])
 report[name]={'bytes':p.stat().st_size,'duration':data['format']['duration'],'video':{k:v.get(k) for k in ['codec_name','profile','width','height','pix_fmt','r_frame_rate','nb_frames','color_space','color_transfer','color_primaries']},'fullDecode':'passed'}
 print(name,report[name],flush=True)
main=OUT/'yuvio-walkthrough-v6.mp4'
run(['-i',main,'-vn','-c:a','pcm_s16le','-y',WORK/'v6-encoded-audio.wav'])
with wave.open(str(WORK/'v6-encoded-audio.wav')) as w:
 sr=w.getframerate(); a=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,w.getnchannels()).astype(np.float64)/32768
report['audio']={'integratedLUFS':float(pyln.Meter(sr).integrated_loudness(a)),'truePeakDBTP':float(20*np.log10(np.max(np.abs(resample_poly(a,4,1,axis=0)))))}
times=[1.8,5,9.5,13.5,17,22,28.5,32,36,41,44,46.4,50.5,53,55.5,57.5,61.5,66.5]
thumbs=[]
for i,t in enumerate(times):
 p=WORK/f'v6-encoded-{i}.png'
 run(['-ss',t,'-i',main,'-frames:v','1','-y',p])
 im=Image.open(p).convert('RGB').resize((640,360)); ImageDraw.Draw(im).text((12,12),f'{t:.1f}s',fill='white');thumbs.append(im)
sheet=Image.new('RGB',(1920,360*6))
for i,im in enumerate(thumbs):sheet.paste(im,((i%3)*640,(i//3)*360))
sheet.save(WORK/'v6-contact.jpg',quality=94)
run(['-ss','66.5','-i',main,'-frames:v','1','-q:v','2','-y',OUT/'yuvio-walkthrough-v6-poster.jpg'])
(ROOT/'v6-export-validation.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2),flush=True)

