# Feature Specification: Professional Dashboard Enhancement

**Feature Name:** Dashboard Enhancement with Analytics & Chat Integration
**Feature ID:** F001
**Version:** 1.0
**Status:** Draft
**Created:** 2025-12-24
**Owner:** Phase-4 Team

---

## 1. Executive Summary

### 1.1 Overview
Transform the existing Todo + Chatbot application into a professional, dashboard-style SaaS product by adding analytics, data visualization, and an integrated chat widget—without altering any core backend or business logic.

### 1.2 Business Goals
- Create a demo-ready, professional-looking product
- Provide users with visual insights into their task management patterns
- Enable seamless task management through multiple interfaces (UI, chat, voice)
- Demonstrate AI-powered productivity features

### 1.3 Success Metrics
- Dashboard loads and displays all KPIs within 3 seconds
- Charts accurately reflect real-time task data
- Chat actions (add, complete, delete) update dashboard UI within 500ms
- Zero regressions in existing task management functionality
- Professional SaaS visual design that impresses stakeholders

---

## 2. Current State Analysis

### 2.1 Existing Frontend Architecture
**Framework:** Next.js 14 with JavaScript (Pages: `/`, `/login`, `/todos`, `/todos/new`, `/todos/[id]`, `/tour`)
**Styling:** Tailwind CSS with glassmorphism design system
**Components:**
- UI primitives: Button, Card, Checkbox, Input, Select
- Task components: TodoList, TodoItem, TodoForm, TodoFilters, Navbar

**Key Files:**
- `frontend/app/todos/page.js:1-130` - Main tasks page with list view
- `frontend/lib/api.js` - API client for backend communication
- `frontend/lib/auth.js` - Authentication utilities

### 2.2 Existing Backend Architecture
**Framework:** FastAPI with SQLModel
**Database:** PostgreSQL
**Key Models:**
- `backend/src/models/task.py:7-31` - Task entity (id, user_id, title, description, status, created_at, updated_at)
- `backend/src/models/conversation.py` - Chat conversation tracking
- `backend/src/models/message.py` - Chat message persistence
- `backend/src/models/user.py` - User entity with auth

**API Endpoints:**
- `POST /api/{user_id}/chat` - Chat interface (backend/src/api/routes.py:39-177)
- Task CRUD endpoints (assumed from MCP tools)

**MCP Tools (AI Chatbot Integration):**
- `list_tasks` - Retrieve/filter tasks (backend/src/mcp/tools/list_tasks.py:1-190)
- `add_task` - Create new task
- `complete_task` - Mark task complete
- `update_task` - Update task details
- `delete_task` - Remove task

### 2.3 Current Data Flow
```
User Input (Chat/UI)
  → FastAPI Endpoints
    → Orchestrator Agent (if chat)
      → MCP Tools
        → SQLModel/PostgreSQL
          → Response
```

### 2.4 Authentication
JWT-based authentication with user isolation (user_id in all queries).

---

## 3. Feature Requirements

### 3.1 In Scope

#### 3.1.1 Dashboard Page Enhancement
**New Route:** `/dashboard` (or replace `/todos` page)

**KPI Cards (4 cards):**
1. **Total Tasks** - Count of all tasks for authenticated user
2. **Completed Tasks** - Count of tasks with status="completed"
3. **Pending Tasks** - Count of tasks with status="pending"
4. **Overdue Tasks** - Count of tasks created > 7 days ago and status="pending"

**Visual Design:**
- Card-based layout with glassmorphism styling (consistent with existing design)
- Icons for each metric
- Trend indicators (e.g., "+5 this week" if feasible with available data)
- Responsive grid (2x2 on mobile, 4x1 on desktop)

#### 3.1.2 Data Visualization Charts

**Chart 1: Donut Chart - Task Status Distribution**
- Shows percentage of pending vs completed tasks
- Colors: Brand colors from Tailwind config
- Center displays total task count
- Interactive tooltips with exact counts

**Chart 2: Line Chart - Tasks Created vs Completed Over Time**
- X-axis: Last 7 days (or last 30 days)
- Y-axis: Task count
- Two lines: Tasks created (blue), Tasks completed (green)
- Data aggregated by day from `created_at` and `updated_at` timestamps
- Shows productivity trends

**Chart 3: Bar Chart - Tasks by Status**
- X-axis: Status categories (Pending, Completed)
- Y-axis: Task count
- Horizontal or vertical bars
- Alternative: If priority/category fields exist in Task model, group by those instead

