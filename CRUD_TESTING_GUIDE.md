# CRUD Operations Testing Guide

## Test Environment Status
- ✅ Backend running on port 8000
- ✅ Frontend running on port 3000
- ✅ CORS configured with PATCH support
- ✅ Priority system integrated (urgent, high, medium, low)
- ✅ LLM-powered chatbot with priority extraction

---

## Manual Testing Checklist

### Prerequisites
1. Login to the application at http://localhost:3000/login
2. Note your user ID from localStorage: `localStorage.getItem('auth_user')`
3. Open browser DevTools (F12) → Console for API response inspection
4. Open Network tab to monitor requests/responses

---

## 1. CREATE Operation Tests

### Test 1.1: Create Task with Default Priority (Medium)
**Endpoint:** `POST /api/{user_id}/tasks`
**Test Steps:**
1. Navigate to http://localhost:3000/todos/new
2. Fill in form:
   - Title: "Test task - default priority"
   - Description: "Testing CREATE with default medium priority"
   - Priority: Leave as "Medium" (default)
3. Click "Add Task"
4. **Expected Result:**
   - ✅ Task created with status 201
   - ✅ Task appears in list with 🟡 (yellow) badge
   - ✅ Priority field in database = "medium"

### Test 1.2: Create Task with Urgent Priority
**Test Steps:**
1. Navigate to http://localhost:3000/todos/new
2. Fill in form:
   - Title: "Test urgent task"
   - Description: "Testing CREATE with urgent priority"
   - Priority: Select "Urgent" from dropdown
3. Click "Add Task"
4. **Expected Result:**
   - ✅ Task created with 🔴 (red) badge
   - ✅ Shows "Urgent" in priority selector
   - ✅ Dashboard KPI shows "Urgent Tasks" count increased

### Test 1.3: Create Task with High Priority
**Test Steps:**
1. Create task with priority = "High"
2. **Expected Result:**
   - ✅ Task created with 🟠 (orange) badge

### Test 1.4: Create Task with Low Priority
**Test Steps:**
1. Create task with priority = "Low"
2. **Expected Result:**
   - ✅ Task created with 🟢 (green) badge

### Test 1.5: Create Task via Chatbot (Natural Language)
**Test Steps:**
1. Open chatbot widget (if available) or use chat endpoint
2. Type: "Add an urgent task to fix production bug"
3. **Expected Result:**
   - ✅ Chatbot extracts priority = "urgent"
   - ✅ Task created with title containing "production bug"
   - ✅ Task has 🔴 urgent badge

---

## 2. READ Operation Tests

### Test 2.1: List All Tasks
**Endpoint:** `GET /api/{user_id}/tasks`
**Test Steps:**
1. Navigate to http://localhost:3000/todos
2. **Expected Result:**
   - ✅ All tasks displayed in table
   - ✅ Each task shows priority badge (🔴🟠🟡🟢)
   - ✅ Tasks sorted by creation date (newest first)

### Test 2.2: Filter by Priority
**Test Steps:**
1. Navigate to http://localhost:3000/dashboard
2. Use priority filter dropdown (if available)
3. Select "Urgent"
4. **Expected Result:**
   - ✅ Only urgent tasks (🔴) displayed
   - ✅ URL updates with `?priority=urgent`

### Test 2.3: Filter by Completion Status
**Test Steps:**
1. Dashboard → Status filter
2. Select "Pending"
3. **Expected Result:**
   - ✅ Only uncompleted tasks shown
   - ✅ URL updates with `?completed=false`

### Test 2.4: Search Tasks
**Test Steps:**
1. Dashboard → Search box
2. Type: "production"
3. **Expected Result:**
   - ✅ Only tasks with "production" in title/description shown
   - ✅ Search works case-insensitive

### Test 2.5: Get Single Task
**Endpoint:** `GET /api/{user_id}/tasks/{task_id}`
**Test Steps:**
1. Navigate to http://localhost:3000/todos/{task_id}
2. **Expected Result:**
   - ✅ Task details loaded
   - ✅ Priority displayed correctly
   - ✅ Edit form populated with task data

---

## 3. UPDATE Operation Tests

### Test 3.1: Update Task Title
**Endpoint:** `PUT /api/{user_id}/tasks/{task_id}`
**Test Steps:**
1. Navigate to task edit page: /todos/{task_id}
2. Change title to: "Updated title"
3. Click "Save"
4. **Expected Result:**
   - ✅ Task updated with new title
   - ✅ `updated_at` timestamp changed
   - ✅ Priority remains unchanged

