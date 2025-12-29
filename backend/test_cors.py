import requests

BASE_URL = "http://localhost:8000/api/auth"

def test_cors():
    print("--- Starting CORS Verification ---")
    
    # 1. Valid Origin
    print("\n[1] Testing Valid Origin (http://localhost:3000)...")
    headers = {"Origin": "http://localhost:3000"}
    resp = requests.options(f"{BASE_URL}/login", headers=headers)
    if "Access-Control-Allow-Origin" in resp.headers:
        print(f"PASS: Valid origin allowed: {resp.headers['Access-Control-Allow-Origin']}")
    else:
        print("FAIL: Valid origin NOT allowed or header missing.")

    # 2. Invalid Origin
    print("\n[2] Testing Invalid Origin (http://malicious-site.com)...")
    headers = {"Origin": "http://malicious-site.com"}
    resp = requests.options(f"{BASE_URL}/login", headers=headers)
    if "Access-Control-Allow-Origin" not in resp.headers or resp.headers.get("Access-Control-Allow-Origin") != "http://malicious-site.com":
         print("PASS: Invalid origin blocked (or not reflected).")
    else:
        print(f"FAIL: Malicious origin allowed: {resp.headers.get('Access-Control-Allow-Origin')}")

    print("\n--- CORS Verification Complete ---")

if __name__ == "__main__":
    test_cors()
