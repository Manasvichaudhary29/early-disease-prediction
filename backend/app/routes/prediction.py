from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..schemas import (
    DiabetesInput, HeartInput, KidneyInput,
    PredictionResult, PredictionOut, ShapFactor
)
from ..crud import create_prediction, get_user_predictions, get_prediction_by_id
from ..utils.auth_utils import get_current_user
from ..models import User
from ..ml.model_loader import model_registry

router = APIRouter(prefix="/predict", tags=["Predictions & Risk Assessment"])

@router.post("/diabetes", response_model=PredictionResult)
def predict_diabetes(
    payload: DiabetesInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        input_data = payload.model_dump()
        proba, category, factors, version = model_registry.predict_disease("diabetes", input_data)
        
        # Persist prediction in database
        db_record = create_prediction(
            db=db,
            user_id=current_user.id,
            disease_type="diabetes",
            risk_probability=round(proba, 4),
            risk_category=category,
            input_features=input_data,
            shap_summary=factors,
            model_version=version
        )
        
        return {
            "prediction_id": db_record.id,
            "disease_type": "diabetes",
            "risk_probability": round(proba, 4),
            "risk_percentage": round(proba * 100, 1),
            "risk_category": category,
            "top_factors": factors,
            "model_version": version,
            "created_at": db_record.created_at
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Diabetes risk prediction failed: {str(e)}"
        )


@router.post("/heart", response_model=PredictionResult)
def predict_heart(
    payload: HeartInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        input_data = payload.model_dump()
        proba, category, factors, version = model_registry.predict_disease("heart", input_data)
        
        db_record = create_prediction(
            db=db,
            user_id=current_user.id,
            disease_type="heart",
            risk_probability=round(proba, 4),
            risk_category=category,
            input_features=input_data,
            shap_summary=factors,
            model_version=version
        )
        
        return {
            "prediction_id": db_record.id,
            "disease_type": "heart",
            "risk_probability": round(proba, 4),
            "risk_percentage": round(proba * 100, 1),
            "risk_category": category,
            "top_factors": factors,
            "model_version": version,
            "created_at": db_record.created_at
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Heart disease risk prediction failed: {str(e)}"
        )


@router.post("/kidney", response_model=PredictionResult)
def predict_kidney(
    payload: KidneyInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        input_data = payload.model_dump()
        proba, category, factors, version = model_registry.predict_disease("kidney", input_data)
        
        db_record = create_prediction(
            db=db,
            user_id=current_user.id,
            disease_type="kidney",
            risk_probability=round(proba, 4),
            risk_category=category,
            input_features=input_data,
            shap_summary=factors,
            model_version=version
        )
        
        return {
            "prediction_id": db_record.id,
            "disease_type": "kidney",
            "risk_probability": round(proba, 4),
            "risk_percentage": round(proba * 100, 1),
            "risk_category": category,
            "top_factors": factors,
            "model_version": version,
            "created_at": db_record.created_at
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chronic kidney disease risk prediction failed: {str(e)}"
        )


@router.get("/history", response_model=List[PredictionOut])
def get_history(
    disease: Optional[str] = Query(None, description="Filter by disease (diabetes, heart, kidney)"),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_predictions(db, current_user.id, disease_type=disease, limit=limit)


@router.get("/history/{prediction_id}", response_model=PredictionOut)
def get_prediction_detail(
    prediction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pred = get_prediction_by_id(db, prediction_id, current_user.id)
    if not pred:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found"
        )
    return pred