**Charting Library:**
- Use **Recharts** (React-compatible, lightweight) OR **Chart.js** with react-chartjs-2
- Must be accessible (ARIA labels, keyboard navigation)
- Responsive and mobile-friendly

#### 3.1.3 Task Management UI (Enhanced Table/List)

**Location:** Below charts on dashboard page

**Features:**
- **Table View** with columns: Checkbox, Title, Status, Created Date, Actions
- **Filters:**
  - Status dropdown (All, Pending, Completed)
  - Search input (filter by title/description)
- **Actions per row:**
  - Complete button (toggle status)
  - Edit button (navigate to `/todos/[id]`)
  - Delete button (with confirmation)
- **Sorting:** Clickable column headers (sort by created_at, status, title)
- **Pagination:** Show 10-20 tasks per page with next/prev controls

**Data Sync:**
- Must fetch latest tasks from backend on page load
- Must refetch tasks after any mutation (complete, delete, edit)
- Must update when chat widget performs task actions

#### 3.1.4 Chat Widget Integration

**Visual Placement:**
- **Option A:** Floating widget (bottom-right corner, expandable/collapsible)
- **Option B:** Side panel (right sidebar, toggle open/close)
- **Recommendation:** Floating widget for better UX

**Widget Features:**
- **Chat Input:** Text area with send button
- **Voice Input Button:** Microphone icon, uses Web Speech API
- **Message Display:** Scrollable chat history with user/assistant message bubbles
- **Language Support:** Auto-detect English/Urdu; respond in detected language
- **Visual Feedback:** Loading indicator while processing
- **Error Handling:** Display friendly error messages

**Backend Integration:**
- Uses existing `POST /api/{user_id}/chat` endpoint
- Passes user message to backend
- Receives assistant response and displays
- No changes to backend chat logic

**Real-Time Dashboard Updates:**
- After chat action (e.g., "Add task: buy milk"), refetch tasks and update KPIs/charts
- Use polling (every 2-3 seconds after chat message) OR WebSocket (out of scope for Phase 1)
- Visual indicator that data is refreshing

#### 3.1.5 Visual Design & UX

**Design System:**
- Extend existing Tailwind CSS configuration
- Use glassmorphism effects (`.glass-panel`, `.glass-card` classes from existing code)
- Brand colors: Maintain existing palette (brand-300, brand-400, brand-500)
- Typography: Consistent with existing font stack

**Responsive Behavior:**
- Desktop-first approach (as specified in user requirements)
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Mobile: Stack KPI cards vertically, simplify charts, hide chat widget by default

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation for all interactive elements
- Screen reader support (ARIA labels for charts, KPIs)
- Color contrast ratio ≥ 4.5:1

**Animations:**
- Smooth transitions (300ms duration)
- Skeleton loaders for data fetching
- Microinteractions (button hover, card hover)

### 3.2 Out of Scope

**Explicitly Excluded:**
- ❌ New authentication logic or user management features
- ❌ Backend API changes (beyond reading existing task data)
- ❌ Database schema modifications (no new columns/tables)
- ❌ Real-time WebSocket connections (Phase 1)
- ❌ Task priority/category fields (unless already exist in backend)
- ❌ Collaboration features (task sharing, comments)
- ❌ Email/calendar integrations
- ❌ Export/import functionality
- ❌ Recurring tasks or reminders

### 3.3 Constraints

1. **Preservation Rule:** Existing frontend pages (`/login`, `/todos/new`, `/todos/[id]`) and backend logic MUST NOT be modified beyond necessary API calls
2. **No Breaking Changes:** All existing functionality must continue working
3. **Type Safety Deferred:** Phase 1 uses JavaScript; TypeScript migration in future phase
4. **Browser Compatibility:** Modern browsers only (Chrome, Firefox, Safari, Edge - last 2 versions)
5. **Performance Budget:** Dashboard initial load < 3s, chart rendering < 1s
6. **API Call Optimization:** Minimize LLM API calls to control costs

---

## 4. User Stories & Acceptance Criteria

### User Story 1: View Task Analytics Dashboard
**As a** user,
**I want to** see a visual dashboard with my task statistics and charts,
**So that** I can understand my productivity patterns at a glance.

**Acceptance Criteria:**
- [ ] Dashboard page displays 4 KPI cards with accurate counts
- [ ] Donut chart shows correct pending vs completed ratio
- [ ] Line chart displays tasks created/completed over last 7 days
- [ ] Bar chart shows task distribution by status
- [ ] All data loads within 3 seconds on 4G connection
- [ ] Charts are responsive and readable on mobile devices

