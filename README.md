# Titanic Passenger Outcome Lab

A small full-stack machine learning project built around the included `Titanic.csv`. The single-page website brings together the passenger predictor, interactive data explorer, and project/methodology guide. The page uses a local ship video loop and a still image as its fallback poster.

## Run locally on Windows

Open PowerShell in this folder and run:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload
```

Open <http://127.0.0.1:8000> in your browser. Use the top navigation to move between the page sections. Stop the server with `Ctrl+C`.

## Learn or explore the Jupyter notebooks in VS Code

Install the Microsoft **Python** and **Jupyter** extensions in VS Code. Open `Titanic_Survival_Analysis.ipynb`, choose the `.venv` Python kernel, and use **Run All** from the top. The notebook covers basic analysis, EDA, feature engineering, a train/test split, Random Forest training, evaluation, and saving the pipeline used by the website.

If PowerShell blocks virtual-environment activation, run the environment's Python directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app:app --reload
```

## Important project files

```text
Titanic Survival Prediction/
├── Titanic.csv                              # Passenger data
├── Titanic_Survival_Analysis.ipynb           # EDA, feature engineering, and ML workflow
├── titanic_survival_pipeline.joblib          # Model used by the website
├── app.py                                    # Website API
├── requirements.txt                          # Python dependencies
├── Titanic_Survival_Prediction_Report (1).docx # College report
├── Titanic_Survival_Prediction_Invertis.pptx # College presentation
└── static/
    ├── index.html       # Single-page predictor, data analysis, and project guide
    ├── manifest.css     # Shared cinematic page styles
    ├── app.js           # Prediction form
    ├── explore.js       # In-page explorer controls
    ├── images/           # Ship poster and generated passenger-class artwork
    └── videos/
        └── titanic-loop.mp4 # Landing-page ship video
```

## How the prediction works

At startup, `app.py` reads the CSV for data summaries and loads `titanic_survival_pipeline.joblib`, the preprocessing-and-model pipeline saved by `Titanic_Survival_Analysis.ipynb`. The saved model expects `pclass`, `sex`, `age`, derived `family_size`, `fare`, and `embarked`; the backend checks this schema before serving predictions. `alive` and the unnamed index column are not used as model inputs. The notebook's scikit-learn version is pinned in `requirements.txt` to match the serialized model.

If the joblib file is missing or does not match the website, run all cells in `Titanic_Survival_Analysis.ipynb` from top to bottom before launching the website. The prediction page sends passenger details to `POST /api/predict`. `GET /api/stats` returns survival breakdowns, missing-value counts, and group summaries. The probability is a model estimate based on historical records; it is not a guarantee.

## API example

```powershell
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/api/predict `
  -ContentType 'application/json' `
  -Body '{"pclass":1,"sex":"female","age":28,"family_size":2,"fare":72,"embarked":"S"}'
```

## Notes

- Requires Python 3.10 or newer.
- The final saved prediction model is refit on all rows in this practice dataset for the interactive demo. Use the notebook's held-out validation results when reporting model performance in a project write-up.
- Google Fonts are optional; the site falls back to system serif and sans-serif fonts if unavailable.
