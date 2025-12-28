# Implementation Plan: Advanced Todo Dashboard UI with Conversational AI, Voice & Urdu Support

**Branch**: `001-dashboard-ui-voice-urdu` | **Date**: 2025-12-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-dashboard-ui-voice-urdu/spec.md`

## Summary

Implement a modern, advanced Todo dashboard UI that enhances the existing `/todos` page with:
1. **Visual Task Management**: KPI cards, interactive charts (donut, line, bar), and enhanced task table with filters/search/pagination
2. **Persistent AI Chat Widget**: Right sidebar chatbot for conversational task management (reuses existing backend)
3. **Voice Input**: Browser Web Speech API for hands-free interaction (microphone button in chat)
4. **Bilingual Support**: Full English + Urdu (RTL) interface with language toggle and i18n

**Technical Approach** (from research.md):
- **i18n**: next-intl 3.4.0+ for App Router with RTL support
- **Voice**: Browser Web Speech API (no external services)
- **Real-Time Sync**: Optimistic UI updates + smart polling (500ms when chat active)
- **State Management**: React hooks only (no Redux/Zustand)
- **RTL**: Tailwind CSS `dir="rtl"` attribute + directional utilities

**Key Constraint**: **UI/UX ONLY** - Zero backend changes, zero new APIs, 100% reuse of existing endpoints.

---

## Technical Context

**Language/Version**: TypeScript 5.x, JavaScript ES2022 (Next.js 14 App Router)
**Primary Dependencies**:
  - Next.js 14.2.35 (App Router)
  - React 18.x
  - Tailwind CSS 3.x
  - Recharts 2.10.3
  - next-intl 3.4.0+ (NEW - only new dependency)
**Storage**: Browser localStorage (language preference), sessionStorage (optional chat history), No database changes
**Testing**: Manual QA testing, Responsive testing (mobile/tablet/desktop), RTL testing, Voice testing (browser compatibility)
**Target Platform**: Modern web browsers (Chrome/Edge 89+, Safari 14.1+, Firefox 116+ with flag)
**Project Type**: Web application (Next.js frontend + existing FastAPI backend)
**Performance Goals**:
  - Dashboard load <3s (SC-001)
  - Chat-to-dashboard sync <2s (SC-002)
  - Language switching <1s (SC-003)
  - Voice transcription 90% accuracy (SC-004)
**Constraints**:
  - UI/UX only (no backend code changes)
  - No new APIs (reuse existing task + chat endpoints)
  - No new state libraries (React hooks only)
  - HTTPS required for voice input in production
  - RTL layout must not break existing components
**Scale/Scope**:
  - 45 functional requirements (FR-001 to FR-045)
  - 4 user stories (P1-P3 priority)
  - 10 success criteria
  - 7 implementation phases

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: Current constitution (`.specify/memory/constitution.md`) is for Kubernetes deployment (Phase IV), but this feature is a UI enhancement. The following principles from the original dashboard constitution (Phase II/III) apply:

**Relevant Principles**:
1. ✅ **Preservation Over Rewriting**: This feature enhances existing dashboard without replacing `/todos` functionality. All existing task CRUD logic preserved (FR-005).
2. ✅ **Spec-Driven Development**: Full specification created (`spec.md`), validated via checklist (16/16 passed), now proceeding to planning.
3. ✅ **Human-in-the-Loop**: Specification approved by user before planning. Implementation will require user acceptance testing for RTL, voice, and chat UX.
4. ✅ **No New State Libraries**: Uses React hooks only (Constraint #3 in spec). No Redux/Zustand/MobX.
5. ✅ **Documentation Requirement**: PHR will be created for this planning session (end of workflow).

**Gates**:
- ✅ **Gate 1**: Specification exists and is complete → PASS (spec.md, 306 lines, 16/16 checklist items)
- ✅ **Gate 2**: No backend logic changes required → PASS (UI-only, reuses existing endpoints)
- ✅ **Gate 3**: Preserves existing functionality → PASS (FR-005: "System MUST preserve existing task CRUD functionality")
- ✅ **Gate 4**: Technology stack constraints respected → PASS (Next.js 14, Tailwind, React hooks, Recharts)

**Violations**: **NONE**

**Justifications**: **N/A**

---

## Project Structure

### Documentation (this feature)

```text
specs/001-dashboard-ui-voice-urdu/
├── spec.md              # Feature specification (Phase 0: User input)
├── plan.md              # This file (Phase 2: /sp.plan output)
├── research.md          # Technical decisions (Phase 0: /sp.plan output)
├── data-model.md        # Frontend state models (Phase 1: /sp.plan output)
├── quickstart.md        # Development setup guide (Phase 1: to be created)
├── contracts/           # API documentation (Phase 1: /sp.plan output)
│   └── api-usage.md     # Existing endpoints used by dashboard
├── checklists/          # Quality validation (Phase 0: spec validation)
│   └── requirements.md  # Spec quality checklist (16/16 PASS)
└── tasks.md             # Implementation tasks (Phase 3: /sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/ (Next.js 14 App Router - EXISTING)
├── app/
│   ├── dashboard/       # NEW: Dashboard page route
│   │   └── page.js      # Main dashboard component (FR-001, FR-002, FR-003, FR-004)
│   ├── [locale]/        # NEW: Locale wrapper for i18n
│   │   └── layout.js    # next-intl provider + dir="rtl" logic (FR-033 to FR-041)
│   └── (existing routes: login, todos, todos/new, todos/[id])
│
├── components/
│   ├── dashboard/       # EXISTING: Reuse KPIs, Charts, TaskTable from Phase 2-6
│   │   ├── DashboardKPIs.js      # EXISTING (FR-006)
│   │   ├── TaskCharts.js         # EXISTING (FR-007)
│   │   ├── TaskTable.js          # EXISTING (FR-008 to FR-014)
│   │   └── charts/               # EXISTING (Donut, Line, Bar charts)
│   │       ├── DonutChart.js
│   │       ├── LineChart.js
│   │       └── BarChart.js
│   │
│   ├── chatbot/         # NEW: Chat widget components
│   │   ├── ChatWidget.js         # Main chat sidebar (FR-015 to FR-023)
│   │   ├── ChatMessage.js        # Individual message bubble (FR-016)
│   │   ├── ChatInput.js          # Text input + send button (FR-017, FR-018)
│   │   ├── VoiceInput.js         # Microphone button + recording UI (FR-024 to FR-032)
│   │   └── ChatModal.js          # Mobile/tablet modal overlay (FR-043)
│   │
│   ├── navigation/      # NEW: Top nav with language toggle
│   │   ├── TopNavBar.js          # App logo, language toggle, user menu (FR-003, FR-033)
│   │   └── LanguageToggle.js     # English ↔ اردو button (FR-033, FR-034)
│   │
│   └── (existing components)
│
├── lib/
│   ├── analytics.js     # EXISTING: KPI calculations (reused for FR-006)
│   ├── chart-utils.js   # EXISTING: Chart configs (reused for FR-007)
│   ├── date-helpers.js  # EXISTING: Date formatting (reused for task table)
│   ├── api.js           # EXISTING: API client (no modifications, reused for FR-018)
│   ├── auth.js          # EXISTING: JWT auth logic (reused for FR-002)
│   └── sync-manager.js  # NEW: Real-time polling + optimistic updates (FR-023)
│
├── hooks/
│   ├── useVoiceRecognition.js    # NEW: Web Speech API hook (FR-024 to FR-032)
│   ├── useLanguage.js            # NEW: Language preference hook (FR-037)
│   └── useTaskSync.js            # NEW: Real-time task sync hook (FR-023)
│
├── locales/             # NEW: Translation files
│   ├── en.json          # English translations (FR-040)
│   └── ur.json          # Urdu translations (FR-040)
│
├── styles/
│   └── globals.css      # EXISTING: Tailwind CSS (add RTL utilities if needed)
│
└── (existing files: package.json, tailwind.config.js, next.config.js, etc.)

