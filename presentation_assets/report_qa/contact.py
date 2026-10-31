from PIL import Image, ImageDraw
from pathlib import Path
p=Path('presentation_assets/report_qa')
fs=sorted(p.glob('page-*.png'))
print('rendered',len(fs),'pages')
thumbs=[]
for i,f in enumerate(fs):
 im=Image.open(f).convert('RGB'); im.thumbnail((260,370))
 c=Image.new('RGB',(280,400),'#ddd'); c.paste(im,((280-im.width)//2,8))
 ImageDraw.Draw(c).text((8,380),f'PAGE {i+1}',fill='black'); thumbs.append(c)
for j in range(0,len(thumbs),8):
 group=thumbs[j:j+8]; out=Image.new('RGB',(1120,800),'white')
 for k,x in enumerate(group): out.paste(x,((k%4)*280,(k//4)*400))
 out.save(p/f'contact-{j//8+1}.jpg',quality=90)
