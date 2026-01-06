from sqlmodel import Session, create_engine, select
import sys
import os
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent))

from src.config import settings
from src.models.user import User

def check_users():
    print(f"Database URL: {settings.DATABASE_URL}")
    try:
        engine = create_engine(settings.DATABASE_URL)
        with Session(engine) as session:
            statement = select(User)
            users = session.exec(statement).all()
            print(f"Found {len(users)} users.")
            for user in users:
                print(f"User: {user.user_id}, Email: {user.email}")
    except Exception as e:
        print(f"Error checking users: {e}")

if __name__ == "__main__":
    check_users()
