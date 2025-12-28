# API Contracts: Dashboard UI Integration

**Feature**: 001-dashboard-ui-voice-urdu
**Date**: 2025-12-28
**Purpose**: Document existing API endpoints used by dashboard UI (no new endpoints created)

## Overview

This feature is **UI-only** and creates **ZERO new backend endpoints**. All API contracts listed below are **existing endpoints** that the dashboard UI will consume.

**No Backend Changes**:
- ✅ No new routes
- ✅ No schema modifications
- ✅ No endpoint changes
- ✅ Existing API contracts remain unchanged

---

## 1. Task Management API

### GET `/api/{user_id}/tasks`

**Purpose**: Fetch all tasks for authenticated user

**Authorization**: JWT token in `Authorization: Bearer <token>` header

**Request**:
```http
GET /api/123e4567-e89b-12d3-a456-426614174000/tasks HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2025-12-28T10:00:00Z",
    "updated_at": "2025-12-28T10:00:00Z",
    "due_date": "2025-12-29T18:00:00Z",
    "user_id": "123e4567-e89b-12d3-a456-426614174000"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Call dentist",
    "description": null,
    "completed": true,
    "created_at": "2025-12-27T14:30:00Z",
    "updated_at": "2025-12-28T09:15:00Z",
    "due_date": null,
    "user_id": "123e4567-e89b-12d3-a456-426614174000"
  }
]
```

**Usage in Dashboard**:
- Called on component mount
- Called during polling (500ms interval when chat active, 5s when idle)
- Powers KPI calculations, chart rendering, task table display

---

### POST `/api/{user_id}/tasks`

**Purpose**: Create new task

**Authorization**: JWT token in `Authorization: Bearer <token>` header

**Request**:
```http
POST /api/123e4567-e89b-12d3-a456-426614174000/tasks HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Schedule meeting",
  "description": "Q1 planning with team",
  "due_date": "2025-12-30T15:00:00Z"
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "title": "Schedule meeting",
  "description": "Q1 planning with team",
  "completed": false,
  "created_at": "2025-12-28T11:00:00Z",
  "updated_at": "2025-12-28T11:00:00Z",
  "due_date": "2025-12-30T15:00:00Z",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Usage in Dashboard**:
- Not directly called by chat widget (chat uses conversational endpoint)
- May be called by future "Add Task" button in UI (not in current spec)

---

### PUT `/api/{user_id}/tasks/{task_id}`

**Purpose**: Update existing task

**Authorization**: JWT token in `Authorization: Bearer <token>` header

**Request**:
```http
PUT /api/123e4567-e89b-12d3-a456-426614174000/tasks/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "completed": true
}
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2025-12-28T10:00:00Z",
  "updated_at": "2025-12-28T11:30:00Z",
  "due_date": "2025-12-29T18:00:00Z",
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Usage in Dashboard**:
- Called when user toggles task completion checkbox in table
- Optimistic update applied immediately, API call in background

---

### DELETE `/api/{user_id}/tasks/{task_id}`

**Purpose**: Delete task

**Authorization**: JWT token in `Authorization: Bearer <token>` header

