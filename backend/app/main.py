from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import get_db, init_db
from app.routers import auth, crowd_data, sos, tickets
from app.websocket import websocket_endpoint, manager
from app.models import User
from app.auth import get_password_hash
import uvicorn
import os # <-- Import the os module to read environment variables

# Create FastAPI app
app = FastAPI(
    title="DevasthanAI API",
    description="AI-powered ecosystem for pilgrimage site management",
    version="1.0.0"
)

# --- UPDATED CORS CONFIGURATION ---
# Start with default origins for local development
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# Get the deployed frontend URL from an environment variable
frontend_url = os.getenv("FRONTEND_URL") 
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use the dynamic list of origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- END OF UPDATED SECTION ---


# Include routers
app.include_router(auth.router)
app.include_router(crowd_data.router)
app.include_router(sos.router)
app.include_router(tickets.router)

# WebSocket endpoint
app.add_websocket_route("/ws/live", websocket_endpoint)


@app.on_event("startup")
async def startup_event():
    """Initialize database and create default admin user"""
    init_db()
    
    # Create default admin user if it doesn't exist
    db = next(get_db())
    admin_user = db.query(User).filter(User.username == "admin").first()
    
    if not admin_user:
        admin_user = User(
            email="admin@devasthanai.com",
            username="admin",
            full_name="System Administrator",
            hashed_password=get_password_hash("admin123"),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print("Default admin user created: username='admin', password='admin123'")
    
    db.close()


@app.get("/")
def read_root():
    """Root endpoint"""
    return {
        "message": "Welcome to DevasthanAI API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/api/v1/prediction_data")
def get_prediction_data():
    """Get mocked prediction data"""
    import json
    
    # Try to load from file, otherwise return mock data
    try:
        with open("prediction_data.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        # Return mock prediction data
        return {
            "predictions": [
                {"timestamp": "2024-01-01T06:00:00Z", "predicted_count": 45, "confidence": 0.85},
                {"timestamp": "2024-01-01T07:00:00Z", "predicted_count": 78, "confidence": 0.82},
                {"timestamp": "2024-01-01T08:00:00Z", "predicted_count": 125, "confidence": 0.88},
                {"timestamp": "2024-01-01T09:00:00Z", "predicted_count": 180, "confidence": 0.90},
                {"timestamp": "2024-01-01T10:00:00Z", "predicted_count": 220, "confidence": 0.87},
                {"timestamp": "2024-01-01T11:00:00Z", "predicted_count": 195, "confidence": 0.85},
                {"timestamp": "2024-01-01T12:00:00Z", "predicted_count": 165, "confidence": 0.83},
                {"timestamp": "2024-01-01T13:00:00Z", "predicted_count": 140, "confidence": 0.80},
                {"timestamp": "2024-01-01T14:00:00Z", "predicted_count": 110, "confidence": 0.78},
                {"timestamp": "2024-01-01T15:00:00Z", "predicted_count": 95, "confidence": 0.82},
                {"timestamp": "2024-01-01T16:00:00Z", "predicted_count": 120, "confidence": 0.85},
                {"timestamp": "2024-01-01T17:00:00Z", "predicted_count": 155, "confidence": 0.88}
            ]
        }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
