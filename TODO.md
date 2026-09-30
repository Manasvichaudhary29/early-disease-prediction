# Project TODO & Implementation Checklist

**Project:** Explainable Machine Learning-Based System for Early Disease Risk Prediction  
**Status:** In Progress / Setup  
**Target Completion:** 4–5 Weeks  

---

## 📌 Milestone Overview & Progress Tracker

- [ ] **Phase 1: Environment, Directory Structure & Datasets** (0% Completed)
- [ ] **Phase 2: Exploratory Data Analysis (EDA) & Preprocessing Pipelines** (0% Completed)
- [ ] **Phase 3: Model Training, Evaluation & SHAP Integration** (0% Completed)
- [ ] **Phase 4: FastAPI Backend & PostgreSQL Infrastructure** (0% Completed)
- [ ] **Phase 5: Modern React Frontend Application** (0% Completed)
- [ ] **Phase 6: Full-Stack Integration & End-to-End Testing** (0% Completed)
- [ ] **Phase 7: Security Audit, Documentation & College Viva Prep** (0% Completed)

---

## Detailed Task Breakdown

### Phase 1: Environment Setup, Project Structure & Datasets
- [ ] **1.1 Directory Initialization** `[Priority: High]`
  - [ ] Create `backend/`, `frontend/`, `datasets/raw/`, `datasets/processed/`, `notebooks/`, and `docs/` folders.
  - [ ] Initialize Git repository and create comprehensive `.gitignore` (ignoring `.env`, `node_modules/`, `__pycache__/`, `.joblib` model binaries > 100MB if needed).
- [ ] **1.2 Python Environment Setup** `[Priority: High]`
  - [ ] Create Python virtual environment (`python -m venv venv` or conda).
  - [ ] Create `backend/requirements.txt` with dependencies:
    - Core ML: `scikit-learn`, `xgboost`, `pandas`, `numpy`, `shap`, `joblib`
    - Visualization: `matplotlib`, `seaborn`
    - Backend: `fastapi`, `uvicorn[standard]`, `pydantic`, `sqlalchemy`, `psycopg2-binary`, `python-jose[cryptography]`, `passlib[bcrypt]`, `python-multipart`
    - Testing: `pytest`, `httpx`
- [ ] **1.3 Dataset Acquisition & Curation** `[Priority: High]`
  - [ ] Download Pima Indians Diabetes Dataset into `datasets/raw/diabetes/diabetes.csv`.
  - [ ] Download UCI Heart Disease (Cleveland) Dataset into `datasets/raw/heart/heart.csv`.
  - [ ] Download UCI Chronic Kidney Disease Dataset into `datasets/raw/kidney/kidney.csv`.
  - [ ] Verify MD5/SHA256 checksums, header names, and column types.

---

