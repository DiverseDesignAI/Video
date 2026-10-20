"""Prepare single-instance components from original Figma exports, without raster copies."""
from pathlib import Path
import copy,json,xml.etree.ElementTree as E
ROOT=Path(__file__).resolve().parents[1];PUB=ROOT/'public';OUT=PUB/'v8';NS='http://www.w3.org/2000/svg';E.register_namespace('',NS)
assets={}
# Remove original receipt controls (including shadows) before their synchronized
# reveal; the moving crop contains paper only, and each action is drawn once.
receipt=E.parse(PUB/'v5/receipt-base.svg').getroot()
for parent in receipt.iter():
 for child in list(parent):
  if child.get('id') in ['Action / Go home','Action / Download PDF']:parent.remove(child)
(OUT/'receipt-base.svg').write_text(E.tostring(receipt,encoding='unicode'),encoding='utf-8')
card_sources={'card-details':PUB/'v7/active-current-action-0.svg','card-freeze':PUB/'v7/active-current-action-1.svg','card-settings':PUB/'v7/active-current-action-2.svg','card-unfreeze':PUB/'v7/frozen-action-1.svg'}
for name,source in card_sources.items():
 root=E.parse(source).getroot()
 for parent in root.iter():
  for child in list(parent):
   if child.tag==f'{{{NS}}}style':parent.remove(child)
 (OUT/(name+'.svg')).write_text(E.tostring(root,encoding='unicode'),encoding='utf-8')
for source in OUT.glob('*.svg'):
 if 'background' in source.stem or source.stem=='receipt-base':continue
 root=E.parse(source).getroot()
 # Figma foreignObject wrappers contain XHTML self-closing divs. Inline HTML
 # parsing can swallow following SVG nodes; backdrop blur belongs to CSS instead.
 for parent in root.iter():
  for child in list(parent):
   if child.tag==f'{{{NS}}}foreignObject':parent.remove(child)
 rects=[e for e in root.iter(f'{{{NS}}}rect') if e.get('fill') and float(e.get('width','0'))>30 and float(e.get('height','0'))>25]
 if rects:
  surface=rects[0];x=float(surface.get('x',0));y=float(surface.get('y',0));w=float(surface.get('width'));h=float(surface.get('height'))
  root.set('viewBox',f'{x} {y} {w} {h}');root.set('width',str(w));root.set('height',str(h))
  # Replace the fill of the ORIGINAL surface, never add an overlay rectangle.
  old_fill=surface.get('fill');base_alpha=float(surface.get('fill-opacity',1));surface.set('fill','url(#__surface__)');surface.attrib.pop('fill-opacity',None)
  gradients={e.get('id'):e for e in root.iter(f'{{{NS}}}linearGradient')}
  if old_fill.startswith('url(#'):
   g=gradients[old_fill[5:-1]]
   stops=[{'at':float(s.get('offset','0')),'color':s.get('stop-color'),'alpha':float(s.get('stop-opacity',1))*base_alpha} for s in g]
   coords=[float(g.get(k,str(v))) for k,v in zip(['x1','y1','x2','y2'],[x,y,x+w,y+h])]
  else:stops=[{'at':0,'color':old_fill,'alpha':base_alpha},{'at':1,'color':old_fill,'alpha':base_alpha}];coords=[x,y,x+w,y+h]
  # Native exports can include outer-shadow padding. Geometry uses the surface rect.
  for node in root.iter():node.attrib.pop('filter',None)
  assets[source.stem]={'svg':E.tostring(root,encoding='unicode'),'stops':stops,'coords':coords,'box':[x,y,w,h]}
 else:assets[source.stem]={'svg':E.tostring(root,encoding='unicode'),'stops':[],'coords':[],'box':[0,0,float(root.get('width')),float(root.get('height'))]}
# Keep original navigation icon paths and labels once; its selected surface is separate.
root=E.parse(PUB/'v5/nav-0.svg').getroot();group=root.find(f'{{{NS}}}g')
for node in group.iter():
 if node.get('stroke') in ['#f6f4ff','#9291a8']:node.set('stroke','currentColor')
 if node.get('fill') in ['#f6f4ff','#9291a8']:node.set('fill','currentColor')
assets['navigation']={'groups':[E.tostring(c,encoding='unicode') for c in group]}
(ROOT/'src/v8-assets.json').write_text(json.dumps(assets,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('Prepared',len(assets),'single-instance vector components.')
