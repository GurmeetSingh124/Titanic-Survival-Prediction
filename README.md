# Titanic Passenger Outcome Lab

A small full-stack machine learning project built around the included `Titanic.csv`. It has three separate pages: a passenger predictor, an interactive data explorer, and a detailed project/methodology guide. The hero uses generated, photorealistic Titanic-style artwork (not an archival photograph).

## Run locally on Windows

Open PowerShell in this folder and run:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload
```

Open <http://127.0.0.1:8000> in your browser. Use the top navigation to move between Predict, Explore data, and About. Stop the server with `Ctrl+C`.

## Open the Jupyter notebook in VS Code

Install the Microsoft **Python** and **Jupyter** extensions in VS Code. Open `Titanic_Survival_Analysis.ipynb`, choose the `.venv` Python kernel when prompted, then use **Run All**. Install the project requirements first if notebook imports are missing.

If PowerShell blocks virtual-environment activation, run the environment's Python directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app:app --reload
```

## Project structure

```text
Titanic Survival Prediction/
├── Titanic.csv          # Included historical passenger data
├── app.py               # Data loading, model pipeline, and API
├── Titanic_Survival_Analysis.ipynb # Step-by-step ML notebook
├── requirements.txt     # Python dependencies
└── static/
    ├── index.html       # Prediction page
    ├── explore.html     # Interactive group charts and data guide
    ├── about.html       # Model, features, workflow, limitations
    ├── styles.css       # Shared prediction-page styling
    ├── pages.css        # Shared hero and detail-page styling
    ├── app.js           # Prediction form behavior
    ├── explore.js       # Interactive charts, filters, and search
    └── images/
        └── titanic-dawn.png # Generated ship artwork
```

## How the prediction works

At startup, `app.py` reads the CSV for data summaries and loads `titanic_survival_pipeline.joblib`, the complete preprocessing-and-model pipeline saved by the final cells of `Titanic_Survival_Analysis.ipynb`. The saved model expects `pclass`, `sex`, `age`, derived `family_size`, `fare`, and `embarked`; the backend checks this schema before serving predictions. `alive` and the unnamed index column are never used as model inputs because they would reveal or add irrelevant information about the target. The notebook's scikit-learn version is pinned in `requirements.txt` so it matches the serialized model.

If the joblib file is missing, open the notebook in VS Code and run its final training/save cells before launching the website. The prediction page sends passenger details to `POST /api/predict`. `GET /api/stats` returns survival breakdowns, missing-value counts, and group summaries. The Explore page lets visitors change the grouping and measure, inspect group counts, and search the field guide. The probability is a model estimate based on historical records; it is not a guarantee.

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
