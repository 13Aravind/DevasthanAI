import hashlib
import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Ticket, User
from app.schemas import TicketCreate, Ticket as TicketSchema
from app.auth import get_current_user

router = APIRouter(prefix="/api/v1", tags=["tickets"])


@router.post("/tickets/book", response_model=TicketSchema)
def book_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Book a darshan slot ticket"""
    # Check if slot is in the future
    if ticket_data.slot_timestamp <= datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Cannot book tickets for past time slots"
        )
    
    # Check if user already has a ticket for this time slot
    existing_ticket = db.query(Ticket).filter(
        Ticket.user_id == current_user.id,
        Ticket.slot_timestamp == ticket_data.slot_timestamp,
        Ticket.status.in_(["booked", "checked_in"])
    ).first()
    
    if existing_ticket:
        raise HTTPException(
            status_code=400,
            detail="You already have a ticket for this time slot"
        )
    
    # Generate unique QR code hash
    qr_data = f"{current_user.id}_{ticket_data.slot_timestamp}_{secrets.token_hex(8)}"
    qr_code_hash = hashlib.sha256(qr_data.encode()).hexdigest()
    
    # Create ticket
    db_ticket = Ticket(
        user_id=current_user.id,
        slot_timestamp=ticket_data.slot_timestamp,
        qr_code_hash=qr_code_hash,
        status="booked"
    )
    
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    return db_ticket


@router.get("/my_tickets")
def get_my_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all tickets for the current user"""
    tickets = db.query(Ticket).filter(
        Ticket.user_id == current_user.id
    ).order_by(Ticket.slot_timestamp.desc()).all()
    
    return tickets


@router.get("/tickets/{ticket_id}")
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific ticket by ID"""
    ticket = db.query(Ticket).filter(
        Ticket.id == ticket_id,
        Ticket.user_id == current_user.id
    ).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return ticket
