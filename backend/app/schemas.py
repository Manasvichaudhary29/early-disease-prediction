from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# -------------------------------------------------------------
# User & Auth Schemas
# -------------------------------------------------------------

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

# -------------------------------------------------------------
# Health Record Schemas
# -------------------------------------------------------------

class HealthRecordCreate(BaseModel):
    age: float = Field(..., ge=1, le=120)
    gender: str = Field(..., pattern="^(male|female|other)$")
    height_cm: Optional[float] = Field(None, ge=50, le=250)
    weight_kg: Optional[float] = Field(None, ge=10, le=300)
    systolic_bp: Optional[float] = Field(None, ge=60, le=250)
    diastolic_bp: Optional[float] = Field(None, ge=40, le=150)
    glucose_fasting: Optional[float] = Field(None, ge=40, le=400)
    total_cholesterol: Optional[float] = Field(None, ge=80, le=600)
    smoker: Optional[bool] = False

class HealthRecordOut(HealthRecordCreate):
    id: str
    user_id: str
    bmi: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

# -------------------------------------------------------------
# Disease Input Schemas
# -------------------------------------------------------------

class DiabetesInput(BaseModel):
    Pregnancies: int = Field(..., ge=0, le=25, description="Number of pregnancies")
    Glucose: float = Field(..., ge=40, le=300, description="Plasma glucose concentration (mg/dL)")
    BloodPressure: float = Field(..., ge=30, le=200, description="Diastolic blood pressure (mm Hg)")
    SkinThickness: float = Field(..., ge=0, le=100, description="Triceps skin fold thickness (mm)")
    Insulin: float = Field(..., ge=0, le=900, description="2-Hour serum insulin (mu U/ml)")
    BMI: float = Field(..., ge=10, le=75, description="Body Mass Index (weight in kg/(height in m)^2)")
    DiabetesPedigreeFunction: float = Field(..., ge=0.01, le=3.0, description="Diabetes pedigree genetic function score")
    Age: int = Field(..., ge=18, le=120, description="Age in years")


class HeartInput(BaseModel):
    age: int = Field(..., ge=18, le=110, description="Age in years")
    sex: int = Field(..., ge=0, le=1, description="Gender (1 = Male, 0 = Female)")
    cp: int = Field(..., ge=0, le=3, description="Chest pain type (0: typical angina, 1: atypical angina, 2: non-anginal, 3: asymptomatic)")
    trestbps: float = Field(..., ge=80, le=240, description="Resting blood pressure (mm Hg)")
    chol: float = Field(..., ge=100, le=600, description="Serum cholesterol (mg/dL)")
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dL (1 = True, 0 = False)")
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0: normal, 1: ST-T wave abnormality, 2: left ventricular hypertrophy)")
    thalach: float = Field(..., ge=60, le=230, description="Maximum heart rate achieved")
    exang: int = Field(..., ge=0, le=1, description="Exercise induced angina (1 = Yes, 0 = No)")
    oldpeak: float = Field(..., ge=0.0, le=8.0, description="ST depression induced by exercise relative to rest")
    slope: int = Field(..., ge=0, le=2, description="Slope of the peak exercise ST segment (0: upsloping, 1: flat, 2: downsloping)")
    ca: int = Field(..., ge=0, le=3, description="Number of major vessels colored by fluoroscopy (0-3)")
    thal: int = Field(..., ge=1, le=3, description="Thalassemia (1 = normal, 2 = fixed defect, 3 = reversible defect)")


class KidneyInput(BaseModel):
    age: int = Field(..., ge=1, le=110, description="Age in years")
    bp: float = Field(..., ge=50, le=200, description="Blood pressure (mm Hg)")
    sg: float = Field(..., ge=1.000, le=1.035, description="Specific gravity (e.g. 1.005, 1.010, 1.015, 1.020, 1.025)")
    al: int = Field(..., ge=0, le=5, description="Albumin (0 to 5)")
    su: int = Field(..., ge=0, le=5, description="Sugar (0 to 5)")
    rbc: str = Field(..., pattern="^(normal|abnormal)$", description="Red blood cells")
    pc: str = Field(..., pattern="^(normal|abnormal)$", description="Pus cells")
    pcc: str = Field(..., pattern="^(present|notpresent)$", description="Pus cell clumps")
    ba: str = Field(..., pattern="^(present|notpresent)$", description="Bacteria")
    bgr: float = Field(..., ge=20, le=500, description="Blood glucose random (mg/dL)")
    bu: float = Field(..., ge=1.0, le=400, description="Blood urea (mg/dL)")
    sc: float = Field(..., ge=0.1, le=80.0, description="Serum creatinine (mg/dL)")
    sod: float = Field(..., ge=90.0, le=180.0, description="Sodium (mEq/L)")
    pot: float = Field(..., ge=1.0, le=50.0, description="Potassium (mEq/L)")
    hemo: float = Field(..., ge=2.0, le=22.0, description="Hemoglobin (gms)")
    pcv: float = Field(..., ge=10, le=60, description="Packed cell volume")
    wc: float = Field(..., ge=1500, le=35000, description="White blood cell count (cells/cumm)")
    rc: float = Field(..., ge=1.0, le=9.0, description="Red blood cell count (millions/cmm)")
    htn: str = Field(..., pattern="^(yes|no)$", description="Hypertension")
    dm: str = Field(..., pattern="^(yes|no)$", description="Diabetes mellitus")
    cad: str = Field(..., pattern="^(yes|no)$", description="Coronary artery disease")
    appet: str = Field(..., pattern="^(good|poor)$", description="Appetite")
    pe: str = Field(..., pattern="^(yes|no)$", description="Pedal edema")
    ane: str = Field(..., pattern="^(yes|no)$", description="Anemia")

# -------------------------------------------------------------
# Explainability & Prediction Output Schemas
# -------------------------------------------------------------

class ShapFactor(BaseModel):
    feature: str
    display_name: str
    impact: float
    direction: str  # "increases_risk" or "decreases_risk"
    user_value: Any

class PredictionResult(BaseModel):
    prediction_id: str
    disease_type: str
    risk_probability: float
    risk_percentage: float
    risk_category: str  # Low, Moderate, High
    top_factors: List[ShapFactor]
    model_version: str
    created_at: datetime

class PredictionOut(BaseModel):
    id: str
    disease_type: str
    risk_probability: float
    risk_category: str
    input_features: Dict[str, Any]
    shap_summary: Optional[List[Dict[str, Any]]] = None
    model_version: str
    created_at: datetime

    class Config:
        from_attributes = True

class ModelMetricSummary(BaseModel):
    disease: str
    best_algorithm: str
    features: List[str]
    metrics: Dict[str, Any]
    all_models: Dict[str, Any]
