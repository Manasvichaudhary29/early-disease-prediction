"""
Early Disease Prediction - Model Training v3.0
Clinically calibrated pipelines for Diabetes, Heart Disease, and CKD.

Key fix: CalibratedClassifierCV wraps every model so probabilities are
smooth and continuous (no 0%/100% saturation on borderline inputs).
"""

import os
import json
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix
)

BASE_DIR           = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT       = os.path.dirname(BASE_DIR)
DATASETS_RAW       = os.path.join(PROJECT_ROOT, "datasets", "raw")
DATASETS_PROCESSED = os.path.join(PROJECT_ROOT, "datasets", "processed")
SAVED_MODELS_DIR   = os.path.join(BASE_DIR, "app", "saved_models")

os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
os.makedirs(DATASETS_PROCESSED, exist_ok=True)

N_SAMPLES = 15000


# ---------------------------------------------------------------------------
# 1.  Dataset Generators
# ---------------------------------------------------------------------------

def get_diabetes_data():
    print(f"  Synthesizing Diabetes Cohort ({N_SAMPLES:,} patients)...", flush=True)
    np.random.seed(42)
    n = N_SAMPLES

    age          = np.random.gamma(shape=5.0, scale=8.0, size=n).clip(21, 85).round(0).astype(int)
    preg         = np.where(age < 25, np.random.poisson(0.8, n), np.random.poisson(2.5, n)).clip(0, 15)
    glucose_base = np.random.normal(115, 32, n).clip(65, 250)
    bmi_base     = np.random.normal(27.5, 5.5, n).clip(18, 50)
    dpf_base     = np.random.gamma(2.0, 0.20, n).clip(0.08, 2.2)
    insulin_base = np.random.lognormal(4.5, 0.55, n).clip(15, 500)
    bp_base      = (65.0 + 0.18*age + 0.22*bmi_base + np.random.normal(0, 5, n)).clip(50, 130)
    skin_base    = (10.0 + 0.50*bmi_base + np.random.normal(0, 4, n)).clip(6, 65)

    z = (
        -2.8
        + 0.042 * (glucose_base - 100)
        + 0.072 * (bmi_base - 25)
        + 0.020 * (age - 35)
        + 1.10  * (dpf_base - 0.45)
        + 0.003 * (insulin_base - 80)
        + 0.010 * (bp_base - 75)
        + 0.028 * preg
        + np.random.normal(0, 0.6, n)
    )
    true_prob = 1 / (1 + np.exp(-np.clip(z, -12, 12)))
    outcome   = np.random.binomial(1, true_prob)

    df = pd.DataFrame({
        "Pregnancies":             preg.astype(int),
        "Glucose":                 glucose_base.round(1),
        "BloodPressure":           bp_base.round(1),
        "SkinThickness":           skin_base.round(1),
        "Insulin":                 insulin_base.round(1),
        "BMI":                     bmi_base.round(1),
        "DiabetesPedigreeFunction":dpf_base.round(3),
        "Age":                     age,
        "Outcome":                 outcome
    })
    raw_path = os.path.join(DATASETS_RAW, "diabetes", "diabetes.csv")
    os.makedirs(os.path.dirname(raw_path), exist_ok=True)
    df.to_csv(raw_path, index=False)
    print(f"  Diabetes: {df.shape}  prevalence={df['Outcome'].mean():.1%}")
    return df