### User Story 2: Manage Tasks from Dashboard
**As a** user,
**I want to** view, filter, search, and manage my tasks directly from the dashboard,
**So that** I can perform all task operations without navigating to separate pages.

**Acceptance Criteria:**
- [ ] Task table displays all tasks with title, status, created date
- [ ] Filter by status (All/Pending/Completed) updates table immediately
- [ ] Search by title/description filters results in real-time
- [ ] Complete button toggles task status and updates KPIs/charts
- [ ] Delete button (with confirmation) removes task and updates UI
- [ ] Edit button navigates to existing `/todos/[id]` edit page
- [ ] Pagination controls work correctly for > 20 tasks

### User Story 3: Manage Tasks via Chat Widget
**As a** user,
**I want to** add, complete, and query tasks using natural language through a chat interface,
**So that** I can manage tasks conversationally without clicking through the UI.

**Acceptance Criteria:**
- [ ] Chat widget is accessible from dashboard (floating button or panel)
- [ ] Text input sends message to backend and displays assistant response
- [ ] Voice input button captures speech and converts to text (browser-supported)
- [ ] Chat actions (e.g., "add task: buy groceries") create tasks in database
- [ ] Dashboard updates (tasks list, KPIs, charts) within 500ms after chat action
- [ ] Urdu language inputs receive Urdu responses (existing backend feature)
- [ ] Error messages display clearly (e.g., "Failed to add task")

### User Story 4: Experience Professional SaaS Design
**As a** stakeholder or demo viewer,
**I want to** see a modern, polished, professional-looking application,
**So that** I perceive the product as high-quality and production-ready.

**Acceptance Criteria:**
- [ ] UI uses consistent glassmorphism design with brand colors
- [ ] Spacing, typography, and layout follow SaaS best practices
- [ ] Smooth animations and transitions (300ms duration)
- [ ] No visual bugs, layout shifts, or broken UI elements
- [ ] Responsive design works correctly on desktop, tablet, mobile
- [ ] Accessibility standards met (keyboard nav, screen reader support)

---

## 5. Technical Design

### 5.1 Frontend Architecture

#### 5.1.1 New Components

**Dashboard Page Component:**
```javascript
// File: frontend/app/dashboard/page.js
// OR replace frontend/app/todos/page.js (clarify with user)

'use client';
import { useState, useEffect } from 'react';
import DashboardKPIs from '../../components/dashboard/DashboardKPIs';
import TaskCharts from '../../components/dashboard/TaskCharts';
import TaskTable from '../../components/dashboard/TaskTable';
import ChatWidget from '../../components/chat/ChatWidget';
import Navbar from '../../components/Navbar';
import { tasksAPI } from '../../lib/api';
import { getUser, isAuthenticated } from '../../lib/auth';

export default function DashboardPage() {
  // State: tasks, loading, filters
  // useEffect: fetch tasks on mount and after chat actions
  // Handlers: complete, delete, filter, search
  // Render: Navbar + KPIs + Charts + Table + ChatWidget
}
```

**DashboardKPIs Component:**
```javascript
// File: frontend/components/dashboard/DashboardKPIs.js
// Props: tasks (array)
// Computes: totalTasks, completedTasks, pendingTasks, overdueTasks
// Renders: 4 KPI cards in responsive grid
```

**TaskCharts Component:**
```javascript
// File: frontend/components/dashboard/TaskCharts.js
// Props: tasks (array)
// Uses: Recharts library
// Renders: DonutChart, LineChart, BarChart in responsive layout
```

**TaskTable Component:**
```javascript
// File: frontend/components/dashboard/TaskTable.js
// Props: tasks, onComplete, onDelete, onEdit, filters, onFilterChange
// Renders: Table with filters, search, sorting, pagination, action buttons
```

**ChatWidget Component:**
```javascript
// File: frontend/components/chat/ChatWidget.js
// State: messages, input, isOpen, isLoading
// Props: userId, onTaskUpdate (callback to refresh dashboard data)
// Features: Text input, voice input, message history, expand/collapse
// API: POST /api/{user_id}/chat
```

#### 5.1.2 Data Fetching Strategy

**Option A: Polling (Recommended for Phase 1)**
- Fetch tasks on page load
- After chat action, set 2-second interval to poll tasks API
- Stop polling after 3-4 iterations
- Simple implementation, no backend changes

**Option B: Optimistic Updates**
- Immediately update UI after chat action (assume success)
- Refetch tasks in background to confirm
- Rollback on error

