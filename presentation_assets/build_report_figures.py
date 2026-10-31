from pathlib import Path
import numpy as np, pandas as pd, matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
ROOT=Path(__file__).resolve().parents[1]; A=Path(__file__).resolve().parent/'report_assets'; A.mkdir(exist_ok=True)
OUT=ROOT/'Titanic_Survival_Prediction_Project_Report.docx'
N='#214F84'; B='#3975BA'; G='#5AA846'; O='#DF765E'; I='#242B33'
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':9,'axes.titlesize':12,'axes.labelsize':9,'axes.titleweight':'bold','axes.edgecolor':'#8793A0'})
d=pd.read_csv(ROOT/'Titanic.csv').drop(columns=['Unnamed: 0'])
def finish(name):
 p=A/name;plt.tight_layout(pad=1);plt.savefig(p,dpi=300,bbox_inches='tight',facecolor='white');plt.close();return p
c=d.survived.value_counts().reindex([0,1]);f,ax=plt.subplots(figsize=(7,3.4));bs=ax.bar(['Did not survive','Survived'],c.values,color=[O,B],width=.55)
for b,v in zip(bs,c.values):ax.text(b.get_x()+b.get_width()/2,v+8,f'{v} ({v/891:.1%})',ha='center',fontweight='bold')
ax.set_ylim(0,650);ax.set_ylabel('Passenger records');ax.set_title('Recorded survival outcomes (n = 891)');ax.spines[['top','right']].set_visible(False);target=finish('target.png')
f,axs=plt.subplots(1,2,figsize=(9,3.7))
for ax,col,order,labs,cols,title in [(axs[0],'sex',['female','male'],['Women','Men'],[B,O],'By sex'),(axs[1],'pclass',[1,2,3],['1st','2nd','3rd'],[G,'#D5A544',O],'By class')]:
 g=d.groupby(col).survived.agg(['mean','count']).reindex(order);v=g['mean'].values*100;bs=ax.bar(labs,v,color=cols,width=.58)
 for b,r,n in zip(bs,v,g['count'].values):ax.text(b.get_x()+b.get_width()/2,r+2,f'{r:.1f}%\\n(n={n})',ha='center',fontsize=8,fontweight='bold')
 ax.set_title(title);ax.set_ylabel('Survival rate');ax.set_ylim(0,max(v)+18);ax.spines[['top','right']].set_visible(False);ax.grid(axis='y',color='#E4E8ED');ax.set_axisbelow(True)
eda=finish('eda.png')
miss=d.isna().sum();fields=['deck','age','embarked','embark_town'];vals=[miss[x]/891*100 for x in fields]
f,ax=plt.subplots(figsize=(7,3.3));bs=ax.barh(fields[::-1],vals[::-1],color=[B,B,G,O])
for b,v in zip(bs,vals[::-1]):ax.text(v+1,b.get_y()+b.get_height()/2,f'{v:.1f}%',va='center',fontweight='bold')
ax.set_xlim(0,90);ax.set_xlabel('Rows missing (%)');ax.set_title('Missing values in notable fields');ax.spines[['top','right']].set_visible(False);ax.grid(axis='x',color='#E4E8ED');ax.set_axisbelow(True);missing=finish('missing.png')
mods=['Logistic Regression','Random Forest','Decision Tree','Dummy baseline'];auc=[.839,.833,.785,.5]
f,ax=plt.subplots(figsize=(7.4,3.4));bs=ax.barh(mods[::-1],auc[::-1],color=['#9AA5AF','#D5A544',G,B][::-1])
for b,v in zip(bs,auc[::-1]):ax.text(v+.008,b.get_y()+b.get_height()/2,f'{v:.3f}',va='center',fontweight='bold')
ax.set_xlim(0,1.02);ax.set_xlabel('Validation ROC-AUC');ax.set_title('Model comparison (179 held-out records)');ax.spines[['top','right']].set_visible(False);ax.grid(axis='x',color='#E4E8ED');ax.set_axisbelow(True);modelplot=finish('models.png')
cm=np.array([[100,10],[26,43]]);f,ax=plt.subplots(figsize=(5.3,3.8));im=ax.imshow(cm,cmap='Blues',vmin=0,vmax=105);ax.set_xticks([0,1],['Predicted no','Predicted yes']);ax.set_yticks([0,1],['Actual no','Actual yes']);ax.set_title('Random Forest validation confusion matrix')
for i in range(2):
 for j in range(2):ax.text(j,i,str(cm[i,j]),ha='center',va='center',fontsize=18,fontweight='bold',color='white' if cm[i,j]>55 else I)
