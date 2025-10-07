from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import SOSAlert
from app.schemas import SOSAlertCreate, SOSAlert as SOSAlertSchema
from app.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/api/v1", tags=["sos"])


@router.post("/sos", response_model=SOSAlertSchema)
def create_sos_alert(
    sos_alert: SOSAlertCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create an SOS alert from a pilgrim"""
    db_sos_alert = SOSAlert(
        location_lat=sos_alert.location_lat,
        location_lon=sos_alert.location_lon,
        description=sos_alert.description,
        user_id=current_user.id,
        status="new"
    )
    
    db.add(db_sos_alert)
    db.commit()
    db.refresh(db_sos_alert)
    
    return db_sos_alert


@router.get("/sos_alerts")
def get_sos_alerts(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Get all active SOS alerts (admin only)"""
    alerts = db.query(SOSAlert).filter(
        SOSAlert.status.in_(["new", "acknowledged"])
    ).order_by(desc(SOSAlert.timestamp)).all()
    
    return alerts


@router.put("/sos_alerts/{alert_id}/acknowledge")
def acknowledge_sos_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Acknowledge an SOS alert (admin only)"""
    alert = db.query(SOSAlert).filter(SOSAlert.id == alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="SOS alert not found")
    
    alert.status = "acknowledged"
    db.commit()
    
    return {"message": "SOS alert acknowledged"}


@router.put("/sos_alerts/{alert_id}/resolve")
def resolve_sos_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """Resolve an SOS alert (admin only)"""
    alert = db.query(SOSAlert).filter(SOSAlert.id == alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="SOS alert not found")
    
    alert.status = "resolved"
    db.commit()
    
    return {"message": "SOS alert resolved"}
