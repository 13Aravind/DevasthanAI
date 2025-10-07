#!/usr/bin/env python3
"""
AI Simulator - Simulates the AI engine that generates crowd data
This script acts as our AI engine, sending random crowd data to the API
"""

import requests
import time
import random
import json
from datetime import datetime

# Configuration
API_BASE_URL = "http://localhost:8000"
LOCATIONS = ["main_entrance", "east_corridor", "west_corridor", "sanctum_sanctorum", "parking_area"]

def generate_crowd_data():
    """Generate realistic crowd data"""
    # Simulate different crowd patterns throughout the day
    current_hour = datetime.now().hour
    
    # Base crowd levels by time of day
    if 6 <= current_hour <= 10:  # Morning rush
        base_count = random.randint(80, 200)
    elif 11 <= current_hour <= 14:  # Midday
        base_count = random.randint(120, 280)
    elif 15 <= current_hour <= 18:  # Afternoon
        base_count = random.randint(100, 250)
    elif 19 <= current_hour <= 22:  # Evening
        base_count = random.randint(60, 180)
    else:  # Night hours
        base_count = random.randint(10, 50)
    
    # Add some randomness
    variation = random.randint(-30, 30)
    person_count = max(0, base_count + variation)
    
    location_id = random.choice(LOCATIONS)
    
    return {
        "location_id": location_id,
        "person_count": person_count
    }

def send_crowd_data():
    """Send crowd data to the API"""
    try:
        crowd_data = generate_crowd_data()
        
        response = requests.post(
            f"{API_BASE_URL}/api/v1/crowd_data",
            json=crowd_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print(f"[AI_SIMULATOR]: Sent crowd data - {crowd_data['person_count']} people at {crowd_data['location_id']}")
        else:
            print(f"[AI_SIMULATOR]: Error sending data - Status: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("[AI_SIMULATOR]: Cannot connect to API server. Make sure the backend is running.")
    except Exception as e:
        print(f"[AI_SIMULATOR]: Error: {e}")

def main():
    """Main simulation loop"""
    print("🤖 AI Simulator starting...")
    print("📡 Sending crowd data to DevasthanAI API every 2-3 seconds")
    print("🛑 Press Ctrl+C to stop")
    print("-" * 50)
    
    try:
        while True:
            send_crowd_data()
            # Wait 2-3 seconds before next update
            time.sleep(random.uniform(2, 3))
            
    except KeyboardInterrupt:
        print("\n🛑 AI Simulator stopped by user")
    except Exception as e:
        print(f"\n❌ AI Simulator error: {e}")

if __name__ == "__main__":
    main()
