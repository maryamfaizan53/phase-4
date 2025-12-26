"""Quick test script for backend API endpoints"""
import requests
import json
import sys

# Fix Windows console encoding issues
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("Testing Backend API Endpoints\n" + "="*50)

    # Test health endpoint
    print("\n1. Testing /health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        assert response.status_code == 200
        print("   ✓ Health endpoint working")
    except Exception as e:
        print(f"   ✗ Health endpoint failed: {e}")
        return

    # Register a test user
    print("\n2. Registering test user...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": "dashboard_test@example.com",
                "password": "testpass123",
                "full_name": "Dashboard Test User"
            }
        )
        if response.status_code == 201:
            data = response.json()
            token = data["access_token"]
            user_id = data["user_id"]
            print(f"   Status: {response.status_code}")
            print(f"   User ID: {user_id}")
            print(f"   Token: {token[:20]}...")
            print("   ✓ User registered successfully")
        elif response.status_code == 400 and "already registered" in response.text:
            # User already exists, try logging in
            print("   User already exists, logging in...")
            response = requests.post(
                f"{BASE_URL}/api/auth/login",
                json={
                    "email": "dashboard_test@example.com",
                    "password": "testpass123"
                }
            )
            data = response.json()
            token = data["access_token"]
            user_id = data["user_id"]
            print(f"   Status: {response.status_code}")
            print(f"   User ID: {user_id}")
            print(f"   Token: {token[:20]}...")
            print("   ✓ User logged in successfully")
        else:
            print(f"   ✗ Registration failed: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"   ✗ Registration failed: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # Test GET /api/{user_id}/tasks (should return empty list initially)
    print(f"\n3. Testing GET /api/{user_id}/tasks...")
    try:
        response = requests.get(f"{BASE_URL}/api/{user_id}/tasks", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code != 200:
            print(f"   Error response: {response.text}")
        tasks = response.json()
        print(f"   Tasks count: {len(tasks) if isinstance(tasks, list) else 'N/A'}")
        assert response.status_code == 200
        assert isinstance(tasks, list)
        print("   ✓ GET /tasks endpoint working")
    except Exception as e:
        print(f"   ✗ GET /tasks failed: {e}")
        if 'response' in locals():
            print(f"   Response text: {response.text[:200]}")
        return

    # Test POST /api/{user_id}/tasks (create task)
    print(f"\n4. Testing POST /api/{user_id}/tasks...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/{user_id}/tasks",
            headers=headers,
            json={
                "title": "Test Dashboard Task",
                "description": "This task was created by the endpoint test"
            }
        )
        print(f"   Status: {response.status_code}")
        task = response.json()
        task_id = task["id"]
        print(f"   Created task ID: {task_id}")
        print(f"   Task title: {task['title']}")
        assert response.status_code == 201
        print("   ✓ POST /tasks endpoint working")
    except Exception as e:
        print(f"   ✗ POST /tasks failed: {e}")
        return

    # Test PATCH /api/{user_id}/tasks/{task_id}/complete
    print(f"\n5. Testing PATCH /api/{user_id}/tasks/{task_id}/complete...")
    try:
        response = requests.patch(
            f"{BASE_URL}/api/{user_id}/tasks/{task_id}/complete",
            headers=headers,
            json={"completed": True}
        )
        print(f"   Status: {response.status_code}")
        task = response.json()
        print(f"   Task status: {task.get('status', 'N/A')}")
        assert response.status_code == 200
        print("   ✓ PATCH /complete endpoint working")
    except Exception as e:
        print(f"   ✗ PATCH /complete failed: {e}")
        return

    # Test DELETE /api/{user_id}/tasks/{task_id}
    print(f"\n6. Testing DELETE /api/{user_id}/tasks/{task_id}...")
    try:
        response = requests.delete(
            f"{BASE_URL}/api/{user_id}/tasks/{task_id}",
            headers=headers
        )
        print(f"   Status: {response.status_code}")
        assert response.status_code == 204
        print("   ✓ DELETE /tasks endpoint working")
    except Exception as e:
        print(f"   ✗ DELETE /tasks failed: {e}")
        return

    # Test chat endpoint
    print(f"\n7. Testing POST /api/{user_id}/chat...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/{user_id}/chat",
            headers=headers,
            json={"message": "list my tasks"}
        )
        print(f"   Status: {response.status_code}")
        chat_response = response.json()
        print(f"   Response preview: {chat_response.get('response', '')[:50]}...")
        print(f"   Conversation ID: {chat_response.get('conversation_id', 'N/A')}")
        assert response.status_code == 200
        print("   ✓ Chat endpoint working")
    except Exception as e:
        print(f"   ✗ Chat endpoint failed: {e}")
        return

    print("\n" + "="*50)
    print("✓ All endpoint tests passed!")
    print("="*50)

if __name__ == "__main__":
    test_endpoints()