**Option C: WebSocket (Future Phase)**
- Real-time bidirectional communication
- Requires backend WebSocket server setup
- Out of scope for Phase 1

**Decision:** Use **Option A (Polling)** for simplicity and no backend changes.

#### 5.1.3 State Management

**Approach:** React Context API or useState at page level
- No Redux/Zustand needed for Phase 1 (single page, simple state)
- If app grows, consider Zustand for global state

**State Shape:**
```javascript
{
  tasks: [], // Array of task objects from API
  loading: false, // Boolean for loading state
  filters: { status: 'all', search: '' }, // Filter state
  chatOpen: false, // Chat widget open/closed
  refreshTrigger: 0 // Increment to trigger refetch
}
```

### 5.2 Backend Integration

#### 5.2.1 Required API Endpoints

**Existing Endpoints (No Changes Required):**
- `POST /api/{user_id}/chat` - Chat interface
- Assumed task CRUD endpoints (GET, POST, PUT, DELETE `/api/{user_id}/tasks`)

**Data Requirements:**
- Tasks must include: id, user_id, title, description, status, created_at, updated_at
- Chat endpoint already handles task actions via MCP tools

**Verification Needed:**
- [ ] Confirm task list endpoint exists (likely `GET /api/{user_id}/tasks`)
- [ ] Confirm query params for filtering (status, search, limit, offset)
- [ ] Confirm task schema matches backend/src/models/task.py

#### 5.2.2 Analytics Data Computation

**Computed on Frontend (from fetched tasks):**
- Total tasks: `tasks.length`
- Completed: `tasks.filter(t => t.status === 'completed').length`
- Pending: `tasks.filter(t => t.status === 'pending').length`
- Overdue: `tasks.filter(t => t.status === 'pending' && isOverdue(t.created_at)).length`
  - `isOverdue`: created > 7 days ago

**Time-Series Data (Line Chart):**
- Group tasks by `created_at.date` for last 7 days
- Count tasks created per day
- Count tasks completed per day (if `updated_at` reflects completion time)

**No Backend Aggregation Needed:** All analytics computed in frontend from full task list.

### 5.3 Technology Stack Additions

**New Dependencies (frontend/package.json):**
```json
{
  "dependencies": {
    "recharts": "^2.10.3", // Charting library
    "date-fns": "^3.0.0"    // Date manipulation for time-series
  }
}
```

**Optional:**
- `react-hot-toast` or `sonner` for toast notifications (task completed, deleted, etc.)

### 5.4 File Structure Changes

**New Files:**
```
frontend/
  app/
    dashboard/
      page.js                  # Main dashboard page
  components/
    dashboard/
      DashboardKPIs.js         # KPI cards component
      TaskCharts.js            # Charts component (Donut, Line, Bar)
      TaskTable.js             # Enhanced task table with filters
    chat/
      ChatWidget.js            # Floating/panel chat widget
      ChatMessage.js           # Individual message bubble
      VoiceInput.js            # Voice input button/logic
  lib/
    analytics.js               # Helper functions for KPI/chart data computation
    date-helpers.js            # Date formatting, isOverdue, groupByDate, etc.
```

**Modified Files:**
```
frontend/
  app/layout.js              # Add ChatWidget globally OR per-page
  lib/api.js                 # Add chat API methods if not present
  tailwind.config.js         # Extend colors/spacing if needed (minimal)
```

**No Changes to:**
- `frontend/app/todos/page.js` (existing task list page)
- `frontend/app/todos/new/page.js` (new task page)
- `frontend/app/todos/[id]/page.js` (edit task page)
- Any backend files

---

## 6. User Interface Mockups

### 6.1 Dashboard Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────┐
│ Navbar (existing component)                                 │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│ │  Total  │  │Completed│  │ Pending │  │ Overdue │   KPIs │
│ │   42    │  │   28    │  │   14    │  │    3    │        │
│ └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                             │
│ ┌──────────────────┐  ┌──────────────────────────────────┐ │
│ │  Donut Chart     │  │  Line Chart: Created vs Completed│ │
│ │  Status Dist.    │  │  (Last 7 days)                   │ │
│ └──────────────────┘  └──────────────────────────────────┘ │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │  Bar Chart: Tasks by Status                          │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐   │
│ │  Filters: [Status ▼] [Search...]                     │   │
│ ├──────────────────────────────────────────────────────┤   │
│ │  Task Table                                          │   │
│ │  ☐ Buy groceries       | Pending   | 2d ago | [···] │   │
│ │  ☑ Finish project      | Completed | 5d ago | [···] │   │
│ │  ☐ Call dentist        | Pending   | 1w ago | [···] │   │
│ │  ... (10-20 rows)                                     │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│                                          ┌──────────────┐   │
│                                          │ Chat Widget  │ 💬│
│                                          │ (Floating)   │   │
│                                          └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Chat Widget (Expanded)

