import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Add the project root (backend folder) to Python path
backend_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_root))

# Load .env file
load_dotenv(backend_root / ".env")

from src.api.dependencies import engine
from src.models import SQLModel, User, Task, Conversation, Message, RefreshToken

def init_db():
    print("Creating tables in database...")
    # This will use the models imported above to create the schema
    SQLModel.metadata.drop_all(engine) # Start fresh
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()
