import pdfplumber
f='Titanic_Survival_Prediction_Project_Report.pdf'
with pdfplumber.open(f) as pdf:
 for i,p in enumerate(pdf.pages,1):
  lines=(p.extract_text() or '').splitlines()
  print(i, ' | '.join(lines[:4]))