```
┌────────────────────────────┐
│ Task Assistant        [×]  │
├────────────────────────────┤
│ 👤 Add task: buy milk      │
│                            │
│ 🤖 Task "buy milk" added!  │
│    It's in your pending    │
│    tasks now.              │
│                            │
│ 👤 Show my tasks           │
│                            │
│ 🤖 You have 15 tasks:      │
│    - 9 pending             │
│    - 6 completed           │
│    ...                     │
├────────────────────────────┤
│ [Type a message...     🎤] │
│ [Send]                     │
└────────────────────────────┘
```

### 6.3 Mobile Layout (Stacked)

```
┌───────────────────┐
│ Navbar            │
├───────────────────┤
│ ┌───────────────┐ │
│ │  Total: 42    │ │
│ └───────────────┘ │
│ ┌───────────────┐ │
│ │ Completed: 28 │ │
│ └───────────────┘ │
│ ┌───────────────┐ │
│ │ Pending: 14   │ │
│ └───────────────┘ │
│ ┌───────────────┐ │
│ │ Overdue: 3    │ │
│ └───────────────┘ │
│                   │
│ Charts (swipeable)│
│                   │
│ Task List         │
│ ...               │
│                   │
│        💬 (Button)│
└───────────────────┘
```

---

## 7. Non-Functional Requirements

### 7.1 Performance

**Target Metrics:**
- **Initial Page Load:** < 3 seconds (p95) on 4G connection
- **Time to Interactive (TTI):** < 5 seconds
- **Chart Rendering:** < 1 second for all 3 charts
- **API Response Time:** < 500ms for task list endpoint
- **Chat Response:** < 2 seconds (limited by LLM API; backend already optimized)

**Optimization Strategies:**
- Lazy load chart library (code splitting)
- Memoize KPI calculations
- Debounce search input (300ms)
- Pagination for task table (20 items per page)

### 7.2 Accessibility (WCAG 2.1 Level AA)

**Requirements:**
- [ ] Keyboard navigation for all interactive elements (Tab, Enter, Escape)
- [ ] Screen reader support: ARIA labels for charts, KPIs, buttons
- [ ] Color contrast ≥ 4.5:1 for all text
- [ ] Focus indicators visible on all interactive elements
- [ ] No content flashing or rapid animations
- [ ] Skip navigation links if needed

**Testing Tools:**
- axe DevTools browser extension
- Lighthouse accessibility audit
- Manual keyboard-only navigation test

### 7.3 Browser Compatibility

**Supported Browsers:**
- Chrome 110+ (latest 2 versions)
- Firefox 115+ (latest 2 versions)
- Safari 16+ (latest 2 versions)
- Edge 110+ (latest 2 versions)

**Not Supported:**
- Internet Explorer (any version)
- Older mobile browsers (iOS < 15, Android < 10)

### 7.4 Security

**Considerations:**
- [ ] All API calls include authentication token (existing JWT logic)
- [ ] User isolation enforced (user_id in all queries)
- [ ] No sensitive data logged to console
- [ ] XSS prevention: Sanitize user input in chat widget
- [ ] CSRF protection: Use existing backend CORS/CSRF setup

**No New Security Logic Required:** Leverage existing auth/authz.

### 7.5 Scalability

**Current Scope (Single User):**
- Frontend fetches full task list (reasonable for < 1000 tasks per user)
- If user has > 100 tasks, implement pagination/virtualization

**Future Considerations:**
- Infinite scroll for task table
- Backend aggregation for analytics (if task count > 5000)
- Caching layer (Redis) for frequent queries

---

## 8. Data Model & API Contracts

### 8.1 Task Model (Existing)

**Schema (from backend/src/models/task.py):**
```python
class Task:
    id: int (primary key)
    user_id: str (indexed, foreign key)
    title: str (max 200 chars)
    description: Optional[str] (max 2000 chars)
    status: str (default "pending") # "pending" | "completed"
    created_at: datetime (auto-generated)
    updated_at: datetime (auto-generated)
```

**No Schema Changes Required.**

### 8.2 API Endpoints (Assumed)

