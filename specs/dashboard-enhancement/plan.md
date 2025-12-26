# Implementation Plan: Dashboard Enhancement

**Feature:** Dashboard Enhancement with Analytics & Chat Integration
**Feature ID:** F001
**Plan Version:** 1.0
**Created:** 2025-12-24
**Status:** Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Codebase Analysis](#2-codebase-analysis)
3. [Reusable Components Identification](#3-reusable-components-identification)
4. [Architecture Overview](#4-architecture-overview)
5. [Implementation Phases](#5-implementation-phases)
6. [Risk Mitigation Strategy](#6-risk-mitigation-strategy)
7. [Testing Strategy](#7-testing-strategy)
8. [Rollback Plan](#8-rollback-plan)
9. [Success Criteria](#9-success-criteria)

---

## 1. Executive Summary

### 1.1 Plan Overview

This plan provides a step-by-step, incremental approach to transform the existing Todo application into a professional dashboard-style product with analytics, charts, and integrated chat widget—without modifying any backend logic or breaking existing functionality.

### 1.2 Key Principles

- **Incremental Delivery:** Each phase produces working, testable functionality
- **Zero Backend Changes:** All enhancements are frontend-only
- **Preservation First:** Existing pages (`/todos`, `/login`, etc.) remain untouched
- **Risk Minimization:** New route (`/dashboard`), new components, isolated changes
- **Reuse Maximized:** Leverage existing UI components, styles, API client

### 1.3 Implementation Strategy

**Approach:** Create new `/dashboard` route with new components, leaving existing `/todos` route intact as legacy fallback.

**Rationale:**
- Minimal risk of breaking existing functionality
- Allows side-by-side testing (old vs new)
- Easy rollback (remove `/dashboard` route if issues arise)
- Incremental user migration path

---

## 2. Codebase Analysis

### 2.1 Existing Frontend Architecture

**Framework:** Next.js 14.0.4 (App Router)
**Language:** JavaScript (no TypeScript)
**Styling:** Tailwind CSS 3.4.0 with custom glassmorphism design system

**Current Routes:**
- `/` - Landing page (frontend/app/page.js:1-105)
- `/login` - Authentication (frontend/app/login/page.js)
- `/todos` - Task list page (frontend/app/todos/page.js:1-130)
- `/todos/new` - Create task (frontend/app/todos/new/page.js)
- `/todos/[id]` - Edit task (frontend/app/todos/[id]/page.js)
- `/tour` - Product tour (frontend/app/tour/page.js)

**Layout:** Global layout with dark gradient background (frontend/app/layout.js)

### 2.2 Existing Components

**UI Primitives (Reusable):**
- `Button` (frontend/components/ui/Button.js) - Primary/secondary variants
- `Card` (frontend/components/ui/Card.js:1-26) - Glassmorphism card with header/footer
- `Input` (frontend/components/ui/Input.js) - Styled input field
- `Checkbox` (frontend/components/ui/Checkbox.js) - Custom checkbox
- `Select` (frontend/components/ui/Select.js) - Dropdown select

**Task Components (Partially Reusable):**
- `Navbar` (frontend/components/Navbar.js) - Top navigation with user menu
- `TodoList` (frontend/components/TodoList.js:1-63) - List container with loading/empty states
- `TodoItem` (frontend/components/TodoItem.js) - Individual task item
- `TodoFilters` (frontend/components/TodoFilters.js) - Filter controls (status, search, sort)
- `TodoForm` (frontend/components/TodoForm.js) - Task creation/edit form

### 2.3 Existing API Client

**Location:** frontend/lib/api.js:1-184

**Available Methods:**
- `tasksAPI.list(userId, filters)` - Get tasks with filtering
- `tasksAPI.get(userId, taskId)` - Get single task
- `tasksAPI.create(userId, taskData)` - Create task
- `tasksAPI.update(userId, taskId, taskData)` - Update task
- `tasksAPI.delete(userId, taskId)` - Delete task
- `tasksAPI.toggleComplete(userId, taskId, completed)` - Toggle completion

**Missing Methods (To Be Added):**
- `chatAPI.sendMessage(userId, message)` - Send chat message

### 2.4 Existing Styling System

**Tailwind Config (frontend/tailwind.config.js:1-74):**
- Brand colors: `brand-50` through `brand-900` (teal palette)
- Dark colors: `dark-700`, `dark-800`, `dark-900`
- Custom animations: `float`, `slide-up`, `pop-in`, `gradient-x`
- Glass shadows: `glass`, `glass-hover`, `neon`

**Global CSS (frontend/app/globals.css:1-102):**
- `.glass-panel` - Semi-transparent panel with blur
- `.glass-card` - Interactive glass card with hover effect
- `.glass-input` - Frosted input field
- Custom scrollbar styles
- Gradient background animation

**Design Tokens:**
- Primary: `brand-500` (#14b8a6 - teal)
- Accent: `brand-300` (#5eead4 - light teal)
- Background: Dark gradient (radial gradients with HSL colors)
- Font: "Outfit" (Google Fonts)

### 2.5 Backend API Endpoints

**Confirmed Endpoints:**
- `POST /api/{user_id}/chat` - Chat interface (backend/src/api/routes.py:39-177)
- `GET /api/{user_id}/tasks` - List tasks (assumed from tasksAPI.list usage)
- `POST /api/{user_id}/tasks` - Create task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion

**Task Schema (backend/src/models/task.py:7-31):**
```python
{
  id: int,
  user_id: str,
  title: str,
  description: str | null,
  status: "pending" | "completed",
  created_at: datetime (ISO 8601),
  updated_at: datetime (ISO 8601)
}
```

**No Backend Changes Required:** All endpoints exist and functional.

---

## 3. Reusable Components Identification

### 3.1 Components to Reuse As-Is

**No Modifications Needed:**
1. `Navbar` - Will use on dashboard page
2. `Card` - Perfect for KPI cards and chart containers
3. `Button` - For action buttons and CTAs
4. `Input` - For search and chat input
5. `Select` - For filter dropdowns
6. `Checkbox` - For task table checkboxes
7. `TodoItem` - Can reuse in task table rows (minor adaptation)

**Reuse Strategy:** Import and use directly; no code changes.

### 3.2 Components to Adapt

**Requires Wrapper/Adapter:**
1. `TodoList` - Extract loading/empty state logic into reusable hook
2. `TodoFilters` - Reuse filter UI, adapt state management

**Adaptation Strategy:** Create new components that wrap/compose existing components.

### 3.3 Components to Create (New)

**Dashboard-Specific:**
1. `DashboardKPIs` - 4 KPI cards grid
2. `TaskCharts` - Chart container with 3 charts
3. `DonutChart` - Status distribution chart
4. `LineChart` - Created vs completed over time
5. `BarChart` - Tasks by status
6. `TaskTable` - Enhanced table with inline actions
7. `TaskTableRow` - Individual table row

**Chat-Specific:**
8. `ChatWidget` - Floating chat interface
9. `ChatMessage` - Message bubble component
10. `VoiceInputButton` - Microphone button with Web Speech API

**Utility:**
11. `SkeletonLoader` - Loading placeholder for charts/KPIs

### 3.4 Utilities to Create

**Helper Functions:**
1. `lib/analytics.js` - KPI calculations, chart data transformations
2. `lib/date-helpers.js` - Date formatting, isOverdue, groupByDate
3. `lib/chart-utils.js` - Chart color palettes, formatters
4. `hooks/useTaskPolling.js` - Custom hook for polling after chat actions
5. `hooks/useVoiceInput.js` - Web Speech API integration

---

## 4. Architecture Overview

### 4.1 Component Hierarchy

```
Dashboard Page
├── Navbar (existing)
├── DashboardKPIs
│   ├── KPICard (×4)
│   │   └── Card (existing)
├── TaskCharts
│   ├── DonutChart (Recharts)
│   ├── LineChart (Recharts)
│   └── BarChart (Recharts)
├── TaskTable
│   ├── TaskFilters (adapted from TodoFilters)
│   └── TaskTableRow (×N)
│       ├── Checkbox (existing)
│       └── Button (existing)
└── ChatWidget (floating)
    ├── ChatMessage (×N)
    └── VoiceInputButton
```

### 4.2 Data Flow

```
1. Page Mount
   ↓
2. Fetch Tasks (tasksAPI.list)
   ↓
3. Compute Analytics (lib/analytics.js)
   ↓
4. Render KPIs, Charts, Table
   ↓
5. User Interacts (Chat, Table Action)
   ↓
6. API Call (chatAPI, tasksAPI)
   ↓
7. Poll for Updates (useTaskPolling hook)
   ↓
8. Re-render with Fresh Data
```

### 4.3 State Management

**Page-Level State:**
```javascript
{
  tasks: [],           // Array of task objects
  loading: false,      // Initial load state
  refreshing: false,   // Polling/refresh state
  filters: {           // Filter state
    status: 'all',
    search: ''
  },
  chatOpen: false,     // Chat widget visibility
  error: null          // Error message
}
```

**No Global State Manager Needed:** All state localized to dashboard page component.

### 4.4 File Structure

```
frontend/
  app/
    dashboard/
      page.js                    # Main dashboard page (NEW)
  components/
    dashboard/
      DashboardKPIs.js           # KPI cards grid (NEW)
      KPICard.js                 # Single KPI card (NEW)
      TaskCharts.js              # Charts container (NEW)
      DonutChart.js              # Donut chart component (NEW)
      LineChart.js               # Line chart component (NEW)
      BarChart.js                # Bar chart component (NEW)
      TaskTable.js               # Enhanced task table (NEW)
      TaskTableRow.js            # Table row component (NEW)
      SkeletonLoader.js          # Loading skeleton (NEW)
    chat/
      ChatWidget.js              # Floating chat widget (NEW)
      ChatMessage.js             # Message bubble (NEW)
      VoiceInputButton.js        # Voice input button (NEW)
    (existing components remain unchanged)
  lib/
    analytics.js                 # Analytics helpers (NEW)
    date-helpers.js              # Date utilities (NEW)
    chart-utils.js               # Chart utilities (NEW)
    api.js                       # ADD: chatAPI methods
  hooks/
    useTaskPolling.js            # Polling hook (NEW)
    useVoiceInput.js             # Voice input hook (NEW)
  (No changes to existing files except api.js)
```

---

## 5. Implementation Phases

### Phase 0: Project Setup & Dependencies (Day 1)

**Goal:** Install required dependencies and verify environment.

**Tasks:**
1. Install new dependencies
2. Verify backend API endpoints
3. Create directory structure
4. Set up development environment

**Files to Create:**
- `frontend/package.json` (MODIFY: add dependencies)

**Dependencies to Add:**
```json
{
  "dependencies": {
    "recharts": "^2.10.3",
    "date-fns": "^3.0.0"
  }
}
```

**Verification Steps:**
1. Run `npm install` in frontend directory
2. Test backend API with curl or Postman:
   - `GET http://localhost:8000/api/{user_id}/tasks`
   - `POST http://localhost:8000/api/{user_id}/chat`
3. Confirm tasks endpoint returns expected schema

**Success Criteria:**
- [ ] Dependencies installed without errors
- [ ] Backend API responding correctly
- [ ] Development server starts (`npm run dev`)

**Risk:** Backend API schema mismatch
**Mitigation:** Verify task schema early; create adapter if needed

---

### Phase 1: Core Utilities & Helpers (Day 1-2)

**Goal:** Build foundational utilities for analytics, date handling, and chart data transformation.

**Tasks:**
1. Create analytics calculation functions
2. Create date helper functions
3. Create chart utility functions
4. Write unit tests for utilities

**Files to Create:**

**1. `frontend/lib/analytics.js`**
```javascript
/**
 * Analytics utility functions for dashboard KPIs and charts
 */

export function calculateKPIs(tasks) {
  // Calculate: totalTasks, completedTasks, pendingTasks, overdueTasks
}

export function getStatusDistribution(tasks) {
  // Return: [{ name: "Pending", value: N }, { name: "Completed", value: M }]
}

export function getTimeSeriesData(tasks, days = 7) {
  // Return: [{ date: "Dec 18", created: N, completed: M }, ...]
}

export function getStatusBreakdown(tasks) {
  // Return: [{ status: "pending", count: N }, { status: "completed", count: M }]
}
```

**2. `frontend/lib/date-helpers.js`**
```javascript
/**
 * Date manipulation and formatting utilities
 */
import { format, parseISO, isAfter, subDays } from 'date-fns';

export function formatDate(dateString) {
  // Format ISO date to "Dec 24, 2025" or "2d ago"
}

export function isOverdue(createdAt, thresholdDays = 7) {
  // Check if task is older than threshold and still pending
}

export function groupTasksByDate(tasks, dateField = 'created_at') {
  // Group tasks by date for time-series charts
}

export function getLast7Days() {
  // Return array of last 7 dates for chart x-axis
}
```

**3. `frontend/lib/chart-utils.js`**
```javascript
/**
 * Chart configuration and formatting utilities
 */

export const CHART_COLORS = {
  pending: '#fbbf24',   // yellow
  completed: '#34d399', // green
  overdue: '#f87171',   // red
  primary: '#14b8a6',   // brand teal
};

export function formatChartNumber(value) {
  // Format numbers for chart labels
}

export function getChartTooltipConfig() {
  // Recharts tooltip configuration
}
```

**Testing:**
- Write Jest tests for `calculateKPIs`, `isOverdue`, `groupTasksByDate`
- Test edge cases: 0 tasks, 1000+ tasks, tasks from today

**Success Criteria:**
- [ ] All utility functions implemented
- [ ] Unit tests pass with 100% coverage
- [ ] Functions handle edge cases gracefully

**Risk:** Date timezone issues
**Mitigation:** Use `date-fns` for consistent UTC handling

---

### Phase 2: API Integration - Chat Endpoint (Day 2)

**Goal:** Extend API client with chat functionality.

**Tasks:**
1. Add chat API methods to `lib/api.js`
2. Test chat endpoint integration
3. Create mock responses for development

**Files to Modify:**

**`frontend/lib/api.js` (ADD at end):**
```javascript
/**
 * Chat API methods
 */
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

**Testing:**
- Manual test with backend running
- Verify response format matches spec
- Test error handling (network failure, 500 error)

**Success Criteria:**
- [ ] Chat API integrated and tested
- [ ] Response format validated
- [ ] Error handling works correctly

**Risk:** Chat endpoint returns unexpected format
**Mitigation:** Add response validation; log errors for debugging

---

### Phase 3: Dashboard Page Foundation (Day 3)

**Goal:** Create basic dashboard page with navigation and layout.

**Tasks:**
1. Create dashboard page component
2. Add route to navigation
3. Implement authentication guard
4. Set up basic layout structure

**Files to Create:**

**1. `frontend/app/dashboard/page.js`**
```javascript
/**
 * Main Dashboard Page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from '../../lib/auth';
import { tasksAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authentication guard
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    setUser(getUser());
  }, [router]);

  // Fetch tasks
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksAPI.list(user.id);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <p className="text-white">Tasks: {tasks.length}</p>
        )}
      </main>
    </div>
  );
}
```

**2. Update Navigation (if needed):**
- Add "Dashboard" link to Navbar component
- Highlight active route

**Testing:**
- Navigate to `/dashboard` when logged in
- Verify redirect to `/login` when not authenticated
- Verify tasks fetch on page load

**Success Criteria:**
- [ ] Dashboard page accessible at `/dashboard`
- [ ] Authentication guard works
- [ ] Tasks load correctly
- [ ] No console errors

**Risk:** Route conflict with existing `/todos`
**Mitigation:** Use new `/dashboard` route; keep `/todos` untouched

---

### Phase 4: KPI Cards Component (Day 3-4)

**Goal:** Display 4 KPI cards with real-time task metrics.

**Tasks:**
1. Create KPICard component
2. Create DashboardKPIs component
3. Integrate with analytics utilities
4. Add responsive grid layout

**Files to Create:**

**1. `frontend/components/dashboard/KPICard.js`**
```javascript
/**
 * Single KPI Card Component
 */
import Card from '../ui/Card';

export default function KPICard({ title, value, icon, trend, color = 'brand' }) {
  return (
    <Card className="hover:shadow-neon transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className={`text-3xl font-bold text-${color}-300`}>{value}</h3>
          {trend && (
            <p className="text-sm text-gray-500 mt-2">{trend}</p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
```

**2. `frontend/components/dashboard/DashboardKPIs.js`**
```javascript
/**
 * Dashboard KPI Cards Grid
 */
import KPICard from './KPICard';
import { calculateKPIs } from '../../lib/analytics';

export default function DashboardKPIs({ tasks }) {
  const kpis = calculateKPIs(tasks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
      <KPICard
        title="Total Tasks"
        value={kpis.totalTasks}
        color="brand"
        icon={<TasksIcon />}
      />
      <KPICard
        title="Completed"
        value={kpis.completedTasks}
        color="green"
        icon={<CheckIcon />}
      />
      <KPICard
        title="Pending"
        value={kpis.pendingTasks}
        color="yellow"
        icon={<ClockIcon />}
      />
      <KPICard
        title="Overdue"
        value={kpis.overdueTasks}
        color="red"
        icon={<AlertIcon />}
      />
    </div>
  );
}

// Icon components (inline SVGs)
function TasksIcon() { /* ... */ }
function CheckIcon() { /* ... */ }
function ClockIcon() { /* ... */ }
function AlertIcon() { /* ... */ }
```

**3. Integrate into Dashboard Page:**
```javascript
import DashboardKPIs from '../../components/dashboard/DashboardKPIs';

// In render:
<DashboardKPIs tasks={tasks} />
```

**Testing:**
- Test with 0 tasks (all KPIs show 0)
- Test with mix of pending/completed tasks
- Test with overdue tasks (created > 7 days ago)
- Test responsive layout on mobile/tablet

**Success Criteria:**
- [ ] All 4 KPI cards display correctly
- [ ] Values update when tasks change
- [ ] Responsive grid works on all screen sizes
- [ ] Icons and colors match design

**Risk:** Color classes not working (Tailwind purge issue)
**Mitigation:** Use safelist in tailwind.config.js for dynamic colors

---

### Phase 5: Chart Components (Day 4-5)

**Goal:** Implement 3 charts (Donut, Line, Bar) using Recharts.

**Tasks:**
1. Create DonutChart component
2. Create LineChart component
3. Create BarChart component
4. Create TaskCharts container component
5. Add responsive behavior and accessibility

**Files to Create:**

**1. `frontend/components/dashboard/DonutChart.js`**
```javascript
/**
 * Donut Chart - Task Status Distribution
 */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getStatusDistribution } from '../../lib/analytics';
import { CHART_COLORS } from '../../lib/chart-utils';

export default function DonutChart({ tasks }) {
  const data = getStatusDistribution(tasks);

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.name.toLowerCase()]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**2. `frontend/components/dashboard/LineChart.js`**
```javascript
/**
 * Line Chart - Tasks Created vs Completed Over Time
 */
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getTimeSeriesData } from '../../lib/analytics';
import { CHART_COLORS } from '../../lib/chart-utils';

export default function LineChart({ tasks }) {
  const data = getTimeSeriesData(tasks, 7);

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Activity Trend (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="created" stroke={CHART_COLORS.primary} strokeWidth={2} />
          <Line type="monotone" dataKey="completed" stroke={CHART_COLORS.completed} strokeWidth={2} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**3. `frontend/components/dashboard/BarChart.js`**
```javascript
/**
 * Bar Chart - Tasks by Status
 */
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStatusBreakdown } from '../../lib/analytics';
import { CHART_COLORS } from '../../lib/chart-utils';

export default function BarChart({ tasks }) {
  const data = getStatusBreakdown(tasks);

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Tasks by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="status" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="count" fill={CHART_COLORS.primary} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**4. `frontend/components/dashboard/TaskCharts.js`**
```javascript
/**
 * Charts Container Component
 */
import DonutChart from './DonutChart';
import LineChart from './LineChart';
import BarChart from './BarChart';

export default function TaskCharts({ tasks }) {
  if (tasks.length === 0) {
    return (
      <div className="glass-card rounded-xl p-12 text-center mb-8">
        <p className="text-gray-400 text-lg">No data to display. Add some tasks to see analytics!</p>
      </div>
    );
  }

  return (
    <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      {/* Top row: Donut + Line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DonutChart tasks={tasks} />
        <LineChart tasks={tasks} />
      </div>
      {/* Bottom row: Bar chart (full width) */}
      <div className="grid grid-cols-1 gap-6">
        <BarChart tasks={tasks} />
      </div>
    </div>
  );
}
```

**5. Integrate into Dashboard Page:**
```javascript
import TaskCharts from '../../components/dashboard/TaskCharts';

// In render:
<TaskCharts tasks={tasks} />
```

**Testing:**
- Test with various task datasets
- Verify responsiveness (mobile, tablet, desktop)
- Test accessibility (keyboard navigation, ARIA labels)
- Test chart tooltips and legends

**Success Criteria:**
- [ ] All 3 charts render correctly
- [ ] Charts update when tasks change
- [ ] Responsive layout works
- [ ] Accessibility standards met

**Risk:** Recharts bundle size too large
**Mitigation:** Lazy load charts with React.lazy; monitor bundle size

---

### Phase 6: Task Table Component (Day 5-6)

**Goal:** Create enhanced task table with filters, search, sorting, and inline actions.

**Tasks:**
1. Create TaskTableRow component
2. Create TaskTable component with pagination
3. Integrate filters (adapt TodoFilters)
4. Add sorting functionality
5. Connect CRUD actions to API

**Files to Create:**

**1. `frontend/components/dashboard/TaskTableRow.js`**
```javascript
/**
 * Task Table Row Component
 */
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import { formatDate } from '../../lib/date-helpers';

export default function TaskTableRow({ task, onToggleComplete, onDelete, onEdit }) {
  const handleToggle = () => {
    onToggleComplete(task.id, task.status === 'pending');
  };

  const handleDelete = () => {
    if (confirm(`Delete task "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  return (
    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
      <td className="px-4 py-3">
        <Checkbox
          checked={task.status === 'completed'}
          onChange={handleToggle}
          aria-label={`Mark task "${task.title}" as ${task.status === 'pending' ? 'completed' : 'pending'}`}
        />
      </td>
      <td className="px-4 py-3 text-white font-medium">
        <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
          {task.title}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-sm ${
          task.status === 'completed'
            ? 'bg-green-500/20 text-green-300'
            : 'bg-yellow-500/20 text-yellow-300'
        }`}>
          {task.status === 'completed' ? 'Completed' : 'Pending'}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-400 text-sm">
        {formatDate(task.created_at)}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(task.id)}
            aria-label={`Edit task "${task.title}"`}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDelete}
            aria-label={`Delete task "${task.title}"`}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
```

**2. `frontend/components/dashboard/TaskTable.js`**
```javascript
/**
 * Enhanced Task Table Component
 */
import { useState } from 'react';
import TaskTableRow from './TaskTableRow';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function TaskTable({ tasks, onToggleComplete, onDelete, onEdit }) {
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Paginate tasks
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  if (tasks.length === 0) {
    return (
      <div className="glass-card rounded-xl p-12 text-center">
        <p className="text-gray-400 text-lg">No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {/* Filters */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Done</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Task</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Created</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map(task => (
              <TaskTableRow
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            Showing {startIndex + 1}-{Math.min(startIndex + tasksPerPage, filteredTasks.length)} of {filteredTasks.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

**3. Integrate into Dashboard Page:**
```javascript
import TaskTable from '../../components/dashboard/TaskTable';

const handleToggleComplete = async (taskId, completed) => {
  try {
    await tasksAPI.toggleComplete(user.id, taskId, completed);
    fetchTasks(); // Refresh tasks
  } catch (error) {
    console.error('Failed to toggle task:', error);
  }
};

const handleDelete = async (taskId) => {
  try {
    await tasksAPI.delete(user.id, taskId);
    fetchTasks(); // Refresh tasks
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
};

const handleEdit = (taskId) => {
  router.push(`/todos/${taskId}`);
};

// In render:
<TaskTable
  tasks={tasks}
  onToggleComplete={handleToggleComplete}
  onDelete={handleDelete}
  onEdit={handleEdit}
/>
```

**Testing:**
- Test filtering by status (all, pending, completed)
- Test search functionality
- Test pagination with > 10 tasks
- Test complete/delete actions
- Test edit navigation

**Success Criteria:**
- [ ] Table displays all tasks correctly
- [ ] Filters and search work in real-time
- [ ] Pagination works correctly
- [ ] Actions (complete, delete, edit) function properly
- [ ] Table is responsive on mobile

**Risk:** Performance issues with large task lists
**Mitigation:** Implement virtualization (react-window) if needed

---

### Phase 7: Chat Widget Component (Day 6-7)

**Goal:** Create floating chat widget with text and voice input.

**Tasks:**
1. Create ChatMessage component
2. Create VoiceInputButton component
3. Create ChatWidget component
4. Integrate with chat API
5. Implement polling for dashboard updates

**Files to Create:**

**1. `frontend/components/chat/ChatMessage.js`**
```javascript
/**
 * Chat Message Bubble Component
 */
export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-up`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-brand-500 text-white'
          : 'glass-panel text-gray-200'
      }`}>
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
```

**2. `frontend/hooks/useVoiceInput.js`**
```javascript
/**
 * Voice Input Hook using Web Speech API
 */
import { useState, useEffect } from 'react';

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.start();
  };

  return { isListening, transcript, isSupported, startListening, setTranscript };
}
```

**3. `frontend/components/chat/VoiceInputButton.js`**
```javascript
/**
 * Voice Input Button Component
 */
import { useVoiceInput } from '../../hooks/useVoiceInput';

export default function VoiceInputButton({ onTranscript }) {
  const { isListening, transcript, isSupported, startListening, setTranscript } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
      setTranscript(''); // Clear after sending
    }
  }, [transcript]);

  if (!isSupported) {
    return null; // Hide button if not supported
  }

  return (
    <button
      onClick={startListening}
      disabled={isListening}
      className={`p-3 rounded-full transition-all ${
        isListening
          ? 'bg-red-500 animate-pulse'
          : 'bg-brand-500 hover:bg-brand-400'
      }`}
      aria-label="Voice input"
    >
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
        <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
      </svg>
    </button>
  );
}
```

**4. `frontend/components/chat/ChatWidget.js`**
```javascript
/**
 * Floating Chat Widget Component
 */
import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import VoiceInputButton from './VoiceInputButton';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { chatAPI } from '../../lib/api';

export default function ChatWidget({ userId, onTaskUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call chat API
      const response = await chatAPI.sendMessage(userId, message);

      // Add assistant response
      const assistantMessage = { role: 'assistant', content: response.response };
      setMessages(prev => [...prev, assistantMessage]);

      // Trigger dashboard refresh
      onTaskUpdate();
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-brand-500 hover:bg-brand-400 rounded-full shadow-neon flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Open chat"
      >
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] glass-card rounded-2xl shadow-2xl flex flex-col z-50 animate-pop-in">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-white font-bold text-lg">Task Assistant</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p>Hello! I can help you manage your tasks.</p>
            <p className="text-sm mt-2">Try: "Add task: buy groceries"</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="glass-panel rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-brand-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
          disabled={loading}
        />
        <VoiceInputButton onTranscript={handleVoiceTranscript} />
        <Button type="submit" variant="primary" disabled={loading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
```

**5. Create Polling Hook:**

**`frontend/hooks/useTaskPolling.js`**
```javascript
/**
 * Hook for polling tasks after chat actions
 */
import { useEffect, useRef } from 'react';

export function useTaskPolling(shouldPoll, onPoll, interval = 2000, maxIterations = 3) {
  const iterationsRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (shouldPoll) {
      iterationsRef.current = 0;

      intervalRef.current = setInterval(() => {
        if (iterationsRef.current < maxIterations) {
          onPoll();
          iterationsRef.current++;
        } else {
          clearInterval(intervalRef.current);
        }
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [shouldPoll, onPoll, interval, maxIterations]);
}
```

**6. Integrate into Dashboard Page:**
```javascript
import ChatWidget from '../../components/chat/ChatWidget';
import { useTaskPolling } from '../../hooks/useTaskPolling';

const [shouldPollTasks, setShouldPollTasks] = useState(false);

// Polling hook
useTaskPolling(shouldPollTasks, fetchTasks);

const handleTaskUpdate = () => {
  setShouldPollTasks(true);
  setTimeout(() => setShouldPollTasks(false), 6000); // Poll for 6 seconds
};

// In render:
<ChatWidget userId={user.id} onTaskUpdate={handleTaskUpdate} />
```

**Testing:**
- Test text message sending and receiving
- Test voice input (if supported)
- Test chat widget open/close
- Test dashboard refresh after chat action
- Test error handling (network failure)

**Success Criteria:**
- [ ] Chat widget opens/closes correctly
- [ ] Messages send and receive properly
- [ ] Voice input works (if supported)
- [ ] Dashboard updates after chat actions
- [ ] Error messages display correctly

**Risk:** Polling causes excessive API calls
**Mitigation:** Limit to 3 iterations over 6 seconds; consider debouncing

---

### Phase 8: Loading States & Error Handling (Day 7)

**Goal:** Add skeleton loaders, error states, and empty states.

**Tasks:**
1. Create SkeletonLoader component
2. Add loading states to all components
3. Add error handling and display
4. Add empty state illustrations

**Files to Create:**

**1. `frontend/components/dashboard/SkeletonLoader.js`**
```javascript
/**
 * Skeleton Loader Component
 */
export function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-24 mb-4"></div>
          <div className="h-8 bg-white/20 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-white/10 rounded w-32 mb-4"></div>
      <div className="h-64 bg-white/5 rounded"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 animate-pulse">
      <div className="h-10 bg-white/10 rounded mb-4"></div>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-12 bg-white/5 rounded mb-2"></div>
      ))}
    </div>
  );
}
```

**2. Update Dashboard Page with Loading States:**
```javascript
if (loading) {
  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
        <KPISkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <TableSkeleton />
      </main>
    </div>
  );
}
```

**3. Add Error State Component:**
```javascript
function ErrorState({ message, onRetry }) {
  return (
    <div className="glass-card rounded-xl p-12 text-center">
      <div className="text-red-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <Button onClick={onRetry}>Try Again</Button>
    </div>
  );
}
```

**Testing:**
- Test skeleton loaders during initial load
- Test error state on API failure
- Test retry functionality

**Success Criteria:**
- [ ] Skeleton loaders display during loading
- [ ] Error states display on failures
- [ ] Empty states display when appropriate
- [ ] All states transition smoothly

---

### Phase 9: Responsive Design & Accessibility (Day 8)

**Goal:** Ensure mobile responsiveness and accessibility compliance.

**Tasks:**
1. Test and fix mobile layout
2. Add ARIA labels and roles
3. Implement keyboard navigation
4. Test with screen reader
5. Fix color contrast issues

**Testing Checklist:**

**Responsive Design:**
- [ ] Dashboard layout works on mobile (320px width)
- [ ] KPI cards stack vertically on mobile
- [ ] Charts are readable on mobile
- [ ] Table scrolls horizontally on mobile
- [ ] Chat widget goes full-screen on mobile

**Accessibility:**
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all elements
- [ ] ARIA labels on all charts and buttons
- [ ] Screen reader announces KPI values
- [ ] Color contrast ≥ 4.5:1 for all text

**Tools:**
- Lighthouse accessibility audit (target ≥ 90)
- axe DevTools for ARIA validation
- Manual keyboard navigation test
- VoiceOver/NVDA screen reader test

**Files to Update:**
- Add responsive classes to all components
- Add ARIA labels to charts, buttons, inputs
- Add `role` attributes where needed

**Success Criteria:**
- [ ] Mobile layout works perfectly
- [ ] Lighthouse accessibility score ≥ 90
- [ ] No axe DevTools violations
- [ ] Keyboard navigation works throughout

---

### Phase 10: Performance Optimization (Day 8-9)

**Goal:** Optimize bundle size, loading performance, and runtime performance.

**Tasks:**
1. Lazy load chart components
2. Optimize images (if any)
3. Memoize expensive calculations
4. Add code splitting
5. Measure and optimize bundle size

**Optimizations:**

**1. Lazy Load Charts:**
```javascript
import dynamic from 'next/dynamic';

const TaskCharts = dynamic(() => import('../../components/dashboard/TaskCharts'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});
```

**2. Memoize Analytics:**
```javascript
import { useMemo } from 'react';

const kpis = useMemo(() => calculateKPIs(tasks), [tasks]);
```

**3. Debounce Search:**
```javascript
import { useMemo, useState } from 'react';
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((value) => setFilters({ ...filters, search: value }), 300),
  []
);
```

**Performance Targets:**
- Initial load: < 3s
- Time to Interactive: < 5s
- Bundle size: < 500KB (gzipped)
- Chart rendering: < 1s

**Testing:**
- Run Lighthouse performance audit
- Analyze bundle with `npm run build`
- Test on slow 3G network

**Success Criteria:**
- [ ] Lighthouse performance score ≥ 80
- [ ] Bundle size within target
- [ ] Charts render quickly
- [ ] No jank or layout shifts

---

### Phase 11: Integration Testing & QA (Day 9)

**Goal:** End-to-end testing and quality assurance.

**Tasks:**
1. Write integration tests
2. Manual QA testing
3. Cross-browser testing
4. Fix bugs found during testing

**Test Scenarios:**

**Integration Tests (Jest + MSW):**
```javascript
describe('Dashboard Integration', () => {
  test('displays KPIs correctly', async () => {
    // Mock tasks API
    // Render dashboard
    // Verify KPI calculations
  });

  test('chat action updates dashboard', async () => {
    // Mock chat API
    // Send chat message
    // Verify tasks refresh
    // Verify KPIs update
  });

  test('table actions work correctly', async () => {
    // Mock task update/delete APIs
    // Click complete button
    // Verify task status updates
  });
});
```

**Manual QA Checklist:**
- [ ] Login flow works
- [ ] Dashboard loads with correct data
- [ ] KPIs display accurate counts
- [ ] All 3 charts render correctly
- [ ] Table filters work
- [ ] Search works
- [ ] Pagination works
- [ ] Complete task updates UI
- [ ] Delete task removes from UI
- [ ] Edit navigates to edit page
- [ ] Chat widget opens/closes
- [ ] Chat messages send/receive
- [ ] Voice input works (if supported)
- [ ] Dashboard refreshes after chat action
- [ ] Mobile layout works
- [ ] Keyboard navigation works
- [ ] No console errors

**Cross-Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Success Criteria:**
- [ ] All integration tests pass
- [ ] Manual QA checklist completed
- [ ] No critical or high-priority bugs
- [ ] Cross-browser compatibility confirmed

---

### Phase 12: Documentation & Deployment (Day 10)

**Goal:** Document changes and deploy to production.

**Tasks:**
1. Update README with new features
2. Document component APIs
3. Create deployment checklist
4. Deploy to staging
5. Deploy to production

**Documentation:**

**Update `frontend/README.md`:**
```markdown
## Dashboard Features

### Overview
The dashboard provides a comprehensive view of task analytics, including:
- KPI cards (Total, Completed, Pending, Overdue)
- Charts (Donut, Line, Bar)
- Enhanced task table with filters and search
- Integrated chat widget with voice input

### Routes
- `/dashboard` - Main dashboard with analytics
- `/todos` - Legacy task list view (preserved)

### Components
- `DashboardPage` - Main dashboard page
- `DashboardKPIs` - KPI cards grid
- `TaskCharts` - Charts container
- `TaskTable` - Enhanced task table
- `ChatWidget` - Floating chat interface

### Usage
1. Navigate to `/dashboard` after login
2. View task analytics in KPI cards and charts
3. Manage tasks using table filters and actions
4. Use chat widget for conversational task management
5. Use voice button (if supported) for hands-free input
```

**Deployment Checklist:**
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Build succeeds (`npm run build`)
- [ ] Bundle size analyzed and optimized
- [ ] Staging environment tested
- [ ] Rollback plan documented
- [ ] Monitoring configured

**Deployment Steps:**
1. Merge feature branch to `main`
2. Deploy to staging environment
3. Run smoke tests on staging
4. Deploy to production
5. Monitor error logs and performance
6. Verify all features working in production

**Success Criteria:**
- [ ] Documentation updated
- [ ] Deployment successful
- [ ] No production errors
- [ ] All features working as expected

---

## 6. Risk Mitigation Strategy

### 6.1 Critical Risks

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| **Backend API schema mismatch** | High | Verify endpoints early in Phase 0; create adapter layer if needed |
| **Existing functionality breaks** | High | Create new `/dashboard` route; don't modify existing pages/components |
| **Performance regression** | Medium | Lazy load charts; monitor bundle size; implement pagination |
| **Recharts bundle bloat** | Medium | Use code splitting; consider smaller alternative if >200KB |
| **Browser incompatibility** | Medium | Test on target browsers early; provide fallbacks for unsupported features |
| **Chat API fails in production** | Medium | Add error handling; retry logic; graceful degradation |
| **Polling causes API overload** | Low | Limit polling iterations (3 max); add exponential backoff |

### 6.2 Risk Monitoring

**Early Warning Signals:**
- API response times > 1s
- Bundle size > 500KB
- Console errors in production
- User reports of broken functionality
- Performance score < 80

**Response Actions:**
- Roll back to previous version
- Investigate issue in staging
- Fix and redeploy
- Communicate with stakeholders

---

## 7. Testing Strategy

### 7.1 Unit Tests

**Coverage Target:** 80% for utility functions

**Files to Test:**
- `lib/analytics.js` - All KPI and chart data functions
- `lib/date-helpers.js` - All date manipulation functions
- `lib/chart-utils.js` - Formatting functions

**Test Framework:** Jest

### 7.2 Integration Tests

**Coverage Target:** All critical user paths

**Test Scenarios:**
- Dashboard loads with real data
- KPIs update when tasks change
- Charts render correctly
- Table actions trigger API calls
- Chat actions update dashboard

**Test Framework:** Jest + React Testing Library + MSW

### 7.3 E2E Tests

**Coverage Target:** 3-5 critical flows

**Test Scenarios:**
1. User logs in → sees dashboard → completes task → verifies update
2. User sends chat message → task created → appears in dashboard
3. User filters tasks → table updates correctly

**Test Framework:** Playwright or Cypress

### 7.4 Accessibility Tests

**Manual Tests:**
- Keyboard navigation
- Screen reader testing (VoiceOver/NVDA)
- Color contrast verification

**Automated Tests:**
- axe-core in Jest tests
- Lighthouse accessibility audit

---

## 8. Rollback Plan

### 8.1 Rollback Triggers

**Immediate Rollback:**
- Dashboard not loading (500 errors)
- Existing `/todos` page broken
- Authentication broken
- Critical data loss or corruption

**Planned Rollback:**
- Performance degradation > 50%
- Accessibility score < 70
- Multiple user reports of bugs

### 8.2 Rollback Procedure

**Steps:**
1. Identify commit hash of last stable version
2. Revert to commit: `git revert <commit-hash>`
3. Redeploy frontend
4. Verify existing functionality works
5. Investigate issue in development environment
6. Fix and re-test before redeploying

**Recovery Time Objective:** < 15 minutes

---

## 9. Success Criteria

### 9.1 Functional Requirements

- [ ] Dashboard accessible at `/dashboard` route
- [ ] All 4 KPI cards display accurate data
- [ ] All 3 charts render correctly with real data
- [ ] Task table displays tasks with filters and search
- [ ] Complete/delete/edit actions work correctly
- [ ] Chat widget sends and receives messages
- [ ] Voice input works (if browser supported)
- [ ] Dashboard updates after chat actions (<500ms)
- [ ] Existing `/todos` page still works (zero regressions)

### 9.2 Non-Functional Requirements

- [ ] Dashboard loads in < 3 seconds (p95)
- [ ] Charts render in < 1 second
- [ ] Lighthouse Performance score ≥ 80
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Bundle size < 500KB (gzipped)
- [ ] Mobile responsive (works on 320px width)
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- [ ] No console errors or warnings

### 9.3 Quality Gates

**Before Merging to Main:**
- [ ] All unit tests pass (coverage ≥ 80%)
- [ ] All integration tests pass
- [ ] Manual QA checklist completed
- [ ] Accessibility audit passed
- [ ] Code reviewed and approved
- [ ] No TypeScript/ESLint errors

**Before Production Deployment:**
- [ ] Staging environment tested end-to-end
- [ ] Performance benchmarks met
- [ ] No critical or high-priority bugs
- [ ] Rollback plan documented
- [ ] Monitoring configured

---

## 10. Architectural Decisions Summary

### ADR-001: Create New `/dashboard` Route vs Replace `/todos`

**Decision:** Create new `/dashboard` route, preserve `/todos`

**Rationale:**
- Minimal risk of breaking existing functionality
- Allows side-by-side testing
- Easy rollback (remove route)
- Users can choose old or new interface

**Alternatives Considered:**
- Replace `/todos` with dashboard (rejected: too risky)
- Rename `/todos` to `/todos-legacy` (rejected: confusing)

**Status:** Approved

---

### ADR-002: Recharts vs Chart.js

**Decision:** Use Recharts library

**Rationale:**
- Better React integration (declarative components)
- Smaller bundle size than Chart.js with react-chartjs-2
- Active maintenance and good documentation
- Accessible by default

**Alternatives Considered:**
- Chart.js (rejected: larger bundle, imperative API)
- Victory (rejected: heavier, overkill for simple charts)
- Custom D3 charts (rejected: too much effort)

**Status:** Approved

---

### ADR-003: Polling vs WebSocket for Real-Time Updates

**Decision:** Use polling (Phase 1), WebSocket (future)

**Rationale:**
- Polling is simpler to implement
- No backend changes required
- Sufficient for Phase 1 requirements
- Can migrate to WebSocket later if needed

**Alternatives Considered:**
- WebSocket (rejected: requires backend changes)
- Server-Sent Events (rejected: one-way only)
- Optimistic updates (rejected: complex rollback logic)

**Status:** Approved (Phase 1), WebSocket planned for Phase 2

---

### ADR-004: Floating Chat Widget vs Sidebar

**Decision:** Floating chat widget (bottom-right corner)

**Rationale:**
- Less intrusive than always-visible sidebar
- Standard UX pattern (familiar to users)
- Saves screen space for dashboard content
- Easy to toggle open/close

**Alternatives Considered:**
- Fixed sidebar (rejected: takes up space)
- Top bar (rejected: poor UX for chat)
- Modal overlay (rejected: blocks entire screen)

**Status:** Approved

---

## 11. Implementation Timeline

**Note:** Per constitution, no time estimates. Phases are incremental and can be adjusted.

**Phase Sequence:**
1. ✅ Phase 0: Project Setup & Dependencies
2. ✅ Phase 1: Core Utilities & Helpers
3. ✅ Phase 2: API Integration - Chat Endpoint
4. ✅ Phase 3: Dashboard Page Foundation
5. ✅ Phase 4: KPI Cards Component
6. ✅ Phase 5: Chart Components
7. ✅ Phase 6: Task Table Component
8. ✅ Phase 7: Chat Widget Component
9. ✅ Phase 8: Loading States & Error Handling
10. ✅ Phase 9: Responsive Design & Accessibility
11. ✅ Phase 10: Performance Optimization
12. ✅ Phase 11: Integration Testing & QA
13. ✅ Phase 12: Documentation & Deployment

**Dependencies:**
- Phases 1-2 can run in parallel
- Phases 4-7 depend on Phase 3
- Phases 8-10 depend on Phases 4-7
- Phase 11 depends on all previous phases
- Phase 12 is final

---

## 12. Conclusion

This implementation plan provides a step-by-step, risk-minimized approach to transforming the Todo application into a professional dashboard product. Key principles:

- **Incremental:** Each phase delivers working functionality
- **Isolated:** New code, new route, zero impact on existing pages
- **Testable:** Each phase has clear success criteria
- **Reversible:** Easy rollback at any point
- **Preservation-First:** No existing code modified (constitution compliance)

**Next Step:** Proceed to `/sp.tasks` to generate detailed task breakdown for implementation.

---

**End of Plan**
