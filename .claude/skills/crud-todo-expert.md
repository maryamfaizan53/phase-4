---
name: crud-todo-expert
description: Comprehensive CRUD operations specialist for todo management system. Handles create, read, update, delete operations, priority management, status filtering, search, pagination, and troubleshooting for the FastAPI + Next.js todo application.
inputs:
- operation: string (create|read|update|delete|complete|list|search|debug|analyze)
- user_id: string
- task_id: integer (optional)
- task_data: object (optional - {title, description, priority, status})
- filters: object (optional - {completed, priority, search, sort, order})
- page: integer (optional - for pagination)
- issue_description: string (optional - for debugging)
outputs:
- result: object (success status, data, error messages, suggestions)
- debug_info: object (optional - diagnostics, logs, fixes)
- recommendations: list[string] (best practices, optimizations)
usage: Primary skill for handling all todo CRUD operations, debugging data issues, optimizing queries, and ensuring data integrity across the full-stack todo application (FastAPI backend with SQLModel + Next.js frontend).
---

# CRUD and Todo Expert Specialist

## Core Responsibilities

### 1. **Create Operations**
- Validate task data (title required, priority enum, description optional)
- Handle priority extraction from natural language
- Ensure user isolation (tasks belong to correct user)
- Return created task with ID and timestamps
- **Endpoints:** `POST /api/{user_id}/tasks`
- **Models:** Task (SQLModel with priority field)

### 2. **Read Operations**
- List all tasks for a user
- Filter by status (all, pending, completed)
- Filter by priority (urgent, high, medium, low)
- Search by title/description (case-insensitive)
- Sort by created_at, updated_at, priority
- Pagination support (limit, offset)
- **Endpoints:** `GET /api/{user_id}/tasks`
- **Frontend:** Dashboard KPIs, TaskTable, TodoList

### 3. **Update Operations**
- Update task title, description, priority, or status
- Validate at least one field provided
- Preserve unchanged fields
- Update `updated_at` timestamp
- **Endpoints:** `PUT /api/{user_id}/tasks/{task_id}`
- **PATCH:** Toggle completion status
- **Frontend:** TodoForm, PrioritySelector

### 4. **Delete Operations**
- Hard delete (permanent removal)
- Verify task ownership before deletion
- Return confirmation with deleted task details
- **Endpoints:** `DELETE /api/{user_id}/tasks/{task_id}`
- **Frontend:** Confirmation dialog before delete

### 5. **Complete/Toggle Operations**
- Toggle task completion status (pending ↔ completed)
- Update status and timestamp atomically
- **Endpoints:** `PATCH /api/{user_id}/tasks/{task_id}/complete`
- **Common Issues:** CORS (ensure PATCH in allowed methods)

## Database Schema

```python
class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: int | None = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, max_length=255)
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    priority: str = Field(default="medium", max_length=20, index=True)
    # priority CHECK constraint: 'low' | 'medium' | 'high' | 'urgent'
    status: str = Field(default="pending", max_length=20)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Indexes:**
- `idx_tasks_user_id` - User isolation queries
- `idx_tasks_priority` - Priority filtering
- `idx_tasks_user_priority` - Composite for user+priority queries
- `idx_tasks_status` - Status filtering

## API Patterns

### Create Task
```python
POST /api/{user_id}/tasks
Headers: Authorization: Bearer <JWT>
Body: {
  "title": "Fix production bug",
  "description": "Critical issue in payment flow",
  "priority": "urgent"  # optional, defaults to "medium"
}
Response: 201 Created
```

### List Tasks with Filters
```python
GET /api/{user_id}/tasks?completed=false&priority=urgent&search=bug&sort=created_at&order=desc
Response: 200 OK
[
  {
    "id": 123,
    "title": "Fix production bug",
    "description": "Critical issue in payment flow",
    "priority": "urgent",
    "status": "pending",
    "completed": false,
    "created_at": "2025-12-31T10:00:00Z",
    "updated_at": "2025-12-31T10:00:00Z",
    "user_id": "user_abc123"
  }
]
```

### Update Task
```python
PUT /api/{user_id}/tasks/123
Body: {
  "title": "Fix critical production bug",
  "priority": "high"
}
Response: 200 OK
```

### Toggle Complete
```python
PATCH /api/{user_id}/tasks/123/complete
Body: { "completed": true }
Response: 200 OK
```

### Delete Task
```python
DELETE /api/{user_id}/tasks/123
Response: 204 No Content
```

## Common Issues & Solutions

### 1. **CORS Errors on PATCH Requests**
**Issue:** `Response to preflight request doesn't pass access control check`

