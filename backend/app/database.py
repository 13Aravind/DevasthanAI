from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Create the database engine using the URL from your settings
engine = create_engine(settings.database_url)

# Create a configured "Session" class. This will be the class we use to create database sessions.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class for your ORM models to inherit from.
# Any model you create (like CrowdData, User, etc.) will inherit from this class.
Base = declarative_base()


def get_db():
    """
    FastAPI dependency to get a database session for a single request.
    This function creates a new session, yields it to the request,
    and ensures the session is always closed, even if errors occur.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initializes the database on application startup.
    1. Creates all necessary tables based on your SQLAlchemy models.
    2. Enables the TimescaleDB extension in the database.
    3. Converts the 'crowd_data' table into a TimescaleDB hypertable.
    """
    print("Initializing database and setting up TimescaleDB...")
    try:
        # This command connects to the DB and creates the 'crowd_data' table
        # (and any other tables) automatically based on your models.py file.
        Base.metadata.create_all(bind=engine)

        # Now, connect to the database to run TimescaleDB-specific commands
        with engine.connect() as conn:
            # 1. Enable the TimescaleDB extension. We wrap the raw SQL in text().
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;"))
            
            # 2. Convert the 'crowd_data' table to a hypertable.
            #    The manual CREATE TABLE SQL is removed because the line above already handled it.
            conn.execute(text("SELECT create_hypertable('crowd_data', 'timestamp', if_not_exists => TRUE);"))
            
            # 3. Commit the transaction to save the changes.
            conn.commit()
            
        print("✅ Database setup successful!")

    except Exception as e:
        print(f"❌ An error occurred during database initialization: {e}")
        # Re-raising the exception will stop the application from starting if the DB fails, which is good practice.
        raise

