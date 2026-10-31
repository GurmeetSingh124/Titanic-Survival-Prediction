from pathlib import Path
from xml.sax.saxutils import escape
from docx import Document
from docx.oxml.ns import qn
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle, KeepTogether
from reportlab.lib.utils import ImageReader

ROOT=Path(__file__).resolve().parents[1]
DOCX=ROOT/'Titanic_Survival_Prediction_Project_Report.docx'
PDF=ROOT/'Titanic_Survival_Prediction_Project_Report.pdf'
TMP=ROOT/'presentation_assets'/'report_assets';TMP.mkdir(exist_ok=True)
docx=Document(DOCX)
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyX',parent=styles['BodyText'],fontName='Helvetica',fontSize=10,leading=13.6,textColor=colors.HexColor('#242B33'),spaceAfter=7,alignment=TA_LEFT))
styles.add(ParagraphStyle(name='H1X',parent=styles['Heading1'],fontName='Helvetica-Bold',fontSize=19,leading=23,textColor=colors.HexColor('#214F84'),spaceBefore=8,spaceAfter=10,keepWithNext=True))
styles.add(ParagraphStyle(name='H2X',parent=styles['Heading2'],fontName='Helvetica-Bold',fontSize=13.2,leading=16,textColor=colors.HexColor('#5AA846'),spaceBefore=9,spaceAfter=6,keepWithNext=True))
styles.add(ParagraphStyle(name='CodeX',parent=styles['Code'],fontName='Courier',fontSize=7.2,leading=9,textColor=colors.HexColor('#263746'),leftIndent=4,rightIndent=4,spaceAfter=0))
styles.add(ParagraphStyle(name='CaptionX',parent=styles['BodyText'],fontName='Helvetica-Oblique',fontSize=8.3,leading=10.5,textColor=colors.HexColor('#59636E'),alignment=TA_CENTER,spaceAfter=7))
styles.add(ParagraphStyle(name='CenteredX',parent=styles['BodyX'],alignment=TA_CENTER))

def paragraph_markup(p):
    parts=[]
    for child in p._p:
        tag=child.tag.split('}')[-1]
        if tag not in ('r','hyperlink'): continue
        text=''.join((t.text or '') for t in child.iter(qn('w:t')))
        if not text: continue
        rpr=child.find(qn('w:rPr'))
        st=escape(text).replace('\n','<br/>')
        if rpr is not None:
            if rpr.find(qn('w:b')) is not None: st='<b>'+st+'</b>'
            if rpr.find(qn('w:i')) is not None: st='<i>'+st+'</i>'
            col=rpr.find(qn('w:color'))
            if col is not None and col.get(qn('w:val')) not in (None,'auto'):
                st=f'<font color="#{col.get(qn("w:val"))}">{st}</font>'
            sz=rpr.find(qn('w:sz'))
            if sz is not None:
                try: st=f'<font size="{int(sz.get(qn("w:val")))/2}">{st}</font>'
                except Exception: pass
        if tag=='hyperlink':
            link=child.get(qn('r:id'))
            try: url=p.part.rels[link].target_ref
            except Exception: url=''
            if url: st=f'<link href="{escape(url, {chr(34): "&quot;"})}" color="#3975BA">{st}</link>'
        parts.append(st)
    return ''.join(parts)

def is_page_break(p):
    return any(el.get(qn('w:type'))=='page' for el in p._p.iter(qn('w:br')))

def add_image_for_paragraph(p):
    rid=None;cx=0
    blip=p._p.find('.//' + qn('a:blip'))
    if blip is None:return None
    rid=blip.get(qn('r:embed'))
    ext=p._p.find('.//' + qn('wp:extent'))
    if ext is not None:cx=int(ext.get('cx'))
    if not rid:return None
    blob=docx.part.related_parts[rid].blob
    path=TMP/f'embedded-{rid}.png';path.write_bytes(blob)
    width=min(cx/914400 if cx else 6.0,6.45)*inch
    im=Image(str(path),width=width,height=width)
    iw,ih=ImageReader(str(path)).getSize();im.drawHeight=width*ih/iw
    maxh=7.2*inch
    if im.drawHeight>maxh:im.drawHeight=maxh;im.drawWidth=maxh*iw/ih
    im.hAlign='CENTER'
    return im

