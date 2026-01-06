from src.agents.intent_parser import IntentParserAgent
import json

def test_intent_parser():
    parser = IntentParserAgent()
    
    test_cases = [
        ("delete 3", "en"),
        ("remove id 5", "en"),
        ("id 2 khatham karo", "ur"),
        ("edit 4 title to wash car", "en"),
        ("change id 1 to buy milk", "en"),
        ("update 2 title finish homework", "en"),
        ("done task 1", "en"),
        ("task 1 complete", "en"),
        ("mark 3 as done", "en"),
        ("show tasks", "en"),
        ("kya kaam baqi hai", "ur"),
    ]
    
    print(f"{'Input':<40} | {'Lang':<5} | {'Intent':<15} | {'Params':<30}")
    print("-" * 100)
    
    for case, lang in test_cases:
        result = parser.parse_intent(case, language=lang)
        intent = result.get("intent", "error")
        params = json.dumps(result.get("parameters", {}))
        print(f"{case:<40} | {lang:<5} | {intent:<15} | {params:<30}")

if __name__ == "__main__":
    test_intent_parser()