### Test 3.2: Update Task Priority
**Test Steps:**
1. Edit task page
2. Change priority from "Medium" to "High"
3. Click "Save"
4. **Expected Result:**
   - ✅ Priority badge changes from 🟡 to 🟠
   - ✅ Task appears in "High" filter
   - ✅ Dashboard KPI updates (urgent count)

### Test 3.3: Update Task Description
**Test Steps:**
1. Edit task page
2. Change description
3. Click "Save"
4. **Expected Result:**
   - ✅ Description updated
   - ✅ Title and priority unchanged

### Test 3.4: Update Multiple Fields
**Test Steps:**
1. Edit task page
2. Change title, description, AND priority
3. Click "Save"
4. **Expected Result:**
   - ✅ All fields updated atomically
   - ✅ No partial updates

---

## 4. COMPLETE Operation Tests

### Test 4.1: Mark Task as Complete
**Endpoint:** `PATCH /api/{user_id}/tasks/{task_id}/complete`
**Test Steps:**
1. Navigate to /todos or /dashboard
2. Click checkbox next to a pending task
3. **Expected Result:**
   - ✅ Checkbox becomes checked (✓)
   - ✅ Task status changes to "completed"
   - ✅ Dashboard KPI: "Completed Tasks" count increases
   - ✅ Dashboard KPI: "Pending Tasks" count decreases
   - ✅ No CORS errors in browser console

### Test 4.2: Mark Task as Incomplete (Uncheck)
**Test Steps:**
1. Click checkbox next to a completed task
2. **Expected Result:**
   - ✅ Checkbox becomes unchecked (○)
   - ✅ Task status changes to "pending"
   - ✅ Dashboard KPIs update accordingly

### Test 4.3: Toggle Complete on Urgent Task
**Test Steps:**
1. Complete an urgent task
2. **Expected Result:**
   - ✅ Task marked complete
   - ✅ Dashboard KPI: "Urgent Tasks" count decreases
   - ✅ Priority badge still shows 🔴 (priority preserved)

---

## 5. DELETE Operation Tests

### Test 5.1: Delete Task with Confirmation
**Endpoint:** `DELETE /api/{user_id}/tasks/{task_id}`
**Test Steps:**
1. Navigate to /todos or /dashboard
2. Click "Delete" button on a task
3. **Expected Result:**
   - ✅ Confirmation dialog appears
   - ✅ User can cancel or confirm

### Test 5.2: Confirm Delete
**Test Steps:**
1. Click "Delete" → Confirm
2. **Expected Result:**
   - ✅ Task removed from list immediately
   - ✅ HTTP 204 No Content response
   - ✅ Dashboard KPIs update
   - ✅ Total task count decreases

### Test 5.3: Cancel Delete
**Test Steps:**
1. Click "Delete" → Cancel
2. **Expected Result:**
   - ✅ Task remains in list
   - ✅ No API call made

### Test 5.4: Delete Urgent Task
**Test Steps:**
1. Delete an urgent task
2. **Expected Result:**
   - ✅ Task deleted
   - ✅ Dashboard KPI: "Urgent Tasks" count decreases

---

## 6. Integration Tests (End-to-End)

### Test 6.1: Complete CRUD Cycle
**Test Steps:**
1. **CREATE:** Add urgent task "Fix bug"
2. **READ:** View in dashboard, verify 🔴 badge
3. **UPDATE:** Change priority to "High"
4. **READ:** Verify badge changed to 🟠
5. **COMPLETE:** Mark as done
6. **READ:** Verify appears in "Completed" filter
7. **DELETE:** Remove task
8. **READ:** Verify not in list
9. **Expected Result:**
   - ✅ All operations succeed
   - ✅ Dashboard KPIs accurate throughout
   - ✅ No console errors

### Test 6.2: Chatbot + Dashboard Integration
**Test Steps:**
1. Chatbot: "Add urgent task to deploy hotfix"
2. Navigate to dashboard
3. Verify task appears with urgent badge
4. Mark complete via dashboard
5. **Expected Result:**
   - ✅ Chatbot creates task correctly
   - ✅ Dashboard displays task
   - ✅ Toggle complete works
   - ✅ Chatbot and dashboard share same data

### Test 6.3: Priority Filter + Search
**Test Steps:**
1. Create 3 urgent tasks, 2 high, 1 medium
2. Filter by "Urgent"
3. Search for specific keyword
4. **Expected Result:**
   - ✅ Only urgent tasks with keyword shown
   - ✅ Filters combine correctly (AND logic)

---

## 7. Error Handling Tests