def table_flow(t):
    data=[]
    for ri,row in enumerate(t.rows):
        line=[]
        for cell in row.cells:
            txt=[]
            for par in cell.paragraphs:
                s=paragraph_markup(par)
                if s:txt.append(s)
            line.append(Paragraph('<br/>'.join(txt) if txt else ' ',styles['BodyX']))
        data.append(line)
    n=len(t.columns); usable=A4[0]-1.64*inch
    widths=[]
    for j in range(n):
        try: widths.append(t.columns[j].width.inches*inch)
        except: widths.append(usable/n)
    total=sum(widths)
    if total>usable: widths=[x*usable/total for x in widths]
    tb=Table(data,colWidths=widths,repeatRows=1 if len(data)>1 and len(data[0])>1 else 0,hAlign='CENTER')
    command=[('GRID',(0,0),(-1,-1),.4,colors.HexColor('#D9D9D9')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]
    if len(data)>1 and len(data[0])>1:
        command += [('BACKGROUND',(0,0),(-1,0),colors.HexColor('#214F84')),('TEXTCOLOR',(0,0),(-1,0),colors.white)]
        for i in range(1,len(data)):
            if i%2==0:command.append(('BACKGROUND',(0,i),(-1,i),colors.HexColor('#EFF4F8')))
    elif n==1:
        command += [('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#F1F4F6')),('LEFTPADDING',(0,0),(-1,-1),9)]
    tb.setStyle(TableStyle(command));return tb

story=[]
body=docx.element.body
for child in body:
    tag=child.tag.split('}')[-1]
    if tag=='p':
        from docx.text.paragraph import Paragraph as DParagraph
        para=DParagraph(child,docx)
        im=add_image_for_paragraph(para)
        if im:
            if para.text.strip():story.append(Paragraph(escape(para.text),styles['BodyX']))
            story.append(im);story.append(Spacer(1,3))
        text=paragraph_markup(para)
        if is_page_break(para):
            if text.strip():story.append(Paragraph(text,styles['BodyX']))
            story.append(PageBreak());continue
        if not text.strip():continue
        stylename=para.style.name if para.style else 'Normal'
        if para.text.strip()=='INVERTIS': style=ParagraphStyle('BrandTitle',parent=styles['CenteredX'],fontName='Helvetica-Bold',fontSize=34,leading=40,textColor=colors.HexColor('#07569B'),spaceAfter=8)
        elif para.text.strip().startswith('UNIVERSITY  BAREILLY'): style=ParagraphStyle('BrandSub',parent=styles['CenteredX'],fontName='Helvetica-Bold',fontSize=16,leading=22,textColor=colors.HexColor('#C32737'),spaceAfter=8)
        elif stylename=='Heading 1': style=styles['H1X']
        elif stylename=='Heading 2':style=styles['H2X']
        elif stylename=='Code':style=styles['CodeX']
        elif para.alignment==1:style=styles['CenteredX']
        else:style=styles['BodyX']
        if para.alignment==1 and any(r.italic for r in para.runs):style=styles['CaptionX']
        story.append(Paragraph(text,style))
    elif tag=='tbl':
        from docx.table import Table as DTable
        story.append(table_flow(DTable(child,docx)));story.append(Spacer(1,7))

def header(canvas,doc):
    canvas.saveState()
    if doc.page>1:
        canvas.setFont('Helvetica',7.5);canvas.setFillColor(colors.HexColor('#687580'))
        canvas.drawRightString(A4[0]-.82*inch,A4[1]-.43*inch,f'TITANIC SURVIVAL PREDICTION   |   PAGE {doc.page}')
        canvas.setFont('Helvetica',7.5);canvas.drawCentredString(A4[0]/2,.36*inch,'Invertis University  |  B.Tech (CSE)  |  Academic project report')
    canvas.restoreState()

template=SimpleDocTemplate(str(PDF),pagesize=A4,rightMargin=.82*inch,leftMargin=.82*inch,topMargin=.78*inch,bottomMargin=.72*inch,title='Titanic Survival Prediction Project Report',author='[Student Name]')
template.build(story,onFirstPage=header,onLaterPages=header)
print(PDF)

