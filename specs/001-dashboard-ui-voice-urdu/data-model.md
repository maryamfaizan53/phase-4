# Data Model: Advanced Todo Dashboard UI

**Feature**: 001-dashboard-ui-voice-urdu
**Date**: 2025-12-28
**Purpose**: Define frontend data structures and state management for dashboard UI

## Overview

This feature is **UI-only** and does not modify any backend database schemas. All data models are **frontend state structures** used for rendering, not persistent storage.

**Backend Models (Existing - Not Modified)**:
- `User` (backend/src/models/user.py)
- `Task` (backend/src/models/task.py)
- `Conversation` (backend/src/models/conversation.py)
- `Message` (backend/src/models/message.py)

**Frontend State Models (New - This Feature)**:
- `LanguagePreference` - Stored in localStorage
- `ChatMessage` - Transient state in React component
- `VoiceRecordingState` - Transient state for voice input
- `TranslationDictionary` - Static translation strings loaded from JSON files

---

## 1. Language Preference

**Purpose**: Store user's language selection (English or Urdu) persistently across sessions

**Storage**: Browser `localStorage`

**Key**: `preferredLanguage`

**Structure**:
```typescript
type Locale = 'en' | 'ur';

interface LanguagePreference {
  locale: Locale;
  direction: 'ltr' | 'rtl'; // Derived from locale
  lastUpdated: number; // Timestamp (Date.now())
}
```

**Validation**:
- `locale` must be exactly `'en'` or `'ur'` (validated against allowlist)
- `direction` is auto-derived: `'en'` → `'ltr'`, `'ur'` → `'rtl'`
- Default value if missing: `{ locale: 'en', direction: 'ltr', lastUpdated: Date.now() }`

**Usage**:
```javascript
// Read
const savedPref = JSON.parse(localStorage.getItem('preferredLanguage')) || { locale: 'en', direction: 'ltr' };

// Write
localStorage.setItem('preferredLanguage', JSON.stringify({
  locale: 'ur',
  direction: 'rtl',
  lastUpdated: Date.now()
}));
```

**Lifecycle**:
- **Created**: When user first clicks language toggle
- **Updated**: Every time language toggle is clicked
- **Deleted**: Never (persists across sessions, browsers, devices)

**Edge Cases**:
- Incognito mode: Preference lost on tab close (fallback to 'en')
- Corrupted value: Validate on read, fallback to default
- Missing key: Treated as 'en' (English default)

---

## 2. Chat Message

**Purpose**: Represent a single message in the chat widget conversation

**Storage**: React component state (`useState`) + optional `sessionStorage` for persistence

**Structure**:
```typescript
interface ChatMessage {
  id: string; // Format: `${Date.now()}-${Math.random()}` (unique per session)
  text: string; // Message content (plain text)
  sender: 'user' | 'ai'; // Who sent the message
  timestamp: number; // Unix timestamp (Date.now())
  language: Locale; // Language of the message ('en' or 'ur')
  status: 'sending' | 'sent' | 'error'; // For optimistic updates
  conversationId?: string; // Backend conversation ID (if returned by API)
}
```

**Validation**:
- `id` must be unique within session (no duplicate checks needed for generated IDs)
- `text` must not be empty (trim whitespace, reject if empty)
- `sender` must be `'user'` or `'ai'`
- `timestamp` must be valid number (> 0)
- `language` must be `'en'` or `'ur'`
- `status` transitions: `'sending'` → `'sent'` (success) or `'error'` (failure)

**Usage**:
```javascript
// React state
const [messages, setMessages] = useState<ChatMessage[]>([]);

// Add user message
const newMessage: ChatMessage = {
  id: `${Date.now()}-${Math.random()}`,
  text: inputText,
  sender: 'user',
  timestamp: Date.now(),
  language: currentLocale,
  status: 'sending'
};
setMessages(prev => [...prev, newMessage]);

// Update status after API response
setMessages(prev => prev.map(msg =>
  msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
));

// Add AI response
const aiMessage: ChatMessage = {
  id: `${Date.now()}-${Math.random()}`,
  text: apiResponse.response,
  sender: 'ai',
  timestamp: Date.now(),
  language: apiResponse.language || currentLocale,
  status: 'sent',
  conversationId: apiResponse.conversation_id
};
setMessages(prev => [...prev, aiMessage]);
```

