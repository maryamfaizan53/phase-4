from sqlmodel import Session, create_engine
import sys
import os
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent))

from src.config import settings
from src.agents.orchestrator import OrchestratorAgent
from src.models.user import User

def test_chat_commands():
    engine = create_engine(settings.DATABASE_URL)
    orchestrator = OrchestratorAgent()
    
    # Use one of the existing users
    user_id = "user_f9f342ced38c"
    
    commands = [
        "add task: buy bread",
        "show my tasks",
        "delete task 3",
        "update task 2 to finish homework"
    ]
    
    with Session(engine) as db:
        for cmd in commands:
            print(f"\nUser: {cmd}")
            try:
                response = orchestrator.process_message(
                    user_id=user_id,
                    message=cmd,
                    conversation_history=[],
                    db=db
                )
                print(f"Assistant: {response}")
            except Exception as e:
                print(f"Assistant Error: {e}")

if __name__ == "__main__":
    test_chat_commands()