def get_heart_data():
    print(f"  Synthesizing Heart Disease Cohort ({N_SAMPLES:,} patients)...", flush=True)
    np.random.seed(42)
    n = N_SAMPLES

    age      = np.random.normal(54, 11, n).clip(22, 85).round(0).astype(int)
    sex      = np.random.choice([0, 1], size=n, p=[0.35, 0.65])
    cp       = np.random.choice([0, 1, 2, 3], size=n, p=[0.24, 0.26, 0.32, 0.18])
    trestbps = (np.random.normal(130, 18, n) + (age - 50)*0.25 + sex*3).clip(90, 200).round(1)
    chol     = (np.random.normal(240, 44, n) + (age - 50)*0.35).clip(120, 500).round(1)
    fbs      = np.random.choice([0, 1], size=n, p=[0.85, 0.15])
    restecg  = np.random.choice([0, 1, 2], size=n, p=[0.52, 0.38, 0.10])
    thalach  = (np.random.normal(150, 22, n) - (age - 50)*0.6).clip(75, 205).round(1)
    exang    = np.random.choice([0, 1], size=n, p=[0.68, 0.32])
    oldpeak  = np.random.exponential(1.0, n).clip(0, 6.0).round(1)
    slope    = np.random.choice([0, 1, 2], size=n, p=[0.42, 0.44, 0.14])
    ca       = np.random.choice([0, 1, 2, 3], size=n, p=[0.58, 0.22, 0.14, 0.06])
    thal     = np.random.choice([1, 2, 3], size=n, p=[0.55, 0.28, 0.17])

    z = (
        -2.0
        + 0.028 * (age - 50)
        + 0.30  * sex
        + 0.75  * (cp == 0)
        + 0.35  * (cp == 1)
        - 0.30  * (cp == 2)
        + 0.012 * (trestbps - 125)
        + 0.004 * (chol - 210)
        + 0.22  * fbs
        + 0.28  * (restecg > 0)
        - 0.018 * (thalach - 150)
        + 0.80  * exang
        + 0.50  * oldpeak
        + 0.22  * (slope == 1) + 0.55 * (slope == 2)
        + 0.50  * ca
        + 0.40  * (thal == 2) + 0.90 * (thal == 3)
        + np.random.normal(0, 0.55, n)
    )
    prob   = 1.0 / (1.0 + np.exp(-np.clip(z, -10, 10)))
    target = np.random.binomial(1, prob)

    df = pd.DataFrame({
        "age": age, "sex": sex, "cp": cp, "trestbps": trestbps, "chol": chol,
        "fbs": fbs, "restecg": restecg, "thalach": thalach, "exang": exang,
        "oldpeak": oldpeak, "slope": slope, "ca": ca, "thal": thal, "target": target
    })
    raw_path = os.path.join(DATASETS_RAW, "heart", "heart.csv")
    os.makedirs(os.path.dirname(raw_path), exist_ok=True)
    df.to_csv(raw_path, index=False)
    print(f"  Heart: {df.shape}  prevalence={df['target'].mean():.1%}")
    return df


def get_kidney_data():
    print(f"  Synthesizing CKD Cohort ({N_SAMPLES:,} patients)...", flush=True)
    np.random.seed(42)
    n = N_SAMPLES

    age  = np.random.normal(53, 15, n).clip(18, 88).round(0).astype(int)
    bp   = np.random.choice([60, 70, 80, 90, 100, 110, 120], n, p=[0.10, 0.35, 0.30, 0.15, 0.06, 0.03, 0.01])
    sg   = np.random.choice([1.005, 1.010, 1.015, 1.020, 1.025], n, p=[0.10, 0.25, 0.35, 0.20, 0.10])
    al   = np.random.choice([0, 1, 2, 3, 4], n, p=[0.55, 0.20, 0.12, 0.08, 0.05])
    su   = np.random.choice([0, 1, 2, 3, 4], n, p=[0.70, 0.14, 0.08, 0.05, 0.03])
    rbc  = np.random.choice(['normal', 'abnormal'], n, p=[0.80, 0.20])
    pc   = np.random.choice(['normal', 'abnormal'], n, p=[0.78, 0.22])
    pcc  = np.random.choice(['notpresent', 'present'], n, p=[0.88, 0.12])
    ba   = np.random.choice(['notpresent', 'present'], n, p=[0.90, 0.10])
    bgr  = np.random.normal(128, 42, n).clip(68, 400).round(1)
    bu   = np.random.normal(45, 24, n).clip(12, 280).round(1)
    sc   = np.random.exponential(1.1, n).clip(0.4, 12.0).round(2)
    sod  = np.random.normal(137, 5, n).clip(115, 150).round(1)
    pot  = np.random.normal(4.5, 0.6, n).clip(2.8, 7.5).round(1)
    hemo = np.random.normal(13.5, 2.4, n).clip(5.0, 18.0).round(1)
    pcv  = (hemo*3.0 + np.random.normal(0, 1.5, n)).clip(15, 54).round(0).astype(int)
    wc   = np.random.normal(8200, 2200, n).clip(3000, 22000).round(0).astype(int)
    rc   = (hemo/3.1 + np.random.normal(0, 0.25, n)).clip(2.2, 6.5).round(1)
    htn  = np.random.choice(['yes', 'no'], n, p=[0.38, 0.62])
    dm   = np.random.choice(['yes', 'no'], n, p=[0.32, 0.68])
    cad  = np.random.choice(['yes', 'no'], n, p=[0.12, 0.88])
    appt = np.random.choice(['good', 'poor'], n, p=[0.80, 0.20])
    pe   = np.random.choice(['yes', 'no'], n, p=[0.18, 0.82])
    ane  = np.random.choice(['yes', 'no'], n, p=[0.16, 0.84])

    z = (
        -2.2
        + 0.020 * (age - 50)
        + 0.015 * (bp - 75)
        - 80    * (sg - 1.018)
        + 0.70  * al
        + 0.35  * su
        + 0.85  * (sc - 1.0)
        + 0.020 * (bu - 35)
        - 0.22  * (hemo - 13.5)
        + 0.55  * (htn == 'yes')
        + 0.50  * (dm == 'yes')
        + 0.40  * (rbc == 'abnormal')
        + 0.40  * (pc == 'abnormal')
        + 0.35  * (pe == 'yes')
        + np.random.normal(0, 0.5, n)
    )
    prob           = 1.0 / (1.0 + np.exp(-np.clip(z, -10, 10)))
    classification = np.random.binomial(1, prob)

    df = pd.DataFrame({
        "age": age, "bp": bp, "sg": sg, "al": al, "su": su,
        "rbc": rbc, "pc": pc, "pcc": pcc, "ba": ba,
        "bgr": bgr, "bu": bu, "sc": sc, "sod": sod, "pot": pot,
        "hemo": hemo, "pcv": pcv, "wc": wc, "rc": rc,
        "htn": htn, "dm": dm, "cad": cad, "appet": appt,
        "pe": pe, "ane": ane, "classification": classification
    })
    raw_path = os.path.join(DATASETS_RAW, "kidney", "kidney.csv")
    os.makedirs(os.path.dirname(raw_path), exist_ok=True)
    df.to_csv(raw_path, index=False)
    print(f"  CKD: {df.shape}  prevalence={df['classification'].mean():.1%}")
    return df


