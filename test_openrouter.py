import requests
import json
import os
import sys
from pathlib import Path

# Add src to path
sys.path.append(str(Path(__file__).parent / "backend"))

try:
    from backend.src.config import settings
    
    api_key = settings.OPENROUTER_API_KEY or settings.OPENAI_API_KEY
    model = settings.LLM_MODEL
    base_url = settings.LLM_BASE_URL
    
    print(f"Testing model: {model}")
    print(f"Using Base URL: {base_url}")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", # Optional but good
        "X-Title": "Todo AI Chatbot"
    }
    
    data = {
        "model": model,
        "messages": [
            {"role": "user", "content": "Hello"}
        ]
    }
    
    response = requests.post(
        f"{base_url}/chat/completions",
        headers=headers,
        data=json.dumps(data)
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

except Exception as e:
    print(f"Test Error: {e}")
