# PulsePredict AI — Explainable Machine Learning Early Disease Risk Prediction System

![Project Status](https://img.shields.io/badge/Status-Fully%20Operational-brightgreen?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Explainable AI](https://img.shields.io/badge/XAI-SHAP%20Explainability-FF6F00?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-SQLite%20%7C%20PostgreSQL-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Authentication](https://img.shields.io/badge/Auth-JWT%20%2B%20Bcrypt-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

An end-to-end, clinically grounded artificial intelligence system that predicts early risk for **Diabetes Mellitus**, **Cardiovascular (Heart) Disease**, and **Chronic Kidney Disease (CKD)**. Unlike standard "black-box" classifiers, **PulsePredict AI** integrates **Explainable AI (SHAP)** into every diagnosis, delivering transparent, feature-level clinical attributions and personalized risk stratification directly in your web browser.

---

## 📋 Table of Contents
1. [🌟 Key Highlights & Features](#-key-highlights--features)
2. [🏛️ System Architecture](#️-system-architecture)
3. [🔬 Machine Learning Pipelines & Benchmarks](#-machine-learning-pipelines--benchmarks)
4. [📂 Project Structure](#-project-structure)
5. [⚙️ Prerequisites](#️-prerequisites)
6. [🚀 How to Run in Browser (Step-by-Step)](#-how-to-run-in-browser-step-by-step)
   - [Method 1: One-Click Instant Launch (Recommended for Windows)](#method-1-one-click-instant-launch-recommended-for-windows)
   - [Method 2: Manual Step-by-Step Launch (Windows / macOS / Linux)](#method-2-manual-step-by-step-launch-windows--macos--linux)
   - [Method 3: Retraining ML Models](#method-3-retraining-ml-models)
7. [🖥️ Application Walkthrough & User Guide](#️-application-walkthrough--user-guide)
8. [🔌 REST API Reference & Interactive Swagger Docs](#-rest-api-reference--interactive-swagger-docs)
9. [📚 Academic & College Documentation Hub](#-academic--college-documentation-hub)
10. [🛠️ Troubleshooting & FAQ](#️-troubleshooting--faq)
11. [⚖️ Medical & Ethical Disclaimer](#️-medical--ethical-disclaimer)

---

## 🌟 Key Highlights & Features

- **Multi-Condition Screening**: Three clinically tailored prediction models:
  - **Diabetes Mellitus** (Pima Indians Clinical Cohort)
  - **Cardiovascular Disease** (UCI Cleveland Heart Disease Cohort)
  - **Chronic Kidney Disease** (UCI CKD 24-parameter Clinical Cohort)
- **Transparent Explainable AI (SHAP)**:
  - Every prediction runs through SHAP (SHapley Additive exPlanations) Linear/Tree explainers.
  - Interactive **Feature Contribution Waterfalls** reveal exactly which biometric indicators increased or mitigated the patient's risk.
- **Dynamic Clinical Risk Tiering**:
  - Automatically stratifies risk into **Low Risk (< 30%)**, **Moderate Risk (30% - 60%)**, and **High Risk (> 60%)**.
  - Provides customized clinical lifestyle recommendations, diagnostic follow-ups, and dietary precautions based on the top contributing features.
- **Modern Glassmorphic Dark UI**:
  - High-performance responsive interface built with React 19, Vite, and Lucide Icons.
  - Animated SVG Risk Gauges, micro-interactions, responsive side navigation, and interactive charts.
- **Secure Authentication & Session History**:
  - Secure user registration and login with bcrypt password hashing and JSON Web Tokens (JWT).
  - Private patient assessment history logged to the database for trend tracking over time.
- **Model Evaluation Dashboard**:
  - Dedicated page displaying real-time benchmark metrics (Accuracy, Precision, Recall, F1-Score, ROC-AUC, 5-Fold Cross Validation Mean, Confusion Matrices) for all 5 algorithms tested per disease.

---

## 🏛️ System Architecture

```
                                  ┌───────────────────────────────┐
                                  │      Client Web Browser       │
                                  │   (React 19 + Vite + CSS)     │
                                  │    http://localhost:5173      │
                                  └──────────────┬────────────────┘
                                                 │ HTTP / JSON (REST + Bearer JWT)
                                                 ▼
                                  ┌───────────────────────────────┐
                                  │       FastAPI Backend         │
                                  │    http://localhost:8000      │
                                  │  (Uvicorn ASGI Server)        │
                                  └──────┬───────────────┬────────┘
                                         │               │
                     ┌───────────────────┴──────┐        └───────────────────┐
                     ▼                          ▼                            ▼
        ┌─────────────────────────┐  ┌──────────────────────┐   ┌─────────────────────────┐
        │  Model Registry (ML)    │  │  Explainability (XAI)│   │ Database (SQLAlchemy)   │
        │  - Diabetes Pipeline    │  │  - SHAP Linear/Tree  │   │ - Users Table (Bcrypt)  │
        │  - Heart Pipeline       │  │  - Local Attribution │   │ - Predictions Table     │
        │  - Kidney Pipeline      │  │  - Risk Factor Rank  │   │ - SQLite / PostgreSQL   │
        └─────────────────────────┘  └──────────────────────┘   └─────────────────────────┘
```

---

## 🔬 Machine Learning Pipelines & Benchmarks

Each disease pipeline was trained across 5 algorithms (**Logistic Regression, Decision Tree, Random Forest, Gradient Boosting, Support Vector Machine**) with 5-fold cross-validation, proper imputation of missing and biological zero values, and feature scaling.

### Best Model Performance Summary

| Condition | Selected Best Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC | 5-Fold CV Mean |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Diabetes** | Decision Tree Classifier | **75.97%** | 63.93% | 72.22% | 67.83% | 76.22% | 72.96% |
| **Heart Disease** | Tuned Logistic Regression | **86.89%** | 85.71% | 90.91% | 88.24% | 91.02% | 81.82% |
| **Chronic Kidney (CKD)** | Tuned Logistic Regression | **92.50%** | 94.44% | 77.27% | 85.00% | 96.39% | 92.81% |

### Preprocessing Strategy
1. **Diabetes**: Median imputation on biologically invalid zeroes (Insulin, Skin Thickness, Glucose, Blood Pressure, BMI) followed by Robust/Standard Scaling.
2. **Heart Disease**: Categorical nominal encoding for chest pain type (`cp`), resting ECG (`restecg`), ST slope (`slope`), and thalassemia (`thal`), coupled with continuous feature scaling.
3. **Chronic Kidney Disease (CKD)**: Text normalization (cleaning whitespace and trailing tabs in clinical records), dual categorical/numerical imputation, and Standard Scaling.

---

## 📂 Project Structure

```
Early-disease-prediction/
│
├── README.md                                # Master project documentation & guide
├── IMPLEMENTATION_PLAN.md                   # Full end-to-end technical blueprint
├── COLLEGE_PROJECT_DOCUMENTATION.md         # Academic SRS documentation for college submission
├── TODO.md                                  # Milestone checklist & progress tracking
├── start.ps1                                # One-click startup script (PowerShell)
├── early_disease.db                         # SQLite local database (auto-generated)
│
├── backend/                                 # FastAPI Backend Service
│   ├── requirements.txt                     # Python dependencies
│   ├── datasets/                            # Training clinical datasets
│   │   ├── diabetes.csv
│   │   ├── heart.csv
│   │   └── kidney.csv
│   └── app/
│       ├── main.py                          # FastAPI application entrypoint & middleware
│       ├── config.py                        # App configuration & environment variables
│       ├── database.py                      # SQLAlchemy engine & session manager
│       ├── models.py                        # ORM models (User, PredictionRecord)
│       ├── schemas.py                       # Pydantic v2 validation models
│       ├── crud.py                          # Database query helper functions
│       ├── ml/
│       │   ├── train_models.py              # ML training, cross-validation & SHAP pipeline
│       │   ├── model_loader.py              # Preloaded memory cache for trained models
│       │   └── shap_explainer.py            # SHAP attribution calculation module
│       ├── routes/
│       │   ├── auth.py                      # JWT Register & Login endpoints
│       │   ├── health.py                    # Server liveness & health check
│       │   ├── prediction.py                # Disease prediction & history endpoints
│       │   └── models_meta.py               # Model metrics inspection endpoints
│       ├── saved_models/                    # Trained .joblib pipelines & metrics JSON
│       │   ├── diabetes_model.joblib
│       │   ├── heart_model.joblib
│       │   ├── kidney_model.joblib
│       │   └── model_metrics.json           # Benchmark metrics for all 15 trained models
│       └── utils/
│           └── security.py                  # Password hashing & JWT generation
│
└── frontend/                                # React 19 + Vite Frontend SPA
    ├── index.html                           # HTML5 template (PulsePredict AI)
    ├── package.json                         # Node dependencies & build scripts
    ├── vite.config.js                       # Vite configuration
    └── src/
        ├── main.jsx                         # React root bootstrap
        ├── App.jsx                          # Main router & app shell
        ├── index.css                        # Glassmorphism design system & CSS tokens
        ├── components/
        │   ├── Navbar.jsx                   # Sticky top navigation with auth state
        │   ├── RiskGauge.jsx                # Animated SVG risk probability gauge
        │   ├── ShapWaterfallChart.jsx       # Interactive SHAP feature attribution chart
        │   └── MedicalDisclaimer.jsx        # Clinical warning card
        ├── context/
        │   └── AuthContext.jsx              # Global authentication context & token manager
        ├── pages/
        │   ├── Dashboard.jsx                # Clinical hub & disease quick-start cards
        │   ├── DiabetesPredict.jsx          # Diabetes prediction clinical form & results
        │   ├── HeartPredict.jsx             # Heart disease prediction clinical form & results
        │   ├── KidneyPredict.jsx            # CKD prediction clinical form & results
        │   ├── PredictionHistory.jsx        # Patient historical risk assessment records
        │   ├── ModelMetrics.jsx             # Live model benchmark comparison explorer
        │   ├── Login.jsx                    # User authentication login view
        │   └── Register.jsx                 # User account creation view
        └── services/
            └── api.js                       # Axios/fetch API client with interceptors
```

---

## ⚙️ Prerequisites

Before launching the project, verify that your computer has the following tools installed:

1. **Python 3.10, 3.11, or 3.12**
   - Check with: `python --version` or `py --version`
2. **Node.js (v18.0 or higher) and npm**
   - Check with: `node -v` and `npm -v`
3. **Web Browser**
   - Google Chrome, Microsoft Edge, Brave, Mozilla Firefox, or Safari.

---

## 🚀 How to Run in Browser (Step-by-Step)

### Method 1: One-Click Instant Launch (Recommended for Windows)

The easiest way to start both the backend server and frontend application is using the provided `start.ps1` script:

1. Open **PowerShell** or **Command Prompt** in the project root directory:
   ```powershell
   cd c:\Users\Dell\OneDrive\Desktop\Early-disease-prediction
   ```
2. Execute the startup script:
   ```powershell
   .\start.ps1
   ```
3. **What happens automatically:**
   - Starts the FastAPI backend on `http://localhost:8000`
   - Starts the Vite frontend on `http://localhost:5173`
   - Automatically opens your default web browser to `http://localhost:5173`!

---

### Method 2: Manual Step-by-Step Launch (Windows / macOS / Linux)

If you prefer starting the servers manually in separate terminal windows, follow these three steps:

#### Step 1: Start the Backend (Terminal 1)

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Activate the Python virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\activate
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```
   *(Note: If you are setting up on a new machine without a virtual environment, run `python -m venv venv` followed by `pip install -r requirements.txt`)*

3. Start the FastAPI server with Uvicorn:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
4. Verify the backend is live:
   - API Root: Open `http://localhost:8000/` in your browser. You will see:
     ```json
     {"status":"online","project":"Explainable Early Disease Prediction System","version":"1.0.0"}
     ```
   - Interactive Swagger API Documentation: `http://localhost:8000/docs`

---

#### Step 2: Start the Frontend (Terminal 2)

1. Open a **new, second terminal** window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies (only required on the first setup):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The terminal will display:
   ```
     VITE v8.x.x  ready in 350 ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
   ```

---

#### Step 3: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

You will see the **PulsePredict AI** dashboard ready for predictions!

---

### Method 3: Retraining ML Models

All 12 production model artifacts, preprocessing scalers, encoders, and metrics are already compiled in `backend/app/saved_models/`. However, if you add new data to `backend/datasets/` and want to retrain from scratch:

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   .\venv\Scripts\python.exe app/ml/train_models.py
   ```
2. The script will train and cross-validate all 5 algorithms for each disease, select the best model, compute test set metrics, serialize the `.joblib` pipelines, and update `model_metrics.json`.

---

## 🖥️ Application Walkthrough & User Guide

### 1. User Registration & Sign-In
- Click **Register** on the top navigation bar.
- Create an account with your Name, Email, and Password.
- Once registered, login with your credentials. A secure JWT token is stored in your browser session.

### 2. Clinical Risk Assessment
Select any of the three diseases from the navigation bar or dashboard cards:
- **Diabetes Prediction**:
  - Enter Glucose (mg/dL), Blood Pressure, BMI, Insulin, Age, Pregnancies, Skinfold thickness, and Diabetes Pedigree Function.
  - Quick tip: Preset buttons or reference normal ranges are documented on the form.
- **Heart Disease Prediction**:
  - Enter Age, Sex, Resting Blood Pressure, Cholesterol, Chest Pain Type (Typical, Atypical, Non-anginal, Asymptomatic), Maximum Heart Rate, Exercise Induced Angina, ST Depression, etc.
- **Kidney Disease (CKD) Prediction**:
  - Enter Albumin, Specific Gravity, Blood Glucose, Blood Urea, Serum Creatinine, Hemoglobin, Hypertension status, and other key renal markers.

### 3. Interpreting Results & SHAP Explanations
Click **Analyze Risk**. Within milliseconds, the system renders:
1. **Risk Probability Gauge**: Visual indicator showing exact risk percentage (e.g., `78.4% — High Risk`).
2. **Clinical Interpretation**: Clear summary of what the score indicates.
3. **Interactive SHAP Waterfall Chart**:
   - Red bars identify features that **increased risk** (e.g., elevated Glucose +0.34, High BMI +0.21).
   - Blue bars identify protective features that **decreased risk** (e.g., normal Blood Pressure -0.15).
4. **Actionable Recommendations**: Clinically approved guidance on lifestyle adjustments, specialist consultations, and monitoring.

### 4. Patient History
- Navigate to **History** from the navigation bar to inspect previous predictions, including risk tier, probability, date, and inputs.

### 5. Inspecting Model Metrics
- Navigate to **Model Metrics** to explore live comparative performance tables for all 5 algorithms, accuracy bars, confusion matrices, and ROC-AUC scores.

---

## 🔌 REST API Reference & Interactive Swagger Docs

FastAPI includes automated interactive API documentation:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc UI**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | No | Register a new user account |
| `POST` | `/api/auth/login` | No | Authenticate and obtain JWT Bearer access token |
| `GET` | `/api/auth/me` | Yes | Get profile details for authenticated user |
| `POST` | `/api/predict/diabetes` | Optional | Run Diabetes ML prediction + SHAP explanation |
| `POST` | `/api/predict/heart` | Optional | Run Heart Disease ML prediction + SHAP explanation |
| `POST` | `/api/predict/kidney` | Optional | Run CKD ML prediction + SHAP explanation |
| `GET` | `/api/predict/history` | Yes | Retrieve logged prediction history for the current user |
| `GET` | `/api/models/metrics` | No | Fetch benchmark metrics for all trained models |
| `GET` | `/` | No | Server status, liveness check & supported disease list |
| `POST` | `/api/health-records` | Yes | Store patient biometric health record |
| `GET` | `/api/health-records` | Yes | List patient health records history |

---

## 📚 Academic & College Documentation Hub

This project is prepared in full academic format for university evaluation and submission:

| Document | Purpose |
| :--- | :--- |
| [IMPLEMENTATION_PLAN.md](file:///c:/Users/Dell/OneDrive/Desktop/Early-disease-prediction/IMPLEMENTATION_PLAN.md) | Technical system architecture, dataset specifications, validation schemas, and security design. |
| [COLLEGE_PROJECT_DOCUMENTATION.md](file:///c:/Users/Dell/OneDrive/Desktop/Early-disease-prediction/COLLEGE_PROJECT_DOCUMENTATION.md) | Standard university format SRS report: Problem Statement, Literature Survey, System Requirements, UML Class/Sequence/DFD Diagrams, Algorithms, and Test Cases. |
| [TODO.md](file:///c:/Users/Dell/OneDrive/Desktop/Early-disease-prediction/TODO.md) | Milestone verification checklist tracking development through completion. |
| [College Format Project Plan (DOCX)](file:///c:/Users/Dell/OneDrive/Desktop/Early-disease-prediction/Early_Disease_Prediction_ML_Project_Plan_Proper_College_Format.docx) | Original university project proposal document. |

---

## 🛠️ Troubleshooting & FAQ

### 1. Port 8000 or Port 5173 is already in use
- If another application occupies port 8000, start Uvicorn on another port:
  ```bash
  python -m uvicorn app.main:app --port 8080 --reload
  ```
- Update `frontend/src/services/api.js` if you alter the backend port.

### 2. PowerShell says "Running scripts is disabled on this system"
- If `.\start.ps1` gives an execution policy error, enable local script execution for your session:
  ```powershell
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
  ```
- Then rerun `.\start.ps1`.

### 3. Missing dependencies or module not found
- Ensure you activated the virtual environment in the `backend/` directory (`.\venv\Scripts\activate`) before running python commands.
- Run `pip install -r requirements.txt` to confirm all packages are installed.
- In `frontend/`, run `npm install` to ensure all React packages are installed.

---

## ⚖️ Medical & Ethical Disclaimer

> **IMPORTANT MEDICAL NOTICE**
> 
> **PulsePredict AI** is an artificial intelligence research and educational screening tool developed for academic evaluation. It is **not** a certified medical diagnostic medical device (FDA / CE-IVD approved) and must **never** be used as a standalone substitute for professional medical advice, clinical diagnosis, laboratory testing, or emergency medical treatment. Always consult a qualified physician or healthcare provider regarding any medical symptoms or conditions.

---

<p align="center">
  <b>Developed for Academic Excellence & Transparent Clinical AI</b><br>
  PulsePredict AI &copy; 2026. All rights reserved.
</p>
