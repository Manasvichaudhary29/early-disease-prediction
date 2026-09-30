from sqlalchemy.orm import Session
from typing import List, Optional
from .models import User, HealthRecord, Prediction, ModelInformation
from .schemas import UserCreate, HealthRecordCreate
from .utils.auth_utils import get_password_hash

# --- User CRUD ---
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email.lower()).first()

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user_in: UserCreate) -> User:
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        hashed_password=hashed_pwd
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# --- Health Record CRUD ---
def create_health_record(db: Session, record_in: HealthRecordCreate, user_id: str) -> HealthRecord:
    bmi = None
    if record_in.height_cm and record_in.weight_kg and record_in.height_cm > 0:
        height_m = record_in.height_cm / 100.0
        bmi = round(record_in.weight_kg / (height_m * height_m), 2)
        
    db_record = HealthRecord(
        user_id=user_id,
        age=record_in.age,
        gender=record_in.gender,
        height_cm=record_in.height_cm,
        weight_kg=record_in.weight_kg,
        bmi=bmi,
        systolic_bp=record_in.systolic_bp,
        diastolic_bp=record_in.diastolic_bp,
        glucose_fasting=record_in.glucose_fasting,
        total_cholesterol=record_in.total_cholesterol,
        smoker=record_in.smoker or False
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_user_health_records(db: Session, user_id: str, limit: int = 10) -> List[HealthRecord]:
    return db.query(HealthRecord).filter(HealthRecord.user_id == user_id).order_by(HealthRecord.created_at.desc()).limit(limit).all()

# --- Prediction CRUD ---
def create_prediction(
    db: Session,
    user_id: str,
    disease_type: str,
    risk_probability: float,
    risk_category: str,
    input_features: dict,
    shap_summary: list,
    model_version: str = "1.0.0",
    health_record_id: Optional[str] = None
) -> Prediction:
    db_pred = Prediction(
        user_id=user_id,
        health_record_id=health_record_id,
        disease_type=disease_type,
        risk_probability=risk_probability,
        risk_category=risk_category,
        input_features=input_features,
        shap_summary=shap_summary,
        model_version=model_version
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    return db_pred

def get_user_predictions(db: Session, user_id: str, disease_type: Optional[str] = None, limit: int = 50) -> List[Prediction]:
    q = db.query(Prediction).filter(Prediction.user_id == user_id)
    if disease_type:
        q = q.filter(Prediction.disease_type == disease_type.lower())
    return q.order_by(Prediction.created_at.desc()).limit(limit).all()

def get_prediction_by_id(db: Session, prediction_id: str, user_id: str) -> Optional[Prediction]:
    return db.query(Prediction).filter(Prediction.id == prediction_id, Prediction.user_id == user_id).first()
