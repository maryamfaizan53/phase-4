import sys
from pathlib import Path

# Add src directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from src.api.dependencies import engine
from src.models import SQLModel, User, Task, Conversation, Message

def init_db():
    print("Creating tables in database...")
    SQLModel.metadata.create_all(engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()
