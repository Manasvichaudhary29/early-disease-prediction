import os
import json
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any

router = APIRouter(prefix="/models", tags=["Model Registry & Evaluation Metrics"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
METRICS_PATH = os.path.join(BASE_DIR, "saved_models", "model_metrics.json")

@router.get("/metrics")
def get_model_metrics() -> Dict[str, Any]:
    """Returns academic benchmarks, cross-validation metrics, and confusion matrices for all models."""
    if not os.path.exists(METRICS_PATH):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model metrics file not found. Ensure pipelines have been trained."
        )
    try:
        with open(METRICS_PATH, "r") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read model metrics: {str(e)}"
        )
