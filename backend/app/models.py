import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="patient")
    created_at = Column(DateTime, default=datetime.utcnow)

    health_records = relationship("HealthRecord", back_populates="user", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")


class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    age = Column(Float, nullable=False)
    gender = Column(String(20), nullable=False)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    bmi = Column(Float, nullable=True)
    systolic_bp = Column(Float, nullable=True)
    diastolic_bp = Column(Float, nullable=True)
    glucose_fasting = Column(Float, nullable=True)
    total_cholesterol = Column(Float, nullable=True)
    smoker = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="health_records")
    predictions = relationship("Prediction", back_populates="health_record")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    health_record_id = Column(String(36), ForeignKey("health_records.id"), nullable=True)
    disease_type = Column(String(50), nullable=False)  # diabetes, heart, kidney
    risk_probability = Column(Float, nullable=False)
    risk_category = Column(String(50), nullable=False)  # Low, Moderate, High
    input_features = Column(JSON, nullable=False)
    shap_summary = Column(JSON, nullable=True)
    model_version = Column(String(50), default="1.0.0")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="predictions")
    health_record = relationship("HealthRecord", back_populates="predictions")


class ModelInformation(Base):
    __tablename__ = "model_information"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    disease_type = Column(String(50), nullable=False)
    algorithm = Column(String(100), nullable=False)
    version = Column(String(50), default="1.0.0")
    accuracy = Column(Float, nullable=False)
    precision_score = Column(Float, nullable=False)
    recall_score = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    confusion_matrix = Column(JSON, nullable=True)
    trained_at = Column(DateTime, default=datetime.utcnow)