**Lifecycle**:
- **Created**: When user sends message or AI responds
- **Updated**: Status changes (`sending` → `sent`/`error`)
- **Deleted**: When user navigates away from dashboard (unless persisted to sessionStorage)

**Persistence** (optional):
```javascript
// Save to sessionStorage on change
useEffect(() => {
  sessionStorage.setItem('chatHistory', JSON.stringify(messages));
}, [messages]);

// Load from sessionStorage on mount
useEffect(() => {
  const saved = sessionStorage.getItem('chatHistory');
  if (saved) setMessages(JSON.parse(saved));
}, []);
```

**Display Logic**:
- **LTR (English)**: User messages right-aligned, AI messages left-aligned
- **RTL (Urdu)**: User messages left-aligned, AI messages right-aligned
- **Status Indicators**:
  - `sending`: Show spinner icon
  - `sent`: Show checkmark icon
  - `error`: Show error icon + "Failed to send" text

---

## 3. Voice Recording State

**Purpose**: Track microphone recording state and transcription progress

**Storage**: React component state (`useState`) - **transient only**, never persisted

**Structure**:
```typescript
interface VoiceRecordingState {
  isRecording: boolean; // True when microphone is active
  transcript: string; // Current transcribed text (real-time updates)
  error: string | null; // Error message if recognition fails
  hasPermission: boolean | null; // null=unknown, true=granted, false=denied
}
```

**Validation**:
- `isRecording` must be boolean
- `transcript` can be empty string (no validation needed)
- `error` can be `null` or non-empty string
- `hasPermission` must be `null`, `true`, or `false`

**Usage**:
```javascript
const [voiceState, setVoiceState] = useState<VoiceRecordingState>({
  isRecording: false,
  transcript: '',
  error: null,
  hasPermission: null // Unknown until first mic button click
});

// Request permission and start recording
const startRecording = async () => {
  const recognition = new webkitSpeechRecognition();
  recognition.onstart = () => setVoiceState(prev => ({ ...prev, isRecording: true, error: null }));
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setVoiceState(prev => ({ ...prev, transcript }));
  };
  recognition.onerror = (event) => {
    setVoiceState(prev => ({
      ...prev,
      isRecording: false,
      error: 'Could not understand. Please try again.',
      hasPermission: event.error === 'not-allowed' ? false : prev.hasPermission
    }));
  };
  recognition.onend = () => setVoiceState(prev => ({ ...prev, isRecording: false }));
  recognition.start();
};

// Stop recording
const stopRecording = () => {
  recognition.stop(); // Triggers onend event
};
```

**Lifecycle**:
- **Created**: When component mounts
- **Updated**: When recording starts/stops, transcript updates, errors occur
- **Deleted**: When component unmounts
- **Never Persisted**: Voice state is purely transient (no sessionStorage/localStorage)

**State Transitions**:
1. **Idle** → `isRecording: false, transcript: '', error: null`
2. **Requesting Permission** → Browser permission dialog shown
3. **Recording** → `isRecording: true, transcript: updating...`
4. **Transcribed** → `isRecording: false, transcript: "final text"`
5. **Error** → `isRecording: false, error: "message"`

---

## 4. Translation Dictionary

**Purpose**: Provide English and Urdu text for all UI labels, buttons, headings, tooltips

**Storage**: Static JSON files loaded via `next-intl`

**File Locations**:
- `frontend/locales/en.json` (English translations)
- `frontend/locales/ur.json` (Urdu translations)

