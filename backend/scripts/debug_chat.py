
import sys
import os
from pathlib import Path

# Add src to path
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent
sys.path.append(str(backend_dir))

from src.agents.intent_parser import IntentParserAgent
from src.agents.response_synthesizer import ResponseSynthesizerAgent

def test_intent_parser():
    print("\n=== Testing Intent Parser ===")
    parser = IntentParserAgent()
    
    test_phrases = [
        "Buy milk",
        "Remind me to call John",
        "Delete task 5",
        "Update task 3 to meeting",
        "Show my tasks",
        "Hello",
        "What can you do?",
        "I need to study physics"
    ]
    
    for phrase in test_phrases:
        result = parser.parse_intent(phrase)
        print(f"Input: '{phrase}'")
        print(f"Output: {result}")
        print("-" * 20)

def test_response_synthesizer():
    print("\n=== Testing Response Synthesizer ===")
    # Note: This might fail if API key is missing or invalid
    try:
        synthesizer = ResponseSynthesizerAgent(use_llm=True)
        
        # Test 1: Success result
        tool_result = {"success": True, "message": "Task added successfully", "task": {"id": 1, "title": "Buy milk"}}
        print("Testing Success Response (LLM)...")
        response = synthesizer.synthesize_response(tool_result)
        print(f"Response: {response}")
        
    except Exception as e:
        print(f"Response Synthesizer Error: {e}")

if __name__ == "__main__":
    test_intent_parser()
    # Uncomment to test LLM if you are sure about cost/access
    # test_response_synthesizer()
