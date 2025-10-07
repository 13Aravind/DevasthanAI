#!/usr/bin/env python3
"""
Database Setup Script for DevasthanAI
This script sets up the PostgreSQL database with TimescaleDB extension
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from app.config import settings

def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (without specifying database)
        conn = psycopg2.connect(
            host=settings.database_url.split('@')[1].split('/')[0].split(':')[0],
            port=settings.database_url.split('@')[1].split('/')[0].split(':')[1] if ':' in settings.database_url.split('@')[1].split('/')[0] else 5432,
            user=settings.database_url.split('://')[1].split(':')[0],
            password=settings.database_url.split('://')[1].split(':')[1].split('@')[0],
            database='postgres'  # Connect to default postgres database
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Extract database name from URL
        db_name = settings.database_url.split('/')[-1]
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Creating database: {db_name}")
            cursor.execute(f'CREATE DATABASE "{db_name}"')
            print(f"Database '{db_name}' created successfully!")
        else:
            print(f"Database '{db_name}' already exists.")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error creating database: {e}")
        sys.exit(1)

def setup_timescaledb():
    """Setup TimescaleDB extension"""
    try:
        conn = psycopg2.connect(settings.database_url)
        cursor = conn.cursor()
        
        print("Setting up TimescaleDB extension...")
        
        # Enable TimescaleDB extension
        cursor.execute("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;")
        
        # Create crowd_data table with a composite primary key
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS crowd_data (
                id SERIAL,
                timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                location_id VARCHAR(50) NOT NULL,
                person_count INTEGER NOT NULL,
                PRIMARY KEY (id, timestamp)
            );
        """)
        
        # Convert to hypertable
        cursor.execute("""
            SELECT create_hypertable('crowd_data', 'timestamp', if_not_exists => TRUE);
        """)
        
        conn.commit()
        print("TimescaleDB setup completed successfully!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error setting up TimescaleDB: {e}")
        sys.exit(1)

def main():
    """Main setup function"""
    print("🏛️ DevasthanAI Database Setup")
    print("=" * 40)
    
    # Check if database URL is configured
    if "postgresql://username:password@localhost:5432/devasthanai" in settings.database_url:
        print("⚠️  Warning: Using default database URL. Please update your .env file with actual database credentials.")
        print("   Example: DATABASE_URL=postgresql://your_user:your_password@localhost:5432/devasthanai")
        response = input("Continue with default settings? (y/N): ")
        if response.lower() != 'y':
            print("Setup cancelled. Please configure your database URL first.")
            sys.exit(1)
    
    try:
        create_database()
        setup_timescaledb()
        
        print("\n✅ Database setup completed successfully!")
        print("\nNext steps:")
        print("1. Run the backend server: python -m uvicorn app.main:app --reload")
        print("2. Run the AI simulator: python ai_simulator.py")
        print("3. Start the frontend: cd frontend && npm start")
        
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