**Structure**:
```typescript
interface TranslationDictionary {
  dashboard: {
    title: string;
    kpis: {
      total: string;
      completed: string;
      pending: string;
      overdue: string;
    };
    charts: {
      statusDistribution: string;
      activityTrend: string;
      taskBreakdown: string;
      noData: string;
    };
    taskTable: {
      title: string;
      status: string;
      dueDate: string;
      actions: string;
      searchPlaceholder: string;
      filterAll: string;
      filterPending: string;
      filterCompleted: string;
      deleteConfirm: string;
      emptyState: string;
    };
  };
  chatWidget: {
    title: string;
    inputPlaceholder: string;
    sendButton: string;
    voiceButton: string;
    voiceRecording: string;
    voiceError: string;
    apiError: string;
    thinking: string;
  };
  navigation: {
    logout: string;
    profile: string;
    languageToggle: string;
  };
  errors: {
    sessionExpired: string;
    microphonePermission: string;
    chatUnavailable: string;
  };
}
```

**Example Content** (`frontend/locales/en.json`):
```json
{
  "dashboard": {
    "title": "Task Dashboard",
    "kpis": {
      "total": "Total Tasks",
      "completed": "Completed",
      "pending": "Pending",
      "overdue": "Overdue"
    },
    "charts": {
      "statusDistribution": "Status Distribution",
      "activityTrend": "7-Day Activity Trend",
      "taskBreakdown": "Task Breakdown",
      "noData": "No data available"
    },
    "taskTable": {
      "title": "Task Title",
      "status": "Status",
      "dueDate": "Due Date",
      "actions": "Actions",
      "searchPlaceholder": "Search tasks...",
      "filterAll": "All",
      "filterPending": "Pending",
      "filterCompleted": "Completed",
      "deleteConfirm": "Are you sure you want to delete this task?",
      "emptyState": "No tasks yet. Create your first task via chat or add manually."
    }
  },
  "chatWidget": {
    "title": "AI Assistant",
    "inputPlaceholder": "Type a message or click the microphone...",
    "sendButton": "Send",
    "voiceButton": "Voice Input",
    "voiceRecording": "Listening...",
    "voiceError": "Could not understand. Please try again or type your message.",
    "apiError": "Unable to connect to AI assistant. Please try again.",
    "thinking": "Thinking..."
  },
  "navigation": {
    "logout": "Logout",
    "profile": "Profile",
    "languageToggle": "اردو"
  },
  "errors": {
    "sessionExpired": "Session expired. Please log in again.",
    "microphonePermission": "Microphone access required. Please enable in your browser settings.",
    "chatUnavailable": "Chat service is currently unavailable. Please try again later."
  }
}
```

**Example Content** (`frontend/locales/ur.json`):
```json
{
  "dashboard": {
    "title": "ٹاسک ڈیش بورڈ",
    "kpis": {
      "total": "کل کام",
      "completed": "مکمل",
      "pending": "زیر التواء",
      "overdue": "تاخیر سے"
    },
    "charts": {
      "statusDistribution": "حیثیت کی تقسیم",
      "activityTrend": "7 دن کی سرگرمی",
      "taskBreakdown": "کام کی تفصیل",
      "noData": "کوئی ڈیٹا دستیاب نہیں"
    },
    "taskTable": {
      "title": "کام کا عنوان",
      "status": "حیثیت",
      "dueDate": "آخری تاریخ",
      "actions": "اعمال",
      "searchPlaceholder": "کام تلاش کریں...",
      "filterAll": "تمام",
      "filterPending": "زیر التواء",
      "filterCompleted": "مکمل",
      "deleteConfirm": "کیا آپ واقعی اس کام کو حذف کرنا چاہتے ہیں؟",
      "emptyState": "ابھی تک کوئی کام نہیں۔ چیٹ کے ذریعے اپنا پہلا کام بنائیں۔"
    }
  },
  "chatWidget": {
    "title": "AI اسسٹنٹ",
    "inputPlaceholder": "پیغام لکھیں یا مائیکروفون پر کلک کریں...",
    "sendButton": "بھیجیں",
    "voiceButton": "آواز ان پٹ",
    "voiceRecording": "سن رہا ہے...",
    "voiceError": "سمجھ نہیں آیا۔ دوبارہ کوشش کریں یا ٹائپ کریں۔",
    "apiError": "AI اسسٹنٹ سے منسلک نہیں ہو سکا۔ دوبارہ کوشش کریں۔",
    "thinking": "سوچ رہا ہے..."
  },
  "navigation": {
    "logout": "لاگ آؤٹ",
    "profile": "پروفائل",
    "languageToggle": "English"
  },
  "errors": {
    "sessionExpired": "سیشن ختم ہو گیا۔ دوبارہ لاگ ان کریں۔",
    "microphonePermission": "مائیکروفون تک رسائی درکار ہے۔ براؤزر کی ترتیبات میں فعال کریں۔",
    "chatUnavailable": "چیٹ سروس فی الحال دستیاب نہیں۔ بعد میں دوبارہ کوشش کریں۔"
  }
}
```

