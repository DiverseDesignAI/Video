"""Preserve unaffected ProRes frames; replace only the final typography/state windows."""
from pathlib import Path
import json,subprocess
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT.parents[3];WORK=BASE/'work'
FF=ROOT/'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
plan=json.loads((ROOT/'v7-refinement-windows.json').read_text())
out=WORK/'v7-refinement-patches';out.mkdir(exist_ok=True)
master=WORK/'yuvio-v7-master.mkv';score=ROOT/'public/v7/soundtrack.wav'
def ms(frame):return (frame*1000+30)//60
def segment(file,sourceFrom,sourceTo,globalFrom,globalTo):
 return f"file '{file.as_posix()}'\ninpoint {ms(sourceFrom)/1000:.3f}\noutpoint {ms(sourceTo)/1000:.3f}\nduration {(ms(globalTo)-ms(globalFrom))/1000:.3f}\n"
manifest='ffconcat version 1.0\n';cursor=0
for i,w in enumerate(plan['windows']):
 n=w['to']-w['from']+1;p=out/f'patch-{i:02}.mkv'
 subprocess.run([str(FF),'-hide_banner','-loglevel','error','-framerate','60','-start_number',str(w['from']),'-i',str(WORK/'v7-refinement-frames/element-%04d.png'),'-ss',str(w['from']/60),'-i',str(score),'-map','0:v:0','-map','1:a:0','-frames:v',str(n),'-t',str(n/60),'-c:v','prores_ks','-profile:v','3','-pix_fmt','yuv422p10le','-colorspace:v','bt709','-color_primaries:v','bt709','-color_trc:v','bt709','-color_range','tv','-vf','zscale=matrix=709:range=limited:primariesin=709:primaries=709:transferin=709:transfer=709','-c:a','pcm_s16le','-ar','48000','-ac','2','-y',str(p)],check=True)
 if cursor<w['from']:manifest+=segment(master,cursor,w['from'],cursor,w['from'])
 manifest+=segment(p,0,n,w['from'],w['to']+1);cursor=w['to']+1
 print(f'Prepared refinement {i+1}/{len(plan["windows"])} ({n} frames)',flush=True)
if cursor<4080:manifest+=segment(master,cursor,4080,cursor,4080)
(WORK/'v7-final-picture.ffconcat').write_text(manifest,encoding='utf-8')
print('Picture manifest complete: 4080 intended frames; PCM score remains uninterrupted.',flush=True)