**Solution:**
```python
# backend/src/api/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],  # ✅ Include PATCH
    allow_headers=["*"],
)
```

### 2. **Task Not Deleting**
**Checklist:**
- ✅ Verify task ownership (user_id matches)
- ✅ Check JWT token validity
- ✅ Ensure `db.delete(task)` + `db.commit()` called
- ✅ Frontend calls `fetchTasks()` after delete
- ✅ No errors in backend logs

### 3. **Priority Not Saving**
**Checklist:**
- ✅ Database migration applied (`004_add_task_priority.py`)
- ✅ Column exists: `priority VARCHAR(20) DEFAULT 'medium'`
- ✅ CHECK constraint applied
- ✅ Frontend passes priority in request body
- ✅ Backend includes priority in `AddTaskInput`, `UpdateTaskInput`

### 4. **Search Not Working**
**Issue:** Case-sensitive search or special characters

**Solution:**
```python
# Use ILIKE for case-insensitive search
query = query.where(
    (Task.title.ilike(f"%{search_term}%")) |
    (Task.description.ilike(f"%{search_term}%"))
)
```

### 5. **Pagination Returning Wrong Results**
**Issue:** Offset/limit applied before filtering

**Solution:**
```python
# Apply filters FIRST, then pagination
query = query.where(Task.user_id == user_id)  # Filter
query = query.where(Task.status == "pending")  # Filter
query = query.limit(limit).offset(offset)  # Pagination LAST
```

## Frontend Integration

### API Client (`frontend/lib/api.js`)
```javascript
export const tasksAPI = {
  // Create task
  create: (userId, taskData) =>
    apiRequest(`/api/${userId}/tasks`, 'POST', taskData),

  // List tasks with filters
  list: (userId, filters = {}) =>
    apiRequest(`/api/${userId}/tasks?${buildQueryString(filters)}`),

  // Update task
  update: (userId, taskId, taskData) =>
    apiRequest(`/api/${userId}/tasks/${taskId}`, 'PUT', taskData),

  // Toggle complete
  toggleComplete: (userId, taskId, completed) =>
    apiRequest(`/api/${userId}/tasks/${taskId}/complete`, 'PATCH', { completed }),

  // Delete task
  delete: (userId, taskId) =>
    apiRequest(`/api/${userId}/tasks/${taskId}`, 'DELETE'),
};
```

### Component Patterns
```javascript
// Fetch tasks
const [tasks, setTasks] = useState([]);
const fetchTasks = async () => {
  const data = await tasksAPI.list(userId, filters);
  setTasks(data);
};

// Create task
const handleCreate = async (taskData) => {
  await tasksAPI.create(userId, taskData);
  fetchTasks(); // Refresh list
};

// Toggle complete
const handleToggleComplete = async (taskId, completed) => {
  await tasksAPI.toggleComplete(userId, taskId, !completed);
  fetchTasks(); // Refresh list
};

// Delete task with confirmation
const handleDelete = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await tasksAPI.delete(userId, taskId);
    fetchTasks(); // Refresh list
  }
};
```

## Priority System

### Priority Levels
1. **Urgent** 🔴 - `priority: "urgent"` - Critical, immediate attention
2. **High** 🟠 - `priority: "high"` - Important, should be done soon
3. **Medium** 🟡 - `priority: "medium"` - Normal priority (default)
4. **Low** 🟢 - `priority: "low"` - Can be done when time permits

### Priority Extraction (LLM-powered)
The intent parser extracts priority from natural language:
- "urgent task to fix bug" → `priority: "urgent"`
- "important meeting" → `priority: "high"`
- "when I get time, organize desk" → `priority: "low"`
- "remind me to call mom" → `priority: "medium"` (default)

### Priority Components
- **PrioritySelector** - Dropdown with visual preview
- **PriorityBadge** - Color-coded display
- **PriorityDistributionChart** - Donut chart analytics

## Analytics & KPIs