f.colorbar(im,ax=ax,fraction=.045,pad=.04,label='Passengers');cmplot=finish('confusion.png')
features=['sex','pclass','age','fare','embarked','family_size'];imp=[.2247,.0346,.0334,.0262,.013,.0099]
f,ax=plt.subplots(figsize=(7,3.5));bs=ax.barh(features[::-1],imp[::-1],color=['#77A6C9']*5+[B])
for b,v in zip(bs,imp[::-1]):ax.text(v+.003,b.get_y()+b.get_height()/2,f'{v:.4f}',va='center',fontsize=8)
ax.set_xlim(0,.27);ax.set_xlabel('ROC-AUC decrease after shuffling');ax.set_title('Permutation importance (30 repeats)');ax.spines[['top','right']].set_visible(False);ax.grid(axis='x',color='#E4E8ED');ax.set_axisbelow(True);importance=finish('importance.png')
agebins=[0,12,18,35,60,120];agelabs=['0–12','13–18','19–35','36–60','61+'];d['age_group']=pd.cut(d.age,bins=agebins,labels=agelabs,include_lowest=True);ag=d.groupby('age_group',observed=False).survived.agg(['mean','count'])
f,ax=plt.subplots(figsize=(7.2,3.2));bs=ax.bar(agelabs,ag['mean'].values*100,color=B)
for b,(_,r) in zip(bs,ag.iterrows()):ax.text(b.get_x()+b.get_width()/2,b.get_height()+2,f"{r['mean']:.1%}\\n(n={int(r['count'])})",ha='center',fontsize=8,fontweight='bold')
ax.set_ylim(0,75);ax.set_ylabel('Survival rate');ax.set_xlabel('Age band (years)');ax.set_title('Observed survival by age group');ax.spines[['top','right']].set_visible(False);ax.grid(axis='y',color='#E4E8ED');ax.set_axisbelow(True);ageplot=finish('age.png')
def diagram(path,architecture=False):
 # Portrait, top-to-bottom diagrams keep every label readable on an A4 page.
 f,ax=plt.subplots(figsize=(7.2,7.8 if architecture else 8.2));ax.set_xlim(0,1);ax.set_ylim(0,1);ax.axis('off')
 def node(x,y,w,h,t,s,col):
  ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle='round,pad=.012,rounding_size=.018',lw=1.6,ec=col,fc='white'))
  ax.text(x+w/2,y+h*.68,t,ha='center',va='center',fontsize=10,fontweight='bold',color=col)
  ax.text(x+w/2,y+h*.30,s,ha='center',va='center',fontsize=8,color=I,wrap=True)
 def arrow(a,b,c,e):ax.add_patch(FancyArrowPatch((a,b),(c,e),arrowstyle='-|>',mutation_scale=14,lw=1.35,color='#788793'))
 if architecture:
  ax.text(.5,.965,'MODEL BUILD / OFFLINE',ha='center',va='center',fontsize=10,fontweight='bold',color=N)
  # Training flow in the left lane, inference flow on the right.
  node(.05,.79,.40,.105,'Titanic.csv','891 records • target: survived',B)
  node(.05,.62,.40,.105,'Jupyter notebook','EDA • features • preprocessing',G)
  node(.05,.45,.40,.105,'Model evaluation','Train/CV • held-out validation',O)
  node(.05,.28,.40,.105,'Saved joblib pipeline','Preprocessing + Random Forest',N)
  arrow(.25,.79,.25,.725);arrow(.25,.62,.25,.555);arrow(.25,.45,.25,.385)
  ax.text(.75,.965,'PREDICTION / ONLINE',ha='center',va='center',fontsize=10,fontweight='bold',color=N)
  node(.55,.79,.40,.105,'Browser pages','Predict • Explore Data • About',B)
  node(.55,.62,.40,.105,'FastAPI application','POST /api/predict • GET /api/stats',G)
  node(.55,.45,.40,.105,'Loaded pipeline','Validate inputs • transform • predict',O)
  node(.55,.28,.40,.105,'Result in browser','Outcome label + estimated probability',N)
  arrow(.75,.79,.75,.725);arrow(.75,.62,.75,.555);arrow(.75,.45,.75,.385)
  # Saved artifact is transferred from training lane to the serving process.
  arrow(.45,.33,.55,.665)
  ax.text(.5,.12,'The website estimate is generated from the saved pipeline. It is not a new validation score.',ha='center',va='center',fontsize=8,color=I,wrap=True)
 else:
  steps=[('1. Load and inspect','Titanic.csv • 891 rows • verify target and data types',B),('2. Explore the data','Missing values • class balance • group patterns',G),('3. Engineer model inputs','Create family_size; remove index and leakage fields','#2B8291'),('4. Build preprocessing','Median / mode imputation • scale / one-hot encode',B),('5. Split the records','Stratified 80/20 • 712 train / 179 validation',G),('6. Compare candidates','5-fold CV and tuning on training data only',B),('7. Evaluate once','Report held-out metrics, ROC-AUC and confusion matrix',G),('8. Save for the demo','Refit selected pipeline on all 891 rows • joblib',O),('9. Serve a prediction','FastAPI validates input • browser displays estimate',N)]
  ys=np.linspace(.88,.12,len(steps));h=.071
  for i,(t,s,col) in enumerate(steps):
   y=ys[i]-h/2;node(.10,y,.80,h,t,s,col)
   if i<len(steps)-1:arrow(.5,y-.008,.5,ys[i+1]+h/2+.008)
 plt.subplots_adjust(left=.04,right=.96,top=.98,bottom=.02);plt.savefig(path,dpi=300,bbox_inches='tight',facecolor='white');plt.close()
