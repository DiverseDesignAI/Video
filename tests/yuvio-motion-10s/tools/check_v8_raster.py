"""Catch the observed missing-layer render regression in every sampled Card frame."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];WORK=ROOT.parents[3]/'work';folder=WORK/'v8-critical-qa'
files=sorted(folder.glob('element-*.png'));assert len(files)==443,len(files)
checks=[]
for p in files:
 frame=int(p.stem.split('-')[-1]);real=frame/60
 if not (43.4<=real<=47.4):continue
 image=np.asarray(Image.open(p).convert('RGB'));header=image[213:366,1588:1853]
 bright=int(np.count_nonzero(np.min(header,axis=2)>185))
 assert bright>600,('Missing stable header layer',frame,bright)
 checks.append({'frame':frame,'headerBrightPixels':bright})
report={'sourceRasterFrames':len(files),'cardFramesChecked':len(checks),'minimumHeaderPixels':min(x['headerBrightPixels'] for x in checks),'renderer':'angle','checks':checks,'status':'passed'}
(ROOT/'v8-raster-qa.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print({k:v for k,v in report.items() if k!='checks'})