# ---------------------------------------------------------------------------
# 2.  Calibrated Model Evaluation
# ---------------------------------------------------------------------------

def evaluate_models(X_train, y_train, X_test, y_test, preprocessor):
    """
    Trains each candidate wrapped in CalibratedClassifierCV so that
    predict_proba() returns well-spread probabilities (no saturation).
    """
    raw_candidates = {
        "Logistic Regression": LogisticRegression(
            C=0.8, max_iter=2000, solver="lbfgs", random_state=42),
        "Random Forest": RandomForestClassifier(
            n_estimators=200, max_depth=7, min_samples_split=8, min_samples_leaf=4,
            n_jobs=-1, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=120, learning_rate=0.08, max_depth=3,
            subsample=0.8, random_state=42),
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    comparison = {}
    best_name, best_score, best_pipeline = None, -1, None

    for name, raw_clf in raw_candidates.items():
        method = "sigmoid" if name == "Logistic Regression" else "isotonic"
        calibrated = CalibratedClassifierCV(estimator=raw_clf, method=method, cv=3)

        pipe = Pipeline([
            ("preprocessor", preprocessor),
            ("classifier",   calibrated)
        ])
        pipe.fit(X_train, y_train)

        y_pred  = pipe.predict(X_test)
        y_proba = pipe.predict_proba(X_test)[:, 1]

        acc  = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec  = recall_score(y_test, y_pred, zero_division=0)
        f1   = f1_score(y_test, y_pred, zero_division=0)
        roc  = roc_auc_score(y_test, y_proba)
        cm   = confusion_matrix(y_test, y_pred).tolist()
        cv_s = cross_val_score(pipe, X_train, y_train, cv=cv, scoring="roc_auc", n_jobs=-1)

        pmin, pmax, pstd = y_proba.min(), y_proba.max(), y_proba.std()

        comparison[name] = {
            "accuracy":         round(float(acc),  4),
            "precision":        round(float(prec), 4),
            "recall":           round(float(rec),  4),
            "f1_score":         round(float(f1),   4),
            "roc_auc":          round(float(roc),  4),
            "cv_accuracy_mean": round(float(cv_s.mean()), 4),
            "cv_accuracy_std":  round(float(cv_s.std()),  4),
            "confusion_matrix": cm,
        }
        print(f"    [{name:25s}] Acc={acc:.4f} F1={f1:.4f} ROC={roc:.4f} "
              f"P=[{pmin:.2f},{pmax:.2f}] std={pstd:.3f}")

        score = roc * 0.60 + f1 * 0.25 + acc * 0.15
        if score > best_score:
            best_score, best_name, best_pipeline = score, name, pipe

    return best_name, best_pipeline, comparison


# ---------------------------------------------------------------------------
# 3.  Pipeline Builders
# ---------------------------------------------------------------------------

def build_diabetes_pipeline():
    print("\n" + "-"*50)
    print("  DIABETES Prediction Pipeline")
    print("-"*50)

    df       = get_diabetes_data()
    df_clean = df.copy()
    for col in ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]:
        df_clean[col] = df_clean[col].replace(0, np.nan)
    df_clean.to_csv(os.path.join(DATASETS_PROCESSED, "diabetes_clean.csv"), index=False)

    feature_cols = [c for c in df.columns if c != "Outcome"]
    X, y = df_clean[feature_cols], df_clean["Outcome"].astype(int)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=42)

    preprocessor = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler",  StandardScaler())
    ])

    best_name, best_pipe, comparison = evaluate_models(
        X_train, y_train, X_test, y_test, preprocessor)
    print(f"\n  Winner: {best_name}  Acc={comparison[best_name]['accuracy']}  "
          f"ROC={comparison[best_name]['roc_auc']}")

    tp = best_pipe.predict_proba(X_test)[:, 1]
    print(f"  Calibration check -> range=[{tp.min():.3f}, {tp.max():.3f}]  std={tp.std():.3f}")

    joblib.dump(best_pipe, os.path.join(SAVED_MODELS_DIR, "diabetes_pipeline.joblib"))
    raw_pp = best_pipe.named_steps["preprocessor"]
    tr = raw_pp.transform(X_train)
    joblib.dump(tr[:200], os.path.join(SAVED_MODELS_DIR, "diabetes_shap_background.joblib"))
    joblib.dump(list(feature_cols), os.path.join(SAVED_MODELS_DIR, "diabetes_features.joblib"))

    return {
        "disease": "diabetes", "best_algorithm": best_name,
        "features": list(feature_cols),
        "metrics": comparison[best_name], "all_models": comparison
    }


