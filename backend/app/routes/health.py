from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..schemas import HealthRecordCreate, HealthRecordOut
from ..crud import create_health_record, get_user_health_records
from ..utils.auth_utils import get_current_user
from ..models import User

router = APIRouter(prefix="/health-records", tags=["Health Records"])

@router.post("", response_model=HealthRecordOut, status_code=status.HTTP_201_CREATED)
def add_health_record(
    record_in: HealthRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_health_record(db, record_in, current_user.id)

@router.get("", response_model=List[HealthRecordOut])
def list_health_records(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_health_records(db, current_user.id, limit=limit)
