from pathlib import Path

import pandas as pd
import joblib
from fastapi import FastAPI
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "Titanic.csv"
MODEL_PATH = ROOT / "titanic_survival_pipeline.joblib"
STATIC_PATH = ROOT / "static"


def load_data() -> pd.DataFrame:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")
    data = pd.read_csv(DATA_PATH)
    required = {"survived", "pclass", "sex", "age", "sibsp", "parch", "fare", "embarked"}
    missing = required.difference(data.columns)
    if missing:
        raise ValueError(f"Titanic.csv is missing required columns: {', '.join(sorted(missing))}")
    data = data.copy()
    data["family_size"] = data["sibsp"] + data["parch"] + 1
    return data


DATA = load_data()
FEATURES = ["pclass", "sex", "age", "family_size", "fare", "embarked"]
if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Saved model not found: {MODEL_PATH}. In VS Code, open Titanic_Basics_Hinglish.ipynb, "
        "select the project Python environment, run all cells from top to bottom, then restart the website. "
        "Titanic_Survival_Analysis.ipynb is the detailed alternative."
    )

model = joblib.load(MODEL_PATH)
saved_features = list(getattr(model, "feature_names_in_", []))
if saved_features != FEATURES:
    raise ValueError(
        "The saved model's input columns do not match the website form. "
        f"Expected {FEATURES}, found {saved_features}. Re-run Titanic_Basics_Hinglish.ipynb from top to bottom."
    )

app = FastAPI(title="Titanic Passenger Outcome Lab", version="1.0.0")
app.mount("/static", StaticFiles(directory=STATIC_PATH), name="static")


class Passenger(BaseModel):
    pclass: int = Field(ge=1, le=3)
    sex: str = Field(pattern="^(male|female)$")
    age: float = Field(ge=0, le=100)
    family_size: int = Field(ge=1, le=20)
    fare: float = Field(ge=0, le=600)
    embarked: str = Field(pattern="^(S|C|Q)$")


@app.get("/")
def home():
    return FileResponse(STATIC_PATH / "index.html")


@app.get("/predict")
def predict_page():
    return FileResponse(STATIC_PATH / "index.html")


@app.get("/explore")
def explore_page():
    return RedirectResponse(url="/#data", status_code=303)


@app.get("/about")
def about_page():
    return RedirectResponse(url="/#about", status_code=303)


@app.get("/api/stats")
def stats():
    overall = DATA["survived"].mean()
    by_class = DATA.groupby("pclass")["survived"].mean().reindex([1, 2, 3])
    by_sex = DATA.groupby("sex")["survived"].mean()
    age_data = DATA.dropna(subset=["age"]).copy()
    age_data["age_band"] = pd.cut(age_data["age"], [-0.001, 12, 18, 30, 45, 60, 100],
    labels=["0–12", "13–18", "19–30", "31–45", "46–60", "60+"])
    by_age = age_data.groupby("age_band", observed=False)["survived"].mean()
    embarked_data = DATA.copy()
    embarked_data["embark_group"] = embarked_data["embarked"].map({"S": "Southampton", "C": "Cherbourg", "Q": "Queenstown"}).fillna("Unknown")
    family_data = DATA.copy()
    family_data["family_group"] = pd.cut(family_data["family_size"], [0, 1, 2, 4, 20],
                                          labels=["Alone", "2 people", "3–4 people", "5+ people"])

    def group_rows(frame, column, labels=None):
        grouped = frame.groupby(column, observed=False, dropna=False)
        rows = []
        for key, group in grouped:
            if pd.isna(key):
                label = "Unknown"
            elif labels:
                label = labels.get(key, str(key))
            else:
                label = str(key)
            rows.append({
                "label": label,
                "passengers": int(len(group)),
                "survived": int(group["survived"].sum()),
                "not_survived": int((group["survived"] == 0).sum()),
                "rate": round(float(group["survived"].mean()) * 100, 1) if len(group) else 0,
            })
        return rows

    dimensions = {
        "class": group_rows(DATA, "pclass", {1: "1st class", 2: "2nd class", 3: "3rd class"}),
        "sex": group_rows(DATA, "sex", {"female": "Women", "male": "Men"}),
        "age": group_rows(age_data, "age_band"),
        "embarked": group_rows(embarked_data, "embark_group"),
        "family": group_rows(family_data, "family_group"),
    }
    missing_values = [{"column": column, "missing": int(DATA[column].isna().sum()),
                       "present": int(DATA[column].notna().sum()),
                       "percent": round(float(DATA[column].isna().mean()) * 100, 1)}
                      for column in DATA.columns if column not in {"", "alive"}]
    return {
        "passengers": int(len(DATA)),
        "survival_rate": round(float(overall) * 100, 1),
        "survived": int(DATA["survived"].sum()),
        "not_survived": int((DATA["survived"] == 0).sum()),
        "missing_age": int(DATA["age"].isna().sum()),
        "by_class": [{"label": f"{i}{'st' if i == 1 else 'nd' if i == 2 else 'rd'} class", "rate": round(float(v) * 100)} for i, v in by_class.items()],
        "by_sex": [{"label": "Women" if k == "female" else "Men", "rate": round(float(v) * 100)} for k, v in by_sex.items()],
        "by_age": [{"label": str(k), "rate": round(float(v) * 100)} for k, v in by_age.items()],
        "groups": dimensions,
        "missing_values": missing_values,
        "features_used": len(FEATURES),
    }


@app.post("/api/predict")
def predict(passenger: Passenger):
    row = pd.DataFrame([passenger.model_dump()])[FEATURES]
    probability = float(model.predict_proba(row)[0, 1])
    return {
        "survival_probability": round(probability * 100, 1),
        "outcome": "Higher likelihood" if probability >= 0.5 else "Lower likelihood",
        "model": type(model.named_steps["model"]).__name__,
        "note": "This is a model estimate based on historical passenger records, not a guarantee.",
    }
