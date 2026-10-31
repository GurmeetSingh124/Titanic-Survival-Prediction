const pptxgen = require('C:/Users/acer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pptxgenjs');
const path = require('path');
const pptx = new pptxgen();
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'candidate.pptx');
const C = { navy:'142F49', blue:'1E4661', ink:'213B52', ivory:'FAF8F1', teal:'398E82', coral:'E77765', gold:'D1A56A', muted:'71838D', line:'D8E0DC', white:'FFFFFF', pale:'EEF4F0', sea:'E3F0E9', red:'F7E7E1' };
const ST = pptx.ShapeType;
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Invertis University - Machine Learning Project';
pptx.subject = 'Titanic Survival Prediction';
pptx.title = 'Titanic Survival Prediction | Invertis University';
pptx.company = 'Invertis University';
pptx.lang = 'en-US';
pptx.theme = { headFontFace:'Georgia', bodyFontFace:'Aptos', lang:'en-US' };
pptx.defineSlideMaster({title:'LIGHT',background:{color:C.ivory},objects:[{line:{x:0.5,y:7.12,w:12.3,h:0,line:{color:C.line,width:0.7}}},{text:{text:'TITANIC SURVIVAL PREDICTION  /  INVERTIS UNIVERSITY',options:{x:0.55,y:7.18,w:6.1,h:0.16,fontFace:'Aptos',fontSize:7,color:C.muted,charSpacing:1.3,margin:0}}}],slideNumber:{x:12.45,y:7.15,color:C.ink,fontFace:'Aptos',fontSize:8}});
function box(s,x,y,w,h,fill,opts={}){s.addShape(opts.round?ST.roundRect:ST.rect,{x,y,w,h,rectRadius:0.09,line:{color:opts.line||fill,transparency:opts.line?0:100,width:opts.line?0.8:0},fill:{color:fill},radius:0.09});}
function txt(s,t,x,y,w,h,o={}){s.addText(t,{x,y,w,h,fontFace:o.font||'Aptos',fontSize:o.size||12,color:o.color||C.ink,bold:!!o.bold,margin:0,fit:'shrink',valign:o.valign||'mid',align:o.align||'left',breakLine:false,...(o.extra||{})});}
function title(s,k,h,sub){txt(s,k.toUpperCase(),0.65,0.34,9,0.2,{size:8,bold:true,color:C.teal});txt(s,h,0.65,0.72,12,0.5,{font:'Georgia',size:26,bold:true,color:C.navy});if(sub)txt(s,sub,0.68,1.28,11.8,0.32,{size:11,color:C.muted});}
function nav(s){const a=[['Goal',2],['Data',3],['Patterns',4],['ML',5],['Results',6],['Website',7],['Takeaway',8]];let x=0.65;for(const [label,n] of a){s.addText(label,{x,y:6.83,w:1.1,h:0.17,fontFace:'Aptos',fontSize:7,color:C.teal,bold:true,margin:0,hyperlink:{slide:n}});x+=1.25;}}
function simple(k,h,sub){let s=pptx.addSlide('LIGHT');title(s,k,h,sub);nav(s);return s;}
function card(s,x,y,w,h,value,label,color=C.teal,detail=''){box(s,x,y,w,h,C.white,{round:true,line:C.line});txt(s,value,x+0.18,y+0.14,w-0.36,0.42,{font:'Georgia',size:24,bold:true,color});txt(s,label.toUpperCase(),x+0.18,y+0.63,w-0.36,0.2,{size:8,bold:true});if(detail)txt(s,detail,x+0.18,y+0.91,w-0.36,h-1.02,{size:8,color:C.muted});}
function notes(s,t){s.addNotes(t);}
// 1: Cover
{
 const s=pptx.addSlide();s.background={color:C.navy};
 s.addImage({path:path.join(ROOT,'static','images','titanic-dawn.png'),x:6.05,y:0,w:7.28,h:7.5,sizing:'cover'});
 box(s,0,0,6.55,7.5,C.navy);box(s,5.85,0,1.05,7.5,C.navy);
 txt(s,'INVERTIS UNIVERSITY',0.78,0.64,4.8,0.24,{size:10,bold:true,color:C.gold});
 txt(s,'TITANIC',0.78,1.72,5.2,0.7,{font:'Georgia',size:38,bold:true,color:C.ivory});
 txt(s,'SURVIVAL PREDICTION',0.78,2.48,5.2,1.0,{font:'Georgia',size:31,bold:true,color:C.coral});
 txt(s,'A simple machine learning project using passenger records',0.82,3.78,4.7,0.62,{font:'Georgia',size:16,color:C.ivory});
 box(s,0.82,4.8,3.4,0.42,C.blue,{round:true});txt(s,'COLLEGE PROJECT  •  B.TECH CSE',1.0,4.91,3.05,0.18,{size:8,bold:true,color:C.ivory});
 txt(s,'Student: [Name / ID]',0.82,6.2,2.7,0.2,{size:9,color:'D0DEDC'});txt(s,'Mentor: [Name]',3.45,6.2,2.3,0.2,{size:9,color:'D0DEDC'});txt(s,'[Section]  •  [Date]',0.82,6.58,3.5,0.18,{size:8,color:'9FB4B7'});
 notes(s,'Introduce this as a college machine learning project. The ship image is generated artwork, not a historical photograph. Fill in the student, mentor, section, and date details before presenting.');
}
// 2: Goal
{
 const s=simple('01 • Project goal','What does this project do?','It learns from old passenger records and estimates the recorded survival outcome.');
 box(s,0.85,1.9,5.4,3.7,C.navy,{round:true});txt(s,'THE QUESTION',1.2,2.3,2.2,0.22,{size:9,bold:true,color:C.gold});txt(s,'Can passenger details help a model estimate who survived?',1.2,2.82,4.4,1.2,{font:'Georgia',size:24,bold:true,color:C.ivory});txt(s,'The model gives an estimate, not a guarantee.',1.2,4.55,4.3,0.36,{size:11,color:'D5E2DE'});
 const steps=[['1','Passenger details','Age • sex • ticket class'],['2','Machine learning','Finds patterns in examples'],['3','Website','Shows a survival estimate']];
 steps.forEach((v,i)=>{let y=2.0+i*1.28;box(s,6.85,y,5.2,1.0,i===1?C.sea:C.white,{round:true,line:C.line});box(s,7.08,y+0.23,0.48,0.48,i===2?C.coral:C.teal,{round:true});txt(s,v[0],7.08,y+0.32,0.48,0.2,{size:11,bold:true,color:C.white,align:'center'});txt(s,v[1],7.8,y+0.18,3.8,0.27,{font:'Georgia',size:16,bold:true});txt(s,v[2],7.8,y+0.56,3.8,0.2,{size:9,color:C.muted});});
 notes(s,'Explain the goal in everyday words: the computer learns patterns from examples where the outcome is already known. It then estimates an outcome for a set of passenger details. It cannot know what would have happened to a real person.');
}
// 3: Dataset
{
 const s=simple('02 • The data','The project starts with 891 passenger records','Each row describes one passenger. “Survived” is the answer the model learns to estimate.');
 card(s,0.85,1.95,3.5,1.35,'891','Passengers',C.navy,'One row per person');card(s,4.9,1.95,3.5,1.35,'342','Survived',C.teal,'About 38 in every 100');card(s,8.95,1.95,3.5,1.35,'549','Did not survive',C.coral,'About 62 in every 100');
 box(s,0.85,3.75,11.6,2.15,C.white,{round:true,line:C.line});txt(s,'DETAILS IN THE FILE',1.18,4.05,3.4,0.23,{size:9,bold:true,color:C.teal});
 const fields=[['Passenger class','1st / 2nd / 3rd'],['Sex','Female / male'],['Age','Some values missing'],['Family','Parents, children, siblings'],['Fare & port','Ticket fare and port']];
 fields.forEach((f,i)=>{let x=1.15+i*2.2;box(s,x,4.55,2.0,0.88,i===2?C.red:C.pale,{round:true});txt(s,f[0],x+0.12,4.68,1.75,0.2,{size:9,bold:true});txt(s,f[1],x+0.12,4.98,1.75,0.25,{size:8,color:C.muted});});
 txt(s,'Some information is missing, so the data preparation step fills in reasonable values.',1.18,5.62,10.8,0.22,{size:10,color:C.muted});
 notes(s,'The included Titanic.csv has 891 records: 342 survived and 549 did not. The target column is Survived. Useful inputs include ticket class, sex, age, family size, fare, and port. Age is missing for 177 people. The model pipeline fills in missing values during prediction.');
}
// 4: Patterns
{
 const s=simple('03 • What we noticed','Survival rates were different across groups','These are patterns in this dataset. They do not prove that one detail caused the outcome.');
 box(s,0.88,1.95,5.55,3.95,C.white,{round:true,line:C.line});txt(s,'BY SEX',1.2,2.24,2,0.2,{size:9,bold:true,color:C.teal});
 const sex=[['Women',74.2,C.teal],['Men',18.9,C.coral]];sex.forEach((r,i)=>{let y=2.9+i*1.05;txt(s,r[0],1.2,y,1.2,0.22,{size:11,bold:true});box(s,2.45,y+0.03,2.65,0.28,'E8EEEA',{round:true});box(s,2.45,y+0.03,2.65*r[1]/100,0.28,r[2],{round:true});txt(s,`${r[1]}%`,5.2,y,0.78,0.22,{size:11,bold:true,color:r[2],align:'right'});});txt(s,'Women: 233 of 314  •  Men: 109 of 577',1.2,5.2,4.8,0.2,{size:8,color:C.muted});
 box(s,6.9,1.95,5.55,3.95,C.white,{round:true,line:C.line});txt(s,'BY TICKET CLASS',7.22,2.24,3,0.2,{size:9,bold:true,color:C.teal});
 const cls=[['1st class',63,C.teal],['2nd class',47,C.gold],['3rd class',24,C.coral]];cls.forEach((r,i)=>{let y=2.78+i*0.8;txt(s,r[0],7.22,y,1.4,0.22,{size:10,bold:true});box(s,8.8,y+0.03,2.65,0.26,'E8EEEA',{round:true});box(s,8.8,y+0.03,2.65*r[1]/100,0.26,r[2],{round:true});txt(s,`${r[1]}%`,11.55,y,0.55,0.22,{size:10,bold:true,color:r[2],align:'right'});});txt(s,'The chart shows the share who survived in each group.',7.22,5.2,4.7,0.2,{size:8,color:C.muted});
 notes(s,'In this dataset, 74.2% of women and 18.9% of men survived. By ticket class, the rates were about 63% in first class, 47% in second, and 24% in third. Explain that these are descriptive comparisons; they do not prove why outcomes differed.');
}
// 5: ML workflow
{
 const s=simple('04 • How the model learns','Four steps turn the CSV into a prediction','The notebook prepares the data, trains models, checks performance, and saves the selected pipeline.');
 const st=[['1','Prepare','Fill missing values and turn categories into numbers.'],['2','Learn','Train models using passenger records and outcomes.'],['3','Check','Test on records the model did not learn from.'],['4','Use','Save the pipeline and connect it to the website.']];
 st.forEach((v,i)=>{let x=0.82+i*3.12;box(s,x,2.25,2.75,2.35,i===3?C.navy:C.white,{round:true,line:i===3?C.navy:C.line});box(s,x+0.22,2.52,0.48,0.48,i===3?C.coral:C.teal,{round:true});txt(s,v[0],x+0.22,2.63,0.48,0.2,{size:11,bold:true,color:C.white,align:'center'});txt(s,v[1],x+0.22,3.22,2.25,0.33,{font:'Georgia',size:18,bold:true,color:i===3?C.ivory:C.navy});txt(s,v[2],x+0.22,3.72,2.28,0.58,{size:10,color:i===3?'D5E2DE':C.muted});if(i<3)txt(s,'→',x+2.82,3.12,0.3,0.34,{font:'Georgia',size:22,bold:true,color:C.gold,align:'center'});});
 box(s,0.86,5.25,11.55,0.72,C.sea,{round:true});txt(s,'A family-size feature combines the number of parents/children and siblings/spouses.',1.12,5.49,10.9,0.22,{size:10,color:C.ink});
 notes(s,'Walk through each step simply. We prepare the fields, train candidate models on part of the data, check predictions on a held-out set, and save a complete pipeline for the website. A family-size field is calculated from the family columns.');
}
// 6: Results
{
 const s=simple('05 • Model results','The model got about 8 out of 10 test records right','This score comes from a held-out validation set of 179 passengers.');
 card(s,0.9,2.0,3.55,1.55,'79.9%','Accuracy',C.teal,'143 of 179 predictions were correct');card(s,4.9,2.0,3.55,1.55,'43 of 69','Survivors found',C.navy,'The model found about 6 in 10 survivors');card(s,8.9,2.0,3.55,1.55,'26','Survivors missed',C.coral,'These are called false negatives');
 box(s,0.9,4.15,11.55,1.35,C.navy,{round:true});txt(s,'WHAT THIS MEANS',1.24,4.44,2.1,0.2,{size:9,bold:true,color:C.gold});txt(s,'The estimate can be useful for a class demo, but it can be wrong.',1.24,4.82,9.9,0.35,{font:'Georgia',size:19,bold:true,color:C.ivory});
 txt(s,'A simple majority guess got 61.5% accuracy, so the model improved on that baseline.',1.0,5.8,10.8,0.24,{size:10,color:C.muted});
 notes(s,'On 179 held-out records, the chosen Random Forest correctly classified 143, giving 79.9% accuracy. It identified 43 of 69 survivors and missed 26. The majority-class baseline reached 61.5% accuracy. These results describe this split and do not guarantee future performance.');
}
// 7: Website
{
 const s=simple('06 • The website','A website makes the project easy to try','Enter passenger details, explore the dataset, or read how the model works.');
 const imgs=[['PREDICT','predict.png'],['EXPLORE DATA','explore.png'],['ABOUT','about.png']];
 imgs.forEach((a,i)=>{let x=0.78+i*4.16;box(s,x,1.92,3.86,3.48,C.white,{round:true,line:C.line});s.addImage({path:path.join(__dirname,a[1]),x:x+0.14,y:2.08,w:3.58,h:2.55});txt(s,a[0],x+0.22,4.83,3.2,0.2,{size:9,bold:true,color:C.teal});});
 txt(s,'Built with Python • FastAPI • scikit-learn • HTML • CSS • JavaScript',0.92,5.82,8.4,0.25,{size:10,bold:true});
 s.addText('Open local demo ↗',{x:9.8,y:5.78,w:2.2,h:0.3,fontFace:'Aptos',fontSize:10,bold:true,color:C.teal,margin:0,hyperlink:{url:'http://127.0.0.1:8000/predict'}});
 txt(s,'The link works when the project website is running on your computer.',0.92,6.18,10.6,0.2,{size:8,color:C.muted});
 notes(s,'Show the three website pages. Predict accepts passenger details. Explore Data shows dataset patterns. About explains the project. The clickable demo link opens localhost, so the FastAPI app must be running on the presenter’s computer at port 8000.');
}
// 8: Conclusion
{
 const s=simple('07 • Takeaway','A complete beginner machine learning project','We explored data, trained and checked a model, then connected it to a website.');
 box(s,0.88,2.0,6.0,3.4,C.navy,{round:true});txt(s,'REMEMBER',1.25,2.35,2,0.22,{size:9,bold:true,color:C.gold});txt(s,'This model gives an estimate based on historical passenger records.',1.25,2.9,5.0,1.05,{font:'Georgia',size:24,bold:true,color:C.ivory});txt(s,'It cannot explain every individual outcome.',1.25,4.47,4.8,0.28,{size:11,color:'D5E2DE'});
 box(s,7.35,2.0,4.85,3.4,C.sea,{round:true});txt(s,'BEFORE PRESENTING',7.72,2.35,3.5,0.22,{size:9,bold:true,color:C.teal});
 const todo=['Add student and mentor details','Run the website for the live demo','Cite the dataset source in the report'];todo.forEach((t,i)=>{box(s,7.74,2.95+i*0.62,0.22,0.22,i===0?C.coral:C.teal,{round:true});txt(s,t,8.15,2.94+i*0.62,3.55,0.28,{size:10});});
 txt(s,'Project files: Titanic.csv • Titanic_Survival_Analysis.ipynb • app.py',0.92,5.84,10.6,0.22,{size:9,color:C.muted});
 notes(s,'Summarize the end-to-end project. The model offers an estimate based on historical records, not certainty. Remind the presenter to fill in names, run the web app, and confirm/cite the original dataset source.');
}
pptx.writeFile({fileName:OUT}).then(()=>console.log(OUT));