**Usage with next-intl**:
```javascript
import { useTranslations } from 'next-intl';

function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>{t('kpis.total')}: {totalTasks}</div>
    </div>
  );
}
```

**Lifecycle**:
- **Created**: JSON files created during implementation (Phase 5: Urdu & RTL Support)
- **Updated**: When new UI text is added or translations are corrected
- **Deleted**: Never (part of source code)

**Validation**:
- Both `en.json` and `ur.json` must have identical key structure
- No missing keys (English has key but Urdu doesn't → error)
- No extra keys (Urdu has key but English doesn't → warning)
- Validation script: `npm run validate-translations` (to be created in Phase 5)

---

## 5. Task List State (Dashboard)

**Purpose**: Maintain synchronized task list for dashboard display (KPIs, charts, table)

**Storage**: React component state (`useState`) - **transient**, re-fetched from API on mount

**Structure**:
```typescript
interface TaskListState {
  tasks: Task[]; // Array of task objects from API
  loading: boolean; // True when fetching from API
  error: string | null; // Error message if API fails
  lastFetch: number; // Timestamp of last successful fetch (for cache invalidation)
  filters: {
    search: string; // Search query for title/description
    status: 'all' | 'pending' | 'completed'; // Status filter
  };
  pagination: {
    currentPage: number; // Current page number (1-indexed)
    pageSize: number; // Number of tasks per page (10)
    totalPages: number; // Total number of pages (calculated from tasks.length)
  };
}
```

**Task Object** (from backend API):
```typescript
interface Task {
  id: string; // UUID from backend
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
  dueDate: string | null; // ISO 8601 timestamp
  userId: string; // Owner's user ID
}
```

**Usage**:
```javascript
const [taskState, setTaskState] = useState<TaskListState>({
  tasks: [],
  loading: true,
  error: null,
  lastFetch: 0,
  filters: {
    search: '',
    status: 'all'
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalPages: 0
  }
});

// Fetch tasks from API
useEffect(() => {
  const fetchTasks = async () => {
    setTaskState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const tasks = await tasksAPI.list(userId);
      setTaskState(prev => ({
        ...prev,
        tasks,
        loading: false,
        lastFetch: Date.now(),
        pagination: {
          ...prev.pagination,
          totalPages: Math.ceil(tasks.length / prev.pagination.pageSize)
        }
      }));
    } catch (error) {
      setTaskState(prev => ({ ...prev, loading: false, error: error.message }));
    }
  };
  fetchTasks();
}, [userId]);
```

**Lifecycle**:
- **Created**: When dashboard component mounts
- **Updated**:
  - When tasks are fetched from API
  - When user modifies tasks (create, update, delete)
  - When chat widget creates/updates tasks (optimistic update + polling)
  - When filters or pagination change
- **Deleted**: When component unmounts

**Polling for Real-Time Sync**:
```javascript
// Active polling when chat is being used
useEffect(() => {
  let intervalId: NodeJS.Timeout | null = null;

  if (isChatActive) {
    intervalId = setInterval(async () => {
      const tasks = await tasksAPI.list(userId);
      setTaskState(prev => ({ ...prev, tasks }));
    }, 500); // Poll every 500ms
  }

  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [isChatActive, userId]);
```

---

## Data Flow Summary

```
User Login
    ↓
Dashboard Component Mounts
    ↓
┌─────────────────────────────────────┐
│ 1. Load Language Preference         │ ← localStorage.getItem('preferredLanguage')
│    (Default: 'en' if not found)     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 2. Fetch Tasks from API              │ ← GET /api/{user_id}/tasks
│    (Store in taskState)              │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 3. Render Dashboard                  │
│    - KPIs (calculated from tasks)    │
│    - Charts (rendered from tasks)    │
│    - Task Table (filtered/paginated) │
│    - Chat Widget (empty state)       │
└─────────────────────────────────────┘

User Interactions:

1. Language Toggle Clicked
       ↓
   Update localStorage ('en' ↔ 'ur')
       ↓
   Re-render with new locale + RTL direction

2. Voice Button Clicked
       ↓
   Request microphone permission
       ↓
   Start recording (update voiceState)
       ↓
   Transcribe speech → update voiceState.transcript
       ↓
   Auto-send to chat after 2s silence

3. Chat Message Sent
       ↓
   Add user message to messages[] (status: 'sending')
       ↓
   POST /api/{user_id}/chat
       ↓
   Update message status ('sent' or 'error')
       ↓
   Add AI response to messages[]
       ↓
   Parse AI response for task changes (optimistic update)
       ↓
   Update taskState.tasks immediately
       ↓
   Start polling (500ms interval) to verify sync

4. Task Table Action (toggle/delete/edit)
       ↓
   Optimistic update to taskState.tasks
       ↓
   API call (PUT/DELETE /api/{user_id}/tasks/{id})
       ↓
   Refresh tasks from API on success
```

---

## Relationships

```
                ┌────────────────────┐
                │  Language Pref     │
                │  (localStorage)    │
                └─────────┬──────────┘
                          │
                          │ Sets locale + direction
                          ↓
    ┌─────────────────────────────────────────────┐
    │         Dashboard Component                  │
    │  ┌──────────────┐  ┌──────────────────┐     │
    │  │  Task State  │  │  Chat Messages   │     │
    │  │  (useState)  │  │  (useState)      │     │
    │  └───────┬──────┘  └────────┬─────────┘     │
    │          │                   │               │
    │          │ Synced via        │               │
    │          │ optimistic        │               │
    │          │ updates + polling │               │
    │          ↓                   ↓               │
    │  ┌──────────────────────────────────┐       │
    │  │  Real-Time Sync (Task ↔ Chat)    │       │
    │  └──────────────────────────────────┘       │
    └─────────────────────────────────────────────┘
                          │
                          │ Uses for labels
                          ↓
                ┌────────────────────┐
                │  Translation Dict  │
                │  (static JSON)     │
                └────────────────────┘

                ┌────────────────────┐
                │  Voice State       │
                │  (useState)        │
                │  - Transient only  │
                └────────────────────┘
```

---

## No Backend Schema Changes

**Confirmed**: This feature does **NOT** modify any backend database schemas:

- ✅ No new tables
- ✅ No new columns
- ✅ No foreign key changes
- ✅ No index changes
- ✅ No migrations

**Reason**: All data models are **frontend-only state structures** for UI rendering. Backend API contracts remain unchanged.

**Existing Backend Models** (not modified):
- `User`, `Task`, `Conversation`, `Message` → Used as-is via existing API endpoints

---

## Validation Rules Summary

| Model | Field | Validation Rule |
|-------|-------|-----------------|
| LanguagePreference | locale | Must be 'en' or 'ur' |
| LanguagePreference | direction | Auto-derived (en→ltr, ur→rtl) |
| ChatMessage | text | Non-empty after trim() |
| ChatMessage | sender | Must be 'user' or 'ai' |
| ChatMessage | status | Must be 'sending', 'sent', or 'error' |
| VoiceRecordingState | isRecording | Must be boolean |
| VoiceRecordingState | hasPermission | Must be null, true, or false |
| TranslationDictionary | keys | Both en.json and ur.json must have identical keys |
| TaskListState | filters.status | Must be 'all', 'pending', or 'completed' |
| TaskListState | pagination.currentPage | Must be >= 1 and <= totalPages |

---

## Next Steps

Phase 1 complete. Proceed to Phase 2: Implementation Planning (7 phases of UI development).
