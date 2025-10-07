from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class User(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Crowd data schemas
class CrowdDataCreate(BaseModel):
    location_id: str
    person_count: int


class CrowdData(CrowdDataCreate):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True


# SOS Alert schemas
class SOSAlertCreate(BaseModel):
    location_lat: float
    location_lon: float
    description: Optional[str] = None


class SOSAlert(SOSAlertCreate):
    id: int
    timestamp: datetime
    status: str
    user_id: Optional[int] = None
    
    class Config:
        from_attributes = True


# Ticket schemas
class TicketCreate(BaseModel):
    slot_timestamp: datetime


class Ticket(TicketCreate):
    id: int
    user_id: int
    qr_code_hash: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Prediction data schema
class PredictionData(BaseModel):
    timestamp: str
    predicted_count: int
    confidence: float


# Live data response
class LiveData(BaseModel):
    current_count: int
    timestamp: datetime
    location_id: str
