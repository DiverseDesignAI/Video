"""Test the reported black-fill regression at every tab-transition frame."""
from pathlib import Path
import json
import numpy as np
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT.parents[3]/'work'
plan=json.loads((ROOT/'v9-qa-plan.json').read_text(encoding='utf-8'))
folder=WORK/'v9-critical-qa';files=list(folder.glob('element-*.png'))
assert len(files)==len(plan['frames']),(len(files),len(plan['frames']))
def file(f):return next(folder.glob(f'element-{f:04d}.png'))
def box(im,pose,x,y,w,h):
 s=pose['scale'];cx=pose['cx'];cy=pose['cy'];a=round(cx+(14+x-215)*s);b=round(cy+(13+y-450)*s)
 return im.crop((a,b,round(a+w*s),round(b+h*s)))
checks=[]
for a,b in [(39.2,39.5),(51.7,52),(57.3,57.7)]:
 for f in range(round(a*60),round(b*60)+1):
  im=Image.open(file(f)).convert('RGB');pose=plan['poses'][str(f)];black=[]
  for x in [50,144,237,332]:
   pixels=np.asarray(box(im,pose,x,807,18,19));count=int(np.count_nonzero(np.max(pixels,axis=2)<12));assert count==0,('Black icon fill',f,x,count);black.append(count)
  checks.append({'frame':f,'blackPixels':sum(black)})
# Contact strips show every requested navigation frame at readable UI size.
for label,a,b in [('home-card',39.2,39.5),('card-activity',51.7,52),('activity-profile',57.3,57.7)]:
 frames=range(round(a*60),round(b*60)+1);sheet=Image.new('RGB',(1000,100*((len(frames)+3)//4)),(25,25,32))
 for i,f in enumerate(frames):
  im=Image.open(file(f)).convert('RGB');crop=box(im,plan['poses'][str(f)],0,790,402,62).resize((250,39));x=(i%4)*250;y=(i//4)*100;sheet.paste(crop,(x,y+20));ImageDraw.Draw(sheet).text((x+6,y+65),f'{f/60:.4f}s / {f}',fill='white')
 sheet.save(WORK/f'v9-nav-{label}.jpg',quality=95)
times=[25.7,25.78,25.86,25.94,38.2,38.28,38.36,38.44,53.3,53.38,53.46,53.54,34.4834,34.55,34.65,34.8,35,35.2,35.4]
sheet=Image.new('RGB',(1440,480*((len(times)+3)//4)))
for i,t in enumerate(times):
 f=min(plan['frames'],key=lambda f:abs(f/60-t));im=Image.open(file(f)).convert('RGB');p=plan['poses'][str(f)];crop=box(im,p,0,0,402,874);crop.thumbnail((340,445));x=(i%4)*360;y=(i//4)*480;sheet.paste(crop,(x+(360-crop.width)//2,y+24));ImageDraw.Draw(sheet).text((x+8,y+5),f'{f/60:.4f}s',fill='white')
sheet.save(WORK/'v9-transitions-receipt.jpg',quality=94)
report={'frames':len(files),'navigationFrames':len(checks),'blackIconPixels':0,'renderer':'angle','status':'passed'}
(ROOT/'v9-raster-qa.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(report)
