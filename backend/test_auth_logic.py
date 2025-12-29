import requests
import json
import time

BASE_URL = "http://localhost:8000/api/auth"

def test_auth():
    print("--- Starting Auth Verification ---")
    
    # 1. Test Registration (Invalid Password)
    print("\n[1] Testing Registration with weak password...")
    reg_data = {
        "email": "testuser_v1@example.com",
        "password": "simplepassword",
        "full_name": "Test User"
    }
    resp = requests.post(f"{BASE_URL}/register", json=reg_data)
    if resp.status_code == 422:
        print("PASS: Weak password correctly rejected.")
    else:
        print(f"FAIL: Weak password accepted or unexpected status: {resp.status_code}")
        print(resp.json())

    # 2. Test Registration (Valid)
    print("\n[2] Testing Valid Registration...")
    reg_data["password"] = "Password123!"
    resp = requests.post(f"{BASE_URL}/register", json=reg_data)
    if resp.status_code == 201:
        print("PASS: Valid registration successful.")
        data = resp.json()
        access_token = data["access_token"]
        refresh_token = data["refresh_token"]
        user_id = data["user_id"]
    else:
        print(f"FAIL: Registration failed: {resp.status_code}")
        print(resp.json())
        return

    # 3. Test Login
    print("\n[3] Testing Login...")
    login_data = {
        "email": "testuser_v1@example.com",
        "password": "Password123!"
    }
    resp = requests.post(f"{BASE_URL}/login", json=login_data)
    if resp.status_code == 200:
        print("PASS: Login successful.")
        data = resp.json()
        access_token = data["access_token"]
        refresh_token = data["refresh_token"]
    else:
        print(f"FAIL: Login failed: {resp.status_code}")
        return

    # 4. Test Token Refresh (Rotation)
    print("\n[4] Testing Token Refresh (Rotation)...")
    refresh_resp = requests.post(f"{BASE_URL}/refresh", json={"refresh_token": refresh_token})
    if refresh_resp.status_code == 200:
        print("PASS: Token refreshed successfully.")
        new_data = refresh_resp.json()
        new_access_token = new_data["access_token"]
        new_refresh_token = new_data["refresh_token"]
        
        # Test reuse of old refresh token (should fail and revoke all)
        print("Testing reuse of old refresh token (Security Test)...")
        reuse_resp = requests.post(f"{BASE_URL}/refresh", json={"refresh_token": refresh_token})
        if reuse_resp.status_code == 401:
            print("PASS: Reuse of old refresh token correctly rejected.")
        else:
            print(f"FAIL: Reuse of old token accepted: {reuse_resp.status_code}")
            
    else:
        print(f"FAIL: Token refresh failed: {refresh_resp.status_code}")
        print(refresh_resp.json())

    # 5. Test Logout
    print("\n[5] Testing Logout...")
    logout_resp = requests.post(
        f"{BASE_URL}/logout", 
        headers={"Authorization": f"Bearer {new_access_token}"}
    )
    if logout_resp.status_code == 200:
        print("PASS: Logout successful.")
    else:
        print(f"FAIL: Logout failed: {logout_resp.status_code}")

    print("\n--- Auth Verification Complete ---")

if __name__ == "__main__":
    test_auth()