backend/ (FastAPI - NO CHANGES)
└── (all files remain unchanged - constraint FR-005)
```

**Structure Decision**:
- **Frontend**: Next.js 14 App Router with new `/dashboard` route, reuses existing dashboard components (Phase 2-6), adds new chatbot components + i18n
- **Backend**: Zero modifications (UI-only feature)
- **Rationale**: Maximizes code reuse (KPIs, charts, table from existing dashboard), isolates new features (chat widget, voice input, i18n) into separate component directories

---

## Complexity Tracking

**No Violations**: This feature adheres to all constitution principles and specification constraints.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

**Justification**: Not applicable - no constitution violations or constraint breaches.

---

## Phase 0: Research & Technical Decisions

**Status**: ✅ COMPLETE (see `research.md`)

**Artifacts Generated**:
- `research.md` (5 research tasks, all decisions made)

**Key Decisions**:
1. **i18n Library**: next-intl 3.4.0+ (App Router-native, RTL support, lightweight)
2. **Voice Input**: Browser Web Speech API (zero dependencies, graceful degradation)
3. **Real-Time Sync**: Optimistic UI + smart polling (500ms active, 5s idle)
4. **Chat State**: React hooks + sessionStorage (no Redux/Zustand)
5. **RTL Support**: Tailwind CSS `dir="rtl"` + directional utilities

**No Clarifications Needed**: All unknowns resolved with informed defaults.

---

## Phase 1: Design, Data Models & Contracts

**Status**: ✅ COMPLETE

**Artifacts Generated**:
- `data-model.md` (5 frontend state models documented)
- `contracts/api-usage.md` (4 existing endpoints documented, ZERO new endpoints)

**Data Models** (Frontend State Only):
1. **LanguagePreference** (localStorage): `{ locale: 'en'|'ur', direction: 'ltr'|'rtl', lastUpdated: number }`
2. **ChatMessage** (React state): `{ id, text, sender, timestamp, language, status }`
3. **VoiceRecordingState** (React state): `{ isRecording, transcript, error, hasPermission }`
4. **TranslationDictionary** (static JSON): Nested keys for all UI text (en.json, ur.json)
5. **TaskListState** (React state): `{ tasks, loading, error, filters, pagination }`

**API Contracts** (Existing, Reused):
- `GET /api/{user_id}/tasks` - Fetch tasks
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `POST /api/{user_id}/chat` - Conversational AI (with optional `language` param)

**No Backend Changes**: Confirmed zero database migrations, zero new tables, zero new endpoints.

---

## Phase 2: Implementation Phases (7 Phases)

**Agent Assignments**:
- **UI/UX Agent**: Layout, styling, RTL visual design
- **Frontend Integration Agent**: API wiring, state management, data flow
- **Conversation UX Agent**: Chat widget behavior, voice input, message formatting
- **Accessibility Agent**: Keyboard navigation, focus states, ARIA labels, contrast checks

---

### **Phase 1: Dashboard Foundation & Routing**

**Purpose**: Establish protected `/dashboard` route with authentication guard, create layout shell with top navigation and two-zone structure (main area + chat sidebar).

**Priority**: P1 (Core - blocks all other phases)

**Responsible Agent**: **UI/UX Agent** (layout), **Frontend Integration Agent** (routing, auth)

**Steps**:

1. **Create Dashboard Page Route** (FR-001, FR-002)
   - **Scope**: Create `frontend/app/dashboard/page.js` with authentication guard
   - **Details**:
     - Import `isAuthenticated()` from `lib/auth.js`
     - Check auth on component mount (`useEffect`)
     - Redirect to `/login?message=Please log in` if not authenticated
     - Fetch user ID from JWT token (`getUserIdFromToken()` helper)
   - **Validation**: Unauthenticated user redirected to `/login`, authenticated user sees dashboard

2. **Update Login Redirect** (FR-001)
   - **Scope**: Modify `frontend/app/login/page.js` to redirect to `/dashboard` after successful login
   - **Details**:
     - Change post-login redirect from `/todos` to `/dashboard`
     - Preserve existing JWT token storage logic
   - **Validation**: User lands on `/dashboard` after login (not `/todos`)

3. **Create Top Navigation Bar Component** (FR-003)
   - **Scope**: Create `frontend/components/navigation/TopNavBar.js`
   - **Details**:
     - Display application logo (existing logo from `/todos` page)
     - Placeholder for language toggle (button, functionality in Phase 5)
     - User profile dropdown menu:
       - Display username from JWT
       - Logout action (clears token, redirects to `/login`)
     - Styling: Tailwind glass-morphism design (match existing dashboard)
   - **Validation**: Nav bar visible on dashboard, logout works, username displayed

4. **Create Two-Zone Layout Shell** (FR-004)
   - **Scope**: Structure dashboard page with main area (left/center) and chat sidebar (right)
   - **Details**:
     - Use CSS Grid or Flexbox for responsive layout
     - Main area: `flex-1` (takes remaining space)
     - Chat sidebar: `w-96` (384px fixed width on desktop)
     - Responsive: Chat sidebar hidden on mobile/tablet (handled in Phase 3)
     - Placeholder divs for now (no content yet)
   - **Validation**: Two-zone layout visible on desktop (main left, chat right)

5. **Language Toggle Scaffolding** (FR-033 - scaffolding only)
   - **Scope**: Add language toggle button to nav bar (non-functional, wired in Phase 5)
   - **Details**:
     - Button displays "English ↔ اردو"
     - onClick logs "Language toggle clicked" (no functionality yet)
     - Positioned in nav bar (between logo and user menu)
   - **Validation**: Button visible and clickable (logs to console)

**Files Affected**:
- NEW: `frontend/app/dashboard/page.js`
- MODIFIED: `frontend/app/login/page.js` (change redirect)
- NEW: `frontend/components/navigation/TopNavBar.js`
- NEW: `frontend/components/navigation/LanguageToggle.js` (placeholder)

**Validation Criteria**:
- ✅ `/dashboard` redirects unauthenticated users to `/login`
- ✅ Authenticated users see top nav bar with logo, language toggle placeholder, and user menu
- ✅ Logout clears token and redirects to `/login`
- ✅ Two-zone layout displays on desktop (main area + chat sidebar placeholder)
- ✅ Post-login redirect goes to `/dashboard` (not `/todos`)

**Dependencies**: None (foundational phase)

**Estimated Effort**: 2-3 hours

---

### **Phase 2: Advanced Task Dashboard UI**

**Purpose**: Implement visual task management in main dashboard area - KPI cards, charts, and interactive task table with filters/search/pagination.

**Priority**: P1 (Core - delivers immediate value per User Story 1)

**Responsible Agent**: **UI/UX Agent** (layout), **Frontend Integration Agent** (data fetching, CRUD operations)

**Steps**:

1. **Integrate Dashboard KPIs Component** (FR-006)
   - **Scope**: Import and render `DashboardKPIs` (EXISTING component from Phase 4)
   - **Details**:
     - Fetch tasks via `tasksAPI.list(userId)` (from `lib/api.js`)
     - Pass tasks to `DashboardKPIs` component
     - Component calculates metrics using `calculateKPIs(tasks)` (from `lib/analytics.js`)
     - Display 4 KPI cards: Total, Completed, Pending, Overdue
   - **Validation**: KPI cards show correct counts matching task data

2. **Integrate Task Charts Component** (FR-007)
   - **Scope**: Import and render `TaskCharts` (EXISTING component from Phase 5)
   - **Details**:
     - Pass tasks to `TaskCharts` component
     - Renders 3 charts:
       - Donut chart: Status distribution (pending vs completed)
       - Line chart: 7-day activity trend (tasks created/completed per day)
       - Bar chart: Tasks by status breakdown
     - Uses existing chart utilities from `lib/chart-utils.js`
   - **Validation**: Charts render with data, empty state for no tasks

3. **Integrate Task Table Component** (FR-008)
   - **Scope**: Import and render `TaskTable` (EXISTING component from Phase 6)
   - **Details**:
     - Pass tasks to `TaskTable` component
     - Displays columns: Title, Status, Due Date, Actions (toggle, edit, delete)
     - Reuses existing CRUD handlers from Phase 6
   - **Validation**: Table displays tasks, columns visible

4. **Add Search Filter UI** (FR-009)
   - **Scope**: Add search input above task table (within `TaskTable` component or parent)
   - **Details**:
     - Input field with placeholder "Search tasks..."
     - Filter tasks by title/description (case-insensitive)
     - Real-time filtering (no submit button)
     - State: `const [searchQuery, setSearchQuery] = useState('')`
   - **Validation**: Typing in search filters task table immediately

5. **Add Status Filter Dropdown** (FR-010)
   - **Scope**: Add dropdown next to search input
   - **Details**:
     - Options: "All", "Pending", "Completed"
     - Filter tasks by status
     - State: `const [statusFilter, setStatusFilter] = useState('all')`
   - **Validation**: Selecting filter updates task table

6. **Implement Pagination Controls** (FR-011)
   - **Scope**: Add pagination UI below task table (within `TaskTable` or parent)
   - **Details**:
     - Display 10 tasks per page
     - Previous/Next buttons
     - Page number indicator (e.g., "Page 2 of 5")
     - State: `const [currentPage, setCurrentPage] = useState(1)`
     - Disable Previous on page 1, Next on last page
   - **Validation**: Pagination works, buttons disabled correctly

7. **Wire Task CRUD Operations** (FR-012, FR-013, FR-014)
   - **Scope**: Connect task table actions to API calls
   - **Details**:
     - **Toggle Completion** (FR-012): Checkbox calls `tasksAPI.update(userId, taskId, { completed: !task.completed })`
     - **Delete Task** (FR-013): Delete button shows confirmation prompt ("Are you sure?"), calls `tasksAPI.delete(userId, taskId)` on confirm
     - **Edit Task** (FR-014): Edit button navigates to `/todos/[id]` (existing edit page)
     - Use optimistic updates (update UI before API call, rollback on error)
   - **Validation**: All CRUD operations work, optimistic updates feel instant

8. **Add Empty State** (Edge Case)
   - **Scope**: Show message when no tasks exist
   - **Details**:
     - If `tasks.length === 0`, display: "No tasks yet. Create your first task via chat or add manually."
     - Provide link to `/todos/new` (existing create page)
   - **Validation**: Empty state displays when no tasks

9. **Add Responsive Layout** (FR-042, FR-044)
   - **Scope**: Make dashboard stack vertically on mobile
   - **Details**:
     - Desktop (≥1024px): KPIs, Charts, Table in grid layout
     - Tablet/Mobile (<1024px): Stack vertically (KPIs → Charts → Table)
     - Use Tailwind responsive classes: `grid grid-cols-2 lg:grid-cols-4`, `flex flex-col lg:flex-row`
   - **Validation**: Dashboard stacks nicely on mobile (test at 375px width)

**Files Affected**:
- MODIFIED: `frontend/app/dashboard/page.js` (add KPIs, charts, table)
- REUSED: `frontend/components/dashboard/DashboardKPIs.js`
- REUSED: `frontend/components/dashboard/TaskCharts.js`
- REUSED: `frontend/components/dashboard/TaskTable.js`
- MODIFIED: `frontend/components/dashboard/TaskTable.js` (add search, status filter, pagination UI if not already present)

**Validation Criteria**:
- ✅ KPI cards display correct metrics (Total, Completed, Pending, Overdue)
- ✅ 3 charts render with task data (donut, line, bar)
- ✅ Task table shows tasks with columns (Title, Status, Due Date, Actions)
- ✅ Search filters tasks in real-time
- ✅ Status filter dropdown works (All, Pending, Completed)
- ✅ Pagination shows 10 tasks per page with working Previous/Next buttons
- ✅ Toggle completion checkbox works (optimistic update + API call)
- ✅ Delete button shows confirmation and deletes task
- ✅ Edit button navigates to `/todos/[id]`
- ✅ Empty state displays when no tasks exist
- ✅ Layout stacks vertically on mobile (<1024px)

**Dependencies**: Phase 1 (dashboard route + layout shell)

**Estimated Effort**: 4-6 hours (mostly integration of existing components)

---

### **Phase 3: Chatbot Widget Integration**

**Purpose**: Build persistent AI chat widget in right sidebar with message history, text input, send button, and integration with existing `/api/{user_id}/chat` endpoint.

**Priority**: P2 (Differentiating feature - makes dashboard "advanced")

**Responsible Agent**: **Conversation UX Agent** (chat behavior, message formatting), **Frontend Integration Agent** (API integration, state management)

**Steps**:

1. **Create ChatWidget Component** (FR-015)
   - **Scope**: Create `frontend/components/chatbot/ChatWidget.js` as persistent sidebar component
   - **Details**:
     - Fixed width: `w-96` (384px) on desktop
     - Height: `h-full` (fills vertical space)
     - Styling: Glass-morphism panel matching dashboard design
     - Three sections: Header ("AI Assistant"), Message History, Input Area
     - Always visible on desktop (not a modal)
   - **Validation**: Chat widget visible on right side of dashboard

2. **Create ChatMessage Component** (FR-016)
   - **Scope**: Create `frontend/components/chatbot/ChatMessage.js` for individual message bubbles
   - **Details**:
     - Props: `{ text, sender: 'user' | 'ai', timestamp, language, status }`
     - **LTR (English)**: User messages right-aligned (blue bubble), AI messages left-aligned (gray bubble)
     - **RTL (Urdu)**: User messages left-aligned, AI messages right-aligned (handled in Phase 5)
     - Display timestamp below message (e.g., "2:30 PM")
     - Status indicator for user messages: ⏳ (sending), ✓ (sent), ❌ (error)
   - **Validation**: Messages render with correct alignment and styling

3. **Implement Message History UI** (FR-016, FR-021, FR-022)
   - **Scope**: Scrollable message container in ChatWidget
   - **Details**:
     - State: `const [messages, setMessages] = useState<ChatMessage[]>([]);`
     - Render messages using `ChatMessage` component
     - Auto-scroll to bottom when new message added (`useEffect` with `scrollIntoView`)
     - Max height with overflow-y-auto for scrolling
     - Load from sessionStorage on mount (optional persistence)
     - Save to sessionStorage on message change (optional persistence)
   - **Validation**: Message history scrolls, auto-scrolls to latest message

4. **Create ChatInput Component** (FR-017, FR-018)
   - **Scope**: Create `frontend/components/chatbot/ChatInput.js` with text input + send button
   - **Details**:
     - Textarea with placeholder "Type a message..."
     - Send button (paper plane icon or "Send" text)
     - State: `const [inputText, setInputText] = useState('')`
     - Enter key sends message (Shift+Enter for newline)
     - Disable input while `isLoading` (API call in progress)
   - **Validation**: Typing and clicking send works

5. **Integrate Chat API** (FR-018, FR-019, FR-020)
   - **Scope**: Wire chat input to POST `/api/{user_id}/chat` endpoint
   - **Details**:
     - Create `chatAPI.sendMessage(userId, { message, language })` in `lib/api.js` (if not already exists)
     - On send:
       1. Add user message to state (status: 'sending')
       2. Call API with message text and current language ('en' or 'ur')
       3. Update user message status to 'sent'
       4. Add AI response to state (sender: 'ai', text: response.response)
       5. Handle errors (update status to 'error', show error message)
     - Loading state: Show "Thinking..." indicator while API call in progress
   - **Validation**: Sending message calls API, AI response appears in chat

6. **Add Loading and Error States** (Edge Cases)
   - **Scope**: Display loading spinner and error messages gracefully
   - **Details**:
     - **Loading**: Show "Thinking..." with pulsing dots while API call in progress
     - **Error**: If API fails, display error message in chat: "Unable to connect to AI assistant. Please try again."
     - Allow retry: User can resend failed message
   - **Validation**: Loading indicator shows, error messages display correctly

7. **Implement Mobile/Tablet Chat Widget** (FR-043)
   - **Scope**: Transform chat widget into floating action button (FAB) + modal on mobile/tablet
   - **Details**:
     - **Desktop (≥1024px)**: Persistent sidebar (existing behavior)
     - **Mobile/Tablet (<1024px)**:
       - Hide sidebar
       - Show floating button (bottom-right corner, blue circle with chat icon)
       - onClick: Open modal overlay (full screen or 80% height)
       - Modal contains same ChatWidget component
       - Close button in modal header
     - Create `ChatModal.js` component for modal wrapper
   - **Validation**: FAB appears on mobile, clicking opens modal, close button works

8. **Session Persistence (Optional)** (FR-022)
   - **Scope**: Save chat history to sessionStorage for persistence across page refreshes
   - **Details**:
     - On mount: Load messages from `sessionStorage.getItem('chatHistory')`
     - On message change: Save to `sessionStorage.setItem('chatHistory', JSON.stringify(messages))`
     - Clear on logout (when JWT token is cleared)
   - **Validation**: Chat history persists after page refresh

**Files Affected**:
- NEW: `frontend/components/chatbot/ChatWidget.js`
- NEW: `frontend/components/chatbot/ChatMessage.js`
- NEW: `frontend/components/chatbot/ChatInput.js`
- NEW: `frontend/components/chatbot/ChatModal.js`
- MODIFIED: `frontend/lib/api.js` (add `chatAPI.sendMessage()` if not exists)
- MODIFIED: `frontend/app/dashboard/page.js` (add ChatWidget to right sidebar)

**Validation Criteria**:
- ✅ Chat widget visible on right sidebar (desktop)
- ✅ Message history displays with correct alignment (user right, AI left)
- ✅ Text input and send button work
- ✅ Sending message calls API, AI response appears
- ✅ Auto-scroll to latest message when new message added
- ✅ Loading indicator shows during API call
- ✅ Error messages display when API fails
- ✅ FAB appears on mobile (<1024px), clicking opens modal
- ✅ Chat history persists across page refresh (sessionStorage)

**Dependencies**: Phase 2 (dashboard with tasks loaded)

**Estimated Effort**: 6-8 hours

---

### **Phase 4: Voice Interaction UI**

**Purpose**: Add microphone button to chat input with Web Speech API integration for hands-free voice commands, including permission handling and visual feedback.

**Priority**: P3 (Convenience feature - dashboard functional without it)

**Responsible Agent**: **Conversation UX Agent** (voice UX, animations), **Frontend Integration Agent** (Web Speech API integration)

**Steps**:

1. **Create VoiceInput Component** (FR-024)
   - **Scope**: Create `frontend/components/chatbot/VoiceInput.js` with microphone button
   - **Details**:
     - Button displays microphone icon (🎤 or SVG icon)
     - Positioned adjacent to text input in ChatInput component
     - Two states: Idle (gray), Recording (red pulsing)
     - onClick toggles recording on/off
   - **Validation**: Microphone button visible next to text input

2. **Create useVoiceRecognition Hook** (FR-025, FR-026)
   - **Scope**: Create `frontend/hooks/useVoiceRecognition.js` to encapsulate Web Speech API logic
   - **Details**:
     - Check browser support: `const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;`
     - If unsupported, return `{ isSupported: false, ...  }` (button will be hidden)
     - State: `{ isRecording, transcript, error, hasPermission }`
     - Methods: `startRecording()`, `stopRecording()`
     - Request microphone permission on first start
   - **Validation**: Hook detects browser support, manages recording state

3. **Implement Voice Recognition** (FR-026, FR-027)
   - **Scope**: Integrate Web Speech API for real-time speech-to-text
   - **Details**:
     - Create `SpeechRecognition` instance
     - Configure: `continuous: false`, `interimResults: true`, `lang: 'en-US'` (or 'ur-PK' for Urdu)
     - `onresult`: Update transcript state in real-time (display in chat input)
     - `onerror`: Handle errors (permission denied, no speech, network error)
     - `onend`: Mark recording as stopped
   - **Validation**: Speaking updates text input in real-time

4. **Implement Auto-Send After Silence** (FR-028)
   - **Scope**: Automatically send transcribed text after 2 seconds of silence
   - **Details**:
     - Listen for `onspeechend` event (fired when user stops speaking)
     - Start 2-second timer (`setTimeout`)
     - If no new speech detected, call `sendMessage(transcript)`
     - User can manually stop recording before 2 seconds (clicking mic button)
   - **Validation**: After speaking, message auto-sends after 2s silence

5. **Add Recording Visual Indicator** (FR-029)
   - **Scope**: Pulsing animation and "Listening..." text while recording
   - **Details**:
     - Microphone button: Red background with pulsing CSS animation
     - Display text below input: "Listening..." with animated dots (. → .. → ...)
     - Transcript appears in text input as user speaks
   - **Validation**: Visual feedback shows recording state clearly

6. **Implement Manual Stop** (FR-030)
   - **Scope**: Allow user to click mic button again to stop recording
   - **Details**:
     - Toggle button: First click starts, second click stops
     - On stop: Keep transcribed text in input (don't auto-send)
     - User can edit text before sending
   - **Validation**: Clicking mic button stops recording, text remains editable

7. **Handle Microphone Permission Denial** (FR-031)
   - **Scope**: Graceful error handling for denied microphone access
   - **Details**:
     - `onerror` event with `error.error === 'not-allowed'` → permission denied
     - Display error message in chat: "Microphone access required. Please enable in your browser settings."
     - Show instructions modal (optional) with browser-specific steps
     - Disable mic button (gray out) if permission denied
   - **Validation**: Permission denied shows error message, button disabled

8. **Hide Button on Unsupported Browsers** (FR-032)
   - **Scope**: Feature detection for Web Speech API
   - **Details**:
     - If `!SpeechRecognition`, hide microphone button entirely
     - Alternative: Show disabled button with tooltip "Voice input not supported in this browser"
     - Text input remains fully functional
   - **Validation**: Button hidden in browsers without Web Speech API (e.g., older Firefox)

9. **Add Voice Error Handling** (Edge Case)
   - **Scope**: Handle recognition errors (gibberish, no speech, network errors)
   - **Details**:
     - `onerror` event types:
       - `no-speech`: "No speech detected. Please try again."
       - `audio-capture`: "Microphone not found. Please check device."
       - `network`: "Network error. Please check connection."
     - Display error messages in chat widget (not as message bubbles, as UI notifications)
     - Allow retry
   - **Validation**: Different error types show appropriate messages

10. **Language Detection for Voice** (FR-019, for Urdu support)
    - **Scope**: Set speech recognition language based on current UI language
    - **Details**:
      - If language is 'en', use `recognition.lang = 'en-US'`
      - If language is 'ur', use `recognition.lang = 'ur-PK'`
      - Language preference from Phase 5 (hook into `useLanguage()`)
    - **Validation**: Voice recognition uses correct language (test with Urdu speech)

**Files Affected**:
- NEW: `frontend/components/chatbot/VoiceInput.js`
- NEW: `frontend/hooks/useVoiceRecognition.js`
- MODIFIED: `frontend/components/chatbot/ChatInput.js` (integrate VoiceInput component)

**Validation Criteria**:
- ✅ Microphone button visible next to text input
- ✅ Clicking button requests microphone permission (first time)
- ✅ Speaking transcribes to text in real-time
- ✅ Pulsing red animation shows while recording
- ✅ Message auto-sends after 2s silence
- ✅ Clicking button again stops recording (text editable)
- ✅ Permission denied shows error message
- ✅ Button hidden in unsupported browsers
- ✅ Voice errors display appropriate messages
- ✅ Language switches to Urdu ('ur-PK') when UI language is Urdu

**Dependencies**: Phase 3 (chat widget with text input)

**Estimated Effort**: 6-8 hours

---

### **Phase 5: Urdu Language & RTL Support**

**Purpose**: Implement full bilingual support (English ↔ Urdu) with language toggle, translation strings, RTL layout switching, and chart/table RTL adaptation.

**Priority**: P2 (Key differentiating feature - expands user base)

**Responsible Agent**: **UI/UX Agent** (RTL layout, visual adaptation), **Frontend Integration Agent** (i18n setup, translation loading)

**Steps**:

1. **Install and Configure next-intl** (FR-040)
   - **Scope**: Add next-intl dependency and configure for Next.js 14 App Router
   - **Details**:
     - Install: `npm install next-intl`
     - Create `frontend/i18n.js` config:
       ```javascript
       import { getRequestConfig } from 'next-intl/server';
       export default getRequestConfig(async ({ locale }) => ({
         messages: (await import(`./locales/${locale}.json`)).default
       }));
       ```
     - Create `next-intl-middleware.js` for locale detection (optional)
   - **Validation**: next-intl installed, config file created

2. **Create Translation Files** (FR-040)
   - **Scope**: Create `frontend/locales/en.json` and `frontend/locales/ur.json`
   - **Details**:
     - Structure: Nested JSON keys for dashboard, chatWidget, navigation, errors
     - English file: All UI text in English (reference data-model.md for structure)
     - Urdu file: Accurate Urdu translations (verified by native speaker - user responsibility)
     - **KEY REQUIREMENT**: Both files must have identical key structure (validate with script)
   - **Validation**: Translation files exist with matching keys

3. **Create Translation Validation Script** (FR-040)
   - **Scope**: Create `frontend/scripts/validate-translations.js` to check key parity
   - **Details**:
     - Load both `en.json` and `ur.json`
     - Compare keys recursively (all English keys exist in Urdu, no extra Urdu keys)
     - Report missing or extra keys
     - Exit with error if mismatch found
     - Add to `package.json`: `"validate-translations": "node scripts/validate-translations.js"`
   - **Validation**: Script runs without errors, catches missing keys

4. **Wrap App with Locale Provider** (FR-034, FR-035, FR-036)
   - **Scope**: Create `frontend/app/[locale]/layout.js` to wrap app with next-intl provider
   - **Details**:
     - Dynamic route segment: `[locale]` captures 'en' or 'ur'
     - Set `<html dir={locale === 'ur' ? 'rtl' : 'ltr'} lang={locale}>`
     - Wrap children with `<NextIntlClientProvider locale={locale} messages={messages}>`
     - Validate locale against allowlist (['en', 'ur']), fallback to 'en'
   - **Validation**: Changing URL to `/en/dashboard` or `/ur/dashboard` switches language + direction

5. **Create useLanguage Hook** (FR-037)
   - **Scope**: Create `frontend/hooks/useLanguage.js` for language preference management
   - **Details**:
     - Read from localStorage: `preferredLanguage` (default: 'en')
     - Return: `{ locale, setLocale, direction }`
     - `setLocale(newLocale)`: Update localStorage + trigger router push to `/[locale]/dashboard`
     - `direction`: Auto-derived ('en' → 'ltr', 'ur' → 'rtl')
   - **Validation**: Hook reads/writes localStorage, returns correct direction

6. **Wire Language Toggle Button** (FR-033, FR-034)
   - **Scope**: Make language toggle functional (scaffolded in Phase 1)
   - **Details**:
     - Import `useLanguage()` hook
     - Display current locale opposite (if 'en', show "اردو", if 'ur', show "English")
     - onClick: Call `setLocale(locale === 'en' ? 'ur' : 'en')`
     - Router pushes to new locale route (e.g., `/ur/dashboard`)
     - Page re-renders with new translations + RTL layout
   - **Validation**: Clicking toggle switches language and layout direction

7. **Translate Dashboard UI Text** (FR-034, FR-038)
   - **Scope**: Replace all hardcoded English text with `t()` function from useTranslations
   - **Details**:
     - Dashboard KPIs: `t('dashboard.kpis.total')`, `t('dashboard.kpis.completed')`, etc.
     - Chart labels: `t('dashboard.charts.statusDistribution')`, `t('dashboard.charts.activityTrend')`, etc.
     - Task table: `t('dashboard.taskTable.title')`, `t('dashboard.taskTable.status')`, etc.
     - Chat widget: `t('chatWidget.title')`, `t('chatWidget.inputPlaceholder')`, etc.
     - Navigation: `t('navigation.logout')`, `t('navigation.profile')`
     - Errors: `t('errors.sessionExpired')`, `t('errors.microphonePermission')`
   - **Validation**: All UI text displays in Urdu when language is 'ur'

8. **Adapt Charts for RTL** (FR-038)
   - **Scope**: Ensure Recharts components render correctly in RTL
   - **Details**:
     - Recharts auto-handles RTL for most charts (no changes needed)
     - Axis labels: Pass translated strings from `t()`
     - Legend position: Use `layout="horizontal"` for consistent positioning
     - Test all 3 charts (donut, line, bar) in RTL mode
   - **Validation**: Charts display correctly in RTL (labels in Urdu, no visual bugs)

9. **Adapt Task Table for RTL** (FR-035, FR-041)
   - **Scope**: Ensure table columns and text alignment work in RTL
   - **Details**:
     - Column order: Auto-reverses with `flex-row` in RTL
     - Text alignment: Use `text-right` for numeric columns (stays right in both LTR/RTL)
     - Actions column: Use `rtl:order-first ltr:order-last` to position correctly
     - Test with long Urdu text (ensure truncation works without breaking layout)
   - **Validation**: Table displays correctly in RTL (columns reversed, text aligned)

10. **Adapt Chat Widget for RTL** (FR-041)
    - **Scope**: Flip chat message alignment for RTL mode
    - **Details**:
      - **LTR (English)**: User messages right-aligned, AI messages left-aligned
      - **RTL (Urdu)**: User messages left-aligned, AI messages right-aligned
      - Use Tailwind RTL utilities: `rtl:justify-start ltr:justify-end` for user messages
      - Test with Urdu chat messages (verify AI responds in Urdu when language is 'ur')
    - **Validation**: Chat bubbles align correctly in RTL, AI responds in Urdu

11. **Send Language Preference to Chat API** (FR-019, FR-039)
    - **Scope**: Include language in POST `/api/{user_id}/chat` request
    - **Details**:
      - Modify `chatAPI.sendMessage()` to accept `language` param
      - Pass current locale: `chatAPI.sendMessage(userId, { message, language: currentLocale })`
      - Backend AI uses language to respond appropriately (no backend changes needed)
    - **Validation**: Sending Urdu message in Urdu mode gets Urdu response from AI

12. **Test RTL Edge Cases** (Edge Cases)
    - **Scope**: Comprehensive RTL testing with real Urdu text
    - **Details**:
      - Long task titles (truncate with ellipsis, tooltip on hover)
      - Mixed English + Urdu text (browser handles bidirectional text)
      - Overflow: Ensure no horizontal scrolling on any component
      - Icons: Verify direction-agnostic icons (no left/right arrows)
    - **Validation**: No visual bugs in RTL, text overflow handled gracefully

**Files Affected**:
- NEW: `frontend/i18n.js` (next-intl config)
- NEW: `frontend/locales/en.json` (English translations)
- NEW: `frontend/locales/ur.json` (Urdu translations)
- NEW: `frontend/scripts/validate-translations.js` (validation script)
- NEW: `frontend/app/[locale]/layout.js` (locale wrapper)
- NEW: `frontend/hooks/useLanguage.js` (language preference hook)
- MODIFIED: `frontend/components/navigation/LanguageToggle.js` (wire functionality)
- MODIFIED: All dashboard components (replace text with `t()` calls)
- MODIFIED: `frontend/lib/api.js` (add `language` param to chatAPI)
- MODIFIED: `package.json` (add validate-translations script, next-intl dependency)

**Validation Criteria**:
- ✅ next-intl installed and configured
- ✅ Translation files created (en.json, ur.json) with matching keys
- ✅ Validation script catches missing keys
- ✅ Locale provider wraps app, sets `dir="rtl"` for Urdu
- ✅ Language toggle switches between English and Urdu
- ✅ All UI text translates (dashboard, chat, nav, errors)
- ✅ Charts display correctly in RTL with Urdu labels
- ✅ Task table reverses columns in RTL, text aligns correctly
- ✅ Chat messages align correctly in RTL (user left, AI right)
- ✅ Language preference sent to chat API, AI responds in Urdu
- ✅ No visual bugs in RTL (overflow, misalignment, broken layouts)

**Dependencies**: Phase 1-4 (all UI components exist)

**Estimated Effort**: 8-10 hours (translation file creation, RTL testing)

---

### **Phase 6: Accessibility & UX Polish**

**Purpose**: Add keyboard navigation, focus states, ARIA labels, contrast checks, loading indicators, and micro-interactions for accessibility and professional UX.

**Priority**: P3 (Polish - dashboard functional without it, but improves UX)

**Responsible Agent**: **Accessibility Agent** (a11y compliance, keyboard nav), **UI/UX Agent** (animations, visual polish)

**Steps**:

1. **Add Keyboard Navigation** (Best Practice)
   - **Scope**: Ensure all interactive elements are keyboard accessible
   - **Details**:
     - Language toggle: Tab to focus, Enter/Space to toggle
     - Chat input: Tab to focus, Enter to send (Shift+Enter for newline)
     - Microphone button: Tab to focus, Enter/Space to start/stop
     - Task table actions: Tab through checkboxes, delete buttons, edit links
     - Search/filter inputs: Tab to focus
     - Pagination: Tab to Previous/Next buttons, Enter to navigate
   - **Validation**: All actions work with keyboard only (no mouse)

2. **Add Focus States** (Best Practice)
   - **Scope**: Visible focus indicators for all interactive elements
   - **Details**:
     - Use Tailwind `focus:ring-2 focus:ring-brand-500` for buttons, inputs
     - Focus outline visible on all focusable elements (buttons, links, inputs)
     - Skip to main content link for screen readers (optional)
   - **Validation**: Focus indicators visible when tabbing through UI

3. **Add ARIA Labels** (Best Practice)
   - **Scope**: Improve screen reader accessibility
   - **Details**:
     - Language toggle: `aria-label="Switch to Urdu"` (or "Switch to English")
     - Microphone button: `aria-label="Start voice input"` (or "Stop voice input")
     - Chat input: `aria-label="Type a message"`
     - Task checkboxes: `aria-label="Toggle task completion"`
     - Delete buttons: `aria-label="Delete task"`
     - Charts: `aria-label="Status distribution chart"` (for screen reader context)
   - **Validation**: Screen reader announces all elements correctly

4. **Check Color Contrast** (Best Practice)
   - **Scope**: Ensure WCAG AA compliance for text contrast
   - **Details**:
     - Run contrast checker on all text (labels, buttons, chat messages)
     - Minimum ratio: 4.5:1 for normal text, 3:1 for large text
     - Fix low-contrast issues (e.g., gray text on light gray background)
   - **Validation**: All text passes WCAG AA contrast requirements

5. **Add Loading Indicators** (Edge Case Handling)
   - **Scope**: Show loading states during async operations
   - **Details**:
     - **Dashboard mount**: Skeleton loaders for KPIs, charts, table while fetching tasks
     - **Chat API call**: "Thinking..." with pulsing dots indicator
     - **Voice transcription**: "Listening..." with animated mic icon
     - **Task CRUD**: Spinner on button while API call in progress (e.g., delete button)
   - **Validation**: Loading indicators display during all async operations

6. **Add Micro-Interactions** (UX Polish)
   - **Scope**: Subtle animations and transitions for professional feel
   - **Details**:
     - **Hover effects**: Scale buttons slightly on hover (`hover:scale-105`)
     - **Click feedback**: Button press animation (`active:scale-95`)
     - **Chat message fade-in**: New messages fade in with CSS transition
     - **Task table row highlight**: Hover over row highlights background
     - **Language toggle flip**: Icon flips 180° on toggle (CSS transform)
   - **Validation**: Animations smooth and subtle, no jank

7. **Add Tooltips** (UX Enhancement)
   - **Scope**: Helpful tooltips on interactive elements
   - **Details**:
     - Microphone button: "Voice input (HTTPS required in production)"
     - Language toggle: "Switch to Urdu" (or "Switch to English")
     - Voice disabled state: "Voice input not supported in this browser"
     - Task actions: "Toggle completion", "Delete task", "Edit task"
     - Use Tailwind `group` and `group-hover` for simple CSS tooltips
   - **Validation**: Tooltips appear on hover

8. **Add Error Boundaries** (Edge Case Handling)
   - **Scope**: Catch React errors gracefully
   - **Details**:
     - Wrap dashboard page in React Error Boundary
     - Fallback UI: "Something went wrong. Please refresh the page."
     - Log errors to console (or external service like Sentry - out of scope)
   - **Validation**: Component errors don't crash entire app

9. **Add Confirmation Prompts** (FR-013 - already specified)
   - **Scope**: Confirm destructive actions
   - **Details**:
     - Delete task: `window.confirm("Are you sure you want to delete this task?")`
     - Logout: `window.confirm("Are you sure you want to logout?")` (optional)
   - **Validation**: Confirmation prompts appear before destructive actions

10. **Add Empty State Illustrations** (UX Polish - Optional)
    - **Scope**: Friendly empty states for no tasks, no chat messages
    - **Details**:
      - No tasks: Illustration + "No tasks yet. Create your first task via chat!"
      - No chat messages: Illustration + "Start a conversation with your AI assistant"
      - Use simple SVG illustrations or icons
    - **Validation**: Empty states look polished, not bare

**Files Affected**:
- MODIFIED: All interactive components (add ARIA labels, focus states, keyboard handlers)
- NEW: `frontend/components/common/ErrorBoundary.js` (React error boundary)
- MODIFIED: `frontend/app/dashboard/page.js` (wrap in ErrorBoundary)
- MODIFIED: Tailwind config (add focus ring colors if needed)

**Validation Criteria**:
- ✅ All actions work with keyboard only
- ✅ Focus indicators visible on all focusable elements
- ✅ ARIA labels present on all interactive elements
- ✅ Text contrast passes WCAG AA (4.5:1 minimum)
- ✅ Loading indicators show during async operations
- ✅ Micro-interactions smooth (hover, click animations)
- ✅ Tooltips appear on hover
- ✅ Error boundary catches React errors
- ✅ Confirmation prompts show before destructive actions
- ✅ Empty states look polished

**Dependencies**: Phase 1-5 (all features implemented)

**Estimated Effort**: 4-6 hours

---

### **Phase 7: Real-Time Sync & Final Integration**

**Purpose**: Implement real-time synchronization between chat widget and visual dashboard (optimistic updates + polling), test end-to-end flows, and validate all acceptance criteria.

**Priority**: P1 (Critical for User Story 2 - "tasks created in chat appear in dashboard immediately")

**Responsible Agent**: **Frontend Integration Agent** (sync logic, polling, state management), **Conversation UX Agent** (chat-to-dashboard integration)

**Steps**:

1. **Create Sync Manager** (FR-023)
   - **Scope**: Create `frontend/lib/sync-manager.js` to handle real-time task synchronization
   - **Details**:
     - Export functions: `startPolling(userId, onTasksUpdate)`, `stopPolling()`, `optimisticAdd(task)`, `optimisticUpdate(taskId, updates)`, `optimisticDelete(taskId)`
     - Polling logic: setInterval with 500ms (active) or 5s (idle) based on `isChatActive` flag
     - Optimistic update queue: Track pending changes, rollback on API error
   - **Validation**: Sync manager starts/stops polling, handles optimistic updates

2. **Create useTaskSync Hook** (FR-023)
   - **Scope**: Create `frontend/hooks/useTaskSync.js` to manage task state + sync
   - **Details**:
     - State: `tasks`, `loading`, `error`, `lastFetch`
     - Methods: `addTask(task)`, `updateTask(taskId, updates)`, `deleteTask(taskId)`, `refreshTasks()`
     - Integrates with sync-manager for polling
     - Returns: `{ tasks, loading, error, addTask, updateTask, deleteTask, refreshTasks }`
   - **Validation**: Hook manages task state, syncs with API

3. **Integrate Optimistic Updates in Chat** (FR-023)
   - **Scope**: Parse AI responses for task operations, apply optimistic updates
   - **Details**:
     - After AI response received, check if it contains task creation/update/deletion confirmation
     - Pattern matching (simple): "I've added the task", "Task marked as complete", "Task deleted"
     - Call `addTask()`, `updateTask()`, or `deleteTask()` optimistically
     - Polling will confirm sync within 500ms
   - **Validation**: Creating task via chat updates dashboard immediately

4. **Start Polling on Chat Activity** (FR-023)
   - **Scope**: Trigger active polling (500ms) when user is interacting with chat
   - **Details**:
     - `isChatActive` flag: `true` when chat input has focus or last message <5 seconds ago
     - Active polling: `setInterval(() => refreshTasks(), 500)`
     - Idle polling: `setInterval(() => refreshTasks(), 5000)`
     - Stop polling when user navigates away from dashboard
   - **Validation**: Polling interval changes based on chat activity

5. **Handle Sync Conflicts** (Edge Case)
   - **Scope**: Resolve conflicts when optimistic update differs from API response
   - **Details**:
     - Compare optimistic task ID with API response
     - If mismatch: API response is source of truth (overwrite optimistic update)
     - Show warning toast: "Task synchronized with server" (optional)
   - **Validation**: API response overwrites optimistic updates on conflict

6. **Handle Concurrent Edits** (Edge Case)
   - **Scope**: Manage case where user edits task in table while chat creates similar task
   - **Details**:
     - Match tasks by ID (primary) or title+description hash (fallback)
     - Last write wins (API response timestamp determines winner)
     - No complex CRDT logic (out of scope for MVP)
   - **Validation**: Concurrent edits resolve without data loss

7. **Add Sync Error Handling** (Edge Case)
   - **Scope**: Display errors when polling fails or optimistic update fails
   - **Details**:
     - If polling fails: Show error banner "Failed to sync with server. Retrying..."
     - Retry with exponential backoff (500ms, 1s, 2s, max 5s)
     - If optimistic update fails: Rollback change, show error toast
   - **Validation**: Sync errors display, retries work

8. **Test Real-Time Sync End-to-End** (FR-023)
   - **Scope**: Validate all real-time sync scenarios
   - **Details**:
     - **Scenario 1**: User creates task via chat → Task appears in KPIs, charts, and table within 2s
     - **Scenario 2**: User completes task via chat → Task status updates in table, KPIs recalculate
     - **Scenario 3**: User deletes task via table → Task disappears from dashboard
     - **Scenario 4**: User edits task via table → Changes reflected immediately
     - **Scenario 5**: Network error during sync → Error message displays, retries work
   - **Validation**: All scenarios work as expected (meets SC-002: <2 seconds)

9. **Test Responsive Behavior** (FR-042, FR-043, FR-044, FR-045)
   - **Scope**: Validate dashboard on mobile/tablet/desktop
   - **Details**:
     - **Desktop (1920x1080)**: Two-zone layout, chat sidebar visible
     - **Tablet (768x1024)**: Layout stacks, chat FAB appears
     - **Mobile (375x667)**: Vertical stack, chat modal, all features accessible
     - **RTL on mobile**: Urdu layout works on mobile (FAB position, modal direction)
   - **Validation**: Dashboard fully functional on all screen sizes (meets SC-005)

10. **Run Full Acceptance Testing** (All User Stories)
    - **Scope**: Validate all 24 acceptance scenarios from spec.md
    - **Details**:
      - **User Story 1** (Visual Task Management): 6 scenarios ✓
      - **User Story 2** (Persistent AI Chat): 6 scenarios ✓
      - **User Story 3** (Voice Input): 6 scenarios ✓
      - **User Story 4** (Bilingual Support): 6 scenarios ✓
      - **Edge Cases**: 10 scenarios ✓
    - **Validation**: All 24 acceptance scenarios pass (ready for user acceptance)

11. **Performance Testing** (SC-001, SC-002, SC-003, SC-007)
    - **Scope**: Measure performance metrics against success criteria
    - **Details**:
      - **SC-001**: Dashboard load time <3s (test with 100 tasks)
      - **SC-002**: Chat-to-dashboard sync <2s (measure time from AI response to table update)
      - **SC-003**: Language switching <1s (measure time from toggle click to UI update)
      - **SC-007**: Chat widget scrolling with 100 messages (smooth, no jank)
    - **Validation**: All performance metrics meet success criteria

12. **Browser Compatibility Testing** (FR-032, SC-009)
    - **Scope**: Test on all target browsers
    - **Details**:
      - **Chrome/Edge 89+**: Full support (Web Speech API works)
      - **Safari 14.1+**: Full support (iOS Safari tested)
      - **Firefox 116+**: Web Speech API requires flag (mic button hidden if unsupported)
      - **Older browsers**: Graceful degradation (mic button hidden, text input works)
    - **Validation**: Dashboard functional on all browsers, voice degrades gracefully (meets SC-009)

**Files Affected**:
- NEW: `frontend/lib/sync-manager.js`
- NEW: `frontend/hooks/useTaskSync.js`
- MODIFIED: `frontend/app/dashboard/page.js` (integrate useTaskSync hook)
- MODIFIED: `frontend/components/chatbot/ChatWidget.js` (trigger optimistic updates on AI response)

**Validation Criteria**:
- ✅ Tasks created via chat appear in dashboard within 2 seconds
- ✅ Task updates via chat sync to dashboard immediately
- ✅ Optimistic updates work (instant UI feedback)
- ✅ Polling adapts to chat activity (500ms active, 5s idle)
- ✅ Sync conflicts resolved (API is source of truth)
- ✅ Sync errors display and retry with backoff
- ✅ All 24 acceptance scenarios pass
- ✅ Dashboard responsive on mobile/tablet/desktop
- ✅ RTL works on all screen sizes
- ✅ Performance metrics meet success criteria (SC-001 to SC-007)
- ✅ Browser compatibility validated (graceful degradation for unsupported features)

**Dependencies**: Phase 1-6 (all features complete)

**Estimated Effort**: 6-8 hours

---

## Implementation Phase Summary

| Phase | Purpose | Priority | Estimated Effort | Agent |
|-------|---------|----------|------------------|-------|
| Phase 1 | Dashboard Foundation & Routing | P1 | 2-3 hours | UI/UX + Frontend Integration |
| Phase 2 | Advanced Task Dashboard UI | P1 | 4-6 hours | UI/UX + Frontend Integration |
| Phase 3 | Chatbot Widget Integration | P2 | 6-8 hours | Conversation UX + Frontend Integration |
| Phase 4 | Voice Interaction UI | P3 | 6-8 hours | Conversation UX + Frontend Integration |
| Phase 5 | Urdu Language & RTL Support | P2 | 8-10 hours | UI/UX + Frontend Integration |
| Phase 6 | Accessibility & UX Polish | P3 | 4-6 hours | Accessibility + UI/UX |
| Phase 7 | Real-Time Sync & Final Integration | P1 | 6-8 hours | Frontend Integration + Conversation UX |
| **Total** | **All Phases** | **Mixed** | **36-49 hours** | **Multi-agent** |

**Parallel Execution Opportunities**:
- Phase 2 + Phase 3: Can run in parallel (independent features)
- Phase 4 + Phase 5: Can run in parallel after Phase 3 (voice independent of i18n)
- Phase 6: Can run in parallel with Phase 7 (accessibility polish doesn't block sync logic)

**Critical Path**: Phase 1 → Phase 2 → Phase 7 (foundation, dashboard, sync)
**Differentiating Features**: Phase 3 (chat), Phase 5 (bilingual/RTL)
**Convenience Features**: Phase 4 (voice), Phase 6 (polish)

---

## Validation & Acceptance Checklist

**User Story 1 - Visual Task Management (P1)**:
- [ ] User redirected to `/dashboard` after login (FR-001)
- [ ] Unauthenticated users redirected to `/login` (FR-002)
- [ ] KPI cards display correct metrics (FR-006)
- [ ] 3 charts render with task data (FR-007)
- [ ] Task table shows tasks with CRUD actions (FR-008 to FR-014)
- [ ] Search and filters work (FR-009, FR-010)
- [ ] Pagination shows 10 tasks per page (FR-011)

**User Story 2 - Persistent AI Chat (P2)**:
- [ ] Chat widget visible on right sidebar (FR-015)
- [ ] Messages display with correct alignment (FR-016)
- [ ] Text input and send button work (FR-017, FR-018)
- [ ] AI responses appear in chat (FR-020)
- [ ] Auto-scroll to latest message (FR-021)
- [ ] Real-time sync: chat creates task → appears in dashboard <2s (FR-023, SC-002)

**User Story 3 - Voice Input (P3)**:
- [ ] Microphone button visible (FR-024)
- [ ] Permission prompt on first click (FR-025)
- [ ] Speech transcribes to text (FR-026, FR-027)
- [ ] Auto-send after 2s silence (FR-028)
- [ ] Visual indicator while recording (FR-029)
- [ ] Manual stop works (FR-030)
- [ ] Permission denial handled gracefully (FR-031)
- [ ] Button hidden on unsupported browsers (FR-032, SC-009)

**User Story 4 - Bilingual Support (P2)**:
- [ ] Language toggle switches between English and Urdu (FR-033, FR-034)
- [ ] Layout direction changes (LTR ↔ RTL) (FR-035, FR-036)
- [ ] Language preference persists (FR-037)
- [ ] Chart labels translate (FR-038)
- [ ] Chat widget sends language preference to API (FR-019, FR-039)
- [ ] AI responds in selected language (FR-039)
- [ ] Chat bubbles align correctly in RTL (FR-041)
- [ ] RTL layout works without visual bugs (SC-008)

**Responsive Design**:
- [ ] Dashboard responsive on desktop (≥1024px) (FR-042)
- [ ] Chat widget → FAB + modal on mobile/tablet (<1024px) (FR-043)
- [ ] Layout stacks vertically on mobile (FR-044)
- [ ] RTL preserved on all screen sizes (FR-045)
- [ ] All features accessible on mobile (320px minimum) (SC-005)

**Performance & Quality**:
- [ ] Dashboard loads <3 seconds (SC-001)
- [ ] Chat-to-dashboard sync <2 seconds (SC-002)
- [ ] Language switching <1 second (SC-003)
- [ ] Voice transcription 90% accuracy (SC-004)
- [ ] 95% of users complete first action <1 minute (SC-006 - user testing)
- [ ] Chat scrolling smooth with 100 messages (SC-007)
- [ ] Zero data inconsistencies in task sync (SC-010)

**Edge Cases**:
- [ ] Empty state for no tasks
- [ ] Chat API unavailable error handling
- [ ] Microphone permission denied handling
- [ ] Voice recognition errors handled
- [ ] Language switching mid-conversation works
- [ ] Mobile/tablet chat modal works
- [ ] Real-time sync handles concurrent edits
- [ ] Session expiry redirects to login
- [ ] Long Urdu text truncates correctly in RTL
- [ ] Browser without Web Speech API degrades gracefully

**Total**: 55 validation items (24 acceptance scenarios + 21 success criteria + 10 edge cases)

---

## Next Steps

1. ✅ **Phase 0-1 Complete**: Research and design artifacts generated
2. **Phase 2 (Next)**: Generate tasks.md using `/sp.tasks` command
3. **Phase 3**: Execute implementation tasks (agents assigned per phase)
4. **Phase 4**: User acceptance testing (validate all 55 checklist items)
5. **Phase 5**: Create PHR for implementation session
6. **Phase 6**: Merge to main branch, deploy to production

---

## Artifacts Summary

| Artifact | Status | Location |
|----------|--------|----------|
| Feature Spec | ✅ Complete | `specs/001-dashboard-ui-voice-urdu/spec.md` |
| Research Doc | ✅ Complete | `specs/001-dashboard-ui-voice-urdu/research.md` |
| Data Model | ✅ Complete | `specs/001-dashboard-ui-voice-urdu/data-model.md` |
| API Contracts | ✅ Complete | `specs/001-dashboard-ui-voice-urdu/contracts/api-usage.md` |
| Implementation Plan | ✅ Complete | `specs/001-dashboard-ui-voice-urdu/plan.md` (this file) |
| Quickstart Guide | ⏳ Pending | `specs/001-dashboard-ui-voice-urdu/quickstart.md` (to be created) |
| Tasks Breakdown | ⏳ Pending | `specs/001-dashboard-ui-voice-urdu/tasks.md` (created by `/sp.tasks`) |

---

**Plan Status**: ✅ **COMPLETE** - Ready for `/sp.tasks` command to generate task breakdown.