**GET /api/{user_id}/tasks**
```
Query Params:
  - status: "all" | "pending" | "completed"
  - search: string (filter by title/description)
  - limit: int (default 20, max 100)
  - offset: int (pagination)
  - sort_order: "newest_first" | "oldest_first"

Response:
{
  "tasks": [ ... ],
  "total_count": 42,
  "returned_count": 20,
  "has_more": true,
  "next_offset": 20
}
```

**POST /api/{user_id}/chat** (Existing)
```
Request:
{
  "message": "Add task: buy milk"
}

Response:
{
  "response": "Task 'buy milk' added successfully!",
  "conversation_id": 123
}
```

**Action:** Verify endpoint exists or map to existing MCP tool logic.

### 8.3 Frontend Data Structures

**Task Object (TypeScript-style for clarity):**
```typescript
interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  status: "pending" | "completed";
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}
```

**KPI Data:**
```javascript
{
  totalTasks: number,
  completedTasks: number,
  pendingTasks: number,
  overdueTasks: number
}
```

**Chart Data (Donut):**
```javascript
[
  { name: "Pending", value: 14, color: "#fbbf24" },
  { name: "Completed", value: 28, color: "#34d399" }
]
```

**Chart Data (Line):**
```javascript
[
  { date: "Dec 18", created: 3, completed: 2 },
  { date: "Dec 19", created: 5, completed: 4 },
  ...
]
```

---

## 9. Error Handling & Edge Cases

### 9.1 Error Scenarios

**Frontend Errors:**
1. **API Fetch Failure:** Display error message "Failed to load tasks. Please refresh."
2. **Empty Task List:** Show empty state with illustration + "Add your first task" CTA
3. **Chat API Error:** Display error message in chat widget "Failed to process message. Try again."
4. **Voice Input Not Supported:** Hide voice button, show tooltip "Voice input not supported in this browser"

**Backend Errors (Existing Handling):**
- 403 Forbidden (user_id mismatch): Redirect to login
- 500 Internal Server Error: Display generic error message

### 9.2 Edge Cases

1. **User has 0 tasks:**
   - KPIs show 0 for all metrics
   - Charts display empty state message
   - Task table shows "No tasks yet" with CTA to add first task

2. **User has 1000+ tasks:**
   - Implement pagination (20 tasks per page)
   - Show total count in UI ("Showing 1-20 of 1,247 tasks")
   - Consider virtualization library (react-window) for performance

3. **Task title > 50 chars (in table):**
   - Truncate with ellipsis ("This is a very long task titl...")
   - Show full title on hover (tooltip)

4. **Chat widget on mobile:**
   - Full-screen overlay (better UX than tiny widget)
   - Close button to return to dashboard

5. **Slow network (3G):**
   - Show skeleton loaders for KPIs, charts, table
   - Display loading indicator during chat processing

6. **Date edge cases:**
   - Tasks created today: Show "Today" instead of "0d ago"
   - Tasks created > 365 days ago: Show full date "Dec 15, 2023"

### 9.3 Validation

**No New Validation Required:**
- Task creation/update validation handled by existing backend
- Chat input: No length limits (backend handles)

**Client-Side Validation:**
- Search input: Trim whitespace, debounce 300ms
- Pagination: Ensure offset ≥ 0, limit ≤ 100

---

## 10. Testing Strategy

### 10.1 Unit Tests

**Components to Test:**
- `DashboardKPIs`: Verify KPI calculations for various task lists
- `TaskCharts`: Verify chart data transformation logic
- `TaskTable`: Test filtering, sorting, pagination logic
- `lib/analytics.js`: Test helper functions (isOverdue, groupByDate, etc.)

**Tools:** Jest + React Testing Library

**Example Test:**
```javascript
// DashboardKPIs.test.js
test('calculates overdue tasks correctly', () => {
  const tasks = [
    { id: 1, status: 'pending', created_at: '2025-12-01T00:00:00Z' },
    { id: 2, status: 'pending', created_at: '2025-12-22T00:00:00Z' },
  ];
  const kpis = calculateKPIs(tasks);
  expect(kpis.overdueTasks).toBe(1); // Only task 1 is > 7 days old
});
```

### 10.2 Integration Tests

**Scenarios:**
1. **Dashboard loads with real API data:**
   - Mock `GET /api/{user_id}/tasks` endpoint
   - Verify KPIs, charts, table render correctly

2. **Chat action updates dashboard:**
   - Mock `POST /api/{user_id}/chat` endpoint
   - Simulate chat message "Add task: test"
   - Verify dashboard refetches tasks and updates UI

3. **Task table actions (complete, delete):**
   - Mock task update/delete endpoints
   - Click complete button → verify status changes in UI
   - Click delete button → verify task removed from UI

