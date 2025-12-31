# Phase-4 Enhancements: Comprehensive Feature Specification

## Document Control

| Field | Value |
|-------|-------|
| **Project** | Phase-4: AI-Powered Todo Dashboard |
| **Feature Set** | 9 Advanced Task Management Features |
| **Version** | 1.0.0 |
| **Date** | 2025-12-30 |
| **Status** | Draft |
| **Author** | Claude Code |
| **Based On** | Reference Implementation Analysis |

## Executive Summary

This specification documents 9 advanced features to be added to the Phase-4 Todo Dashboard application, inspired by analysis of the reference implementation (samade747/Hackathon-II-Phase-III-PRO-AI-Powered-Todo-Chatbot). These enhancements will transform the application from a basic task manager into a world-class productivity platform.

**Scope:** Frontend (Next.js 14), Backend (FastAPI), Database (PostgreSQL/Neon)

**Implementation Phases:**
- **Phase 1 (Critical):** Priority System, Due Dates, Better Auth
- **Phase 2 (Power Features):** Recurring Tasks, Timer Tracking, Tags
- **Phase 3 (Polish):** Bulk Creation, Framer Motion, Lucide Icons

---

## Table of Contents

1. [Feature 1: Priority System](#feature-1-priority-system)
2. [Feature 2: Due Dates](#feature-2-due-dates)
3. [Feature 3: Better Auth Integration](#feature-3-better-auth-integration)
4. [Feature 4: Recurring Tasks (Mission Respawn)](#feature-4-recurring-tasks-mission-respawn)
5. [Feature 5: Timer/Time Tracking](#feature-5-timertime-tracking)
6. [Feature 6: Tags System](#feature-6-tags-system)
7. [Feature 7: Bulk Task Creation](#feature-7-bulk-task-creation)
8. [Feature 8: Framer Motion Animations](#feature-8-framer-motion-animations)
9. [Feature 9: Lucide React Icons](#feature-9-lucide-react-icons)

---

## Feature 1: Priority System

### FR-P01: Priority Levels

**User Story:** As a user, I want to assign priority levels to my tasks so I can focus on what matters most.

**Requirements:**

**FR-P01.1:** System SHALL support four priority levels:
- `low` - Green color coding (#10b981)
- `medium` - Yellow color coding (#f59e0b)
- `high` - Orange color coding (#f97316)
- `urgent` - Red color coding (#ef4444)

**FR-P01.2:** Default priority SHALL be `medium` for all new tasks

**FR-P01.3:** Priority SHALL be stored in `tasks.priority` column (varchar 20)

**FR-P01.4:** Priority SHALL have database check constraint limiting values to (low, medium, high, urgent)

### FR-P02: Priority UI Components

**FR-P02.1:** Task creation form SHALL include priority dropdown selector

**FR-P02.2:** Task table SHALL display priority badge with color coding

**FR-P02.3:** Priority badge SHALL show icon + text (e.g., "🔥 Urgent")

**FR-P02.4:** Task edit form SHALL allow priority modification

### FR-P03: Priority Filtering

**FR-P03.1:** Dashboard SHALL include priority filter dropdown

**FR-P03.2:** Filter options: All, Low, Medium, High, Urgent

**FR-P03.3:** Filtered tasks SHALL update all dashboard components (KPIs, charts, table)

**FR-P03.4:** Filter state SHALL persist in URL query params

### FR-P04: Priority Analytics

**FR-P04.1:** Dashboard SHALL display "Priority Distribution" donut chart

**FR-P04.2:** KPI cards SHALL show counts by priority (e.g., "3 Urgent", "5 High")

**FR-P04.3:** Task table SHALL support sorting by priority (urgent first)

### FR-P05: Priority in MCP Tools

**FR-P05.1:** `add_task` tool SHALL accept optional `priority` parameter

**FR-P05.2:** `update_task` tool SHALL support priority modification

**FR-P05.3:** `list_tasks` tool SHALL accept priority filter parameter

**FR-P05.4:** Chatbot SHALL extract priority from natural language ("urgent task", "high priority")

### Acceptance Criteria

- [ ] Database migration adds priority column with check constraint
- [ ] Priority selector works in task creation form
- [ ] Priority badges display correctly with color coding
- [ ] Dashboard filter works across all components
- [ ] Priority distribution chart renders
- [ ] MCP tools accept and handle priority
- [ ] Chatbot understands priority keywords

### Technical Design Notes

**Database Migration:**
```sql
ALTER TABLE tasks
ADD COLUMN priority VARCHAR(20) NOT NULL DEFAULT 'medium'
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

CREATE INDEX idx_tasks_priority ON tasks(priority);
```

**SQLModel Update:**
```python
# backend/src/models/task.py
priority: str = Field(default="medium", max_length=20, pattern="^(low|medium|high|urgent)$")
```

**Frontend Component:**
```jsx
// frontend/components/ui/PrioritySelector.js
const priorities = [
  { value: 'low', label: 'Low', color: 'green', icon: '📘' },
  { value: 'medium', label: 'Medium', color: 'yellow', icon: '📙' },
  { value: 'high', label: 'High', color: 'orange', icon: '📕' },
  { value: 'urgent', label: 'Urgent', color: 'red', icon: '🔥' }
];
```

---

## Feature 2: Due Dates

### FR-D01: Due Date Storage

**User Story:** As a user, I want to set due dates for my tasks so I can manage deadlines effectively.

**Requirements:**

**FR-D01.1:** System SHALL store due dates in `tasks.due_date` column (timestamp with timezone)

**FR-D01.2:** Due date SHALL be optional (nullable)

**FR-D01.3:** Due date SHALL support date and time (not just date)

**FR-D01.4:** Due dates SHALL be stored in UTC

### FR-D02: Due Date UI

**FR-D02.1:** Task creation form SHALL include date-time picker

**FR-D02.2:** Date picker SHALL support both date and time selection

**FR-D02.3:** Task table SHALL display due date in user's local timezone

**FR-D02.4:** Due date SHALL display as relative time ("in 2 days", "tomorrow at 3pm")

**FR-D02.5:** Overdue tasks SHALL have visual indicator (red text, warning icon)

### FR-D03: Due Date Filtering

**FR-D03.1:** Dashboard SHALL support filtering by due date ranges:
- Today
- This Week
- This Month
- Overdue
- No Due Date

**FR-D03.2:** Table SHALL support sorting by due date (earliest first)

### FR-D04: Due Date Analytics

**FR-D04.1:** KPI card SHALL show "Overdue Tasks" count

**FR-D04.2:** Current logic: tasks created > 7 days ago
**FR-D04.3:** New logic: tasks with `due_date < now()` AND `status = 'pending'`

**FR-D04.4:** Line chart SHALL show due dates timeline (upcoming tasks per day)

### FR-D05: Due Date in MCP Tools

**FR-D05.1:** `add_task` tool SHALL accept optional `due_date` ISO 8601 string

**FR-D05.2:** `update_task` tool SHALL support due date modification

**FR-D05.3:** Chatbot SHALL extract due dates from natural language:
- "tomorrow at 3pm"
- "next Friday"
- "in 2 weeks"
- "December 31st"

### Acceptance Criteria

- [ ] Database migration adds due_date column
- [ ] Date-time picker works in task form
- [ ] Due dates display correctly in local timezone
- [ ] Overdue tasks highlighted in red
- [ ] Due date filters work in dashboard
- [ ] KPI shows accurate overdue count
- [ ] Chatbot parses natural language dates

### Technical Design Notes

**Database Migration:**
```sql
ALTER TABLE tasks
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

**Frontend Component:**
```jsx
// frontend/components/ui/DateTimePicker.js
import { format, parseISO } from 'date-fns';

export default function DateTimePicker({ value, onChange }) {
  return (
    <input
      type="datetime-local"
      value={value ? format(parseISO(value), "yyyy-MM-dd'T'HH:mm") : ''}
      onChange={(e) => onChange(new Date(e.target.value).toISOString())}
    />
  );
}
```

**Natural Language Parsing:**
```python
# backend/src/agents/date_parser.py
from dateparser import parse

def parse_due_date(text: str) -> datetime | None:
    return parse(text, settings={'PREFER_DATES_FROM': 'future'})
```

---

## Feature 3: Better Auth Integration

### FR-BA01: Authentication Provider

**User Story:** As a user, I want secure, production-ready authentication with social login options.

**Requirements:**

**FR-BA01.1:** System SHALL use Better Auth library for authentication

**FR-BA01.2:** System SHALL support email/password authentication

**FR-BA01.3:** System SHALL support Google OAuth login

**FR-BA01.4:** System SHALL support GitHub OAuth login (optional)

**FR-BA01.5:** JWT secret SHALL NOT be hardcoded in frontend

### FR-BA02: Session Management

**FR-BA02.1:** Access tokens SHALL expire after 24 hours

**FR-BA02.2:** Refresh tokens SHALL expire after 7 days

**FR-BA02.3:** System SHALL implement automatic token refresh on 401 responses

**FR-BA02.4:** System SHALL revoke refresh tokens on logout

**FR-BA02.5:** System SHALL implement token rotation (new refresh token on each refresh)

### FR-BA03: Security Features

**FR-BA03.1:** Passwords SHALL be hashed using bcrypt (cost factor 12)

**FR-BA03.2:** System SHALL implement email verification for new accounts

**FR-BA03.3:** System SHALL support password reset via email

**FR-BA03.4:** System SHALL implement rate limiting on login endpoint (5 attempts per 15 minutes)

**FR-BA03.5:** System SHALL log failed login attempts

### FR-BA04: Frontend Integration

**FR-BA04.1:** Remove client-side JWT signing from `frontend/lib/auth.js`

**FR-BA04.2:** Use Better Auth React hooks (`useAuth`, `useUser`, `useSession`)

**FR-BA04.3:** AuthProvider SHALL use Better Auth SessionProvider

**FR-BA04.4:** Login page SHALL include social login buttons

### FR-BA05: Backend Integration

**FR-BA05.1:** Backend SHALL verify Better Auth tokens using public key verification

**FR-BA05.2:** Backend SHALL extract user_id from Better Auth session

**FR-BA05.3:** Backend SHALL maintain compatibility with existing user_id format

**FR-BA05.4:** System SHALL migrate existing demo users to Better Auth

### Acceptance Criteria

- [ ] Better Auth installed and configured
- [ ] Email/password login works
- [ ] Google OAuth login works
- [ ] Token refresh works automatically
- [ ] Password reset flow works
- [ ] Email verification works
- [ ] Frontend uses Better Auth hooks
- [ ] Backend verifies Better Auth tokens
- [ ] Existing users can login
- [ ] No hardcoded secrets in frontend

### Technical Design Notes

**Better Auth Configuration:**
```typescript
// frontend/lib/auth-config.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  socialProviders: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      enabled: true,
    },
  },
});
```

**Backend Token Verification:**
```python
# backend/src/api/dependencies.py
from better_auth import verify_token

async def get_current_user(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    session = await verify_token(token, public_key=settings.BETTER_AUTH_PUBLIC_KEY)
    return session.user_id
```

---

## Feature 4: Recurring Tasks (Mission Respawn)

### FR-R01: Recurrence Types

**User Story:** As a user, I want to create recurring tasks that automatically regenerate when completed.

**Requirements:**

**FR-R01.1:** System SHALL support recurrence types:
- `none` (default)
- `daily`
- `weekly`
- `monthly`

**FR-R01.2:** Recurrence SHALL be stored in `tasks.recurrence` column (varchar 20)

**FR-R01.3:** System SHALL track `last_completed_at` timestamp for recurring tasks

### FR-R02: Mission Respawn Logic

**FR-R02.1:** When a recurring task is completed:
1. Mark current task as completed
2. Set `last_completed_at` to current timestamp
3. Create new task instance with same title, description, priority, tags
4. Calculate next due date based on recurrence type
5. Set new task status to 'pending'

**FR-R02.2:** Daily recurrence: next_due_date = now() + 1 day

**FR-R02.3:** Weekly recurrence: next_due_date = now() + 7 days

**FR-R02.4:** Monthly recurrence: next_due_date = now() + 1 month (same day)

**FR-R02.5:** If original task has no due date, new task SHALL use calculated date

### FR-R03: Recurrence UI

**FR-R03.1:** Task creation form SHALL include recurrence dropdown

**FR-R03.2:** Recurring tasks SHALL display recurrence badge (🔁 icon)

**FR-R03.3:** Task table SHALL show "Next occurrence" date for recurring tasks

**FR-R03.4:** Completion confirmation SHALL mention recurrence ("This task will respawn tomorrow")

### FR-R04: Recurrence Analytics

**FR-R04.1:** Dashboard SHALL show "Recurring Tasks" count in KPI

**FR-R04.2:** Calendar view SHALL preview upcoming recurring task instances

**FR-R04.3:** History SHALL show all completed instances of recurring task

### FR-R05: Recurrence in MCP Tools

**FR-R05.1:** `add_task` tool SHALL accept optional `recurrence` parameter

**FR-R05.2:** `complete_task` tool SHALL implement Mission Respawn logic

**FR-R05.3:** `toggle_todo` tool SHALL handle recurrence on completion

**FR-R05.4:** Chatbot SHALL extract recurrence from natural language ("daily standup", "weekly report")

### Acceptance Criteria

- [ ] Database migration adds recurrence columns
- [ ] Recurrence selector works in task form
- [ ] Completing recurring task creates new instance
- [ ] New task has correct due date
- [ ] Recurrence badge displays correctly
- [ ] History shows all instances
- [ ] MCP tools handle recurrence
- [ ] Chatbot understands recurrence keywords

### Technical Design Notes

**Database Migration:**
```sql
ALTER TABLE tasks
ADD COLUMN recurrence VARCHAR(20) NOT NULL DEFAULT 'none'
CHECK (recurrence IN ('none', 'daily', 'weekly', 'monthly')),
ADD COLUMN last_completed_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX idx_tasks_recurrence ON tasks(recurrence);
```

**Mission Respawn Implementation:**
```python
# backend/src/mcp/tools/complete_task.py
def complete_task(db: Session, input_data: CompleteTaskInput) -> dict:
    task = db.get(Task, input_data.task_id)

    # Mark as completed
    task.status = "completed"
    task.last_completed_at = datetime.utcnow()
    db.commit()

    # Mission Respawn
    if task.recurrence != "none":
        next_due = calculate_next_due_date(task.recurrence)
        new_task = Task(
            user_id=task.user_id,
            title=task.title,
            description=task.description,
            priority=task.priority,
            recurrence=task.recurrence,
            tags=task.tags,
            due_date=next_due,
            status="pending"
        )
        db.add(new_task)
        db.commit()
        return {"success": True, "message": f"Mission Respawned! Next: {next_due}"}

    return {"success": True}
```

---

## Feature 5: Timer/Time Tracking

### FR-T01: Timer Controls

**User Story:** As a user, I want to track time spent on tasks using a built-in timer.

**Requirements:**

**FR-T01.1:** Each task SHALL have start/stop timer functionality

**FR-T01.2:** System SHALL store `timer_started_at` timestamp when timer is running

**FR-T01.3:** System SHALL accumulate `total_time_spent` in seconds

**FR-T01.4:** Only one timer SHALL run per user at a time

**FR-T01.5:** Timer SHALL continue running across page refreshes

### FR-T02: Timer UI

**FR-T02.1:** Task table SHALL display timer button (▶️ / ⏸️)

**FR-T02.2:** Active timer SHALL show elapsed time (HH:MM:SS)

**FR-T02.3:** Timer SHALL update every second when running

**FR-T02.4:** Task row SHALL highlight when timer is active (pulsing animation)

**FR-T02.5:** Total time spent SHALL display as "X hours Y minutes"

### FR-T03: Timer Management

**FR-T03.1:** Starting timer on task A SHALL auto-stop timer on task B

**FR-T03.2:** Completing task with active timer SHALL stop timer

**FR-T03.3:** Deleting task with active timer SHALL stop timer

**FR-T03.4:** System SHALL handle timer recovery if browser crashes (use last known timestamp)

### FR-T04: Time Tracking Analytics

**FR-T04.1:** Dashboard SHALL show "Time Tracked Today" KPI

**FR-T04.2:** Dashboard SHALL display time distribution chart (time per task)

**FR-T04.3:** Export functionality SHALL include time tracking data

**FR-T04.4:** Weekly report SHALL show total time by priority/tag

### FR-T05: Timer in MCP Tools

**FR-T05.1:** New MCP tool: `manage_timer(task_id, user_id, action)` where action = 'start' | 'stop'

**FR-T05.2:** Chatbot SHALL support timer commands:
- "start timer on task X"
- "stop timer"
- "how long have I worked on X?"

### Acceptance Criteria

- [ ] Database migration adds timer columns
- [ ] Timer buttons work in task table
- [ ] Timer displays elapsed time
- [ ] Only one timer runs at a time
- [ ] Total time accumulates correctly
- [ ] Time analytics display in dashboard
- [ ] Timer persists across page refresh
- [ ] Chatbot can control timer

### Technical Design Notes

**Database Migration:**
```sql
ALTER TABLE tasks
ADD COLUMN total_time_spent INTEGER DEFAULT 0,
ADD COLUMN timer_started_at TIMESTAMP WITH TIME ZONE;
```

**Frontend Timer Hook:**
```jsx
// frontend/hooks/useTimer.js
export function useTimer(taskId, isRunning, startedAt) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - new Date(startedAt)) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startedAt]);

  return formatTime(elapsed);
}
```

---

## Feature 6: Tags System

### FR-TAG01: Tag Storage

**User Story:** As a user, I want to organize tasks using flexible tags.

**Requirements:**

**FR-TAG01.1:** Tasks SHALL support multiple tags (array)

**FR-TAG01.2:** Tags SHALL be stored in `tasks.tags` column (JSONB array)

**FR-TAG01.3:** Tags SHALL be case-insensitive

**FR-TAG01.4:** System SHALL suggest popular tags

### FR-TAG02: Tag UI

**FR-TAG02.1:** Task creation form SHALL include tag input (multi-select)

**FR-TAG02.2:** Tag input SHALL support:
- Type and press Enter to add
- Autocomplete from existing tags
- Remove by clicking X
- Maximum 10 tags per task

**FR-TAG02.3:** Task table SHALL display tag pills with colors

**FR-TAG02.4:** Tag colors SHALL be auto-generated from tag name (consistent hash)

### FR-TAG03: Tag Filtering

**FR-TAG03.1:** Dashboard SHALL display tag cloud with counts

**FR-TAG03.2:** Clicking tag SHALL filter to tasks with that tag

**FR-TAG03.3:** Multiple tags SHALL use AND logic (tasks must have all selected tags)

**FR-TAG03.4:** Tags SHALL be combinable with other filters (status, priority, etc.)

### FR-TAG04: Tag Analytics

**FR-TAG04.1:** Dashboard SHALL show "Tasks by Tag" chart

**FR-TAG04.2:** Popular tags SHALL display in sidebar

**FR-TAG04.3:** Tag search SHALL support autocomplete

### FR-TAG05: Tags in MCP Tools

**FR-TAG05.1:** `add_task` tool SHALL accept optional `tags` array

**FR-TAG05.2:** `list_tasks` tool SHALL support tag filtering

**FR-TAG05.3:** Chatbot SHALL extract tags from natural language ("#work", "@home", "project-x")

### Acceptance Criteria

- [ ] Database migration adds tags column with GIN index
- [ ] Tag input component works
- [ ] Tags display as colored pills
- [ ] Tag filtering works
- [ ] Tag cloud displays
- [ ] Autocomplete suggests existing tags
- [ ] MCP tools handle tags
- [ ] Chatbot extracts hashtags

### Technical Design Notes

**Database Migration:**
```sql
ALTER TABLE tasks
ADD COLUMN tags JSONB DEFAULT '[]'::jsonb;

CREATE INDEX idx_tasks_tags ON tasks USING GIN (tags);
```

**Tag Input Component:**
```jsx
// frontend/components/ui/TagInput.js
export default function TagInput({ value = [], onChange, suggestions = [] }) {
  const [input, setInput] = useState('');

  const addTag = (tag) => {
    if (!value.includes(tag) && value.length < 10) {
      onChange([...value, tag.toLowerCase()]);
      setInput('');
    }
  };

  const removeTag = (tag) => {
    onChange(value.filter(t => t !== tag));
  };

  return (
    <div className="tag-input">
      {value.map(tag => (
        <span key={tag} className="tag-pill">
          {tag} <button onClick={() => removeTag(tag)}>×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && addTag(input)}
        list="tag-suggestions"
      />
      <datalist id="tag-suggestions">
        {suggestions.map(tag => <option key={tag} value={tag} />)}
      </datalist>
    </div>
  );
}
```

---

## Feature 7: Bulk Task Creation

### FR-BULK01: Bulk Input

**User Story:** As a user, I want to quickly create multiple tasks at once.

**Requirements:**

**FR-BULK01.1:** System SHALL provide bulk creation modal

**FR-BULK01.2:** Modal SHALL accept multi-line textarea input (one task per line)

**FR-BULK01.3:** System SHALL parse each line as task title

**FR-BULK01.4:** System SHALL apply common properties (priority, tags, due date) to all tasks

### FR-BULK02: Bulk Creation UI

**FR-BULK02.1:** Dashboard SHALL have "Bulk Add" button

**FR-BULK02.2:** Modal SHALL show:
- Textarea for task titles
- Priority selector (applied to all)
- Tag selector (applied to all)
- Due date picker (optional, applied to all)
- Preview of tasks to be created

**FR-BULK02.3:** System SHALL validate minimum 2 tasks

**FR-BULK02.4:** System SHALL show success message with count created

### FR-BULK03: Bulk Operations

**FR-BULK03.1:** System SHALL support bulk delete (checkbox selection)

**FR-BULK03.2:** System SHALL support bulk status change (complete/pending)

**FR-BULK03.3:** System SHALL support bulk priority change

**FR-BULK03.4:** System SHALL require confirmation for bulk operations

### FR-BULK04: Bulk in MCP Tools

**FR-BULK04.1:** New MCP tool: `add_tasks_bulk(titles, user_id, priority, tags, due_date)`

**FR-BULK04.2:** Tool SHALL return count of created tasks

**FR-BULK04.3:** Chatbot SHALL support bulk commands:
- "add these tasks: task1, task2, task3"
- "create 5 tasks for weekly planning"

### Acceptance Criteria

- [ ] Bulk add modal opens from dashboard
- [ ] Textarea accepts multi-line input
- [ ] Common properties apply to all tasks
- [ ] Preview shows tasks before creation
- [ ] Bulk creation succeeds
- [ ] Bulk delete works with confirmation
- [ ] MCP bulk tool works
- [ ] Chatbot handles bulk creation

### Technical Design Notes

**Bulk MCP Tool:**
```python
# backend/src/mcp/tools/add_tasks_bulk.py
def add_tasks_bulk(db: Session, input_data: AddTasksBulkInput) -> dict:
    tasks = []
    for title in input_data.titles:
        if title.strip():
            task = Task(
                user_id=input_data.user_id,
                title=title.strip(),
                priority=input_data.priority,
                tags=input_data.tags,
                due_date=input_data.due_date,
                status="pending"
            )
            tasks.append(task)

    db.add_all(tasks)
    db.commit()
    return {"success": True, "count": len(tasks)}
```

---

## Feature 8: Framer Motion Animations

### FR-ANIM01: Page Transitions

**User Story:** As a user, I want smooth, polished animations throughout the app.

**Requirements:**

**FR-ANIM01.1:** System SHALL use Framer Motion for animations

**FR-ANIM01.2:** Page transitions SHALL fade in/out smoothly

**FR-ANIM01.3:** Route changes SHALL feel instant (< 300ms)

### FR-ANIM02: Task Animations

**FR-ANIM02.1:** Adding task SHALL animate in from bottom (slide up + fade)

**FR-ANIM02.2:** Deleting task SHALL animate out (slide left + fade)

**FR-ANIM02.3:** Completing task SHALL show checkmark animation

**FR-ANIM02.4:** Task row SHALL have subtle hover lift effect

### FR-ANIM03: Dashboard Animations

**FR-ANIM03.1:** KPI cards SHALL stagger-animate on load (100ms delay each)

**FR-ANIM03.2:** Charts SHALL animate data points on load

**FR-ANIM03.3:** Loading states SHALL show skeleton pulse animation

**FR-ANIM03.4:** Empty states SHALL have subtle floating animation

### FR-ANIM04: Micro-interactions

**FR-ANIM04.1:** Buttons SHALL have scale effect on press (0.95x)

**FR-ANIM04.2:** Checkboxes SHALL have bounce effect when checked

**FR-ANIM04.3:** Modals SHALL slide up from bottom on mobile, fade on desktop

**FR-ANIM04.4:** Toast notifications SHALL slide in from top-right

### Acceptance Criteria

- [ ] Framer Motion installed
- [ ] Page transitions smooth
- [ ] Task list animations work
- [ ] KPI cards stagger-animate
- [ ] Hover effects polished
- [ ] Performance remains good (60fps)
- [ ] Animations respect prefers-reduced-motion

### Technical Design Notes

**Installation:**
```bash
npm install framer-motion
```

**Example Usage:**
```jsx
// frontend/components/dashboard/TaskTableRow.js
import { motion } from 'framer-motion';

export default function TaskTableRow({ task }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
    >
      {/* Task content */}
    </motion.tr>
  );
}
```

---

## Feature 9: Lucide React Icons

### FR-ICON01: Icon Library

**User Story:** As a developer, I want a consistent, comprehensive icon library.

**Requirements:**

**FR-ICON01.1:** System SHALL use Lucide React for all icons

**FR-ICON01.2:** System SHALL replace custom SVGs with Lucide icons

**FR-ICON01.3:** Icons SHALL be tree-shakeable (only import used icons)

**FR-ICON01.4:** Icon size SHALL be configurable via props

### FR-ICON02: Icon Usage

**FR-ICON02.1:** Priority icons:
- Low: `AlertCircle` (green)
- Medium: `AlertTriangle` (yellow)
- High: `Flame` (orange)
- Urgent: `Zap` (red)

**FR-ICON02.2:** Status icons:
- Pending: `Circle`
- Completed: `CheckCircle2`

**FR-ICON02.3:** Action icons:
- Edit: `Pencil`
- Delete: `Trash2`
- Timer: `Clock`
- Tags: `Tag`

**FR-ICON02.4:** Navigation icons:
- Dashboard: `LayoutDashboard`
- Tasks: `CheckSquare`
- Logout: `LogOut`

### Acceptance Criteria

- [ ] Lucide React installed
- [ ] All custom SVGs replaced
- [ ] Icons display consistently
- [ ] Bundle size doesn't increase significantly
- [ ] Icon sizes responsive

### Technical Design Notes

**Installation:**
```bash
npm install lucide-react
```

**Example Usage:**
```jsx
import { CheckCircle2, Trash2, Clock, Flame } from 'lucide-react';

<CheckCircle2 className="w-5 h-5 text-green-500" />
<Trash2 className="w-4 h-4 text-red-500" />
<Clock className="w-6 h-6 text-blue-500" />
<Flame className="w-5 h-5 text-orange-500" />
```

---

## Implementation Strategy

### Phased Rollout

**Phase 1: Critical (Week 1-2)**
1. Priority System (2-3 days)
2. Due Dates (1-2 days)
3. Better Auth Integration (3-4 days)

**Phase 2: Power Features (Week 3-5)**
4. Recurring Tasks (3-4 days)
5. Timer/Time Tracking (2-3 days)
6. Tags System (2-3 days)

**Phase 3: Polish (Week 6)**
7. Bulk Task Creation (1-2 days)
8. Framer Motion Animations (1-2 days)
9. Lucide React Icons (1 day)

### Development Workflow

For each feature:
1. **Specify:** Create detailed spec (this document section)
2. **Plan:** Design architecture, database, API, UI
3. **Tasks:** Break down into actionable implementation tasks
4. **Implement:** Execute tasks one by one
5. **Test:** Manual testing + automated tests
6. **Document:** Update PHRs and user documentation

### Risk Mitigation

**Database Migrations:**
- Test migrations on local copy first
- Use Alembic auto-generate then manual review
- Backup production database before migration
- Plan rollback strategy

**Breaking Changes:**
- Better Auth migration may require user re-authentication
- Maintain backward compatibility in API responses
- Version API endpoints if necessary

**Performance:**
- Monitor query performance with new indexes
- Test animations on low-end devices
- Lazy load heavy components

---

## Success Metrics

**User Adoption:**
- 80%+ of tasks have priority assigned
- 60%+ of tasks have due dates
- 40%+ users create recurring tasks
- 30%+ users use time tracking

**Technical:**
- No performance regression (p95 < 500ms)
- Zero data loss during migrations
- 100% feature parity with reference implementation
- Test coverage > 70% for new features

**Quality:**
- Zero critical bugs in production
- User satisfaction score > 4.5/5
- Mobile usability score > 90%

---

## Appendix A: Database Schema Changes

```sql
-- Complete migration script for all 9 features

BEGIN;

-- Feature 1: Priority System
ALTER TABLE tasks
ADD COLUMN priority VARCHAR(20) NOT NULL DEFAULT 'medium'
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Feature 2: Due Dates
ALTER TABLE tasks
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Feature 4: Recurring Tasks
ALTER TABLE tasks
ADD COLUMN recurrence VARCHAR(20) NOT NULL DEFAULT 'none'
CHECK (recurrence IN ('none', 'daily', 'weekly', 'monthly')),
ADD COLUMN last_completed_at TIMESTAMP WITH TIME ZONE;
CREATE INDEX idx_tasks_recurrence ON tasks(recurrence);

-- Feature 5: Timer/Time Tracking
ALTER TABLE tasks
ADD COLUMN total_time_spent INTEGER DEFAULT 0,
ADD COLUMN timer_started_at TIMESTAMP WITH TIME ZONE;

-- Feature 6: Tags System
ALTER TABLE tasks
ADD COLUMN tags JSONB DEFAULT '[]'::jsonb;
CREATE INDEX idx_tasks_tags ON tasks USING GIN (tags);

COMMIT;
```

---

## Appendix B: API Endpoint Changes

**New Endpoints:**
- `POST /api/{user_id}/tasks/bulk` - Bulk task creation
- `POST /api/{user_id}/tasks/{task_id}/timer` - Timer management
- `GET /api/{user_id}/tasks/recurring` - List recurring tasks
- `GET /api/{user_id}/tasks/overdue` - List overdue tasks

**Modified Endpoints:**
- `POST /api/{user_id}/tasks` - Now accepts priority, due_date, recurrence, tags
- `PUT /api/{user_id}/tasks/{task_id}` - Now accepts all new fields
- `GET /api/{user_id}/tasks` - Now supports filtering by priority, tags, due_date range

---

## Document Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-12-30 | Initial comprehensive specification | Claude Code |

---

**Next Steps:**
1. Review and approve this specification
2. Use `sp.plan` to create implementation plans for each feature
3. Use `sp.tasks` to generate actionable task lists
4. Use `sp.implement` to execute implementation
5. Create PHRs documenting the journey