def build_heart_pipeline():
    print("\n" + "-"*50)
    print("  HEART DISEASE Prediction Pipeline")
    print("-"*50)

    df = get_heart_data()
    df.to_csv(os.path.join(DATASETS_PROCESSED, "heart_clean.csv"), index=False)

    feature_cols = [c for c in df.columns if c != "target"]
    X, y = df[feature_cols], df["target"].astype(int)
    num_cols = ["age", "trestbps", "chol", "thalach", "oldpeak"]
    cat_cols = ["sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=42)

    preprocessor = ColumnTransformer([
        ("num", Pipeline([
            ("i", SimpleImputer(strategy="median")),
            ("s", StandardScaler())
        ]), num_cols),
        ("cat", Pipeline([
            ("i", SimpleImputer(strategy="most_frequent")),
            ("e", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
        ]), cat_cols),
    ])

    best_name, best_pipe, comparison = evaluate_models(
        X_train, y_train, X_test, y_test, preprocessor)
    print(f"\n  Winner: {best_name}  Acc={comparison[best_name]['accuracy']}  "
          f"ROC={comparison[best_name]['roc_auc']}")

    tp = best_pipe.predict_proba(X_test)[:, 1]
    print(f"  Calibration check -> range=[{tp.min():.3f}, {tp.max():.3f}]  std={tp.std():.3f}")

    joblib.dump(best_pipe, os.path.join(SAVED_MODELS_DIR, "heart_pipeline.joblib"))
    pf  = best_pipe.named_steps["preprocessor"]
    tr  = pf.transform(X_train)
    cf  = pf.named_transformers_["cat"].named_steps["e"].get_feature_names_out(cat_cols)
    eng = list(num_cols) + list(cf)
    joblib.dump(tr[:200], os.path.join(SAVED_MODELS_DIR, "heart_shap_background.joblib"))
    joblib.dump(list(feature_cols), os.path.join(SAVED_MODELS_DIR, "heart_features.joblib"))
    joblib.dump(eng, os.path.join(SAVED_MODELS_DIR, "heart_engineered_features.joblib"))

    return {
        "disease": "heart", "best_algorithm": best_name,
        "features": list(feature_cols),
        "metrics": comparison[best_name], "all_models": comparison
    }


def build_kidney_pipeline():
    print("\n" + "-"*50)
    print("  CHRONIC KIDNEY DISEASE Prediction Pipeline")
    print("-"*50)

    df = get_kidney_data()
    df.to_csv(os.path.join(DATASETS_PROCESSED, "kidney_clean.csv"), index=False)

    feature_cols = [c for c in df.columns if c != "classification"]
    X, y = df[feature_cols], df["classification"].astype(int)
    num_cols = ["age", "bp", "sg", "al", "su", "bgr", "bu",
                "sc", "sod", "pot", "hemo", "pcv", "wc", "rc"]
    cat_cols = ["rbc", "pc", "pcc", "ba", "htn",
                "dm", "cad", "appet", "pe", "ane"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=42)

    preprocessor = ColumnTransformer([
        ("num", Pipeline([
            ("i", SimpleImputer(strategy="median")),
            ("s", StandardScaler())
        ]), num_cols),
        ("cat", Pipeline([
            ("i", SimpleImputer(strategy="most_frequent")),
            ("e", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
        ]), cat_cols),
    ])

    best_name, best_pipe, comparison = evaluate_models(
        X_train, y_train, X_test, y_test, preprocessor)
    print(f"\n  Winner: {best_name}  Acc={comparison[best_name]['accuracy']}  "
          f"ROC={comparison[best_name]['roc_auc']}")

    tp = best_pipe.predict_proba(X_test)[:, 1]
    print(f"  Calibration check -> range=[{tp.min():.3f}, {tp.max():.3f}]  std={tp.std():.3f}")

    joblib.dump(best_pipe, os.path.join(SAVED_MODELS_DIR, "kidney_pipeline.joblib"))
    pf  = best_pipe.named_steps["preprocessor"]
    tr  = pf.transform(X_train)
    cf  = pf.named_transformers_["cat"].named_steps["e"].get_feature_names_out(cat_cols)
    eng = list(num_cols) + list(cf)
    joblib.dump(tr[:200], os.path.join(SAVED_MODELS_DIR, "kidney_shap_background.joblib"))
    joblib.dump(list(feature_cols), os.path.join(SAVED_MODELS_DIR, "kidney_features.joblib"))
    joblib.dump(eng, os.path.join(SAVED_MODELS_DIR, "kidney_engineered_features.joblib"))

    return {
        "disease": "kidney", "best_algorithm": best_name,
        "features": list(feature_cols),
        "metrics": comparison[best_name], "all_models": comparison
    }


# ---------------------------------------------------------------------------
# 4.  Main
# ---------------------------------------------------------------------------

def main():
    print("="*60)
    print("  Early Disease Prediction - ML Training v3.0")
    print(f"  Samples: {N_SAMPLES:,} per disease | Calibration: ON")
    print("="*60)

    dm = build_diabetes_pipeline()
    hm = build_heart_pipeline()
    km = build_kidney_pipeline()

    all_metrics = {
        "version":   "3.0.0",
        "n_samples": N_SAMPLES,
        "diabetes":  dm,
        "heart":     hm,
        "kidney":    km,
    }

    metrics_path = os.path.join(SAVED_MODELS_DIR, "model_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump(all_metrics, f, indent=2)

    print("\n" + "="*60)
    print("  ALL PIPELINES SAVED")
    print(f"  Diabetes  -> {dm['best_algorithm']:25s} Acc={dm['metrics']['accuracy']:.4f} ROC={dm['metrics']['roc_auc']:.4f}")
    print(f"  Heart     -> {hm['best_algorithm']:25s} Acc={hm['metrics']['accuracy']:.4f} ROC={hm['metrics']['roc_auc']:.4f}")
    print(f"  Kidney    -> {km['best_algorithm']:25s} Acc={km['metrics']['accuracy']:.4f} ROC={km['metrics']['roc_auc']:.4f}")
    print(f"  Output    -> {SAVED_MODELS_DIR}")
    print("="*60)


if __name__ == "__main__":
    main()
