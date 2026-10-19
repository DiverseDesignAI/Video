"""Split approved controls into native UI pieces; retain original paints and typography."""
from pathlib import Path
import copy,base64,xml.etree.ElementTree as E
ROOT=Path(__file__).resolve().parents[1]
PUB=ROOT/'public'; OUT=PUB/'v7'; OUT.mkdir(exist_ok=True)
NS='http://www.w3.org/2000/svg'; E.register_namespace('',NS)
font='@font-face{font-family:Onest;src:url(data:font/ttf;base64,'+base64.b64encode((PUB/'Onest.ttf').read_bytes()).decode()+');font-weight:100 900}'
def save(name,root): E.ElementTree(root).write(OUT/name,encoding='unicode',xml_declaration=False)
for state,source in [('active','card-controls.svg'),('frozen','frozen-controls.svg')]:
 root=E.parse(PUB/'v5'/source).getroot()
 groups=[g for g in root.iter() if g.tag==f'{{{NS}}}g' and 'filter' in g.attrib]
 assert len(groups)==3
 for i,g in enumerate(groups):
  for pressed in [False,True]:
   tile=E.Element(f'{{{NS}}}svg',{'width':'112','height':'86','viewBox':f'{14+i*121} 50 112 86','fill':'none'})
   for c in root:
    if c.tag in [f'{{{NS}}}style',f'{{{NS}}}defs']: tile.append(copy.deepcopy(c))
   body=copy.deepcopy(g)
   if pressed:
    # UI Kit Card Action 322:756 / 322:761: opacity .72, effects [].
    body.set('opacity','0.72');body.attrib.pop('filter',None)
   tile.append(body)
   save(f'{state}-action-{i}'+('-pressed' if pressed else '')+'.svg',tile)
 for g in groups:
  parent=next(p for p in root.iter() if g in list(p));parent.remove(g)
 save(f'{state}-panel.svg',root)
# Original component exports, with screen-specific labels retained in local derivatives.
for source in ['primary-default','primary-pressed']:
 root=E.parse(OUT/(source+'.svg')).getroot()
 style=E.Element(f'{{{NS}}}style');style.text=font;root.insert(0,style)
 for label,key in [('Go home','go-home'),('Done','done')]:
  variant=copy.deepcopy(root)
  span=next(variant.iter(f'{{{NS}}}tspan'));span.text=label;span.set('x','177');span.set('text-anchor','middle')
  save(source+'-'+key+'.svg',variant)
for source in ['secondary-default','secondary-pressed']:
 root=E.parse(OUT/(source+'.svg')).getroot();style=E.Element(f'{{{NS}}}style');style.text=font;root.insert(0,style);save(source+'-embedded.svg',root)
print('Prepared original component derivatives with embedded Onest.')

# Fresh UI-10 exports: the active Freeze surface is neutral, not selected purple.
# Keep unique URLs so Studio cannot reuse cached previous-revision images.
for i in range(3):
 source=OUT/f'card-current-action-{i}.svg'
 if not source.exists(): continue
 current=E.parse(source).getroot()
 for pressed in [False,True]:
  tile=copy.deepcopy(current)
  if pressed:
   body=E.Element(f'{{{NS}}}g',{'opacity':'.72'})
   for child in list(tile):
    if child.tag!=f'{{{NS}}}defs': tile.remove(child);body.append(child)
   for child in body.iter(): child.attrib.pop('filter',None)
   tile.append(body)
  save(f'active-current-action-{i}'+('-pressed' if pressed else '')+'.svg',tile)

