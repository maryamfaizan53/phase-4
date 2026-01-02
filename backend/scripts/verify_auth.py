
import requests
import uuid

API_URL = "http://127.0.0.1:8006/api/auth"

def test_login_fails_for_new_user():
    print("Test 1: Login fails for non-existent user (Auto-create disabled)...")
    email = f"test-{uuid.uuid4().hex[:6]}@example.com"
    password = "password123"
    
    response = requests.post(f"{API_URL}/login", json={"email": email, "password": password})
    if response.status_code == 401:
        print("Success: Login failed as expected.")
    else:
        print(f"FAILED: Expected 401, got {response.status_code}. Response: {response.text}")

def test_registration_and_login():
    print("\nTest 2: Registration and subsequent login...")
    email = f"user-{uuid.uuid4().hex[:6]}@example.com"
    password = "password123"
    
    # Register
    reg_response = requests.post(f"{API_URL}/register", json={"email": email, "password": password, "full_name": "Test User"})
    if reg_response.status_code == 201:
        print("Registration successful.")
    else:
        print(f"FAILED: Registration failed with {reg_response.status_code}. Response: {reg_response.text}")
        return

    # Login
    login_response = requests.post(f"{API_URL}/login", json={"email": email, "password": password})
    if login_response.status_code == 200:
        print("Login successful.")
        token = login_response.json().get("access_token")
        if token:
            print("Token received.")
        else:
            print("FAILED: No token in response.")
    else:
        print(f"FAILED: Login failed with {login_response.status_code}. Response: {login_response.text}")

if __name__ == "__main__":
    try:
        test_login_fails_for_new_user()
        test_registration_and_login()
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to backend. Is it running on http://localhost:8000?")