diagram(A/'architecture.png',True);diagram(A/'workflow.png')
# Pair the two compact validation diagnostics so they can share one report page.
f,axs=plt.subplots(1,2,figsize=(12,4.2),gridspec_kw={'width_ratios':[1,1.3]})
axs[0].imshow(cm,cmap='Blues',vmin=0,vmax=105);axs[0].set_xticks([0,1],['Pred. no','Pred. yes']);axs[0].set_yticks([0,1],['Actual no','Actual yes']);axs[0].set_title('Validation confusion matrix')
for i in range(2):
 for j in range(2):axs[0].text(j,i,str(cm[i,j]),ha='center',va='center',fontsize=14,fontweight='bold',color='white' if cm[i,j]>55 else I)
imp_order=np.argsort(imp);axs[1].barh(np.array(features)[imp_order],np.array(imp)[imp_order],color='#77A6C9');axs[1].set_xlim(0,.27);axs[1].set_xlabel('ROC-AUC decrease after shuffling');axs[1].set_title('Permutation importance (30 repeats)')
for y,v in enumerate(np.array(imp)[imp_order]):axs[1].text(v+.003,y,f'{v:.4f}',va='center',fontsize=8)
for ax in axs:ax.spines[['top','right']].set_visible(False);ax.grid(axis='x',color='#E4E8ED');ax.set_axisbelow(True)
finish('evaluation_panels.png')
print("Report visuals generated:", A)
