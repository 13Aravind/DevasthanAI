"""
Sutradhar - The Orchestration Engine
This module contains the rule-based engine that orchestrates responses to crowd data
"""

import json
from typing import Dict, Any


def trigger_orchestration(person_count: int) -> None:
    """
    Trigger orchestration logic based on crowd data
    This is the "brain" that makes intelligent decisions
    """
    print(f"\n[SUTRADHAR]: Processing crowd data - {person_count} pilgrims detected")
    
    # Define thresholds
    LOW_THRESHOLD = 50
    MEDIUM_THRESHOLD = 150
    HIGH_THRESHOLD = 300
    CRITICAL_THRESHOLD = 500
    
    # Rule-based orchestration
    if person_count <= LOW_THRESHOLD:
        print("[SUTRADHAR]: Crowd levels normal. All systems operating smoothly.")
        print("[SUTRADHAR]: Suggestion: Maintain current security deployment.")
        
    elif person_count <= MEDIUM_THRESHOLD:
        print("[SUTRADHAR]: Moderate crowd detected. Initiating standard protocols.")
        print("[SUTRADHAR]: Suggestion: Deploy 1 additional security unit to main entrance.")
        print("[SUTRADHAR]: Sending push notification to pilgrims: 'Temple is moderately busy. Expected wait time: 15-20 minutes.'")
        
    elif person_count <= HIGH_THRESHOLD:
        print("[SUTRADHAR]: High crowd density detected. Activating enhanced protocols.")
        print("[SUTRADHAR]: Suggestion: Deploy 2 additional security units to East Corridor.")
        print("[SUTRADHAR]: Triggering high-traffic alert to police API.")
        print("[SUTRADHAR]: Sending push notification to pilgrims: 'High crowd density. Expected wait time: 30-45 minutes.'")
        print("[SUTRADHAR]: Activating crowd flow optimization algorithms.")
        
    elif person_count <= CRITICAL_THRESHOLD:
        print("[SUTRADHAR]: CRITICAL CROWD LEVELS! Initiating emergency protocols.")
        print("[SUTRADHAR]: Suggestion: Deploy 3 additional security units to all corridors.")
        print("[SUTRADHAR]: Triggering emergency alert to police API and local authorities.")
        print("[SUTRADHAR]: Sending urgent push notification: 'CRITICAL: Temple at capacity. Please wait or return later.'")
        print("[SUTRADHAR]: Activating emergency crowd control measures.")
        print("[SUTRADHAR]: Notifying medical team to be on standby.")
        
    else:
        print("[SUTRADHAR]: EXTREME CROWD LEVELS! Initiating maximum security protocols.")
        print("[SUTRADHAR]: Suggestion: Deploy ALL available security units immediately.")
        print("[SUTRADHAR]: Triggering maximum alert to all emergency services.")
        print("[SUTRADHAR]: Sending critical push notification: 'EMERGENCY: Temple overcrowded. Entry temporarily restricted.'")
        print("[SUTRADHAR]: Activating full emergency response protocol.")
        print("[SUTRADHAR]: Contacting temple management for immediate intervention.")
    
    # Additional intelligent suggestions based on time patterns
    from datetime import datetime
    current_hour = datetime.now().hour
    
    if 6 <= current_hour <= 10:  # Morning rush
        print("[SUTRADHAR]: Morning rush hour detected. Optimizing for peak efficiency.")
    elif 18 <= current_hour <= 22:  # Evening rush
        print("[SUTRADHAR]: Evening rush hour detected. Preparing for increased footfall.")
    elif 22 <= current_hour or current_hour <= 5:  # Night hours
        print("[SUTRADHAR]: Night hours - maintaining minimal security presence.")
    
    print("[SUTRADHAR]: Orchestration complete. All systems updated.\n")


def get_prescriptive_alert(person_count: int) -> Dict[str, Any]:
    """
    Get prescriptive alert message for the dashboard
    """
    if person_count <= 50:
        return {
            "level": "normal",
            "message": "All systems operating smoothly",
            "suggestion": "Maintain current security deployment"
        }
    elif person_count <= 150:
        return {
            "level": "moderate",
            "message": "Moderate crowd detected",
            "suggestion": "Deploy 1 additional security unit to main entrance"
        }
    elif person_count <= 300:
        return {
            "level": "high",
            "message": "High crowd density detected",
            "suggestion": "Deploy 2 additional security units to East Corridor"
        }
    elif person_count <= 500:
        return {
            "level": "critical",
            "message": "CRITICAL crowd levels detected",
            "suggestion": "Deploy 3 additional security units to all corridors"
        }
    else:
        return {
            "level": "extreme",
            "message": "EXTREME crowd levels - Emergency protocols activated",
            "suggestion": "Deploy ALL available security units immediately"
        }
