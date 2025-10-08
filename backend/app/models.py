from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float, PrimaryKeyConstraint
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="pilgrim")  # 'pilgrim' or 'admin'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class CrowdData(Base):
    __tablename__ = "crowd_data"
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    location_id = Column(String(50), nullable=False)
    person_count = Column(Integer, nullable=False)
    
    __table_args__ = (
        PrimaryKeyConstraint('timestamp', 'location_id'),
    )


class SOSAlert(Base):
    __tablename__ = "sos_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    location_lat = Column(Float, nullable=False)
    location_lon = Column(Float, nullable=False)
    status = Column(String, default="new")  # 'new', 'acknowledged', 'resolved'
    user_id = Column(Integer, nullable=True)  # Optional: if we know which user sent it
    description = Column(Text, nullable=True)


class Ticket(Base):
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    slot_timestamp = Column(DateTime(timezone=True), nullable=False)
    qr_code_hash = Column(String, unique=True, nullable=False)
    status = Column(String, default="booked")  # 'booked', 'checked_in', 'expired'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