### Test 7.1: Create Task with Missing Title
**Test Steps:**
1. Try to create task with empty title
2. **Expected Result:**
   - ✅ Validation error (422)
   - ✅ User-friendly error message
   - ✅ Form doesn't submit

### Test 7.2: Update Non-Existent Task
**Test Steps:**
1. Try to update task ID 999999
2. **Expected Result:**
   - ✅ 404 Not Found error
   - ✅ Error message displayed

### Test 7.3: Delete Already Deleted Task
**Test Steps:**
1. Delete task
2. Try to delete same task again
3. **Expected Result:**
   - ✅ 404 Not Found
   - ✅ Graceful error handling

### Test 7.4: Unauthorized Access
**Test Steps:**
1. Clear localStorage (remove token)
2. Try to access /dashboard
3. **Expected Result:**
   - ✅ Redirect to /login
   - ✅ 401 Unauthorized handled

---

## 8. Performance Tests

### Test 8.1: Load Dashboard with 50+ Tasks
**Test Steps:**
1. Create 50+ tasks via chatbot or form
2. Navigate to dashboard
3. **Expected Result:**
   - ✅ Dashboard loads in < 2 seconds
   - ✅ All charts render correctly
   - ✅ No lag when scrolling task table

### Test 8.2: Rapid Task Creation
**Test Steps:**
1. Create 10 tasks rapidly (< 30 seconds)
2. **Expected Result:**
   - ✅ All tasks created successfully
   - ✅ No race conditions
   - ✅ Dashboard KPIs accurate

### Test 8.3: Priority Filter Performance
**Test Steps:**
1. Filter tasks by priority repeatedly
2. **Expected Result:**
   - ✅ Filter applies instantly (< 100ms)
   - ✅ No network delay (client-side filtering)

---

## 9. Database Verification Tests

### Test 9.1: Check Priority Column
**SQL Query:**
```sql
SELECT id, title, priority, status, created_at
FROM tasks
WHERE user_id = 'your_user_id'
ORDER BY created_at DESC
LIMIT 10;
```
**Expected Result:**
- ✅ Priority column exists
- ✅ Values are: low, medium, high, urgent
- ✅ No NULL priorities (defaults to "medium")

### Test 9.2: Check Priority Distribution
**SQL Query:**
```sql
SELECT priority, COUNT(*) as count
FROM tasks
WHERE user_id = 'your_user_id'
GROUP BY priority;
```
**Expected Result:**
- ✅ All 4 priority levels present (if created)
- ✅ Counts match dashboard KPI

### Test 9.3: Verify Indexes
**SQL Query:**
```sql
\d tasks
-- Or check index list
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'tasks';
```
**Expected Result:**
- ✅ `idx_tasks_user_id` exists
- ✅ `idx_tasks_priority` exists
- ✅ `idx_tasks_user_priority` composite index exists

---

## 10. Browser Compatibility Tests

### Test 10.1: Chrome
**Test Steps:**
1. Run all CRUD operations in Chrome
2. **Expected Result:**
   - ✅ All operations work
   - ✅ No console errors
   - ✅ Glassmorphism renders correctly

### Test 10.2: Firefox
**Test Steps:**
1. Run all CRUD operations in Firefox
2. **Expected Result:**
   - ✅ All operations work
   - ✅ Backdrop-filter (glassmorphism) works

### Test 10.3: Edge
**Test Steps:**
1. Run all CRUD operations in Edge
2. **Expected Result:**
   - ✅ All operations work

---

## Testing Results Summary

| Operation | Status | Notes |
|-----------|--------|-------|
| CREATE (default priority) | ⬜ Not Tested | |
| CREATE (urgent) | ⬜ Not Tested | |
| CREATE (high) | ⬜ Not Tested | |
| CREATE (low) | ⬜ Not Tested | |
| CREATE (via chatbot) | ⬜ Not Tested | |
| READ (list all) | ⬜ Not Tested | |
| READ (filter by priority) | ⬜ Not Tested | |
| READ (filter by status) | ⬜ Not Tested | |
| READ (search) | ⬜ Not Tested | |
| READ (single task) | ⬜ Not Tested | |
| UPDATE (title) | ⬜ Not Tested | |
| UPDATE (priority) | ⬜ Not Tested | |
| UPDATE (description) | ⬜ Not Tested | |
| UPDATE (multiple fields) | ⬜ Not Tested | |
| COMPLETE (mark done) | ⬜ Not Tested | |
| COMPLETE (uncheck) | ⬜ Not Tested | |
| DELETE (with confirmation) | ⬜ Not Tested | |
| DELETE (urgent task) | ⬜ Not Tested | |
| CORS (PATCH requests) | ⬜ Not Tested | |
| Error Handling | ⬜ Not Tested | |
| Database Schema | ⬜ Not Tested | |

