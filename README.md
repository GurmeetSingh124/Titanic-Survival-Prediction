# Titanic Passenger Outcome Lab
> **Naye learners:** Pehle [simple Hinglish guide](Titanic_Project_Guide_Hinglish.md) padhein, phir `Titanic_Basics_Hinglish.ipynb` run karein. Detailed EDA aur model comparison ke liye `Titanic_Survival_Analysis.ipynb` optional hai.


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

Install the Microsoft **Python** and **Jupyter** extensions in VS Code. Start with `Titanic_Basics_Hinglish.ipynb` and choose the `.venv` Python kernel. Use **Run All** from the top. This basic notebook uses one 80/20 split and one Random Forest model, explains the important terms, and saves the pipeline used by the website. For extra charts, candidate model comparisons, cross-validation, and deeper interpretation, open `Titanic_Survival_Analysis.ipynb`.

If PowerShell blocks virtual-environment activation, run the environment's Python directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app:app --reload
```

## Important project files

```text
Titanic Survival Prediction/
├── Titanic.csv                              # Passenger data
├── Titanic_Basics_Hinglish.ipynb            # Start here: basic ML workflow
├── Titanic_Survival_Analysis.ipynb           # Optional detailed analysis
├── titanic_survival_pipeline.joblib          # Model used by the website
├── app.py                                    # Website API
├── requirements.txt                          # Python dependencies
├── Titanic_Project_Guide_Hinglish.md         # Simple project guide
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

At startup, `app.py` reads the CSV for data summaries and loads `titanic_survival_pipeline.joblib`, the complete preprocessing-and-model pipeline saved by `Titanic_Basics_Hinglish.ipynb` (or the final cells of the full analysis notebook). The saved model expects `pclass`, `sex`, `age`, derived `family_size`, `fare`, and `embarked`; the backend checks this schema before serving predictions. `alive` and the unnamed index column are never used as model inputs because they would reveal or add irrelevant information about the target. The notebook's scikit-learn version is pinned in `requirements.txt` so it matches the serialized model.

If the joblib file is missing or does not match the website, run all cells in `Titanic_Basics_Hinglish.ipynb` from top to bottom before launching the website. The prediction page sends passenger details to `POST /api/predict`. `GET /api/stats` returns survival breakdowns, missing-value counts, and group summaries. The Explore page lets visitors change the grouping and measure, inspect group counts, and search the field guide. The probability is a model estimate based on historical records; it is not a guarantee.

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
