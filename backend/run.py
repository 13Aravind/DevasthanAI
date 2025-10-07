#!/usr/bin/env python3
"""
Run script for DevasthanAI Backend
"""

import uvicorn
from app.main import app

if __name__ == "__main__":
    print("🏛️ Starting DevasthanAI Backend Server...")
    print("📡 API Documentation: http://localhost:8000/docs")
    print("🔌 WebSocket: ws://localhost:8000/ws/live")
    print("🛑 Press Ctrl+C to stop")
    print("-" * 50)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
