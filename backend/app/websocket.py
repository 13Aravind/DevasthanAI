from fastapi import WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CrowdData, SOSAlert
from app.sutradhar import get_prescriptive_alert
from sqlalchemy import desc
import json
import asyncio
from typing import List


class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket"""
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        """Broadcast a message to all connected WebSockets"""
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove broken connections
                self.active_connections.remove(connection)


manager = ConnectionManager()


async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


async def broadcast_crowd_update(db: Session):
    """Broadcast crowd data update to all connected clients"""
    # Get latest crowd data
    latest_data = db.query(CrowdData).order_by(desc(CrowdData.timestamp)).first()
    
    if latest_data:
        # Get prescriptive alert
        alert = get_prescriptive_alert(latest_data.person_count)
        
        # Prepare message
        message = {
            "type": "crowd_update",
            "data": {
                "current_count": latest_data.person_count,
                "timestamp": latest_data.timestamp.isoformat(),
                "location_id": latest_data.location_id,
                "alert": alert
            }
        }
        
        await manager.broadcast(json.dumps(message))


async def broadcast_sos_alert(sos_alert: SOSAlert):
    """Broadcast new SOS alert to all connected clients"""
    message = {
        "type": "sos_alert",
        "data": {
            "id": sos_alert.id,
            "timestamp": sos_alert.timestamp.isoformat(),
            "location_lat": sos_alert.location_lat,
            "location_lon": sos_alert.location_lon,
            "status": sos_alert.status,
            "description": sos_alert.description
        }
    }
    
    await manager.broadcast(json.dumps(message))
