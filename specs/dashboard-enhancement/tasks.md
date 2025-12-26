# Implementation Tasks: Dashboard Enhancement

**Feature:** Dashboard Enhancement with Analytics & Chat Integration
**Feature ID:** F001
**Tasks Version:** 1.0
**Created:** 2025-12-24
**Status:** Ready for Implementation

---

## Table of Contents

1. [Task Overview](#task-overview)
2. [Task Dependency Graph](#task-dependency-graph)
3. [Phase 0: Project Setup](#phase-0-project-setup-3-tasks)
4. [Phase 1: Core Utilities](#phase-1-core-utilities-4-tasks)
5. [Phase 2: API Integration](#phase-2-api-integration-2-tasks)
6. [Phase 3: Dashboard Foundation](#phase-3-dashboard-foundation-3-tasks)
7. [Phase 4: KPI Cards](#phase-4-kpi-cards-3-tasks)
8. [Phase 5: Chart Components](#phase-5-chart-components-5-tasks)
9. [Phase 6: Task Table](#phase-6-task-table-4-tasks)
10. [Phase 7: Chat Widget](#phase-7-chat-widget-6-tasks)
11. [Phase 8: Loading & Error States](#phase-8-loading--error-states-3-tasks)
12. [Phase 9: Responsive & Accessibility](#phase-9-responsive--accessibility-4-tasks)
13. [Phase 10: Performance](#phase-10-performance-3-tasks)
14. [Phase 11: Testing & QA](#phase-11-testing--qa-4-tasks)
15. [Phase 12: Deployment](#phase-12-deployment-2-tasks)

**Total Tasks:** 46

---

## Task Overview

### Summary Statistics

| Phase | Tasks | Estimated Complexity |
|-------|-------|---------------------|
| Phase 0: Setup | 3 | Low |
| Phase 1: Utilities | 4 | Low-Medium |
| Phase 2: API | 2 | Low |
| Phase 3: Dashboard | 3 | Medium |
| Phase 4: KPIs | 3 | Low-Medium |
| Phase 5: Charts | 5 | Medium |
| Phase 6: Table | 4 | Medium |
| Phase 7: Chat | 6 | Medium-High |
| Phase 8: Loading | 3 | Low |
| Phase 9: Responsive | 4 | Medium |
| Phase 10: Performance | 3 | Medium |
| Phase 11: Testing | 4 | Medium-High |
| Phase 12: Deployment | 2 | Low |
| **Total** | **46** | **Mixed** |

### Task Complexity Legend

- **Low:** < 2 hours, straightforward implementation
- **Medium:** 2-4 hours, requires some design decisions
- **High:** 4-8 hours, complex integration or multiple dependencies

---

## Task Dependency Graph

```
Phase 0 (Setup)
  ├─ T001 → T002 → T003
  ↓
Phase 1 (Utilities)
  ├─ T004, T005, T006, T007 (parallel)
  ↓
Phase 2 (API)
  ├─ T008 → T009
  ↓
Phase 3 (Dashboard)
  ├─ T010 → T011 → T012
  ↓
Phase 4 (KPIs) + Phase 5 (Charts) + Phase 6 (Table) (parallel)
  ├─ T013 → T014 → T015
  ├─ T016 → T017 → T018 → T019 → T020
  ├─ T021 → T022 → T023 → T024
  ↓
Phase 7 (Chat)
  ├─ T025 → T026 → T027 → T028 → T029 → T030
  ↓
Phase 8 (Loading)
  ├─ T031, T032, T033 (parallel)
  ↓
Phase 9 (Responsive)
  ├─ T034, T035, T036, T037 (parallel)
  ↓
Phase 10 (Performance)
  ├─ T038, T039, T040 (parallel)
  ↓
Phase 11 (Testing)
  ├─ T041, T042, T043, T044 (parallel)
  ↓
Phase 12 (Deployment)
  ├─ T045 → T046
```

**Critical Path:** T001 → T002 → T003 → T010 → T011 → T012 → T025-T030 → T045 → T046

---

## Phase 0: Project Setup (3 Tasks)

### T001: Install Project Dependencies

**Objective:** Install required npm packages for charts and date manipulation.

**Priority:** P0 (Blocker)
**Complexity:** Low
**Dependencies:** None
**Estimated Time:** 15 minutes

**Files to Modify:**
- `frontend/package.json` (add dependencies)
- `frontend/package-lock.json` (auto-generated)

**Implementation Steps:**
1. Navigate to `frontend/` directory
2. Add dependencies to `package.json`:
   ```json
   {
     "dependencies": {
       "recharts": "^2.10.3",
       "date-fns": "^3.0.0"
     }
   }
   ```
3. Run `npm install`
4. Verify installation success

**Expected Outcome:**
- `recharts` and `date-fns` installed in `node_modules/`
- No installation errors
- `package-lock.json` updated

**Validation Criteria:**
- [X] `npm install` completes without errors
- [X] `node_modules/recharts/` directory exists
- [X] `node_modules/date-fns/` directory exists
- [X] Can import packages: `import { format } from 'date-fns'` (test in console)
- [X] No version conflicts reported

**Test Cases:**
```javascript
// Test import in a temporary file
import { format } from 'date-fns';
import { BarChart } from 'recharts';

console.log(format(new Date(), 'yyyy-MM-dd')); // Should print current date
console.log(BarChart); // Should print function/object
```

---

### T002: Verify Backend API Endpoints

**Objective:** Confirm all required backend endpoints are operational and return expected data format.

**Priority:** P0 (Blocker)
**Complexity:** Low
**Dependencies:** None
**Estimated Time:** 30 minutes

**Files to Modify:**
- None (verification only)

**Implementation Steps:**
1. Start backend server (`uvicorn main:app --reload` in backend directory)
2. Test each endpoint using curl or Postman:
   - `GET /health` - Health check
   - `POST /api/{user_id}/chat` - Chat endpoint
   - `GET /api/{user_id}/tasks` - List tasks
   - `POST /api/{user_id}/tasks` - Create task
   - `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion
   - `DELETE /api/{user_id}/tasks/{id}` - Delete task
3. Verify response schemas match expected format
4. Document any schema discrepancies

**Expected Outcome:**
- All endpoints respond with 200/201 status codes
- Task schema matches:
  ```json
  {
    "id": 1,
    "user_id": "user_123",
    "title": "Example task",
    "description": "Description",
    "status": "pending",
    "created_at": "2025-12-24T10:00:00Z",
    "updated_at": "2025-12-24T10:00:00Z"
  }
  ```
- Chat endpoint returns `{ "response": "...", "conversation_id": 123 }`

**Validation Criteria:**
- [ ] Backend server starts without errors
- [ ] `/health` endpoint returns `{"status": "ok"}`
- [ ] Tasks endpoint returns array of tasks
- [ ] Task schema matches expected format (6 fields: id, user_id, title, description, status, created_at, updated_at)
- [ ] Chat endpoint accepts `{ "message": "..." }` and returns response
- [ ] CRUD operations work correctly
- [ ] CORS headers allow frontend origin

**Test Cases:**
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test tasks list
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/user_123/tasks

# Test chat
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <token>" \
  -d '{"message":"list my tasks"}' http://localhost:8000/api/user_123/chat
```

**Acceptance Criteria:**
- All endpoints return expected status codes
- No CORS errors when called from localhost:3000
- Response schemas match documented formats

---

### T003: Create Directory Structure

**Objective:** Set up directory structure for new dashboard components and utilities.

**Priority:** P0 (Blocker)
**Complexity:** Low
**Dependencies:** None
**Estimated Time:** 10 minutes

**Files to Create:**
- `frontend/app/dashboard/` (directory)
- `frontend/components/dashboard/` (directory)
- `frontend/components/chat/` (directory)
- `frontend/lib/` (verify exists, create if needed)
- `frontend/hooks/` (directory)

**Implementation Steps:**
1. Create directories:
   ```bash
   cd frontend
   mkdir -p app/dashboard
   mkdir -p components/dashboard
   mkdir -p components/chat
   mkdir -p hooks
   ```
2. Verify `lib/` directory exists (should already exist)
3. Create `.gitkeep` files if needed to preserve empty directories

**Expected Outcome:**
- All directories created successfully
- Directory structure matches plan

**Validation Criteria:**
- [X] `frontend/app/dashboard/` exists
- [X] `frontend/components/dashboard/` exists
- [X] `frontend/components/chat/` exists
- [X] `frontend/hooks/` exists
- [X] `frontend/lib/` exists (already present)
- [X] No errors during directory creation

**Test Cases:**
```bash
# Verify directories exist
ls -la frontend/app/dashboard
ls -la frontend/components/dashboard
ls -la frontend/components/chat
ls -la frontend/hooks
```

**Acceptance Criteria:**
- All directories created
- Structure ready for component development

---

## Phase 1: Core Utilities (4 Tasks)

### T004: Create Analytics Utility Functions

**Objective:** Implement utility functions for KPI calculations and chart data transformations.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** T001 (date-fns installed)
**Estimated Time:** 2 hours

**Files to Create:**
- `frontend/lib/analytics.js`

**Implementation Steps:**
1. Create `lib/analytics.js`
2. Implement `calculateKPIs(tasks)`:
   - Count total tasks
   - Count completed tasks (status === 'completed')
   - Count pending tasks (status === 'pending')
   - Count overdue tasks (pending + created > 7 days ago)
3. Implement `getStatusDistribution(tasks)`:
   - Return `[{ name: "Pending", value: N }, { name: "Completed", value: M }]`
4. Implement `getTimeSeriesData(tasks, days = 7)`:
   - Group tasks by created_at date (last 7 days)
   - Count tasks created per day
   - Count tasks completed per day (if updated_at date differs from created_at and status is completed)
   - Return `[{ date: "Dec 18", created: N, completed: M }, ...]`
5. Implement `getStatusBreakdown(tasks)`:
   - Return `[{ status: "pending", count: N }, { status: "completed", count: M }]`
6. Add JSDoc comments for all functions

**Expected Outcome:**
- `lib/analytics.js` created with 4 exported functions
- All functions handle edge cases (empty arrays, null values)
- Functions return expected data structures

**Validation Criteria:**
- [X] File created at `frontend/lib/analytics.js`
- [X] `calculateKPIs` function exported and documented
- [X] `getStatusDistribution` function exported and documented
- [X] `getTimeSeriesData` function exported and documented
- [X] `getStatusBreakdown` function exported and documented
- [X] Functions handle empty task arrays gracefully
- [X] Overdue calculation uses 7-day threshold correctly
- [X] Time-series data covers last 7 days

**Test Cases:**
```javascript
import { calculateKPIs, getStatusDistribution, getTimeSeriesData, getStatusBreakdown } from './analytics';

// Test with empty array
const emptyKPIs = calculateKPIs([]);
expect(emptyKPIs).toEqual({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, overdueTasks: 0 });

// Test with sample tasks
const tasks = [
  { id: 1, status: 'pending', created_at: '2025-12-24T10:00:00Z', updated_at: '2025-12-24T10:00:00Z' },
  { id: 2, status: 'completed', created_at: '2025-12-20T10:00:00Z', updated_at: '2025-12-24T10:00:00Z' },
  { id: 3, status: 'pending', created_at: '2025-12-10T10:00:00Z', updated_at: '2025-12-10T10:00:00Z' }, // Overdue
];

const kpis = calculateKPIs(tasks);
expect(kpis.totalTasks).toBe(3);
expect(kpis.completedTasks).toBe(1);
expect(kpis.pendingTasks).toBe(2);
expect(kpis.overdueTasks).toBe(1); // Task 3 is > 7 days old

const distribution = getStatusDistribution(tasks);
expect(distribution).toEqual([
  { name: 'Pending', value: 2 },
  { name: 'Completed', value: 1 }
]);
```

**Acceptance Criteria:**
- All test cases pass
- Functions return correct data structures
- Edge cases handled (empty arrays, null dates)

---

### T005: Create Date Helper Functions

**Objective:** Implement date manipulation and formatting utilities.

**Priority:** P1 (High)
**Complexity:** Low-Medium
**Dependencies:** T001 (date-fns installed)
**Estimated Time:** 1.5 hours

**Files to Create:**
- `frontend/lib/date-helpers.js`

**Implementation Steps:**
1. Create `lib/date-helpers.js`
2. Implement `formatDate(dateString)`:
   - Convert ISO 8601 to human-readable format
   - "Today" for today's date
   - "Yesterday" for yesterday
   - "2d ago" for 2 days ago (up to 7 days)
   - "Dec 24, 2025" for > 7 days ago
3. Implement `isOverdue(createdAt, thresholdDays = 7)`:
   - Check if date is older than threshold
   - Return boolean
4. Implement `groupTasksByDate(tasks, dateField = 'created_at')`:
   - Group tasks by date (ignoring time)
   - Return `{ "2025-12-24": [...], "2025-12-23": [...] }`
5. Implement `getLast7Days()`:
   - Return array of last 7 dates in "MMM dd" format
   - Example: `["Dec 18", "Dec 19", ..., "Dec 24"]`
6. Add JSDoc comments

**Expected Outcome:**
- `lib/date-helpers.js` created with 4 exported functions
- All functions use `date-fns` for date manipulation
- Timezone handling is consistent (UTC)

**Validation Criteria:**
- [X] File created at `frontend/lib/date-helpers.js`
- [X] `formatDate` function exported and handles all date ranges
- [X] `isOverdue` function correctly identifies dates > threshold
- [X] `groupTasksByDate` groups tasks by date correctly
- [X] `getLast7Days` returns correct date array
- [X] All functions use `date-fns` utilities
- [X] Functions handle invalid dates gracefully

**Test Cases:**
```javascript
import { formatDate, isOverdue, groupTasksByDate, getLast7Days } from './date-helpers';

// Test formatDate
const today = new Date().toISOString();
expect(formatDate(today)).toBe('Today');

const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
expect(formatDate(twoDaysAgo)).toBe('2d ago');

const oldDate = '2025-01-01T10:00:00Z';
expect(formatDate(oldDate)).toBe('Jan 1, 2025');

// Test isOverdue
const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
expect(isOverdue(eightDaysAgo, 7)).toBe(true);

const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
expect(isOverdue(threeDaysAgo, 7)).toBe(false);

// Test getLast7Days
const days = getLast7Days();
expect(days).toHaveLength(7);
expect(days[6]).toContain('Dec'); // Last element is today
```

**Acceptance Criteria:**
- All test cases pass
- Date formatting is user-friendly
- Timezone handling is consistent

---

### T006: Create Chart Utility Functions

**Objective:** Implement chart configuration and formatting utilities for Recharts.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T001 (recharts installed)
**Estimated Time:** 1 hour

**Files to Create:**
- `frontend/lib/chart-utils.js`

**Implementation Steps:**
1. Create `lib/chart-utils.js`
2. Define `CHART_COLORS` constant:
   ```javascript
   export const CHART_COLORS = {
     pending: '#fbbf24',   // yellow-400
     completed: '#34d399', // green-400
     overdue: '#f87171',   // red-400
     primary: '#14b8a6',   // brand-500
     secondary: '#5eead4', // brand-300
   };
   ```
3. Implement `formatChartNumber(value)`:
   - Format numbers for chart labels (e.g., 1000 → "1K", 1500 → "1.5K")
   - Return original number if < 1000
4. Implement `getChartTooltipConfig()`:
   - Return Recharts tooltip configuration object
   - Dark theme with glassmorphism
5. Add JSDoc comments

**Expected Outcome:**
- `lib/chart-utils.js` created with exported constants and functions
- Color palette matches brand colors
- Tooltip styling matches design system

**Validation Criteria:**
- [X] File created at `frontend/lib/chart-utils.js`
- [X] `CHART_COLORS` constant exported with 5 colors
- [X] `formatChartNumber` function formats numbers correctly
- [X] `getChartTooltipConfig` returns valid Recharts config
- [X] Colors match Tailwind theme colors

**Test Cases:**
```javascript
import { CHART_COLORS, formatChartNumber, getChartTooltipConfig } from './chart-utils';

// Test colors
expect(CHART_COLORS.pending).toBe('#fbbf24');
expect(CHART_COLORS.completed).toBe('#34d399');

// Test number formatting
expect(formatChartNumber(500)).toBe(500);
expect(formatChartNumber(1000)).toBe('1K');
expect(formatChartNumber(1500)).toBe('1.5K');
expect(formatChartNumber(1000000)).toBe('1M');

// Test tooltip config
const tooltipConfig = getChartTooltipConfig();
expect(tooltipConfig).toHaveProperty('contentStyle');
expect(tooltipConfig.contentStyle.backgroundColor).toContain('rgba');
```

**Acceptance Criteria:**
- All test cases pass
- Colors are accessible (contrast ratio ≥ 4.5:1)
- Tooltip styling is consistent with design system

---

### T007: Write Unit Tests for Utilities

**Objective:** Create comprehensive unit tests for all utility functions.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** T004, T005, T006
**Estimated Time:** 2 hours

**Files to Create:**
- `frontend/lib/__tests__/analytics.test.js`
- `frontend/lib/__tests__/date-helpers.test.js`
- `frontend/lib/__tests__/chart-utils.test.js`

**Implementation Steps:**
1. Set up Jest test environment (if not already configured)
2. Write tests for `analytics.js`:
   - Test `calculateKPIs` with various task sets
   - Test edge cases (empty array, null values, missing fields)
   - Test `getStatusDistribution`, `getTimeSeriesData`, `getStatusBreakdown`
3. Write tests for `date-helpers.js`:
   - Test `formatDate` with various date ranges
   - Test `isOverdue` with different thresholds
   - Test `groupTasksByDate` and `getLast7Days`
4. Write tests for `chart-utils.js`:
   - Test `formatChartNumber` with various numbers
   - Verify `CHART_COLORS` values
   - Test `getChartTooltipConfig` structure
5. Run tests and verify 100% coverage for utility files

**Expected Outcome:**
- All test files created with comprehensive test cases
- All tests pass
- Code coverage ≥ 90% for utility files

**Validation Criteria:**
- [ ] Test files created in `lib/__tests__/` directory
- [ ] All utility functions have test coverage
- [ ] Edge cases tested (empty arrays, null values, invalid inputs)
- [ ] All tests pass (`npm test`)
- [ ] Code coverage report shows ≥ 90% coverage for utility files

**Test Cases:**
See individual task test cases (T004, T005, T006) for specific test scenarios.

**Acceptance Criteria:**
- `npm test` runs without errors
- All tests pass
- Coverage report meets target

---

## Phase 2: API Integration (2 Tasks)

### T008: Extend API Client with Chat Methods

**Objective:** Add chat API methods to existing API client.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T002 (API verified)
**Estimated Time:** 30 minutes

**Files to Modify:**
- `frontend/lib/api.js` (add chatAPI object)

**Implementation Steps:**
1. Open `lib/api.js`
2. Add `chatAPI` object after `tasksAPI`:
   ```javascript
   export const chatAPI = {
     /**
      * Send message to chat endpoint
      * @param {string} userId
      * @param {string} message - User message
      * @returns {Promise<Object>} { response, conversation_id }
      */
     sendMessage: async (userId, message) => {
       return apiRequest(`/api/${userId}/chat`, {
         method: 'POST',
         body: JSON.stringify({ message }),
       });
     },
   };
   ```
3. Add JSDoc comments
4. Test with manual API call

**Expected Outcome:**
- `chatAPI.sendMessage` method added to `lib/api.js`
- Method uses existing `apiRequest` helper
- Proper error handling inherited from `apiRequest`

**Validation Criteria:**
- [X] `chatAPI` object exported from `lib/api.js`
- [X] `sendMessage` method implemented
- [X] JSDoc comments added
- [X] Method signature matches: `sendMessage(userId, message)`
- [X] Returns promise that resolves to `{ response, conversation_id }`
- [X] Uses existing `apiRequest` helper (no duplicate code)

**Test Cases:**
```javascript
import { chatAPI } from './api';

// Test chat API call (manual test with backend running)
async function testChat() {
  try {
    const response = await chatAPI.sendMessage('user_123', 'list my tasks');
    console.log('Response:', response.response);
    console.log('Conversation ID:', response.conversation_id);
    expect(response).toHaveProperty('response');
    expect(response).toHaveProperty('conversation_id');
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Acceptance Criteria:**
- Manual test succeeds with backend running
- Response format matches expected structure
- Error handling works correctly

---

### T009: Test Chat API Integration

**Objective:** Verify chat API integration works end-to-end with backend.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T008
**Estimated Time:** 30 minutes

**Files to Modify:**
- None (testing only)

**Implementation Steps:**
1. Start backend server
2. Create test script or use browser console
3. Test `chatAPI.sendMessage` with various messages:
   - "list my tasks"
   - "add task: test task"
   - "complete task 1"
4. Verify responses are correct
5. Test error scenarios:
   - Invalid user ID
   - Network failure
   - Invalid message format
6. Document any issues found

**Expected Outcome:**
- Chat API successfully communicates with backend
- Responses are received and parsed correctly
- Error handling works as expected

**Validation Criteria:**
- [ ] Chat message sends successfully
- [ ] Response received with `response` and `conversation_id` fields
- [ ] Task-related commands work (add, list, complete)
- [ ] Error handling works (network errors, 401, 403, 500)
- [ ] CORS headers allow frontend requests
- [ ] Authorization header is sent correctly

**Test Cases:**
```javascript
// Test successful message
await chatAPI.sendMessage('user_123', 'list my tasks');
// Expected: { response: "You have 5 tasks...", conversation_id: 123 }

// Test task creation
await chatAPI.sendMessage('user_123', 'add task: buy groceries');
// Expected: { response: "Task added...", conversation_id: 123 }

// Test error (invalid user)
await chatAPI.sendMessage('invalid_user', 'test');
// Expected: Error thrown with 403 status
```

**Acceptance Criteria:**
- All test cases pass
- No console errors
- Responses match expected format

---

## Phase 3: Dashboard Foundation (3 Tasks)

### T010: Create Dashboard Page Component

**Objective:** Create basic dashboard page with authentication guard and layout.

**Priority:** P0 (Blocker)
**Complexity:** Medium
**Dependencies:** T003 (directory structure)
**Estimated Time:** 2 hours

**Files to Create:**
- `frontend/app/dashboard/page.js`

**Implementation Steps:**
1. Create `app/dashboard/page.js`
2. Implement page component with:
   - 'use client' directive
   - Authentication guard (redirect to /login if not authenticated)
   - State management (user, tasks, loading)
   - `fetchTasks` function
   - Basic layout with Navbar
3. Use existing `getUser`, `isAuthenticated` from `lib/auth`
4. Use existing `tasksAPI.list` from `lib/api`
5. Add loading spinner while fetching user/tasks
6. Render placeholder text for now (e.g., "Dashboard - Tasks: {count}")

**Expected Outcome:**
- Dashboard page accessible at `/dashboard`
- Redirects to `/login` if not authenticated
- Fetches and displays task count
- Uses existing Navbar component

**Validation Criteria:**
- [ ] File created at `frontend/app/dashboard/page.js`
- [ ] Page uses 'use client' directive
- [ ] Authentication guard redirects unauthenticated users to `/login`
- [ ] Fetches user from `getUser()` on mount
- [ ] Fetches tasks using `tasksAPI.list(user.id)` after user loads
- [ ] Displays loading spinner while loading
- [ ] Renders Navbar component with user prop
- [ ] Displays task count once loaded
- [ ] No console errors

**Test Cases:**
```javascript
// Manual test: Navigate to /dashboard without login
// Expected: Redirect to /login

// Manual test: Login, then navigate to /dashboard
// Expected: Dashboard loads, shows Navbar, displays task count
```

**Acceptance Criteria:**
- `/dashboard` route works
- Authentication guard functional
- Tasks fetch successfully
- No TypeScript/ESLint errors

---

### T011: Implement Task Refresh Handler

**Objective:** Add function to refresh tasks from API (for use after CRUD operations).

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T010
**Estimated Time:** 30 minutes

**Files to Modify:**
- `frontend/app/dashboard/page.js` (add refresh function)

**Implementation Steps:**
1. Open `app/dashboard/page.js`
2. Extract `fetchTasks` function to be reusable
3. Add error handling to `fetchTasks`
4. Ensure function can be called multiple times without issues
5. Add loading state during refresh (different from initial load)

**Expected Outcome:**
- `fetchTasks` function can be called to refresh task list
- Loading state updates correctly
- Error messages display if fetch fails

**Validation Criteria:**
- [ ] `fetchTasks` function exists and is reusable
- [ ] Function includes try/catch error handling
- [ ] Loading state updates during refresh
- [ ] Error state displays user-friendly message
- [ ] Function can be called multiple times safely
- [ ] No memory leaks or duplicate requests

**Test Cases:**
```javascript
// Call fetchTasks() multiple times in quick succession
// Expected: Only one request in flight at a time (debounce or loading check)

// Simulate network error
// Expected: Error message displayed, tasks state unchanged
```

**Acceptance Criteria:**
- Function works reliably
- Error handling prevents crashes
- Loading states are clear

---

### T012: Add Basic Dashboard Layout Structure

**Objective:** Set up layout structure for KPIs, charts, and table sections.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T010
**Estimated Time:** 1 hour

**Files to Modify:**
- `frontend/app/dashboard/page.js` (add layout sections)

**Implementation Steps:**
1. Open `app/dashboard/page.js`
2. Add main content structure:
   ```javascript
   <main className="container mx-auto px-4 py-8 relative z-10">
     <div className="max-w-7xl mx-auto">
       {/* Header */}
       <div className="mb-8 animate-slide-up">
         <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard</h1>
         <p className="text-brand-100 mt-2 font-medium">Your task analytics and insights</p>
       </div>

       {/* KPIs Section (placeholder) */}
       <div className="mb-8">
         <p className="text-white">KPIs will go here</p>
       </div>

       {/* Charts Section (placeholder) */}
       <div className="mb-8">
         <p className="text-white">Charts will go here</p>
       </div>

       {/* Table Section (placeholder) */}
       <div className="mb-8">
         <p className="text-white">Task table will go here</p>
       </div>
     </div>
   </main>
   ```
3. Apply consistent spacing and animations
4. Ensure responsive layout (container max-width)

**Expected Outcome:**
- Dashboard has clear section structure
- Placeholders for KPIs, charts, table
- Layout is responsive
- Animations applied consistently

**Validation Criteria:**
- [ ] Header section with title and subtitle
- [ ] Three placeholder sections (KPIs, Charts, Table)
- [ ] Container has max-width for readability
- [ ] Sections have consistent spacing (mb-8)
- [ ] Animations applied (slide-up)
- [ ] Responsive layout works on mobile

**Test Cases:**
```javascript
// Manual test: View dashboard on different screen sizes
// Expected: Layout adapts correctly, content is readable
```

**Acceptance Criteria:**
- Layout structure is clear
- Ready for component integration
- Responsive on mobile/desktop

---

## Phase 4: KPI Cards (3 Tasks)

### T013: Create KPICard Component

**Objective:** Build reusable KPI card component for displaying metrics.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** None
**Estimated Time:** 1 hour

**Files to Create:**
- `frontend/components/dashboard/KPICard.js`

**Implementation Steps:**
1. Create `components/dashboard/KPICard.js`
2. Implement component with props:
   - `title` (string) - Metric name
   - `value` (number) - Metric value
   - `icon` (ReactNode) - Icon SVG
   - `color` (string) - Color variant ('brand', 'green', 'yellow', 'red')
   - `trend` (string, optional) - Trend text (e.g., "+5 this week")
3. Use existing `Card` component as container
4. Apply glassmorphism styling
5. Add hover effect
6. Make component responsive

**Expected Outcome:**
- Reusable KPI card component
- Accepts customization props
- Matches design system

**Validation Criteria:**
- [X] File created at `frontend/components/dashboard/KPICard.js`
- [X] Component accepts all required props
- [X] Uses existing `Card` component
- [X] Displays title, value, icon correctly
- [X] Color variants work (brand, green, yellow, red)
- [X] Hover effect applied
- [X] Responsive on mobile
- [X] Accessible (ARIA labels)

**Test Cases:**
```javascript
import KPICard from './KPICard';

// Render with different props
<KPICard
  title="Total Tasks"
  value={42}
  icon={<svg>...</svg>}
  color="brand"
  trend="+5 this week"
/>

// Test color variants
<KPICard title="Test" value={10} icon={<svg>...</svg>} color="green" />
<KPICard title="Test" value={10} icon={<svg>...</svg>} color="yellow" />
<KPICard title="Test" value={10} icon={<svg>...</svg>} color="red" />
```

**Acceptance Criteria:**
- Component renders correctly
- Props work as expected
- Styling matches design
- No console errors

---

### T014: Create DashboardKPIs Component

**Objective:** Create container component for displaying 4 KPI cards in a grid.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** T004 (analytics.js), T013 (KPICard)
**Estimated Time:** 2 hours

**Files to Create:**
- `frontend/components/dashboard/DashboardKPIs.js`

**Implementation Steps:**
1. Create `components/dashboard/DashboardKPIs.js`
2. Accept `tasks` array as prop
3. Use `calculateKPIs` from `lib/analytics.js` to compute metrics
4. Render 4 KPICard components:
   - Total Tasks (brand color)
   - Completed Tasks (green color)
   - Pending Tasks (yellow color)
   - Overdue Tasks (red color)
5. Create icon SVGs for each KPI (inline components)
6. Apply responsive grid layout (2x2 mobile, 4x1 desktop)
7. Add animation delays for staggered entrance

**Expected Outcome:**
- Grid of 4 KPI cards
- Accurate metrics calculated from tasks
- Icons for each metric
- Responsive grid layout

**Validation Criteria:**
- [X] File created at `frontend/components/dashboard/DashboardKPIs.js`
- [X] Component accepts `tasks` prop
- [X] Uses `calculateKPIs` to compute metrics
- [X] Renders 4 KPICard components with correct data
- [X] Icons created for each KPI (tasks, check, clock, alert)
- [X] Grid layout: 1 column mobile, 2 columns tablet, 4 columns desktop
- [X] Staggered animations applied
- [X] Handles empty tasks array gracefully

**Test Cases:**
```javascript
import DashboardKPIs from './DashboardKPIs';

// Test with empty tasks
<DashboardKPIs tasks={[]} />
// Expected: All KPIs show 0

// Test with sample tasks
const tasks = [
  { id: 1, status: 'pending', created_at: '2025-12-24T10:00:00Z', updated_at: '2025-12-24T10:00:00Z' },
  { id: 2, status: 'completed', created_at: '2025-12-20T10:00:00Z', updated_at: '2025-12-24T10:00:00Z' },
  { id: 3, status: 'pending', created_at: '2025-12-10T10:00:00Z', updated_at: '2025-12-10T10:00:00Z' },
];
<DashboardKPIs tasks={tasks} />
// Expected: Total=3, Completed=1, Pending=2, Overdue=1
```

**Acceptance Criteria:**
- All KPIs display correct values
- Grid layout is responsive
- Animations work smoothly

---

### T015: Integrate KPIs into Dashboard Page

**Objective:** Add DashboardKPIs component to dashboard page.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T012 (layout), T014 (DashboardKPIs)
**Estimated Time:** 30 minutes

**Files to Modify:**
- `frontend/app/dashboard/page.js`

**Implementation Steps:**
1. Open `app/dashboard/page.js`
2. Import `DashboardKPIs` component
3. Replace KPIs placeholder with:
   ```javascript
   <DashboardKPIs tasks={tasks} />
   ```
4. Add loading state for KPIs (show skeleton while loading)
5. Test with real task data

**Expected Outcome:**
- KPIs displayed on dashboard
- Metrics update when tasks change
- Loading state shown during fetch

**Validation Criteria:**
- [X] `DashboardKPIs` imported and rendered
- [X] Component receives `tasks` prop
- [X] KPIs display accurate metrics
- [X] Loading state shown while `loading === true`
- [X] KPIs update after task refresh
- [X] No console errors

**Test Cases:**
```javascript
// Manual test: View dashboard with tasks
// Expected: KPIs show correct counts

// Manual test: Complete a task via table action
// Expected: KPIs update to reflect new counts
```

**Acceptance Criteria:**
- KPIs integrated successfully
- Metrics are accurate
- Updates work correctly

---

## Phase 5: Chart Components (5 Tasks)

### T016: Create DonutChart Component

**Objective:** Build donut chart component for task status distribution.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** T001 (Recharts), T004 (analytics), T006 (chart-utils)
**Estimated Time:** 2 hours

**Files to Create:**
- `frontend/components/dashboard/DonutChart.js`

**Implementation Steps:**
1. Create `components/dashboard/DonutChart.js`
2. Accept `tasks` prop
3. Use `getStatusDistribution` from `lib/analytics.js`
4. Import Recharts components: `PieChart`, `Pie`, `Cell`, `ResponsiveContainer`, `Tooltip`, `Legend`
5. Configure donut chart:
   - Inner radius: 60px, Outer radius: 100px
   - Use `CHART_COLORS` for cell colors
   - Add tooltip and legend
   - Responsive container (100% width, 300px height)
6. Wrap in glass-card container with title
7. Add accessibility attributes

**Expected Outcome:**
- Interactive donut chart showing status distribution
- Tooltip on hover
- Legend for colors
- Responsive sizing

**Validation Criteria:**
- [ ] File created at `frontend/components/dashboard/DonutChart.js`
- [ ] Component accepts `tasks` prop
- [ ] Uses `getStatusDistribution` for data
- [ ] Renders donut chart (not full pie)
- [ ] Colors match `CHART_COLORS` (pending=yellow, completed=green)
- [ ] Tooltip shows exact counts
- [ ] Legend displays status names
- [ ] Responsive (adjusts to container width)
- [ ] Accessible (ARIA labels)

**Test Cases:**
```javascript
import DonutChart from './DonutChart';

// Test with sample tasks
const tasks = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'completed' },
];
<DonutChart tasks={tasks} />
// Expected: Chart shows 67% pending, 33% completed

// Test with all completed
const allCompleted = [
  { id: 1, status: 'completed' },
  { id: 2, status: 'completed' },
];
<DonutChart tasks={allCompleted} />
// Expected: Chart shows 100% completed
```

**Acceptance Criteria:**
- Chart renders correctly
- Data visualization is accurate
- Interactive features work

---

### T017: Create LineChart Component

**Objective:** Build line chart for tasks created vs completed over time.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** T001 (Recharts), T004 (analytics), T006 (chart-utils)
**Estimated Time:** 2 hours

**Files to Create:**
- `frontend/components/dashboard/LineChart.js`

**Implementation Steps:**
1. Create `components/dashboard/LineChart.js`
2. Accept `tasks` prop
3. Use `getTimeSeriesData` from `lib/analytics.js` (last 7 days)
4. Import Recharts: `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `ResponsiveContainer`
5. Configure line chart:
   - Two lines: "Created" (blue) and "Completed" (green)
   - X-axis: Dates (last 7 days)
   - Y-axis: Task count
   - Grid lines with low opacity
   - Tooltip and legend
6. Wrap in glass-card with title "Activity Trend (Last 7 Days)"
7. Handle empty data gracefully

**Expected Outcome:**
- Line chart showing task creation and completion trends
- Two distinct lines with different colors
- Interactive tooltip
- Responsive layout

**Validation Criteria:**
- [ ] File created at `frontend/components/dashboard/LineChart.js`
- [ ] Component accepts `tasks` prop
- [ ] Uses `getTimeSeriesData(tasks, 7)` for data
- [ ] Renders two lines (Created, Completed)
- [ ] X-axis shows last 7 days
- [ ] Y-axis shows task counts
- [ ] Grid lines visible
- [ ] Tooltip shows values on hover
- [ ] Legend identifies lines
- [ ] Responsive sizing
- [ ] Handles empty data (shows message)

**Test Cases:**
```javascript
import LineChart from './LineChart';

// Test with tasks spread across days
const tasks = [
  { id: 1, status: 'pending', created_at: '2025-12-20T10:00:00Z' },
  { id: 2, status: 'completed', created_at: '2025-12-21T10:00:00Z', updated_at: '2025-12-23T10:00:00Z' },
  { id: 3, status: 'pending', created_at: '2025-12-24T10:00:00Z' },
];
<LineChart tasks={tasks} />
// Expected: Chart shows data points for each day

// Test with empty tasks
<LineChart tasks={[]} />
// Expected: Empty state message shown
```

**Acceptance Criteria:**
- Chart visualizes trends correctly
- Interactive features work
- Empty state handled

---

### T018: Create BarChart Component

**Objective:** Build bar chart for tasks by status.

**Priority:** P1 (High)
**Complexity:** Low-Medium
**Dependencies:** T001 (Recharts), T004 (analytics), T006 (chart-utils)
**Estimated Time:** 1.5 hours

**Files to Create:**
- `frontend/components/dashboard/BarChart.js`

**Implementation Steps:**
1. Create `components/dashboard/BarChart.js`
2. Accept `tasks` prop
3. Use `getStatusBreakdown` from `lib/analytics.js`
4. Import Recharts: `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer`
5. Configure bar chart:
   - X-axis: Status names (Pending, Completed)
   - Y-axis: Task counts
   - Bars filled with primary brand color
   - Tooltip and grid
6. Wrap in glass-card with title "Tasks by Status"
7. Make responsive

**Expected Outcome:**
- Simple bar chart showing task counts by status
- Clear visual distinction between statuses
- Responsive sizing

**Validation Criteria:**
- [ ] File created at `frontend/components/dashboard/BarChart.js`
- [ ] Component accepts `tasks` prop
- [ ] Uses `getStatusBreakdown` for data
- [ ] Renders bars for each status
- [ ] X-axis labeled with status names
- [ ] Y-axis shows counts
- [ ] Bars use brand color
- [ ] Tooltip shows exact counts
- [ ] Responsive
- [ ] Accessible

**Test Cases:**
```javascript
import BarChart from './BarChart';

const tasks = [
  { id: 1, status: 'pending' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'completed' },
];
<BarChart tasks={tasks} />
// Expected: Pending bar = 2, Completed bar = 1
```

**Acceptance Criteria:**
- Chart renders correctly
- Data is accurate
- Visual clarity

---

### T019: Create TaskCharts Container

**Objective:** Create container component for all three charts with responsive layout.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T016, T017, T018
**Estimated Time:** 1 hour

**Files to Create:**
- `frontend/components/dashboard/TaskCharts.js`

**Implementation Steps:**
1. Create `components/dashboard/TaskCharts.js`
2. Accept `tasks` prop
3. Import DonutChart, LineChart, BarChart
4. Create responsive grid layout:
   - Top row: Donut + Line (2 columns on desktop, stacked on mobile)
   - Bottom row: Bar chart (full width)
5. Add empty state if no tasks
6. Apply animations

**Expected Outcome:**
- Container renders all three charts
- Responsive grid layout
- Empty state for no tasks

**Validation Criteria:**
- [ ] File created at `frontend/components/dashboard/TaskCharts.js`
- [ ] Component accepts `tasks` prop
- [ ] Renders 3 chart components
- [ ] Grid layout: 1 column mobile, 2 columns desktop (top row)
- [ ] Bar chart spans full width on bottom row
- [ ] Empty state displayed if `tasks.length === 0`
- [ ] Animations applied (staggered)
- [ ] Responsive on all screen sizes

**Test Cases:**
```javascript
import TaskCharts from './TaskCharts';

// Test with tasks
<TaskCharts tasks={tasks} />
// Expected: All 3 charts visible

// Test with empty tasks
<TaskCharts tasks={[]} />
// Expected: Empty state message shown
```

**Acceptance Criteria:**
- All charts display correctly
- Layout is responsive
- Empty state works

---

### T020: Integrate Charts into Dashboard Page

**Objective:** Add TaskCharts component to dashboard page.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T012 (layout), T019 (TaskCharts)
**Estimated Time:** 30 minutes

**Files to Modify:**
- `frontend/app/dashboard/page.js`

**Implementation Steps:**
1. Open `app/dashboard/page.js`
2. Import `TaskCharts` component
3. Replace charts placeholder with:
   ```javascript
   <TaskCharts tasks={tasks} />
   ```
4. Add loading skeleton for charts
5. Test with real data

**Expected Outcome:**
- Charts displayed on dashboard
- Charts update when tasks change
- Loading state shown during fetch

**Validation Criteria:**
- [X] `TaskCharts` imported and rendered
- [X] Component receives `tasks` prop
- [X] Charts display correctly
- [X] Loading state shown while `loading === true`
- [X] Charts update after task changes
- [X] No console errors

**Test Cases:**
```javascript
// Manual test: View dashboard with tasks
// Expected: All 3 charts visible and accurate

// Manual test: Add a task via chat
// Expected: Charts update to reflect new task
```

**Acceptance Criteria:**
- Charts integrated successfully
- Data visualization is accurate
- Updates work correctly

---

## Phase 6: Task Table (4 Tasks)

### T021: Create TaskTableRow Component

**Objective:** Build individual table row component for displaying a single task.

**Priority:** P1 (High)
**Complexity:** Low-Medium
**Dependencies:** T005 (date-helpers)
**Estimated Time:** 1.5 hours

**Files to Create:**
- `frontend/components/dashboard/TaskTableRow.js`

**Implementation Steps:**
1. Create `components/dashboard/TaskTableRow.js`
2. Accept props: `task`, `onToggleComplete`, `onDelete`, `onEdit`
3. Import existing components: `Checkbox`, `Button`
4. Use `formatDate` from `lib/date-helpers.js`
5. Render table row (<tr>) with columns:
   - Checkbox (completion status)
   - Title (with strikethrough if completed)
   - Status badge (Pending=yellow, Completed=green)
   - Created date (formatted)
   - Action buttons (Edit, Delete)
6. Add hover effect
7. Add confirmation dialog for delete

**Expected Outcome:**
- Reusable table row component
- Interactive checkbox and buttons
- Visual feedback on hover

**Validation Criteria:**
- [X] File created at `frontend/components/dashboard/TaskTableRow.js`
- [X] Component accepts all required props
- [X] Renders <tr> element with 5 <td> columns
- [X] Checkbox reflects task status
- [X] Title has strikethrough if completed
- [X] Status badge shows correct color/text
- [X] Date formatted using `formatDate`
- [X] Edit and Delete buttons rendered
- [X] Delete confirmation dialog shown
- [X] Hover effect applied
- [X] Accessible (ARIA labels)

**Test Cases:**
```javascript
import TaskTableRow from './TaskTableRow';

const task = {
  id: 1,
  title: 'Buy groceries',
  status: 'pending',
  created_at: '2025-12-24T10:00:00Z'
};

const handleToggle = jest.fn();
const handleDelete = jest.fn();
const handleEdit = jest.fn();

<TaskTableRow
  task={task}
  onToggleComplete={handleToggle}
  onDelete={handleDelete}
  onEdit={handleEdit}
/>

// Click checkbox
// Expected: handleToggle called with (1, true)

// Click delete button
// Expected: Confirmation dialog shown, then handleDelete called with (1)
```

**Acceptance Criteria:**
- Component renders correctly
- Callbacks work as expected
- Accessibility standards met

---

### T022: Create TaskTable Component

**Objective:** Build task table with filters, search, pagination, and action handlers.

**Priority:** P0 (Blocker)
**Complexity:** Medium-High
**Dependencies:** T021 (TaskTableRow)
**Estimated Time:** 3 hours

**Files to Create:**
- `frontend/components/dashboard/TaskTable.js`

**Implementation Steps:**
1. Create `components/dashboard/TaskTable.js`
2. Accept props: `tasks`, `onToggleComplete`, `onDelete`, `onEdit`
3. Implement local state:
   - Filters: `{ status: 'all', search: '' }`
   - Pagination: `currentPage`, `tasksPerPage = 10`
4. Import `Input`, `Select` for filters
5. Implement filtering logic:
   - Filter by status (all/pending/completed)
   - Filter by search (title/description)
6. Implement pagination:
   - Calculate total pages
   - Slice tasks for current page
   - Prev/Next buttons
7. Render table with:
   - Filter section (search input + status select)
   - Table header (5 columns)
   - TaskTableRow for each task
   - Pagination controls
   - Empty state if no tasks
8. Wrap in glass-card

**Expected Outcome:**
- Functional task table with all features
- Filtering and pagination work correctly
- Clean, responsive layout

**Validation Criteria:**
- [X] File created at `frontend/components/dashboard/TaskTable.js`
- [X] Component accepts all required props
- [X] Filters section rendered (search + status dropdown)
- [X] Table header with 5 columns (Done, Task, Status, Created, Actions)
- [X] TaskTableRow rendered for each paginated task
- [X] Filtering works (status + search)
- [X] Pagination works (10 tasks per page)
- [X] Empty state shown if no tasks
- [X] Glass-card styling applied
- [X] Responsive on mobile (horizontal scroll)

**Test Cases:**
```javascript
import TaskTable from './TaskTable';

const tasks = [/* 15 sample tasks */];

<TaskTable
  tasks={tasks}
  onToggleComplete={handleToggle}
  onDelete={handleDelete}
  onEdit={handleEdit}
/>

// Test filtering by status
// Select "Pending" → Expected: Only pending tasks shown

// Test search
// Type "buy" → Expected: Only tasks with "buy" in title shown

// Test pagination
// Expected: 10 tasks on page 1, 5 tasks on page 2

// Test empty state
<TaskTable tasks={[]} {...handlers} />
// Expected: "No tasks yet" message shown
```

**Acceptance Criteria:**
- All features work correctly
- No performance issues with 100+ tasks
- Responsive and accessible

---

### T023: Connect Table Actions to API

**Objective:** Wire up table action handlers to API calls in dashboard page.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** T011 (refresh handler), T022 (TaskTable)
**Estimated Time:** 1.5 hours

**Files to Modify:**
- `frontend/app/dashboard/page.js`

**Implementation Steps:**
1. Open `app/dashboard/page.js`
2. Implement `handleToggleComplete(taskId, completed)`:
   - Call `tasksAPI.toggleComplete(user.id, taskId, completed)`
   - Handle errors
   - Call `fetchTasks()` to refresh
3. Implement `handleDelete(taskId)`:
   - Call `tasksAPI.delete(user.id, taskId)`
   - Handle errors
   - Call `fetchTasks()` to refresh
4. Implement `handleEdit(taskId)`:
   - Navigate to `/todos/${taskId}` (existing edit page)
5. Pass handlers to TaskTable component
6. Add error toast notifications (optional but recommended)

**Expected Outcome:**
- Complete, delete, edit actions work from table
- Dashboard refreshes after each action
- Error handling prevents crashes

**Validation Criteria:**
- [X] `handleToggleComplete` function implemented
- [X] `handleDelete` function implemented
- [X] `handleEdit` function implemented
- [X] Functions call correct API methods
- [X] Error handling implemented (try/catch)
- [X] `fetchTasks()` called after successful API call
- [X] Navigation works for edit action
- [X] Error messages displayed (console or toast)
- [X] Loading states shown during API calls

**Test Cases:**
```javascript
// Manual test: Click complete checkbox
// Expected: Task status updates, KPIs/charts refresh

// Manual test: Click delete button
// Expected: Confirmation shown, task deleted, UI updates

// Manual test: Click edit button
// Expected: Navigate to /todos/:id page
```

**Acceptance Criteria:**
- All actions work end-to-end
- Data stays in sync
- Errors handled gracefully

---

### T024: Integrate Table into Dashboard Page

**Objective:** Add TaskTable component to dashboard page.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T012 (layout), T023 (action handlers)
**Estimated Time:** 30 minutes

**Files to Modify:**
- `frontend/app/dashboard/page.js`

**Implementation Steps:**
1. Open `app/dashboard/page.js`
2. Import `TaskTable` component
3. Replace table placeholder with:
   ```javascript
   <TaskTable
     tasks={tasks}
     onToggleComplete={handleToggleComplete}
     onDelete={handleDelete}
     onEdit={handleEdit}
   />
   ```
4. Add loading skeleton for table
5. Test all actions

**Expected Outcome:**
- Table displayed on dashboard
- All CRUD actions functional
- Loading states shown appropriately

**Validation Criteria:**
- [X] `TaskTable` imported and rendered
- [X] Component receives all required props
- [X] Table displays tasks correctly
- [X] Loading state shown while `loading === true`
- [X] Actions work (complete, delete, edit)
- [X] Dashboard updates after actions
- [X] No console errors

**Test Cases:**
```javascript
// Manual test: View dashboard with tasks
// Expected: Table shows all tasks with filters

// Manual test: Complete a task
// Expected: Checkbox updates, status changes, KPIs update

// Manual test: Delete a task
// Expected: Task removed, table updates, KPIs update
```

**Acceptance Criteria:**
- Table integrated successfully
- All features work correctly
- Data synchronization works

---

## Phase 7: Chat Widget (6 Tasks)

### T025: Create ChatMessage Component

**Objective:** Build message bubble component for chat interface.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** None
**Estimated Time:** 1 hour

**Files to Create:**
- `frontend/components/chat/ChatMessage.js`

**Implementation Steps:**
1. Create `components/chat/ChatMessage.js`
2. Accept props: `role` ('user' | 'assistant'), `content` (string)
3. Render message bubble:
   - User messages: right-aligned, brand-500 background
   - Assistant messages: left-aligned, glass-panel background
   - Max width 80%
   - Rounded corners
   - Padding
4. Add slide-up animation
5. Make text selectable

**Expected Outcome:**
- Reusable message bubble component
- Different styling for user vs assistant
- Smooth animations

**Validation Criteria:**
- [ ] File created at `frontend/components/chat/ChatMessage.js`
- [ ] Component accepts `role` and `content` props
- [ ] User messages styled differently from assistant messages
- [ ] User messages right-aligned
- [ ] Assistant messages left-aligned
- [ ] Max width 80%
- [ ] Rounded corners and padding applied
- [ ] Slide-up animation on render
- [ ] Text is selectable

**Test Cases:**
```javascript
import ChatMessage from './ChatMessage';

<ChatMessage role="user" content="Hello!" />
// Expected: Right-aligned, brand color background

<ChatMessage role="assistant" content="Hi there!" />
// Expected: Left-aligned, glass background
```

**Acceptance Criteria:**
- Component renders correctly for both roles
- Styling matches design
- Animations smooth

---

### T026: Create VoiceInput Hook

**Objective:** Implement custom hook for Web Speech API integration.

**Priority:** P2 (Medium)
**Complexity:** Medium
**Dependencies:** None
**Estimated Time:** 2 hours

**Files to Create:**
- `frontend/hooks/useVoiceInput.js`

**Implementation Steps:**
1. Create `hooks/useVoiceInput.js`
2. Check for browser support (`webkitSpeechRecognition` or `SpeechRecognition`)
3. Implement hook that returns:
   - `isListening` (boolean) - Recording state
   - `transcript` (string) - Recognized text
   - `isSupported` (boolean) - Browser support
   - `startListening` (function) - Start recording
   - `setTranscript` (function) - Clear transcript
4. Configure SpeechRecognition:
   - Language: 'en-US'
   - Interim results: false
   - Continuous: false
5. Handle events: onstart, onend, onresult, onerror
6. Add error handling

**Expected Outcome:**
- Hook provides voice input functionality
- Works in supported browsers (Chrome, Edge)
- Gracefully degrades in unsupported browsers

**Validation Criteria:**
- [ ] File created at `frontend/hooks/useVoiceInput.js`
- [ ] Hook exports: `isListening`, `transcript`, `isSupported`, `startListening`, `setTranscript`
- [ ] Browser support detected correctly
- [ ] SpeechRecognition configured for English
- [ ] Transcript state updates on speech recognition
- [ ] Listening state toggles correctly
- [ ] Errors handled gracefully
- [ ] Hook cleans up on unmount

**Test Cases:**
```javascript
import { useVoiceInput } from './useVoiceInput';

function TestComponent() {
  const { isListening, transcript, isSupported, startListening } = useVoiceInput();

  return (
    <div>
      <p>Supported: {isSupported ? 'Yes' : 'No'}</p>
      <p>Listening: {isListening ? 'Yes' : 'No'}</p>
      <p>Transcript: {transcript}</p>
      <button onClick={startListening}>Start</button>
    </div>
  );
}

// Manual test: Click start, speak "hello"
// Expected: transcript updates to "hello"
```

**Acceptance Criteria:**
- Hook works in Chrome/Edge
- Returns `isSupported: false` in Firefox/Safari
- Transcript updates correctly

---

### T027: Create VoiceInputButton Component

**Objective:** Build microphone button component using VoiceInput hook.

**Priority:** P2 (Medium)
**Complexity:** Low
**Dependencies:** T026 (useVoiceInput)
**Estimated Time:** 1 hour

**Files to Create:**
- `frontend/components/chat/VoiceInputButton.js`

**Implementation Steps:**
1. Create `components/chat/VoiceInputButton.js`
2. Accept props: `onTranscript` (function) - Callback when transcript ready
3. Use `useVoiceInput` hook
4. Render button:
   - Microphone icon SVG
   - Circular button
   - Brand-500 background (red when listening)
   - Pulse animation when listening
5. Call `onTranscript(transcript)` when transcript updates
6. Hide button if `isSupported === false`

**Expected Outcome:**
- Microphone button that triggers voice input
- Visual feedback during recording
- Passes transcript to parent component

**Validation Criteria:**
- [ ] File created at `frontend/components/chat/VoiceInputButton.js`
- [ ] Component accepts `onTranscript` prop
- [ ] Uses `useVoiceInput` hook
- [ ] Button renders with microphone icon
- [ ] Button hidden if voice input not supported
- [ ] Background color changes when listening (red)
- [ ] Pulse animation shown when listening
- [ ] `onTranscript` called with transcript value
- [ ] Accessible (ARIA label)

**Test Cases:**
```javascript
import VoiceInputButton from './VoiceInputButton';

const handleTranscript = jest.fn();

<VoiceInputButton onTranscript={handleTranscript} />

// Manual test: Click button, speak "hello"
// Expected: handleTranscript called with "hello"

// Test in unsupported browser
// Expected: Button not rendered
```

**Acceptance Criteria:**
- Button works correctly
- Transcript passed to callback
- Graceful degradation

---

### T028: Create ChatWidget Component

**Objective:** Build floating chat widget with text and voice input.

**Priority:** P0 (Blocker)
**Complexity:** High
**Dependencies:** T008 (chatAPI), T025 (ChatMessage), T027 (VoiceInputButton)
**Estimated Time:** 4 hours

**Files to Create:**
- `frontend/components/chat/ChatWidget.js`

**Implementation Steps:**
1. Create `components/chat/ChatWidget.js`
2. Accept props: `userId`, `onTaskUpdate` (callback to trigger dashboard refresh)
3. Implement state:
   - `isOpen` (boolean) - Widget open/closed
   - `messages` (array) - Chat history
   - `input` (string) - Current input
   - `loading` (boolean) - Processing state
4. Render closed state: Floating button (bottom-right, chat icon)
5. Render open state:
   - Header with title and close button
   - Messages container (scrollable)
   - ChatMessage components for each message
   - Input form (text input + voice button + send button)
   - Loading indicator (typing dots)
6. Implement `handleSendMessage(message)`:
   - Add user message to state
   - Call `chatAPI.sendMessage(userId, message)`
   - Add assistant response to state
   - Call `onTaskUpdate()` to refresh dashboard
   - Handle errors
7. Auto-scroll to bottom on new messages
8. Add initial greeting message
9. Apply glass-card styling and animations

**Expected Outcome:**
- Fully functional chat widget
- Opens/closes smoothly
- Sends messages and displays responses
- Triggers dashboard refresh after actions

**Validation Criteria:**
- [ ] File created at `frontend/components/chat/ChatWidget.js`
- [ ] Component accepts `userId` and `onTaskUpdate` props
- [ ] Closed state: Floating button visible (bottom-right)
- [ ] Open state: Widget shows header, messages, input form
- [ ] Messages render with ChatMessage component
- [ ] Text input and voice button functional
- [ ] Send button submits message
- [ ] `chatAPI.sendMessage` called on submit
- [ ] User and assistant messages added to state
- [ ] `onTaskUpdate` called after assistant response
- [ ] Auto-scroll to bottom on new messages
- [ ] Loading indicator shown during processing
- [ ] Error handling prevents crashes
- [ ] Glass-card styling applied
- [ ] Pop-in animation on open

**Test Cases:**
```javascript
import ChatWidget from './ChatWidget';

const handleTaskUpdate = jest.fn();

<ChatWidget userId="user_123" onTaskUpdate={handleTaskUpdate} />

// Click floating button
// Expected: Widget opens

// Type "list my tasks" and submit
// Expected:
// - User message added to chat
// - API called
// - Assistant response added
// - handleTaskUpdate called

// Click close button
// Expected: Widget closes
```

**Acceptance Criteria:**
- Widget works end-to-end
- All features functional
- Dashboard updates after chat actions

---

### T029: Create TaskPolling Hook

**Objective:** Implement custom hook for polling tasks after chat actions.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** None
**Estimated Time:** 1.5 hours

**Files to Create:**
- `frontend/hooks/useTaskPolling.js`

**Implementation Steps:**
1. Create `hooks/useTaskPolling.js`
2. Accept parameters:
   - `shouldPoll` (boolean) - Trigger for polling
   - `onPoll` (function) - Callback to call on each interval
   - `interval` (number) - Milliseconds between polls (default 2000)
   - `maxIterations` (number) - Max poll count (default 3)
3. Use `useEffect` to start/stop polling based on `shouldPoll`
4. Use `setInterval` for polling
5. Track iteration count, stop after `maxIterations`
6. Clean up interval on unmount or when polling stops
7. Prevent multiple intervals running simultaneously

**Expected Outcome:**
- Hook polls at specified interval
- Stops after max iterations
- Cleans up properly

**Validation Criteria:**
- [ ] File created at `frontend/hooks/useTaskPolling.js`
- [ ] Hook accepts all parameters
- [ ] Polling starts when `shouldPoll === true`
- [ ] `onPoll` called every `interval` milliseconds
- [ ] Polling stops after `maxIterations`
- [ ] Interval cleared when `shouldPoll === false`
- [ ] Interval cleared on unmount
- [ ] No memory leaks

**Test Cases:**
```javascript
import { useTaskPolling } from './useTaskPolling';

const onPoll = jest.fn();

function TestComponent({ shouldPoll }) {
  useTaskPolling(shouldPoll, onPoll, 1000, 3);
  return null;
}

// Render with shouldPoll=true
// Expected: onPoll called 3 times at 1-second intervals

// Set shouldPoll=false before 3 iterations
// Expected: Polling stops early
```

**Acceptance Criteria:**
- Hook works correctly
- Polling stops after max iterations
- Cleanup prevents memory leaks

---

### T030: Integrate ChatWidget into Dashboard

**Objective:** Add ChatWidget to dashboard page and connect to task refresh.

**Priority:** P0 (Blocker)
**Complexity:** Medium
**Dependencies:** T028 (ChatWidget), T029 (useTaskPolling)
**Estimated Time:** 1.5 hours

**Files to Modify:**
- `frontend/app/dashboard/page.js`

**Implementation Steps:**
1. Open `app/dashboard/page.js`
2. Import `ChatWidget` and `useTaskPolling` hook
3. Add state: `shouldPollTasks` (boolean)
4. Set up polling hook: `useTaskPolling(shouldPollTasks, fetchTasks, 2000, 3)`
5. Implement `handleTaskUpdate` function:
   - Set `shouldPollTasks = true`
   - Set timeout to reset `shouldPollTasks = false` after 6 seconds
6. Render `ChatWidget` component at end of JSX
7. Pass `userId` and `onTaskUpdate={handleTaskUpdate}`
8. Test full flow: chat → task update → dashboard refresh

**Expected Outcome:**
- Chat widget visible on dashboard
- Dashboard refreshes after chat actions
- Polling works for 6 seconds after chat

**Validation Criteria:**
- [ ] `ChatWidget` imported and rendered
- [ ] `useTaskPolling` hook imported and configured
- [ ] `shouldPollTasks` state added
- [ ] `handleTaskUpdate` function implemented
- [ ] Function sets `shouldPollTasks = true`
- [ ] Timeout resets `shouldPollTasks = false` after 6s
- [ ] Polling calls `fetchTasks` 3 times (0s, 2s, 4s)
- [ ] ChatWidget receives correct props
- [ ] Full flow works: send message → tasks refresh → KPIs/charts/table update
- [ ] No console errors

**Test Cases:**
```javascript
// Manual test: Send chat message "add task: test"
// Expected:
// 1. User message appears in chat
// 2. Assistant responds "Task added"
// 3. Dashboard refreshes (3 polls over 6 seconds)
// 4. New task appears in table, KPIs update

// Manual test: Send "complete task 1"
// Expected:
// 1. Assistant responds "Task completed"
// 2. Dashboard refreshes
// 3. Task 1 marked complete in table, KPIs update
```

**Acceptance Criteria:**
- Chat widget fully integrated
- Dashboard refresh works reliably
- End-to-end flow functional

---

## Phase 8: Loading & Error States (3 Tasks)

### T031: Create SkeletonLoader Components

**Objective:** Build loading placeholder components for KPIs, charts, and table.

**Priority:** P2 (Medium)
**Complexity:** Low
**Dependencies:** None
**Estimated Time:** 1.5 hours

**Files to Create:**
- `frontend/components/dashboard/SkeletonLoader.js`

**Implementation Steps:**
1. Create `components/dashboard/SkeletonLoader.js`
2. Export multiple skeleton components:
   - `KPISkeleton` - 4 card placeholders
   - `ChartSkeleton` - Chart container placeholder
   - `TableSkeleton` - Table rows placeholder
3. Use glass-card styling with animate-pulse
4. Match layout of actual components

**Expected Outcome:**
- Three skeleton loader components
- Smooth pulsing animation
- Match actual component layouts

**Validation Criteria:**
- [ ] File created at `frontend/components/dashboard/SkeletonLoader.js`
- [ ] `KPISkeleton` exported (renders 4 card placeholders)
- [ ] `ChartSkeleton` exported (renders chart container placeholder)
- [ ] `TableSkeleton` exported (renders table rows placeholder)
- [ ] Animate-pulse applied to all skeletons
- [ ] Layouts match actual components
- [ ] Glass-card styling consistent

**Test Cases:**
```javascript
import { KPISkeleton, ChartSkeleton, TableSkeleton } from './SkeletonLoader';

<KPISkeleton />
// Expected: 4 pulsing card placeholders in grid

<ChartSkeleton />
// Expected: Pulsing chart container

<TableSkeleton />
// Expected: Pulsing table rows
```

**Acceptance Criteria:**
- All skeletons render correctly
- Animations smooth
- Layouts accurate

---

### T032: Add Loading States to Dashboard

**Objective:** Integrate skeleton loaders into dashboard page during data fetching.

**Priority:** P2 (Medium)
**Complexity:** Low
**Dependencies:** T031 (SkeletonLoader)
**Estimated Time:** 1 hour

**Files to Modify:**
- `frontend/app/dashboard/page.js`

**Implementation Steps:**
1. Open `app/dashboard/page.js`
2. Import skeleton components
3. Conditionally render skeletons when `loading === true`:
   - Replace KPIs with `<KPISkeleton />`
   - Replace charts with chart skeletons
   - Replace table with `<TableSkeleton />`
4. Ensure smooth transition from skeleton to content

**Expected Outcome:**
- Skeletons shown during initial load
- Smooth transition to actual content
- No layout shift

**Validation Criteria:**
- [ ] Skeleton components imported
- [ ] Skeletons shown when `loading === true`
- [ ] Actual components shown when `loading === false`
- [ ] No layout shift during transition
- [ ] Page feels responsive (immediate visual feedback)

**Test Cases:**
```javascript
// Manual test: Refresh dashboard
// Expected:
// 1. Skeletons appear immediately
// 2. After tasks load, skeletons replaced with actual content
// 3. No jarring layout shifts
```

**Acceptance Criteria:**
- Loading states improve UX
- Transitions are smooth
- No visual glitches

---

### T033: Add Error Handling and Empty States

**Objective:** Implement error messages and empty state components throughout dashboard.

**Priority:** P2 (Medium)
**Complexity:** Medium
**Dependencies:** None
**Estimated Time:** 2 hours

**Files to Modify:**
- `frontend/app/dashboard/page.js`
- `frontend/components/dashboard/TaskCharts.js` (already has empty state)
- `frontend/components/dashboard/TaskTable.js` (already has empty state)

**Implementation Steps:**
1. Create `ErrorState` component (inline in dashboard page):
   - Display error icon
   - Show error message
   - "Try Again" button
2. Add error state to dashboard page:
   - Show error if task fetch fails
   - Provide retry button
3. Ensure all components have empty states:
   - TaskCharts (already implemented)
   - TaskTable (already implemented)
   - DashboardKPIs (show 0 for all metrics)
4. Add error toast for action failures (optional)

**Expected Outcome:**
- User-friendly error messages
- Retry functionality
- Graceful empty states

**Validation Criteria:**
- [ ] ErrorState component created
- [ ] Error state shown if task fetch fails
- [ ] Retry button calls `fetchTasks()` again
- [ ] All components handle empty data gracefully
- [ ] Error messages are user-friendly (no technical jargon)
- [ ] No uncaught errors in console

**Test Cases:**
```javascript
// Simulate network error
// Expected:
// 1. Error state shown
// 2. "Try Again" button visible
// 3. Click button → fetchTasks called again

// Test with 0 tasks
// Expected:
// 1. KPIs show 0
// 2. Charts show empty state
// 3. Table shows "No tasks yet" message
```

**Acceptance Criteria:**
- Errors handled gracefully
- Empty states are helpful
- User can recover from errors

---

## Phase 9: Responsive & Accessibility (4 Tasks)

### T034: Implement Responsive Mobile Layout

**Objective:** Ensure dashboard works perfectly on mobile devices (320px+).

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** All component tasks
**Estimated Time:** 3 hours

**Files to Modify:**
- All dashboard components (adjust Tailwind classes)
- `frontend/app/dashboard/page.js`
- `frontend/components/dashboard/*.js`
- `frontend/components/chat/ChatWidget.js`

**Implementation Steps:**
1. Test dashboard on mobile viewport (320px, 375px, 414px)
2. Fix layout issues:
   - KPIs: Stack vertically on mobile (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
   - Charts: Stack vertically on mobile, side-by-side on tablet+
   - Table: Horizontal scroll on mobile
   - Chat widget: Full-screen overlay on mobile
3. Adjust font sizes for readability
4. Ensure touch targets ≥ 44x44px
5. Test scrolling and overflow behavior

**Expected Outcome:**
- Dashboard fully functional on mobile
- All elements readable and usable
- No horizontal scroll (except table)

**Validation Criteria:**
- [ ] Dashboard tested on 320px, 375px, 414px widths
- [ ] KPIs stack vertically on mobile
- [ ] Charts stack vertically on mobile
- [ ] Table scrolls horizontally on mobile (not cut off)
- [ ] Chat widget goes full-screen on mobile
- [ ] Font sizes readable (≥ 14px)
- [ ] Touch targets ≥ 44x44px
- [ ] No horizontal page scroll
- [ ] All interactive elements accessible on touch

**Test Cases:**
```bash
# Use Chrome DevTools device emulation
# Test devices: iPhone SE, iPhone 12, Pixel 5, iPad

# Test actions on mobile:
# - Tap KPI cards
# - Scroll through charts
# - Use table filters
# - Open chat widget
# - Send chat message
```

**Acceptance Criteria:**
- All features work on mobile
- Layout is clean and usable
- No UX regressions

---

### T035: Add ARIA Labels and Keyboard Navigation

**Objective:** Ensure dashboard is fully accessible via keyboard and screen readers.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** All component tasks
**Estimated Time:** 2.5 hours

**Files to Modify:**
- All interactive components
- Charts (add ARIA labels to Recharts components)
- Buttons, inputs, checkboxes

**Implementation Steps:**
1. Add ARIA labels to all charts:
   - `aria-label="Task status distribution chart"`
   - `aria-describedby` for chart data
2. Add ARIA labels to all buttons:
   - "Complete task", "Delete task", "Edit task"
   - "Open chat", "Close chat", "Send message"
3. Ensure all inputs have labels (visible or aria-label)
4. Add skip navigation links if needed
5. Test keyboard navigation:
   - Tab through all interactive elements
   - Enter/Space activate buttons
   - Escape closes modals/chat
6. Add focus indicators (outline) to all focusable elements
7. Test with screen reader (NVDA or VoiceOver)

**Expected Outcome:**
- Full keyboard navigation support
- Screen reader announces all elements correctly
- Focus indicators visible

**Validation Criteria:**
- [ ] All charts have ARIA labels
- [ ] All buttons have ARIA labels
- [ ] All inputs have labels (visible or ARIA)
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Enter/Space activates buttons
- [ ] Escape closes chat widget
- [ ] Focus indicators visible on all elements
- [ ] No keyboard traps
- [ ] Screen reader testing passed (basic smoke test)

**Test Cases:**
```bash
# Keyboard navigation test:
# 1. Tab through entire dashboard
# 2. Verify all elements focusable
# 3. Verify focus indicators visible
# 4. Activate buttons with Enter/Space
# 5. Close chat with Escape

# Screen reader test (NVDA/VoiceOver):
# 1. Navigate dashboard
# 2. Verify KPIs announced correctly
# 3. Verify charts have descriptions
# 4. Verify table structure announced
```

**Acceptance Criteria:**
- Keyboard navigation works fully
- Screen reader usability acceptable
- WCAG 2.1 Level AA compliance (basic)

---

### T036: Run Lighthouse Accessibility Audit

**Objective:** Achieve Lighthouse accessibility score ≥ 90.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** T035 (ARIA labels)
**Estimated Time:** 2 hours

**Files to Modify:**
- Various (based on audit findings)

**Implementation Steps:**
1. Run Lighthouse audit in Chrome DevTools:
   - Open dashboard page
   - Run audit (Accessibility category)
2. Review audit results
3. Fix all "Serious" and "Moderate" issues:
   - Missing alt text
   - Low color contrast
   - Missing ARIA attributes
   - Form labels
4. Re-run audit until score ≥ 90
5. Document any remaining issues

**Expected Outcome:**
- Lighthouse accessibility score ≥ 90
- All serious issues fixed
- Accessible to users with disabilities

**Validation Criteria:**
- [ ] Lighthouse audit run successfully
- [ ] Accessibility score ≥ 90
- [ ] No "Serious" issues remaining
- [ ] Color contrast ≥ 4.5:1 for all text
- [ ] All images have alt text (if any)
- [ ] All form elements have labels
- [ ] ARIA attributes valid

**Test Cases:**
```bash
# Run Lighthouse audit
# Category: Accessibility
# Expected score: ≥ 90

# Common issues to check:
# - [color-contrast] Sufficient contrast
# - [label] Form elements have labels
# - [aria-*] Valid ARIA attributes
# - [button-name] Buttons have accessible names
```

**Acceptance Criteria:**
- Audit score meets target
- Dashboard is accessible
- Best practices followed

---

### T037: Fix Color Contrast Issues

**Objective:** Ensure all text has sufficient color contrast (≥ 4.5:1).

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T036 (Lighthouse audit)
**Estimated Time:** 1 hour

**Files to Modify:**
- Various (based on contrast issues found)

**Implementation Steps:**
1. Use Lighthouse or axe DevTools to identify contrast issues
2. Test all text/background combinations:
   - White text on dark backgrounds
   - Colored text on light backgrounds
   - Status badges
   - Buttons
3. Adjust colors as needed:
   - Lighten text or darken background
   - Use brand colors with sufficient contrast
4. Re-test with contrast checker tool
5. Document color palette with contrast ratios

**Expected Outcome:**
- All text meets WCAG AA contrast requirements
- Design remains visually appealing

**Validation Criteria:**
- [ ] All text has contrast ratio ≥ 4.5:1
- [ ] Status badges readable
- [ ] Button text visible
- [ ] Chart labels readable
- [ ] No Lighthouse contrast warnings

**Test Cases:**
```bash
# Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

# Test combinations:
# - White (#FFFFFF) on dark-900 (#0f172a)
# - Brand-300 (#5eead4) on dark-900
# - Yellow-400 (#fbbf24) on dark-800
# - Green-400 (#34d399) on dark-800
```

**Acceptance Criteria:**
- All combinations pass
- Text is readable
- Design integrity maintained

---

## Phase 10: Performance (3 Tasks)

### T038: Implement Lazy Loading for Charts

**Objective:** Reduce initial bundle size by lazy-loading chart components.

**Priority:** P2 (Medium)
**Complexity:** Low
**Dependencies:** T020 (Charts integrated)
**Estimated Time:** 1 hour

**Files to Modify:**
- `frontend/app/dashboard/page.js`

**Implementation Steps:**
1. Open `app/dashboard/page.js`
2. Replace static `TaskCharts` import with dynamic import:
   ```javascript
   import dynamic from 'next/dynamic';

   const TaskCharts = dynamic(() => import('../../components/dashboard/TaskCharts'), {
     loading: () => <ChartSkeleton />,
     ssr: false
   });
   ```
3. Import `ChartSkeleton` for loading state
4. Test that charts load correctly
5. Verify bundle size reduction (check Next.js build output)

**Expected Outcome:**
- Charts loaded on demand
- Smaller initial bundle
- Loading placeholder shown during load

**Validation Criteria:**
- [ ] TaskCharts imported with `dynamic()`
- [ ] Loading state uses ChartSkeleton
- [ ] SSR disabled for charts (`ssr: false`)
- [ ] Charts still render correctly
- [ ] Bundle size reduced (check `npm run build` output)
- [ ] Initial load time improved

**Test Cases:**
```javascript
// Manual test: Load dashboard
// Expected:
// 1. KPIs and table load immediately
// 2. Chart skeletons shown briefly
// 3. Charts load after ~500ms

// Check bundle size:
// Run: npm run build
// Compare .next/static/chunks sizes before/after
```

**Acceptance Criteria:**
- Lazy loading works correctly
- Performance improved
- No visual regressions

---

### T039: Memoize Expensive Calculations

**Objective:** Use `useMemo` to prevent unnecessary recalculations.

**Priority:** P2 (Medium)
**Complexity:** Low
**Dependencies:** T004 (analytics)
**Estimated Time:** 1 hour

**Files to Modify:**
- `frontend/components/dashboard/DashboardKPIs.js`
- `frontend/components/dashboard/TaskCharts.js`
- `frontend/components/dashboard/DonutChart.js`
- `frontend/components/dashboard/LineChart.js`
- `frontend/components/dashboard/BarChart.js`

**Implementation Steps:**
1. Import `useMemo` from React
2. Wrap analytics calculations in `useMemo`:
   ```javascript
   const kpis = useMemo(() => calculateKPIs(tasks), [tasks]);
   const statusData = useMemo(() => getStatusDistribution(tasks), [tasks]);
   const timeSeriesData = useMemo(() => getTimeSeriesData(tasks, 7), [tasks]);
   ```
3. Ensure dependency arrays are correct
4. Test that components re-render correctly
5. Measure performance improvement with React DevTools Profiler

**Expected Outcome:**
- Analytics functions only recalculate when tasks change
- Improved render performance
- No unnecessary recalculations

**Validation Criteria:**
- [ ] `useMemo` used for all analytics calculations
- [ ] Dependency arrays correct ([tasks])
- [ ] Components still update when tasks change
- [ ] No stale data displayed
- [ ] Performance improved (measure with Profiler)

**Test Cases:**
```javascript
// Manual test: Re-render dashboard without changing tasks
// Expected: Analytics functions not called (check console.log)

// Manual test: Add a task
// Expected: Analytics functions recalculated, UI updates
```

**Acceptance Criteria:**
- Memoization works correctly
- Performance improved
- No bugs introduced

---

### T040: Debounce Search Input

**Objective:** Prevent excessive filtering on every keystroke in search input.

**Priority:** P2 (Medium)
**Complexity:** Low
**Dependencies:** T022 (TaskTable)
**Estimated Time:** 1 hour

**Files to Modify:**
- `frontend/components/dashboard/TaskTable.js`

**Implementation Steps:**
1. Install `lodash` (or use custom debounce function)
2. Import `debounce` from lodash
3. Create debounced filter function:
   ```javascript
   const debouncedSetSearch = useMemo(
     () => debounce((value) => {
       setFilters(prev => ({ ...prev, search: value }));
     }, 300),
     []
   );
   ```
4. Update input onChange to use debounced function
5. Clean up debounce on unmount
6. Test that search still works correctly

**Expected Outcome:**
- Search input debounced (300ms delay)
- Fewer filter calculations
- Smoother typing experience

**Validation Criteria:**
- [ ] `debounce` imported (lodash or custom)
- [ ] Search input onChange uses debounced function
- [ ] Debounce delay = 300ms
- [ ] Debounce cleaned up on unmount
- [ ] Search still works correctly (just delayed)
- [ ] Typing feels smooth (no lag)

**Test Cases:**
```javascript
// Manual test: Type quickly in search input
// Expected:
// 1. Filtering delayed until 300ms after last keystroke
// 2. Typing feels smooth
// 3. Results appear after stopping typing
```

**Acceptance Criteria:**
- Debouncing works correctly
- Performance improved
- UX not negatively impacted

---

## Phase 11: Testing & QA (4 Tasks)

### T041: Write Integration Tests

**Objective:** Create integration tests for dashboard functionality.

**Priority:** P1 (High)
**Complexity:** High
**Dependencies:** All implementation tasks
**Estimated Time:** 4 hours

**Files to Create:**
- `frontend/__tests__/dashboard.test.js`
- `frontend/__tests__/dashboard-actions.test.js`

**Implementation Steps:**
1. Set up testing environment (Jest + React Testing Library + MSW)
2. Write tests for dashboard page:
   - Test authentication guard (redirect to /login)
   - Test tasks fetch on load
   - Test KPIs calculation
   - Test charts rendering
   - Test table rendering
3. Write tests for dashboard actions:
   - Test task completion (API call + UI update)
   - Test task deletion (API call + UI update)
   - Test chat message (API call + dashboard refresh)
4. Mock API responses with MSW
5. Run tests and ensure all pass

**Expected Outcome:**
- Comprehensive integration test suite
- All critical paths covered
- Tests pass reliably

**Validation Criteria:**
- [ ] Test files created
- [ ] MSW configured for API mocking
- [ ] Authentication guard tested
- [ ] Task fetch tested
- [ ] KPI calculation tested
- [ ] Chart rendering tested
- [ ] Table rendering tested
- [ ] Task actions tested (complete, delete)
- [ ] Chat integration tested
- [ ] All tests pass (`npm test`)

**Test Cases:**
```javascript
describe('Dashboard Integration', () => {
  test('redirects to login if not authenticated', async () => {
    // Mock: isAuthenticated returns false
    // Render: /dashboard
    // Assert: Redirected to /login
  });

  test('fetches and displays tasks', async () => {
    // Mock: API returns 3 tasks
    // Render: /dashboard
    // Assert: 3 tasks displayed in table
    // Assert: KPIs show correct counts
  });

  test('completes task and updates UI', async () => {
    // Mock: API returns success for toggle
    // Render: /dashboard
    // Action: Click complete checkbox
    // Assert: API called
    // Assert: Task status updated
    // Assert: KPIs updated
  });

  test('chat message updates dashboard', async () => {
    // Mock: Chat API returns success
    // Render: /dashboard
    // Action: Send chat message "add task: test"
    // Assert: Chat API called
    // Assert: Tasks refetched
    // Assert: UI updated
  });
});
```

**Acceptance Criteria:**
- All tests pass
- Coverage ≥ 70% for dashboard code
- Tests are maintainable

---

### T042: Manual QA Testing

**Objective:** Perform comprehensive manual QA testing of all features.

**Priority:** P0 (Blocker)
**Complexity:** Medium
**Dependencies:** All implementation tasks
**Estimated Time:** 3 hours

**Files to Modify:**
- None (testing only)

**Implementation Steps:**
1. Create QA checklist (see below)
2. Test each item methodically
3. Document any bugs found
4. Fix bugs
5. Re-test until all items pass

**QA Checklist:**
- [ ] Login flow works
- [ ] Dashboard loads with correct data
- [ ] KPIs display accurate counts (total, completed, pending, overdue)
- [ ] Donut chart shows correct distribution
- [ ] Line chart shows activity trend
- [ ] Bar chart shows status breakdown
- [ ] Table displays all tasks
- [ ] Table filters work (status, search)
- [ ] Table pagination works
- [ ] Complete checkbox toggles task status
- [ ] Delete button removes task (with confirmation)
- [ ] Edit button navigates to edit page
- [ ] Chat widget opens/closes
- [ ] Chat messages send and receive
- [ ] Voice input works (if supported)
- [ ] Dashboard refreshes after chat actions
- [ ] Mobile layout works (test on 375px width)
- [ ] Keyboard navigation works
- [ ] No console errors or warnings
- [ ] Loading states show appropriately
- [ ] Error states display correctly
- [ ] Empty states display when no tasks

**Expected Outcome:**
- All QA items pass
- No critical or high-priority bugs
- Dashboard ready for production

**Validation Criteria:**
- [ ] All 24 QA checklist items pass
- [ ] No critical bugs found
- [ ] No console errors in production mode
- [ ] App feels polished and professional

**Test Cases:**
See QA checklist above.

**Acceptance Criteria:**
- Manual QA completed
- All issues resolved
- Dashboard is production-ready

---

### T043: Cross-Browser Testing

**Objective:** Verify dashboard works in all target browsers.

**Priority:** P1 (High)
**Complexity:** Low
**Dependencies:** T042 (Manual QA)
**Estimated Time:** 2 hours

**Files to Modify:**
- Various (fix browser-specific issues)

**Implementation Steps:**
1. Test dashboard in each browser:
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
2. Test key features in each browser:
   - Dashboard load and display
   - Charts rendering
   - Table interactions
   - Chat widget
   - Voice input (Chrome/Edge only)
3. Document browser-specific issues
4. Fix issues or add browser-specific workarounds
5. Re-test until all browsers work

**Expected Outcome:**
- Dashboard works in all target browsers
- No browser-specific bugs
- Graceful degradation for unsupported features

**Validation Criteria:**
- [ ] Chrome: All features work
- [ ] Firefox: All features work (voice input gracefully disabled)
- [ ] Safari: All features work (voice input gracefully disabled)
- [ ] Edge: All features work
- [ ] No critical browser-specific bugs

**Test Cases:**
```bash
# Chrome:
# - Test all features
# - Test voice input

# Firefox:
# - Test all features
# - Verify voice button hidden

# Safari:
# - Test all features
# - Verify charts render correctly
# - Verify voice button hidden

# Edge:
# - Test all features
# - Test voice input
```

**Acceptance Criteria:**
- All browsers supported
- Feature parity across browsers (except voice)
- No blocking issues

---

### T044: Performance Testing

**Objective:** Verify dashboard meets performance targets.

**Priority:** P1 (High)
**Complexity:** Medium
**Dependencies:** T038, T039, T040 (Performance optimizations)
**Estimated Time:** 2 hours

**Files to Modify:**
- None (testing only)

**Implementation Steps:**
1. Run Lighthouse performance audit:
   - Open dashboard in Chrome
   - Run Lighthouse audit (Performance category)
   - Target score: ≥ 80
2. Measure key metrics:
   - First Contentful Paint (FCP) < 1.8s
   - Time to Interactive (TTI) < 5s
   - Largest Contentful Paint (LCP) < 2.5s
3. Test with large dataset (100+ tasks):
   - Verify table pagination works
   - Verify charts render quickly
   - Verify no performance degradation
4. Test on slow network (throttle to 3G):
   - Verify loading states show
   - Verify app remains usable
5. Analyze bundle size:
   - Run `npm run build`
   - Check chunk sizes
   - Target: Main bundle < 500KB gzipped
6. Fix any performance issues found
7. Re-test until targets met

**Expected Outcome:**
- Lighthouse performance score ≥ 80
- All metrics meet targets
- App feels fast and responsive

**Validation Criteria:**
- [ ] Lighthouse performance score ≥ 80
- [ ] FCP < 1.8s
- [ ] TTI < 5s
- [ ] LCP < 2.5s
- [ ] Bundle size < 500KB gzipped
- [ ] Charts render < 1s
- [ ] Table pagination handles 100+ tasks smoothly
- [ ] App usable on slow 3G network

**Test Cases:**
```bash
# Lighthouse audit:
# Category: Performance
# Expected score: ≥ 80

# Bundle size:
# Run: npm run build
# Check: .next/static/chunks
# Expected: Main bundle < 500KB gzipped

# Large dataset test:
# Mock 100 tasks
# Expected: Table paginates, charts render quickly
```

**Acceptance Criteria:**
- All targets met
- Dashboard feels fast
- No performance regressions

---

## Phase 12: Deployment (2 Tasks)

### T045: Documentation and Deployment Prep

**Objective:** Update documentation and prepare for deployment.

**Priority:** P0 (Blocker)
**Complexity:** Low
**Dependencies:** All previous tasks
**Estimated Time:** 2 hours

**Files to Modify:**
- `frontend/README.md`
- Create deployment checklist

**Implementation Steps:**
1. Update `frontend/README.md`:
   - Add dashboard features section
   - Document new routes
   - List new components
   - Add development instructions
2. Create deployment checklist:
   - All tests passing
   - No console errors
   - Environment variables configured
   - Build succeeds
   - Bundle size analyzed
3. Run final pre-deployment checks:
   - `npm test` (all tests pass)
   - `npm run build` (build succeeds)
   - `npm run start` (production build works)
   - Lighthouse audits (performance + accessibility)
4. Document rollback procedure
5. Create deployment runbook

**Expected Outcome:**
- Documentation updated
- Deployment checklist complete
- Ready for production deployment

**Validation Criteria:**
- [ ] README updated with dashboard info
- [ ] Deployment checklist created
- [ ] All tests pass
- [ ] Build succeeds without errors
- [ ] Production build tested locally
- [ ] Lighthouse scores meet targets
- [ ] Rollback procedure documented

**Test Cases:**
```bash
# Pre-deployment checks:
npm test                    # All tests pass
npm run build               # Build succeeds
npm run start               # Production server starts
# Open localhost:3000       # Dashboard works in production mode
# Run Lighthouse audits     # Scores meet targets
```

**Acceptance Criteria:**
- All checks pass
- Documentation complete
- Ready for deployment

---

### T046: Deploy to Production

**Objective:** Deploy dashboard to production environment.

**Priority:** P0 (Blocker)
**Complexity:** Low
**Dependencies:** T045 (Deployment prep)
**Estimated Time:** 1 hour

**Files to Modify:**
- None (deployment only)

**Implementation Steps:**
1. Merge feature branch to main:
   ```bash
   git checkout main
   git merge feature/dashboard-enhancement
   ```
2. Tag release:
   ```bash
   git tag -a v1.0.0 -m "Dashboard Enhancement Release"
   git push origin v1.0.0
   ```
3. Deploy to production:
   - Follow existing deployment process
   - Monitor deployment logs
   - Verify deployment succeeds
4. Smoke test production:
   - Visit production URL
   - Test dashboard loads
   - Test key features work
5. Monitor for errors:
   - Check error logs
   - Monitor performance metrics
6. Announce deployment to stakeholders

**Expected Outcome:**
- Dashboard deployed to production
- All features working
- No critical errors

**Validation Criteria:**
- [ ] Code merged to main
- [ ] Release tagged
- [ ] Deployment succeeds
- [ ] Production dashboard accessible
- [ ] Smoke tests pass (login, view dashboard, use chat)
- [ ] No error spikes in logs
- [ ] Performance metrics normal
- [ ] Stakeholders notified

**Test Cases:**
```bash
# Production smoke test:
1. Navigate to production URL
2. Login with test account
3. Navigate to /dashboard
4. Verify KPIs display correctly
5. Verify charts render
6. Verify table shows tasks
7. Send test chat message
8. Verify dashboard updates
9. Test on mobile device
10. Check browser console (no errors)
```

**Acceptance Criteria:**
- Deployment successful
- Dashboard live in production
- All features functional
- Monitoring active

---

## Completion Checklist

### All Tasks Complete When:

**Phase 0: Setup**
- [ ] T001: Dependencies installed
- [ ] T002: APIs verified
- [ ] T003: Directories created

**Phase 1: Utilities**
- [ ] T004: Analytics utility created
- [ ] T005: Date helpers created
- [ ] T006: Chart utils created
- [ ] T007: Utility tests passing

**Phase 2: API**
- [ ] T008: Chat API integrated
- [ ] T009: Chat API tested

**Phase 3: Dashboard**
- [ ] T010: Dashboard page created
- [ ] T011: Refresh handler added
- [ ] T012: Layout structure complete

**Phase 4: KPIs**
- [ ] T013: KPICard component created
- [ ] T014: DashboardKPIs created
- [ ] T015: KPIs integrated

**Phase 5: Charts**
- [ ] T016: DonutChart created
- [ ] T017: LineChart created
- [ ] T018: BarChart created
- [ ] T019: TaskCharts container created
- [ ] T020: Charts integrated

**Phase 6: Table**
- [ ] T021: TaskTableRow created
- [ ] T022: TaskTable created
- [ ] T023: Actions connected
- [ ] T024: Table integrated

**Phase 7: Chat**
- [ ] T025: ChatMessage created
- [ ] T026: VoiceInput hook created
- [ ] T027: VoiceInputButton created
- [ ] T028: ChatWidget created
- [ ] T029: TaskPolling hook created
- [ ] T030: Chat integrated

**Phase 8: Loading**
- [ ] T031: Skeletons created
- [ ] T032: Loading states added
- [ ] T033: Error handling added

**Phase 9: Accessibility**
- [ ] T034: Mobile responsive
- [ ] T035: ARIA labels added
- [ ] T036: Lighthouse audit passed
- [ ] T037: Contrast issues fixed

**Phase 10: Performance**
- [ ] T038: Lazy loading implemented
- [ ] T039: Memoization added
- [ ] T040: Search debounced

**Phase 11: Testing**
- [ ] T041: Integration tests written
- [ ] T042: Manual QA completed
- [ ] T043: Cross-browser tested
- [ ] T044: Performance verified

**Phase 12: Deployment**
- [ ] T045: Documentation updated
- [ ] T046: Deployed to production

**Total:** 46 tasks complete ✅

---

**End of Tasks Document**
