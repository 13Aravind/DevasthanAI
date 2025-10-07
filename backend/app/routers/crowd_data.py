from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import CrowdData
from app.schemas import CrowdDataCreate, CrowdData as CrowdDataSchema, LiveData
from app.auth import get_current_admin_user

router = APIRouter(prefix="/api/v1", tags=["crowd_data"])


@router.post("/crowd_data", response_model=CrowdDataSchema)
def create_crowd_data(
    crowd_data: CrowdDataCreate, 
    db: Session = Depends(get_db)
):
    """Receive live crowd count data from AI engine simulator"""
    db_crowd_data = CrowdData(
        location_id=crowd_data.location_id,
        person_count=crowd_data.person_count
    )
    
    db.add(db_crowd_data)
    db.commit()
    db.refresh(db_crowd_data)
    
    # Trigger Sutradhar orchestration logic
    from app.sutradhar import trigger_orchestration
    trigger_orchestration(crowd_data.person_count)
    
    return db_crowd_data


@router.get("/live_data", response_model=LiveData)
def get_live_data(db: Session = Depends(get_db)):
    """Get the latest person count"""
    latest_data = db.query(CrowdData).order_by(desc(CrowdData.timestamp)).first()
    
    if not latest_data:
        # Return default values if no data exists
        return LiveData(
            current_count=0,
            timestamp="2024-01-01T00:00:00Z",
            location_id="main_entrance"
        )
    
    return LiveData(
        current_count=latest_data.person_count,
        timestamp=latest_data.timestamp,
        location_id=latest_data.location_id
    )


@router.get("/crowd_data/history")
def get_crowd_history(
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get historical crowd data (admin only)"""
    history = db.query(CrowdData).order_by(desc(CrowdData.timestamp)).limit(limit).all()
    return history