**Tools:** Jest + MSW (Mock Service Worker)

### 10.3 End-to-End Tests

**Critical Paths:**
1. User logs in → sees dashboard with tasks
2. User completes task → KPIs and charts update
3. User sends chat message "Add task: example" → task appears in dashboard
4. User filters tasks by status → table updates correctly

**Tools:** Playwright or Cypress

**Example E2E Test:**
```javascript
test('chat widget adds task and updates dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="chat-widget-toggle"]');
  await page.fill('[data-testid="chat-input"]', 'Add task: buy groceries');
  await page.click('[data-testid="chat-send"]');
  await page.waitForSelector('text=Task "buy groceries" added');
  // Verify task appears in table
  await expect(page.locator('text=buy groceries')).toBeVisible();
});
```

### 10.4 Accessibility Testing

**Manual Tests:**
- [ ] Keyboard-only navigation through dashboard
- [ ] Screen reader announces KPIs, chart data, task actions
- [ ] Focus indicators visible on all interactive elements

**Automated Tests:**
- Run axe-core in Jest tests
- Lighthouse accessibility audit (target score ≥ 90)

### 10.5 Performance Testing

**Metrics to Track:**
- Lighthouse Performance score (target ≥ 80)
- Bundle size analysis (ensure chart library doesn't bloat bundle > 500KB)
- API response times (monitor with Network tab)

**Load Testing:**
- Test dashboard with 100, 500, 1000 tasks
- Verify pagination and rendering performance

---

## 11. Deployment & Rollout

### 11.1 Deployment Strategy

**Phase 1: Feature Branch Development**
- Create feature branch `feature/dashboard-enhancement`
- Develop components incrementally (KPIs → Charts → Table → Chat)
- Run tests locally + CI pipeline

**Phase 2: Staging Environment**
- Deploy to staging environment
- Perform manual QA testing
- Accessibility audit
- Performance testing

**Phase 3: Production Rollout**
- Merge to `main` branch
- Deploy to production
- Monitor error logs, performance metrics
- Rollback plan: Revert commit if critical issues

**No Feature Flags Needed:** Dashboard is additive; existing pages unaffected.

### 11.2 Rollback Plan

**Triggers for Rollback:**
- Dashboard not loading (500 errors)
- KPIs displaying incorrect data
- Chat widget breaks existing chat functionality
- Performance regression (p95 load time > 5s)

**Rollback Steps:**
1. Revert to previous Git commit
2. Redeploy frontend
3. Investigate issue in dev environment
4. Fix and re-test before re-deploying

### 11.3 Monitoring & Observability

**Metrics to Monitor (Post-Launch):**
- Dashboard page load time (p50, p95, p99)
- API error rates for `/api/{user_id}/tasks` and `/api/{user_id}/chat`
- Chart rendering performance
- User engagement (chat widget usage, task completions)

**Tools:**
- Frontend: Google Analytics or Plausible for page views
- Backend: Existing logging (backend/backend.log)
- Sentry or similar for error tracking

---

## 12. Dependencies & Risks

### 12.1 Dependencies

**Internal:**
- Existing backend task API endpoints (verify availability)
- Existing chat endpoint (`POST /api/{user_id}/chat`)
- Existing auth/JWT system

**External:**
- Recharts library (charting)
- date-fns library (date manipulation)
- Web Speech API (browser-native, no install)

**No Blocking Dependencies:** All critical pieces exist.

### 12.2 Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Task list API doesn't exist or has different schema | High | Medium | Verify API early; create adapter layer if needed |
| Charts library causes bundle bloat | Medium | Low | Lazy load charts; use tree-shaking; monitor bundle size |
| Web Speech API not supported in target browsers | Low | Medium | Provide fallback (hide voice button, text-only input) |
| Real-time updates don't work (polling fails) | Medium | Low | Test polling thoroughly; add retry logic |
| Existing pages break due to shared component changes | High | Low | Avoid modifying existing components; create new ones |
| Performance regression with large task lists | Medium | Medium | Implement pagination early; test with 1000+ tasks |

### 12.3 Open Questions

1. **Dashboard Route:** Should dashboard be `/dashboard` (new page) or replace `/todos` (existing page)?
   - **Recommendation:** Create new `/dashboard` route, keep `/todos` as legacy list view. Ask user.

2. **Chart Library:** Recharts vs Chart.js?
   - **Recommendation:** Recharts (better React integration, smaller bundle).

3. **Voice Input Fallback:** What to do if browser doesn't support Web Speech API?
   - **Recommendation:** Hide voice button, show tooltip "Not supported in this browser."

4. **Task Overdue Definition:** Use 7 days or configurable threshold?
   - **Recommendation:** Hardcode 7 days for Phase 1; make configurable in Phase 2.

5. **Chat Widget Placement:** Floating widget or sidebar?
   - **Recommendation:** Floating widget (bottom-right) for better UX. Ask user.

---

## 13. Success Criteria & Definition of Done

### 13.1 Functional Success Criteria

- [ ] All 4 KPI cards display accurate real-time data
- [ ] All 3 charts (Donut, Line, Bar) render correctly with real task data
- [ ] Task table supports filtering, searching, sorting, pagination
- [ ] Complete and Delete actions work and update dashboard immediately
- [ ] Chat widget sends messages to backend and displays responses
- [ ] Chat actions (add, complete tasks) update dashboard within 500ms
- [ ] Voice input works in supported browsers
- [ ] Urdu language support works in chat widget

### 13.2 Non-Functional Success Criteria

- [ ] Dashboard loads in < 3 seconds (p95)
- [ ] Charts render in < 1 second
- [ ] All interactions feel smooth (no jank, 60 FPS)
- [ ] Lighthouse Performance score ≥ 80
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] No regressions in existing pages (`/login`, `/todos`, `/todos/new`, `/todos/[id]`)
- [ ] Zero console errors or warnings in production