### Phase 2: Exploratory Data Analysis (EDA) & Preprocessing Pipelines
- [ ] **2.1 Diabetes EDA & Preprocessing Notebook (`notebooks/01_diabetes.ipynb`)** `[Priority: High]`
  - [ ] Inspect missing zero values in `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, and `BMI`.
  - [ ] Replace biologically impossible zero entries with `np.nan`.
  - [ ] Implement `SimpleImputer(strategy='median')` fitted strictly on training data.
  - [ ] Standardize numerical features using `StandardScaler`.
  - [ ] Verify class distribution and export cleaned dataset to `datasets/processed/diabetes_clean.csv`.
- [ ] **2.2 Heart Disease EDA & Preprocessing Notebook (`notebooks/02_heart.ipynb`)** `[Priority: High]`
  - [ ] Check distributions of continuous metrics (`trestbps`, `chol`, `thalach`, `oldpeak`).
  - [ ] Encode categorical variables (`cp`, `restecg`, `slope`, `thal`) using `OneHotEncoder` or ColumnTransformer.
  - [ ] Scale continuous variables using `StandardScaler`.
  - [ ] Export cleaned dataset to `datasets/processed/heart_clean.csv`.
- [ ] **2.3 Chronic Kidney Disease EDA Notebook (`notebooks/03_kidney.ipynb`)** `[Priority: High]`
  - [ ] Clean dirty strings (strip whitespace, trailing tabs like `ckd\t`, typo variants).
  - [ ] Handle missing values (Median imputer for numerical, Mode imputer for categorical).
  - [ ] Encode categorical features and target variable (`ckd` -> 1, `notckd` -> 0).
  - [ ] Export cleaned dataset to `datasets/processed/kidney_clean.csv`.

---

### Phase 3: Model Training, Evaluation & Explainable AI (SHAP)
- [ ] **3.1 Model Benchmarking & Selection** `[Priority: High]`
  - [ ] Train and evaluate 5 candidate classifiers on each dataset using 5-fold Stratified Cross-Validation:
    - Logistic Regression
    - Decision Tree Classifier
    - Random Forest Classifier
    - XGBoost Classifier
    - Support Vector Machine (SVC)
  - [ ] Calculate Accuracy, Precision, Recall/Sensitivity, Specificity, F1-Score, and ROC-AUC.
  - [ ] Plot Confusion Matrices and ROC Curves for all algorithms.
  - [ ] Select best performing model for each disease (prioritizing Recall and ROC-AUC).
- [ ] **3.2 Pipeline Construction & Serialization** `[Priority: High]`
  - [ ] Build end-to-end `sklearn.pipeline.Pipeline` objects containing preprocessing + final estimator.
  - [ ] Serialize pipelines using `joblib.dump()` to `backend/app/saved_models/`:
    - `diabetes_pipeline.joblib`
    - `heart_pipeline.joblib`
    - `kidney_pipeline.joblib`
- [ ] **3.3 Explainability Framework (SHAP)** `[Priority: High]`
  - [ ] Initialize `TreeExplainer` or `KernelExplainer` for each serialized model.
  - [ ] Create helper function to extract local SHAP values for single inference sample.
  - [ ] Format top positive (risk-increasing) and negative (protective) feature contributions into JSON format.

---

### Phase 4: FastAPI Backend & PostgreSQL Infrastructure
- [ ] **4.1 Database Layer (SQLAlchemy & PostgreSQL)** `[Priority: High]`
  - [ ] Configure database connection string and session pool in `backend/app/database.py`.
  - [ ] Define ORM models in `backend/app/models.py`:
    - `User` (id, email, full_name, hashed_password, role, created_at)
    - `HealthRecord` (id, user_id, age, gender, height_cm, weight_kg, bmi, blood_pressure, etc.)
    - `Prediction` (id, user_id, health_record_id, disease_type, risk_probability, risk_category, input_features, shap_summary, model_version, created_at)
    - `ModelInformation` (id, disease_type, algorithm, version, accuracy, precision, recall, f1, roc_auc, trained_at)
  - [ ] Create database migration scripts.
- [ ] **4.2 Authentication & Security** `[Priority: High]`
  - [ ] Implement password hashing and verification using `passlib[bcrypt]`.
  - [ ] Implement JWT generation, signing, and bearer token dependency in `backend/app/utils/auth_utils.py`.
  - [ ] Create `/api/auth/register`, `/api/auth/login`, and `/api/auth/me` endpoints.
- [ ] **4.3 Prediction & Inference Endpoints** `[Priority: High]`
  - [ ] Build Pydantic request schemas with validation bounds in `backend/app/schemas.py`.
  - [ ] Create singleton model loader in `backend/app/ml/model_loader.py`.
  - [ ] Implement endpoints in `backend/app/routes/prediction.py`:
    - `POST /api/predict/diabetes`
    - `POST /api/predict/heart`
    - `POST /api/predict/kidney`
  - [ ] Store each prediction result and SHAP explanation in `predictions` table.
- [ ] **4.4 History & Metadata Endpoints** `[Priority: Medium]`
  - [ ] `GET /api/predictions` (user's past predictions with pagination).
  - [ ] `GET /api/predictions/{id}` (single prediction detail with stored SHAP).
  - [ ] `GET /api/models/metrics` (public route for model evaluation transparency).

---

### Phase 5: Modern React Frontend Application
- [ ] **5.1 Setup & Design Foundation** `[Priority: High]`
  - [ ] Initialize Vite + React project (`frontend/`).
  - [ ] Configure modern CSS design system (curated medical dark/light palette, Inter/Roboto typography).
  - [ ] Install dependencies: `axios`, `lucide-react`, `recharts`, `react-router-dom`.
- [ ] **5.2 Core State & Navigation** `[Priority: High]`
  - [ ] Implement `AuthContext` to persist JWT token, user state, and login/logout handlers.
  - [ ] Create responsive `Navbar` and `Footer` with medical safety badges.
  - [ ] Configure client-side routes with `ProtectedRoute` guards for user dashboard.
- [ ] **5.3 Forms & Interactive Prediction Interfaces** `[Priority: High]`
  - [ ] Build `DiabetesPredict.jsx` form with biological range validation & unit hints.
  - [ ] Build `HeartPredict.jsx` form with clinical dropdowns (Chest pain type, ECG, ST slope).
  - [ ] Build `KidneyPredict.jsx` form with comprehensive renal biomarkers.
- [ ] **5.4 Results & XAI Visualization** `[Priority: High]`
  - [ ] Develop `RiskGauge.jsx`: dynamic speedometer/gauge showing risk probability (0–100%) and tier (Low, Moderate, High).
  - [ ] Develop `ShapWaterfallChart.jsx`: Recharts horizontal bar chart highlighting top risk drivers (Red) vs protective factors (Green).
  - [ ] Add `MedicalDisclaimer.jsx` alert banner on all prediction outputs.
- [ ] **5.5 Dashboard & History Analytics** `[Priority: Medium]`
  - [ ] Develop `Dashboard.jsx` summarizing recent assessments and quick actions.
  - [ ] Develop `PredictionHistory.jsx` with table sorting, disease filtering, and record inspection.
  - [ ] Develop `ModelInfo.jsx` showcasing college-level accuracy tables, confusion matrices, and ROC curves.

---

### Phase 6: System Integration, E2E Testing & Security Hardening
- [ ] **6.1 Automated Testing** `[Priority: High]`
  - [ ] Write unit tests for ML pipeline inference in `backend/tests/test_pipelines.py`.
  - [ ] Write API integration tests for auth and predictions in `backend/tests/test_api.py`.
  - [ ] Verify test suite passes with `pytest`.
- [ ] **6.2 Input Sanitization & Boundary Testing** `[Priority: High]`
  - [ ] Verify handling of out-of-range inputs (e.g., negative age, extreme glucose).
  - [ ] Verify CORS policy blocks unauthorized web origins.
  - [ ] Ensure non-authenticated users cannot access private health records.
- [ ] **6.3 Performance Optimization** `[Priority: Medium]`
  - [ ] Optimize model loading so models are cached in memory upon FastAPI startup (no re-loading per request).
  - [ ] Optimize SHAP computation to complete in $< 500\text{ ms}$.

---

### Phase 7: Academic Documentation, Presentation & College Submission
- [ ] **7.1 Project Documentation Verification** `[Priority: High]`
  - [ ] Verify all chapters in [COLLEGE_PROJECT_DOCUMENTATION.md](file:///c:/Users/Dell/OneDrive/Desktop/Early-disease-prediction/COLLEGE_PROJECT_DOCUMENTATION.md).
  - [ ] Insert finalized empirical evaluation tables from model training into documentation.
  - [ ] Export high-resolution architecture diagrams and ER diagrams for the report.
- [ ] **7.2 Presentation & Viva Deliverables** `[Priority: High]`
  - [ ] Prepare 15–20 slide PowerPoint / PDF presentation:
    - Problem Statement & Clinical Motivation
    - Multi-Pipeline Architecture vs Monolithic Models
    - Dataset Distributions & Preprocessing Innovations
    - Algorithm Comparison & Cross-Validation Results
    - Explainable AI (SHAP) Case Studies
    - Live Demonstration Walkthrough (Screenshots / Video)
    - Medical Ethics, Disclaimers & Future Scope
  - [ ] Create 2-minute recorded demo video of the working application.
- [ ] **7.3 Deployment (Optional / Bonus)** `[Priority: Low]`
  - [ ] Deploy FastAPI backend to Render / Railway.
  - [ ] Deploy PostgreSQL to Supabase / Neon / Render PostgreSQL.
  - [ ] Deploy React frontend to Vercel / Netlify.
  - [ ] Verify live production URL.

---

## 🛠️ Quick Commands Cheatsheet

```bash
# Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend Setup
cd frontend
npm install
npm run dev

# Run Automated Tests
cd backend
pytest -v
```