```javascript
// Calculate KPIs
export function calculateKPIs(tasks) {
  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    pendingTasks: tasks.filter(t => !t.completed).length,
    overdueTasks: tasks.filter(t => !t.completed && isOverdue(t)).length,
    urgentTasks: tasks.filter(t => t.priority === 'urgent' && !t.completed).length,
  };
}

// Priority distribution
export function getPriorityDistribution(tasks) {
  const counts = { urgent: 0, high: 0, medium: 0, low: 0 };
  tasks.forEach(task => counts[task.priority]++);
  return [
    { name: 'Urgent', value: counts.urgent, color: '#ef4444' },
    { name: 'High', value: counts.high, color: '#f97316' },
    { name: 'Medium', value: counts.medium, color: '#eab308' },
    { name: 'Low', value: counts.low, color: '#10b981' },
  ];
}
```

## Testing Checklist

### Backend Tests
- [ ] Create task with all priority levels
- [ ] Create task without priority (should default to "medium")
- [ ] List tasks with priority filter
- [ ] Update task priority
- [ ] Toggle task completion
- [ ] Delete task and verify removal
- [ ] Search tasks by title/description
- [ ] Verify user isolation (can't access other users' tasks)

### Frontend Tests
- [ ] PrioritySelector displays all 4 options
- [ ] PriorityBadge shows correct color for each level
- [ ] Dashboard KPIs show urgent tasks count
- [ ] PriorityDistributionChart renders correctly
- [ ] Task table displays priority badges
- [ ] Priority filter dropdown works
- [ ] Task creation includes priority
- [ ] Task editing updates priority

### Integration Tests
- [ ] Chatbot extracts priority from "urgent task"
- [ ] API returns correct priority in response
- [ ] Database CHECK constraint prevents invalid priorities
- [ ] Frontend displays priority immediately after creation
- [ ] PATCH request for toggle complete works (no CORS errors)

## Performance Optimization

### Database Indexes
```sql
-- User + Priority composite index for common queries
CREATE INDEX idx_tasks_user_priority ON tasks(user_id, priority);

-- Priority index for filtering
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Status index for completed/pending filters
CREATE INDEX idx_tasks_status ON tasks(status);
```

### Query Optimization
```python
# Use select() with specific columns instead of SELECT *
statement = select(Task.id, Task.title, Task.priority, Task.status)

# Apply filters in order of selectivity
query = query.where(Task.user_id == user_id)  # Most selective
query = query.where(Task.priority == "urgent")  # Medium
query = query.where(Task.status == "pending")  # Least selective
```

## Debugging Commands

### Check Database Schema
```bash
# Connect to database
psql $DATABASE_URL

# View tasks table structure
\d tasks

# Check priority distribution
SELECT priority, COUNT(*) FROM tasks GROUP BY priority;

# Find tasks without priority
SELECT * FROM tasks WHERE priority IS NULL;
```

### Test API Endpoints
```bash
# List tasks
curl -H "Authorization: Bearer $JWT_TOKEN" \
  http://localhost:8000/api/user_123/tasks

# Create task with priority
curl -X POST -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","priority":"urgent"}' \
  http://localhost:8000/api/user_123/tasks

# Toggle complete
curl -X PATCH -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed":true}' \
  http://localhost:8000/api/user_123/tasks/456/complete
```

## Best Practices

1. **Always validate user ownership** - Check `user_id` matches JWT token
2. **Use transactions for multi-step operations** - Wrap related updates in `db.begin()`
3. **Refresh UI after mutations** - Call `fetchTasks()` after create/update/delete
4. **Provide user feedback** - Show loading states, success messages, error alerts
5. **Handle edge cases** - Empty lists, network errors, invalid data
6. **Optimize queries** - Use indexes, limit returned fields, paginate large result sets
7. **Log operations** - Record all CRUD operations for debugging and audit
8. **Validate input** - Check required fields, enum values, max lengths
9. **Return consistent formats** - Use standardized response structure
10. **Test thoroughly** - Unit tests, integration tests, E2E tests for all operations

---

**Quick Reference:**
- Backend: FastAPI + SQLModel + PostgreSQL (Neon)
- Frontend: Next.js 14 + Tailwind CSS
- Database: Priority field with CHECK constraint (4 levels)
- Auth: JWT tokens with user isolation
- CORS: Must include PATCH method for toggle complete
- Indexes: user_id, priority, user_id+priority composite