---

## Quick API Test Commands

### Test CREATE with curl
```bash
# Get token from browser localStorage
TOKEN="your_jwt_token_here"
USER_ID="your_user_id_here"

# Create urgent task
curl -X POST "http://localhost:8000/api/${USER_ID}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test urgent task via curl",
    "description": "Testing CREATE endpoint",
    "priority": "urgent"
  }'
```

### Test READ with curl
```bash
# List all tasks
curl -X GET "http://localhost:8000/api/${USER_ID}/tasks" \
  -H "Authorization: Bearer ${TOKEN}"

# Filter by priority
curl -X GET "http://localhost:8000/api/${USER_ID}/tasks?priority=urgent" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Test UPDATE with curl
```bash
# Update task priority
TASK_ID="123"
curl -X PUT "http://localhost:8000/api/${USER_ID}/tasks/${TASK_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "high"
  }'
```

### Test COMPLETE with curl
```bash
# Toggle complete (PATCH request)
curl -X PATCH "http://localhost:8000/api/${USER_ID}/tasks/${TASK_ID}/complete" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Test DELETE with curl
```bash
# Delete task
curl -X DELETE "http://localhost:8000/api/${USER_ID}/tasks/${TASK_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## Automated Test Script (PowerShell)

```powershell
# Save this as test-crud-operations.ps1
# Run with: powershell -ExecutionPolicy Bypass -File test-crud-operations.ps1

# Configuration
$API_URL = "http://localhost:8000"
$USER_ID = "test_user_123"
$TOKEN = "your_jwt_token_here"

$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
}

Write-Host "=== CRUD Operations Test Suite ===" -ForegroundColor Cyan

# Test 1: CREATE
Write-Host "`nTest 1: CREATE task with urgent priority..." -ForegroundColor Yellow
$createBody = @{
    title = "Automated test task"
    description = "Testing CREATE endpoint"
    priority = "urgent"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/$USER_ID/tasks" -Method Post -Headers $headers -Body $createBody
    Write-Host "✓ CREATE successful - Task ID: $($response.id)" -ForegroundColor Green
    $TASK_ID = $response.id
} catch {
    Write-Host "✗ CREATE failed: $_" -ForegroundColor Red
}

# Test 2: READ
Write-Host "`nTest 2: READ all tasks..." -ForegroundColor Yellow
try {
    $tasks = Invoke-RestMethod -Uri "$API_URL/api/$USER_ID/tasks" -Method Get -Headers $headers
    Write-Host "✓ READ successful - Found $($tasks.Count) tasks" -ForegroundColor Green
} catch {
    Write-Host "✗ READ failed: $_" -ForegroundColor Red
}

# Test 3: UPDATE
Write-Host "`nTest 3: UPDATE task priority to high..." -ForegroundColor Yellow
$updateBody = @{
    priority = "high"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/$USER_ID/tasks/$TASK_ID" -Method Put -Headers $headers -Body $updateBody
    Write-Host "✓ UPDATE successful - Priority: $($response.priority)" -ForegroundColor Green
} catch {
    Write-Host "✗ UPDATE failed: $_" -ForegroundColor Red
}

# Test 4: COMPLETE
Write-Host "`nTest 4: COMPLETE task..." -ForegroundColor Yellow
$completeBody = @{
    completed = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/$USER_ID/tasks/$TASK_ID/complete" -Method Patch -Headers $headers -Body $completeBody
    Write-Host "✓ COMPLETE successful - Status: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "✗ COMPLETE failed: $_" -ForegroundColor Red
}

# Test 5: DELETE
Write-Host "`nTest 5: DELETE task..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$API_URL/api/$USER_ID/tasks/$TASK_ID" -Method Delete -Headers $headers
    Write-Host "✓ DELETE successful" -ForegroundColor Green
} catch {
    Write-Host "✗ DELETE failed: $_" -ForegroundColor Red
}

Write-Host "`n=== Test Suite Complete ===" -ForegroundColor Cyan
```

---

## Next Steps

1. ✅ Run manual tests using browser
2. ✅ Verify CORS (PATCH requests work without errors)
3. ✅ Test chatbot priority extraction
4. ✅ Check database schema and indexes
5. ✅ Run automated test script (optional)
6. ✅ Document results in this file

**Testing Status:** Ready to begin manual testing

**Tester:** _____________
**Date:** _____________
**Build Version:** v1.0.0 (Task Priority System)
