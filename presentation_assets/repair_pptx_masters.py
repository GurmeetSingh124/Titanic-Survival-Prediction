import zipfile
from pathlib import Path
src=Path('presentation_assets/candidate.pptx')
tmp=src.with_suffix('.repaired.pptx')
with zipfile.ZipFile(src,'r') as zin, zipfile.ZipFile(tmp,'w',zipfile.ZIP_DEFLATED) as zout:
    files={n:zin.read(n) for n in zin.namelist() if not n.endswith('/')}
    master=files['ppt/slideMasters/slideMaster1.xml']
    rels=files['ppt/slideMasters/_rels/slideMaster1.xml.rels']
    for i in range(2,16):
        files[f'ppt/slideMasters/slideMaster{i}.xml']=master
        files[f'ppt/slideMasters/_rels/slideMaster{i}.xml.rels']=rels
    for name,data in files.items(): zout.writestr(name,data)
tmp.replace(src)