**Request**:
```http
DELETE /api/123e4567-e89b-12d3-a456-426614174000/tasks/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (204 No Content):
```
(Empty body)
```

**Usage in Dashboard**:
- Called when user clicks delete button in task table
- Confirmation prompt shown before API call
- Optimistic update removes task from UI immediately

---

## 2. Conversational AI API

### POST `/api/{user_id}/chat`

**Purpose**: Send message to AI chatbot for task management via natural language

**Authorization**: JWT token in `Authorization: Bearer <token>` header

**Request** (English):
```http
POST /api/123e4567-e89b-12d3-a456-426614174000/chat HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "message": "add task: buy groceries tomorrow at 6pm",
  "language": "en"
}
```

**Request** (Urdu):
```http
POST /api/123e4567-e89b-12d3-a456-426614174000/chat HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "message": "کل شام 6 بجے گروسری خریدنے کا کام شامل کریں",
  "language": "ur"
}
```

**Response** (200 OK):
```json
{
  "response": "I've added the task 'Buy groceries' with due date tomorrow at 6pm.",
  "conversation_id": "conv_550e8400-e29b-41d4-a716-446655440003",
  "language": "en"
}
```

**Response** (Urdu):
```json
{
  "response": "میں نے 'گروسری خریدیں' کا کام کل شام 6 بجے کے لیے شامل کر دیا ہے۔",
  "conversation_id": "conv_550e8400-e29b-41d4-a716-446655440003",
  "language": "ur"
}
```

**Usage in Dashboard**:
- Called when user sends message in chat widget
- Language preference passed in request body
- Response displayed in chat history
- Polling triggered after AI response to sync visual dashboard

**Chatbot Capabilities** (existing backend logic, not modified):
- Create tasks: "add task: <title> [description] [due date]"
- Complete tasks: "mark '<title>' as done"
- List tasks: "show my tasks"
- Delete tasks: "delete task '<title>'"
- Update tasks: "change '<title>' due date to tomorrow"

**Error Response** (500 Internal Server Error):
```json
{
  "detail": "Chat service unavailable. Please try again later."
}
```

**Usage Notes**:
- `language` field is optional in request (defaults to 'en' if omitted)
- Backend AI already supports multilingual conversations (no changes needed)
- Response `language` field indicates which language AI used in response
- `conversation_id` can be stored for conversation persistence (out of scope for MVP)

---

## 3. Authentication API (Existing)

**Not Modified**: Dashboard uses existing JWT authentication

**Token Source**: `localStorage.getItem('authToken')` (set during login)

**Token Validation**: Backend validates JWT signature, expiry, user ID claim

**Session Expiry Handling**:
- 401 Unauthorized response → Redirect to `/login` with message
- Token refresh logic: Out of scope (existing auth system handles this)

---

## API Client Implementation

**Existing Client**: `frontend/lib/api.js` (no modifications needed)

**Usage Pattern**:
```javascript
import { tasksAPI, chatAPI } from '@/lib/api';

// Fetch tasks
const tasks = await tasksAPI.list(userId);

// Toggle task completion
await tasksAPI.update(userId, taskId, { completed: true });

// Delete task
await tasksAPI.delete(userId, taskId);

// Send chat message
const response = await chatAPI.sendMessage(userId, {
  message: 'add task: buy milk',
  language: currentLocale
});
```

**Error Handling** (existing):
```javascript
try {
  const tasks = await tasksAPI.list(userId);
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
    router.push('/login?message=Session expired');
  } else {
    // Show error toast
    setError(error.message);
  }
}
```

---

## Real-Time Sync Contract

**Polling Mechanism**:
```javascript
// Active polling when chat is being used
useEffect(() => {
  let intervalId;

  if (isChatActive) {
    intervalId = setInterval(async () => {
      const tasks = await tasksAPI.list(userId);
      setTaskState(prev => ({
        ...prev,
        tasks,
        lastFetch: Date.now()
      }));
    }, 500); // Poll every 500ms
  } else {
    intervalId = setInterval(async () => {
      const tasks = await tasksAPI.list(userId);
      setTaskState(prev => ({
        ...prev,
        tasks,
        lastFetch: Date.now()
      }));
    }, 5000); // Poll every 5 seconds when idle
  }

  return () => clearInterval(intervalId);
}, [isChatActive, userId]);
```

**Optimistic Update Pattern**:
```javascript
// Example: Toggle task completion
const handleToggleComplete = async (taskId) => {
  // 1. Optimistic update
  setTaskState(prev => ({
    ...prev,
    tasks: prev.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
  }));

  // 2. API call
  try {
    await tasksAPI.update(userId, taskId, { completed: true });
  } catch (error) {
    // 3. Rollback on error
    setTaskState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
    setError('Failed to update task');
  }

  // 4. Polling will verify consistency within 500ms
};
```

---

## Summary

**Existing Endpoints Used**:
1. `GET /api/{user_id}/tasks` - Fetch all tasks
2. `PUT /api/{user_id}/tasks/{task_id}` - Update task
3. `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
4. `POST /api/{user_id}/chat` - Conversational AI

**New Endpoints Created**: **ZERO**

**Backend Changes**: **ZERO**

**API Modifications**: **ZERO**

---

## Next Steps

Phase 1 complete (Data Model + API Contracts documented).

Proceed to Phase 2: Implementation Plan (7 phases of UI development).
