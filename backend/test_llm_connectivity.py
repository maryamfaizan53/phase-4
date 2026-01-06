import sys
import os
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent))

from src.config import settings
from src.agents.llm_client import llm_client

def test_llm():
    print(f"Testing LLM with provider: {settings.LLM_PROVIDER}")
    print(f"Model: {settings.LLM_MODEL}")
    print("Attempting to generate response...")
    
    try:
        response = llm_client.generate_response(
            system_prompt="You are a helpful assistant.",
            user_message="Say 'LLM is working' if you can read this."
        )
        print(f"Response: {response}")
        if "LLM is working" in response or "working" in response.lower():
            print("SUCCESS: LLM is reachable and responding.")
        else:
            print("FAILURE: LLM returned unexpected response.")
    except Exception as e:
        print(f"FAILURE: LLM call failed with error: {e}")
        import traceback
        traceback.print_exc()

print("Script started...")
if __name__ == "__main__":
    test_llm()
print("Script finished.")
