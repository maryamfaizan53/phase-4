"""Test script for chatbot natural language priority extraction"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from src.agents.intent_parser import IntentParserAgent

def test_priority_extraction():
    """Test priority extraction from natural language"""
    parser = IntentParserAgent(use_llm=False)  # Use rule-based for quick testing

    test_cases = [
        # Urgent priority tests
        ("Add an urgent task to fix production bug", "urgent"),
        ("ASAP: Deploy hotfix to server", "urgent"),
        ("Critical issue - server is down", "urgent"),
        ("Emergency! Fix the payment gateway immediately", "urgent"),
        ("Top priority: Call the CEO right now", "urgent"),

        # High priority tests
        ("Important: Prepare presentation for tomorrow", "high"),
        ("Add high priority task: Submit proposal", "high"),
        ("Crucial meeting with client soon", "high"),
        ("Vital task: Review contract", "high"),
        ("High: Finish quarterly report", "high"),

        # Low priority tests
        ("When I get time, organize my desk", "low"),
        ("Low priority: Clean up old files", "low"),
        ("Minor task: Update documentation", "low"),
        ("Not urgent - just remind me to water plants", "low"),
        ("Whenever you have time, backup photos", "low"),

        # Medium priority tests (default)
        ("Buy groceries", "medium"),
        ("Call mom", "medium"),
        ("Schedule dentist appointment", "medium"),
        ("Read new book", "medium"),
        ("Normal task without keywords", "medium"),
    ]

    print("=" * 80)
    print("CHATBOT PRIORITY EXTRACTION TEST RESULTS")
    print("=" * 80)
    print()

    passed = 0
    failed = 0

    for user_input, expected_priority in test_cases:
        # Extract priority using rule-based method
        actual_priority = parser._extract_priority(user_input.lower())

        status = "PASS" if actual_priority == expected_priority else "FAIL"
        symbol = "[OK]" if actual_priority == expected_priority else "[FAIL]"

        if actual_priority == expected_priority:
            passed += 1
        else:
            failed += 1

        print(f"{symbol} Input: {user_input}")
        print(f"   Expected: {expected_priority} | Actual: {actual_priority} | {status}")
        print()

    print("=" * 80)
    print(f"SUMMARY: {passed} passed, {failed} failed out of {len(test_cases)} tests")
    print(f"Success Rate: {passed / len(test_cases) * 100:.1f}%")
    print("=" * 80)

    return passed, failed

def test_intent_parsing():
    """Test full intent parsing with priority"""
    parser = IntentParserAgent(use_llm=False)

    print("\n" + "=" * 80)
    print("FULL INTENT PARSING TEST")
    print("=" * 80)
    print()

    test_messages = [
        "Add an urgent task to fix the bug in production",
        "Create a high priority task to call the client",
        "Remind me to buy groceries when I get time",
        "I need to finish the report ASAP",
    ]

    for message in test_messages:
        print(f"Input: {message}")
        result = parser.parse_intent(message)
        print(f"Intent: {result.get('intent')}")
        print(f"Priority: {result.get('parameters', {}).get('priority')}")
        print(f"Title: {result.get('parameters', {}).get('title')}")
        print()

if __name__ == "__main__":
    # Test priority extraction
    passed, failed = test_priority_extraction()

    # Test full intent parsing
    test_intent_parsing()

    # Exit with appropriate code
    sys.exit(0 if failed == 0 else 1)