### 13.3 Quality Gates

**Before Merging to Main:**
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Manual QA checklist completed
- [ ] Accessibility audit passed (axe DevTools, manual keyboard test)
- [ ] Performance benchmarks met (Lighthouse)
- [ ] Code review approved by peer
- [ ] No TypeScript errors (if migrated) or ESLint warnings

**Before Production Deployment:**
- [ ] Staging environment tested end-to-end
- [ ] No critical bugs in issue tracker
- [ ] Rollback plan documented and tested
- [ ] Monitoring/alerting configured

### 13.4 Definition of Done

**A feature is considered DONE when:**
1. All acceptance criteria for user stories are met
2. All tests (unit, integration, E2E) pass
3. Code is reviewed and approved
4. Documentation updated (README, API docs if needed)
5. Deployed to staging and manually tested
6. Performance and accessibility benchmarks met
7. No known critical or high-priority bugs
8. Stakeholder demo completed and approved

---

## 14. Timeline & Milestones

**Note:** Per constitution, no time estimates. Focus on incremental delivery.

### Milestone 1: Foundation
- [ ] Set up dashboard page route
- [ ] Install Recharts and date-fns dependencies
- [ ] Create basic layout (Navbar + placeholder sections)

### Milestone 2: KPIs & Charts
- [ ] Implement DashboardKPIs component with accurate calculations
- [ ] Implement TaskCharts component (Donut, Line, Bar)
- [ ] Verify charts render correctly with mock data

### Milestone 3: Task Table
- [ ] Implement TaskTable component with filters, search, sorting
- [ ] Add pagination controls
- [ ] Connect Complete and Delete actions to API

### Milestone 4: Chat Widget
- [ ] Implement ChatWidget component (text input, message display)
- [ ] Connect to existing `/api/{user_id}/chat` endpoint
- [ ] Implement voice input button (with browser compatibility check)
- [ ] Implement dashboard refresh after chat actions

### Milestone 5: Polish & Testing
- [ ] Add responsive design (mobile, tablet)
- [ ] Implement loading states, error states, empty states
- [ ] Run accessibility audit and fix issues
- [ ] Run performance audit and optimize
- [ ] Write unit and integration tests

### Milestone 6: Deployment
- [ ] Deploy to staging
- [ ] Conduct manual QA
- [ ] Fix bugs from QA
- [ ] Deploy to production
- [ ] Monitor metrics post-launch

---

## 15. Appendix

### 15.1 Glossary

- **KPI:** Key Performance Indicator (e.g., Total Tasks, Completed Tasks)
- **MCP:** Model Context Protocol (tool integration framework for AI chatbot)
- **SaaS:** Software as a Service
- **Glassmorphism:** UI design style with frosted glass effect
- **JWT:** JSON Web Token (authentication mechanism)
- **WCAG:** Web Content Accessibility Guidelines

### 15.2 References

- [Recharts Documentation](https://recharts.org/)
- [Web Speech API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 15.3 Revision History

| Version | Date       | Changes                          | Author       |
|---------|------------|----------------------------------|--------------|
| 1.0     | 2025-12-24 | Initial specification created    | Phase-4 Team |

---

**End of Specification**
