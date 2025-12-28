#!/bin/bash
# Comprehensive Application Test Script
# Tests frontend, backend, authentication, and key features

echo "========================================="
echo "  Application Test Suite"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local description="$1"
    local url="$2"
    local expected_status="$3"

    echo -n "Testing: $description... "

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)

    if [ "$response" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $response)"
        ((FAILED++))
    fi
}

# Test function with authentication
test_auth_endpoint() {
    local description="$1"
    local url="$2"
    local expected_status="$3"
    local token="$4"

    echo -n "Testing: $description... "

    response=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $token" "$url" 2>/dev/null)

    if [ "$response" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $response)"
        ((FAILED++))
    fi
}

echo "1. Frontend Tests"
echo "-----------------"
test_endpoint "Homepage" "http://localhost:3000" "200"
test_endpoint "Login page" "http://localhost:3000/login" "200"
test_endpoint "Dashboard page (no auth)" "http://localhost:3000/dashboard" "200"
test_endpoint "English translations" "http://localhost:3000/locales/en.json" "200"
test_endpoint "Urdu translations" "http://localhost:3000/locales/ur.json" "200"
echo ""

echo "2. Backend Health Tests"
echo "----------------------"
test_endpoint "Backend root" "http://localhost:8000" "200"
test_endpoint "API docs" "http://localhost:8000/docs" "200"
echo ""

echo "3. Backend API Tests (Unauthenticated)"
echo "--------------------------------------"
test_endpoint "Tasks endpoint (should require auth)" "http://localhost:8000/api/demo-user/tasks" "401"
test_endpoint "Chat endpoint (should require auth)" "http://localhost:8000/api/demo-user/chat" "401"
echo ""

echo "4. Authentication Test"
echo "---------------------"
echo "Creating test JWT token..."

# Generate a test JWT token using Python
PYTHON_SCRIPT='
import jwt
import time

# Must match backend JWT_SECRET_KEY
secret = "e15c4146e3b3c6828c8aaf9338835fdd08a73160e284b105050fb2f3e4b0f5b4"

payload = {
    "sub": "test-user-12345",
    "id": "test-user-12345",
    "email": "test@example.com",
    "iat": int(time.time()),
    "exp": int(time.time()) + 86400
}

token = jwt.encode(payload, secret, algorithm="HS256")
print(token)
'

if command -v python &> /dev/null; then
    TOKEN=$(python -c "$PYTHON_SCRIPT" 2>/dev/null)
    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}✓ Token generated${NC}"
        ((PASSED++))

        echo ""
        echo "5. Authenticated API Tests"
        echo "-------------------------"
        test_auth_endpoint "Get tasks (with auth)" "http://localhost:8000/api/test-user-12345/tasks" "200" "$TOKEN"

        # Test creating a task
        echo -n "Testing: Create task (with auth)... "
        CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"title":"Test task from script","description":"Testing API"}' \
            "http://localhost:8000/api/test-user-12345/tasks" 2>/dev/null)

        STATUS=$(echo "$CREATE_RESPONSE" | tail -n 1)
        if [ "$STATUS" == "201" ]; then
            echo -e "${GREEN}✓ PASSED${NC} (HTTP $STATUS)"
            ((PASSED++))
        else
            echo -e "${RED}✗ FAILED${NC} (Expected: 201, Got: $STATUS)"
            ((FAILED++))
        fi
    else
        echo -e "${RED}✗ Failed to generate token${NC}"
        ((FAILED++))
        echo -e "${YELLOW}Skipping authenticated tests${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Python not found - skipping auth tests${NC}"
fi

echo ""
echo "========================================="
echo "  Test Summary"
echo "========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
