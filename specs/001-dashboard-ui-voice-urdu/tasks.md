# Tasks: Advanced Todo Dashboard UI with Conversational AI, Voice & Urdu Support

**Feature Branch**: `001-dashboard-ui-voice-urdu`
**Date**: 2025-12-28
**Status**: Ready for Implementation
**Source**: Generated from [plan.md](./plan.md) and [spec.md](./spec.md)

## Overview

This task breakdown decomposes the 7-phase implementation plan into atomic, executable tasks organized by user story for independent delivery. Total effort: **36-49 hours** across 4 user stories and 7 implementation phases.

**Multi-Agent Assignments**:
- **UI/UX Agent**: Layout, styling, RTL visual design
- **Frontend Integration Agent**: API wiring, state management, data flow
- **Conversation UX Agent**: Chat widget behavior, voice input, message formatting
- **Accessibility Agent**: Keyboard navigation, ARIA labels, contrast checks

---

## User Story 1: Visual Task Management (Priority: P1) - Foundation

**Goal**: Users land on a modern dashboard displaying tasks through KPIs, charts, and an interactive table with filters/search/pagination.

**Acceptance Criteria**:
- ✓ User redirected to `/dashboard` after login
- ✓ Unauthenticated users redirected to `/login`
- ✓ KPI cards display correct metrics (Total, Completed, Pending, Overdue)
- ✓ 3 charts render with task data
- ✓ Task table shows tasks with CRUD actions
- ✓ Search and filters work
- ✓ Pagination shows 10 tasks per page

### Phase 1: Dashboard Foundation & Routing (2-3 hours)

- [x] [US1-T001] [P1] [Story1] Create protected `/dashboard` route with authentication guard → `frontend/app/dashboard/page.js`
  - Import `isAuthenticated()` from `lib/auth.js`
  - Check auth on mount with `useEffect`
  - Redirect to `/login?message=Please log in` if not authenticated
  - Fetch user ID from JWT using `getUserIdFromToken()`
  - **Validation**: ✅ Already implemented - authentication guard exists

- [x] [US1-T002] [P1] [Story1] Update login redirect to `/dashboard` instead of `/todos` → `frontend/app/login/page.js`
  - Modify `router.push('/todos')` to `router.push('/dashboard')` after successful login
  - Preserve existing JWT token storage logic
  - **Validation**: ✅ COMPLETE - Post-login now redirects to `/dashboard`

- [x] [US1-T003] [P1] [Story1] Create `TopNavBar` component with logo, language toggle placeholder, user menu → `frontend/components/navigation/TopNavBar.js`
  - Display application logo (reuse from existing `/todos` page)
  - Add language toggle button (placeholder, wired in Phase 5)
  - User profile dropdown: username from JWT, logout action
  - Logout: clears token (`localStorage.removeItem('authToken')`), redirects to `/login`
  - Styling: Tailwind glass-morphism (`glass-panel rounded-xl border border-white/20`)
  - **Validation**: ✅ COMPLETE - TopNavBar created with all features

- [x] [US1-T004] [P1] [Story1] Create two-zone layout shell (main dashboard + chat sidebar) → `frontend/app/dashboard/page.js`
  - Use CSS Grid: `grid grid-cols-1 lg:grid-cols-[1fr_384px]`
  - Main area: `flex-1` (left/center)
  - Chat sidebar: `w-96 hidden lg:block` (right, 384px fixed on desktop)
  - Placeholder divs with borders for visual verification
  - **Validation**: ✅ COMPLETE - Two-zone layout implemented with responsive behavior

- [x] [US1-T005] [P1] [Story1] Add language toggle scaffolding to TopNavBar → `frontend/components/navigation/LanguageToggle.js`
  - Button displays "English ↔ اردو"
  - onClick logs "Language toggle clicked" (functionality in Phase 5)
  - Position between logo and user menu
  - **Validation**: ✅ COMPLETE - Language toggle scaffolding added

### Phase 2: Advanced Task Dashboard UI (4-6 hours)

- [x] [US1-T006] [P1] [Story1] Integrate `DashboardKPIs` component with task fetching → `frontend/app/dashboard/page.js`
  - Import `DashboardKPIs` from `@/components/dashboard/DashboardKPIs`
  - Fetch tasks: `const tasks = await tasksAPI.list(userId)`
  - Pass tasks as prop: `<DashboardKPIs tasks={tasks} />`
  - Component calculates metrics using `calculateKPIs(tasks)` from `lib/analytics.js`
  - **Validation**: ✅ Already implemented - DashboardKPIs integrated at line 183

- [x] [US1-T007] [P1] [Story1] Integrate `TaskCharts` component for visualizations → `frontend/app/dashboard/page.js`
  - Import `TaskCharts` from `@/components/dashboard/TaskCharts`
  - Pass tasks as prop: `<TaskCharts tasks={tasks} />`
  - Renders 3 charts: Donut (status distribution), Line (7-day trend), Bar (task breakdown)
  - Uses existing `lib/chart-utils.js` for chart configs
  - **Validation**: ✅ Already implemented - TaskCharts integrated at line 197

- [x] [US1-T008] [P1] [Story1] Integrate `TaskTable` component for task display → `frontend/app/dashboard/page.js`
  - Import `TaskTable` from `@/components/dashboard/TaskTable`
  - Pass tasks and CRUD handlers: `<TaskTable tasks={tasks} onToggle={handleToggleComplete} onDelete={handleDelete} onEdit={handleEdit} />`
  - Display columns: Title, Status, Due Date, Actions (checkbox, delete, edit)
  - **Validation**: ✅ Already implemented - TaskTable integrated at line 208

- [x] [US1-T009] [P1] [Story1] Add search filter UI above task table → `frontend/app/dashboard/page.js` or `TaskTable.js`
  - Input field: `<input placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />`
  - State: `const [searchQuery, setSearchQuery] = useState('')`
  - Filter logic: `tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description?.toLowerCase().includes(searchQuery.toLowerCase()))`
  - Real-time filtering (no submit button)
  - **Validation**: ✅ Already implemented - Search in TaskTable.js lines 85-108 with debouncing

- [x] [US1-T010] [P1] [Story1] Add status filter dropdown next to search → `frontend/app/dashboard/page.js` or `TaskTable.js`
  - Dropdown: `<select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>`
  - Options: "All", "Pending", "Completed"
  - State: `const [statusFilter, setStatusFilter] = useState('all')`
  - Filter logic: `tasks.filter(task => statusFilter === 'all' || (statusFilter === 'pending' && !task.completed) || (statusFilter === 'completed' && task.completed))`
  - **Validation**: ✅ Already implemented - Status filter in TaskTable.js lines 111-122

- [x] [US1-T011] [P1] [Story1] Implement pagination controls (10 tasks per page) → `frontend/app/dashboard/page.js` or `TaskTable.js`
  - State: `const [currentPage, setCurrentPage] = useState(1)`
  - Pagination logic: `const paginatedTasks = filteredTasks.slice((currentPage - 1) * 10, currentPage * 10)`
  - UI: Previous/Next buttons + page indicator ("Page X of Y")
  - Disable Previous on page 1, Next on last page
  - **Validation**: ✅ Already implemented - Pagination in TaskTable.js lines 195-217, 10 tasks/page

- [x] [US1-T012] [P1] [Story1] Wire task CRUD operations (toggle, delete, edit) → `frontend/app/dashboard/page.js`
  - **Toggle**: `handleToggleComplete = async (taskId) => { /* optimistic update */ await tasksAPI.update(userId, taskId, { completed: !task.completed }); fetchTasks(); }`
  - **Delete**: `handleDelete = async (taskId) => { if (confirm('Are you sure?')) { await tasksAPI.delete(userId, taskId); fetchTasks(); } }`
  - **Edit**: `handleEdit = (taskId) => router.push(\`/todos/${taskId}\`)`
  - Use optimistic updates (update UI before API call, rollback on error)
  - **Validation**: ✅ Already implemented - CRUD handlers at lines 79-107

- [x] [US1-T013] [P1] [Story1] Add empty state for no tasks → `frontend/app/dashboard/page.js` or `TaskTable.js`
  - Conditional render: `{tasks.length === 0 && <div>No tasks yet. Create your first task via chat or <a href="/todos/new">add manually</a>.</div>}`
  - Styling: Center-aligned, large text, link to `/todos/new`
  - **Validation**: ✅ Already implemented - Empty state in TaskTable.js lines 133-155

- [x] [US1-T014] [P1] [Story1] Add responsive layout (stack vertically on mobile) → `frontend/app/dashboard/page.js`
  - Desktop (≥1024px): Grid layout `grid grid-cols-2 lg:grid-cols-4 gap-4` for KPIs
  - Mobile (<1024px): Stack vertically `flex flex-col gap-6`
  - Use Tailwind responsive classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
  - Test at 375px width (mobile), 768px (tablet), 1920px (desktop)
  - **Validation**: ✅ Already implemented - Responsive layout with Tailwind classes

---

## User Story 2: Persistent AI Chat Widget (Priority: P2)

**Goal**: Users see a persistent chatbot widget in the right sidebar for conversational task management, with real-time sync to the visual dashboard.

**Acceptance Criteria**:
- ✓ Chat widget visible on right sidebar (desktop)
- ✓ Messages display with correct alignment
- ✓ Text input and send button work
- ✓ AI responses appear in chat
- ✓ Auto-scroll to latest message
- ✓ Real-time sync: chat creates task → appears in dashboard <2s

### Phase 3: Chatbot Widget Integration (6-8 hours)

- [ ] [US2-T015] [P2] [Story2] Create `ChatWidget` component (persistent sidebar) → `frontend/components/chatbot/ChatWidget.js`
  - Fixed width: `w-96` (384px), height: `h-full`
  - Three sections: Header ("AI Assistant"), Message History (scrollable), Input Area
  - Styling: Glass-morphism panel `glass-panel rounded-xl border border-white/20`
  - Always visible on desktop (not a modal)
  - **Validation**: Chat widget visible on right side of dashboard

- [ ] [US2-T016] [P2] [Story2] Create `ChatMessage` component for message bubbles → `frontend/components/chatbot/ChatMessage.js`
  - Props: `{ text, sender: 'user' | 'ai', timestamp, language, status }`
  - LTR (English): User messages right-aligned (blue bubble), AI messages left-aligned (gray bubble)
  - RTL (Urdu): User messages left-aligned, AI messages right-aligned (Phase 5)
  - Display timestamp below message (format: "2:30 PM")
  - Status indicator: ⏳ (sending), ✓ (sent), ❌ (error)
  - **Validation**: Messages render with correct alignment and styling

- [ ] [US2-T017] [P2] [Story2] Implement scrollable message history in ChatWidget → `frontend/components/chatbot/ChatWidget.js`
  - State: `const [messages, setMessages] = useState<ChatMessage[]>([]);`
  - Render messages with `ChatMessage` component
  - Auto-scroll to bottom: `useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);`
  - Max height with `overflow-y-auto` for scrolling
  - **Validation**: Message history scrolls, auto-scrolls to latest message

- [ ] [US2-T018] [P2] [Story2] Create `ChatInput` component (text input + send button) → `frontend/components/chatbot/ChatInput.js`
  - Textarea: `<textarea placeholder="Type a message..." value={inputText} onChange={e => setInputText(e.target.value)} />`
  - Send button: Paper plane icon or "Send" text
  - Enter key sends (Shift+Enter for newline)
  - Disable input while `isLoading`
  - **Validation**: Typing and clicking send works

- [ ] [US2-T019] [P2] [Story2] Integrate chat API endpoint in ChatWidget → `frontend/lib/api.js` and `ChatWidget.js`
  - Add `chatAPI.sendMessage(userId, { message, language })` to `lib/api.js`
  - On send:
    1. Add user message to state (status: 'sending')
    2. Call API: `const response = await chatAPI.sendMessage(userId, { message: inputText, language: currentLocale })`
    3. Update user message status to 'sent'
    4. Add AI response to state (sender: 'ai', text: response.response)
  - **Validation**: Sending message calls API, AI response appears in chat

- [ ] [US2-T020] [P2] [Story2] Add loading and error states to ChatWidget → `frontend/components/chatbot/ChatWidget.js`
  - Loading: Show "Thinking..." with pulsing dots while API call in progress
  - Error: Display "Unable to connect to AI assistant. Please try again." in chat
  - Allow retry: User can resend failed message
  - **Validation**: Loading indicator shows, error messages display correctly

- [ ] [US2-T021] [P2] [Story2] Create `ChatModal` for mobile/tablet FAB → `frontend/components/chatbot/ChatModal.js`
  - Desktop (≥1024px): Hide modal (persistent sidebar used)
  - Mobile/Tablet (<1024px): Show floating action button (FAB) bottom-right
  - FAB: Blue circle with chat icon, `fixed bottom-4 right-4`
  - onClick: Open modal overlay (full screen or 80% height)
  - Modal contains same ChatWidget component
  - Close button in modal header
  - **Validation**: FAB appears on mobile, clicking opens modal, close button works

- [ ] [US2-T022] [P2] [Story2] Add session persistence for chat history (optional) → `frontend/components/chatbot/ChatWidget.js`
  - On mount: Load messages from `sessionStorage.getItem('chatHistory')`
  - On message change: Save to `sessionStorage.setItem('chatHistory', JSON.stringify(messages))`
  - Clear on logout (when JWT token cleared)
  - **Validation**: Chat history persists after page refresh

---

## User Story 3: Voice Input (Priority: P3)

**Goal**: Users can interact with the chatbot using voice input via microphone button with speech-to-text.

**Acceptance Criteria**:
- ✓ Microphone button visible next to text input
- ✓ Permission prompt on first click
- ✓ Speech transcribes to text in real-time
- ✓ Auto-send after 2s silence
- ✓ Visual indicator while recording
- ✓ Manual stop works
- ✓ Permission denial handled gracefully
- ✓ Button hidden on unsupported browsers

### Phase 4: Voice Interaction UI (6-8 hours)

- [ ] [US3-T023] [P3] [Story3] Create `VoiceInput` component with microphone button → `frontend/components/chatbot/VoiceInput.js`
  - Button: Microphone icon (🎤 or SVG)
  - Two states: Idle (gray), Recording (red pulsing)
  - onClick toggles recording on/off
  - Position adjacent to text input in ChatInput
  - **Validation**: Microphone button visible next to text input

- [ ] [US3-T024] [P3] [Story3] Create `useVoiceRecognition` hook for Web Speech API → `frontend/hooks/useVoiceRecognition.js`
  - Feature detection: `const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;`
  - Return `{ isSupported, isRecording, transcript, error, hasPermission, startRecording, stopRecording }`
  - State: `{ isRecording: false, transcript: '', error: null, hasPermission: null }`
  - **Validation**: Hook detects browser support, manages recording state

- [ ] [US3-T025] [P3] [Story3] Implement voice recognition with real-time transcription → `frontend/hooks/useVoiceRecognition.js`
  - Create `SpeechRecognition` instance
  - Configure: `continuous: false`, `interimResults: true`, `lang: 'en-US'`
  - `onresult`: Update transcript state in real-time
  - `onerror`: Handle errors (permission denied, no speech, network)
  - `onend`: Mark recording as stopped
  - **Validation**: Speaking updates text input in real-time

- [ ] [US3-T026] [P3] [Story3] Implement auto-send after 2 seconds of silence → `frontend/hooks/useVoiceRecognition.js`
  - Listen for `onspeechend` event
  - Start 2-second timer (`setTimeout(sendMessage, 2000)`)
  - If no new speech detected, auto-send transcript
  - User can manually stop before 2 seconds
  - **Validation**: After speaking, message auto-sends after 2s silence

- [ ] [US3-T027] [P3] [Story3] Add pulsing animation and "Listening..." indicator → `frontend/components/chatbot/VoiceInput.js`
  - Microphone button: Red background with pulsing CSS animation
  - Display text below input: "Listening..." with animated dots
  - Transcript appears in text input as user speaks
  - **Validation**: Visual feedback shows recording state clearly

- [ ] [US3-T028] [P3] [Story3] Implement manual stop recording → `frontend/components/chatbot/VoiceInput.js`
  - Toggle button: First click starts, second click stops
  - On stop: Keep transcribed text in input (don't auto-send)
  - User can edit text before sending
  - **Validation**: Clicking mic button stops recording, text remains editable

- [ ] [US3-T029] [P3] [Story3] Handle microphone permission denial gracefully → `frontend/hooks/useVoiceRecognition.js`
  - `onerror` event with `error.error === 'not-allowed'` → permission denied
  - Display error: "Microphone access required. Please enable in your browser settings."
  - Show instructions modal (optional) with browser-specific steps
  - Disable mic button (gray out) if permission denied
  - **Validation**: Permission denied shows error message, button disabled

- [ ] [US3-T030] [P3] [Story3] Hide microphone button on unsupported browsers → `frontend/components/chatbot/VoiceInput.js`
  - If `!SpeechRecognition`, hide button entirely
  - Alternative: Show disabled button with tooltip "Voice input not supported in this browser"
  - Text input remains fully functional
  - **Validation**: Button hidden in browsers without Web Speech API

- [ ] [US3-T031] [P3] [Story3] Add voice error handling (no speech, network errors) → `frontend/hooks/useVoiceRecognition.js`
  - `onerror` event types:
    - `no-speech`: "No speech detected. Please try again."
    - `audio-capture`: "Microphone not found. Please check device."
    - `network`: "Network error. Please check connection."
  - Display errors in chat widget (not as message bubbles, as UI notifications)
  - **Validation**: Different error types show appropriate messages

- [ ] [US3-T032] [P3] [Story3] Add language detection for voice input → `frontend/hooks/useVoiceRecognition.js`
  - If language is 'en', use `recognition.lang = 'en-US'`
  - If language is 'ur', use `recognition.lang = 'ur-PK'`
  - Language preference from Phase 5 (hook into `useLanguage()`)
  - **Validation**: Voice recognition uses correct language (test with Urdu speech)

---

## User Story 4: Bilingual Interface (Priority: P2)

**Goal**: Users can switch between English and Urdu with full RTL layout support and translated UI text.

**Acceptance Criteria**:
- ✓ Language toggle switches between English and Urdu
- ✓ Layout direction changes (LTR ↔ RTL)
- ✓ Language preference persists
- ✓ Chart labels translate
- ✓ Chat widget sends language preference to API
- ✓ AI responds in selected language
- ✓ Chat bubbles align correctly in RTL
- ✓ RTL layout works without visual bugs

### Phase 5: Urdu Language & RTL Support (8-10 hours)

- [ ] [US4-T033] [P2] [Story4] Install and configure next-intl → `frontend/package.json`, `frontend/i18n.js`
  - Install: `npm install next-intl`
  - Create `frontend/i18n.js`:
    ```javascript
    import { getRequestConfig } from 'next-intl/server';
    export default getRequestConfig(async ({ locale }) => ({
      messages: (await import(`./locales/${locale}.json`)).default
    }));
    ```
  - **Validation**: next-intl installed, config file created

- [ ] [US4-T034] [P2] [Story4] Create English translation file → `frontend/locales/en.json`
  - Structure: Nested JSON with keys for dashboard, chatWidget, navigation, errors
  - Example: `{ "dashboard": { "title": "Task Dashboard", "kpis": { "total": "Total Tasks" } } }`
  - See `data-model.md` for full structure
  - **Validation**: `en.json` exists with all required keys

- [ ] [US4-T035] [P2] [Story4] Create Urdu translation file → `frontend/locales/ur.json`
  - Mirror structure of `en.json` with Urdu translations
  - Example: `{ "dashboard": { "title": "ٹاسک ڈیش بورڈ", "kpis": { "total": "کل کام" } } }`
  - **CRITICAL**: Urdu translations must be verified by native speaker (user responsibility)
  - **Validation**: `ur.json` exists with identical key structure to `en.json`

- [ ] [US4-T036] [P2] [Story4] Create translation validation script → `frontend/scripts/validate-translations.js`
  - Load both `en.json` and `ur.json`
  - Compare keys recursively (all English keys exist in Urdu, no extra Urdu keys)
  - Report missing or extra keys
  - Exit with error if mismatch found
  - Add to `package.json`: `"validate-translations": "node scripts/validate-translations.js"`
  - **Validation**: Script runs without errors, catches missing keys

- [ ] [US4-T037] [P2] [Story4] Wrap app with locale provider → `frontend/app/[locale]/layout.js`
  - Dynamic route segment: `[locale]` captures 'en' or 'ur'
  - Set `<html dir={locale === 'ur' ? 'rtl' : 'ltr'} lang={locale}>`
  - Wrap children with `<NextIntlClientProvider locale={locale} messages={messages}>`
  - Validate locale against allowlist (['en', 'ur']), fallback to 'en'
  - **Validation**: Changing URL to `/en/dashboard` or `/ur/dashboard` switches language + direction

- [ ] [US4-T038] [P2] [Story4] Create `useLanguage` hook for language preference management → `frontend/hooks/useLanguage.js`
  - Read from localStorage: `preferredLanguage` (default: 'en')
  - Return: `{ locale, setLocale, direction }`
  - `setLocale(newLocale)`: Update localStorage + trigger router push to `/[locale]/dashboard`
  - `direction`: Auto-derived ('en' → 'ltr', 'ur' → 'rtl')
  - **Validation**: Hook reads/writes localStorage, returns correct direction

- [ ] [US4-T039] [P2] [Story4] Wire language toggle button functionality → `frontend/components/navigation/LanguageToggle.js`
  - Import `useLanguage()` hook
  - Display current locale opposite (if 'en', show "اردو", if 'ur', show "English")
  - onClick: Call `setLocale(locale === 'en' ? 'ur' : 'en')`
  - Router pushes to new locale route (e.g., `/ur/dashboard`)
  - **Validation**: Clicking toggle switches language and layout direction

- [ ] [US4-T040] [P2] [Story4] Translate all dashboard UI text → All dashboard components
  - Replace hardcoded text with `t()` function from `useTranslations`
  - Dashboard KPIs: `t('dashboard.kpis.total')`, etc.
  - Chart labels: `t('dashboard.charts.statusDistribution')`, etc.
  - Task table: `t('dashboard.taskTable.title')`, etc.
  - Chat widget: `t('chatWidget.title')`, etc.
  - Navigation: `t('navigation.logout')`, etc.
  - Errors: `t('errors.sessionExpired')`, etc.
  - **Validation**: All UI text displays in Urdu when language is 'ur'

- [ ] [US4-T041] [P2] [Story4] Adapt Recharts for RTL mode → `frontend/components/dashboard/charts/`
  - Pass translated strings from `t()` for axis labels
  - Use `layout="horizontal"` for consistent legend positioning
  - Test all 3 charts (donut, line, bar) in RTL mode
  - **Validation**: Charts display correctly in RTL (labels in Urdu, no visual bugs)

- [ ] [US4-T042] [P2] [Story4] Adapt task table for RTL → `frontend/components/dashboard/TaskTable.js`
  - Column order: Auto-reverses with `flex-row` in RTL
  - Text alignment: Use `text-right` for numeric columns
  - Actions column: Use `rtl:order-first ltr:order-last`
  - Test with long Urdu text (ensure truncation works without breaking layout)
  - **Validation**: Table displays correctly in RTL (columns reversed, text aligned)

- [ ] [US4-T043] [P2] [Story4] Adapt chat widget for RTL → `frontend/components/chatbot/ChatMessage.js`
  - LTR (English): User messages right-aligned, AI messages left-aligned
  - RTL (Urdu): User messages left-aligned, AI messages right-aligned
  - Use Tailwind RTL utilities: `rtl:justify-start ltr:justify-end` for user messages
  - **Validation**: Chat bubbles align correctly in RTL, AI responds in Urdu

- [ ] [US4-T044] [P2] [Story4] Send language preference to chat API → `frontend/lib/api.js` and `ChatWidget.js`
  - Modify `chatAPI.sendMessage()` to accept `language` param
  - Pass current locale: `chatAPI.sendMessage(userId, { message, language: currentLocale })`
  - Backend AI uses language to respond appropriately (no backend changes needed)
  - **Validation**: Sending Urdu message in Urdu mode gets Urdu response from AI

- [ ] [US4-T045] [P2] [Story4] Test RTL edge cases → All components
  - Long task titles (truncate with ellipsis, tooltip on hover)
  - Mixed English + Urdu text (bidirectional text)
  - Overflow: Ensure no horizontal scrolling on any component
  - Icons: Verify direction-agnostic icons (no left/right arrows)
  - **Validation**: No visual bugs in RTL, text overflow handled gracefully

---

## Cross-Story Tasks: Accessibility, Real-Time Sync, Final Integration

**Goal**: Add accessibility features, implement real-time sync between chat and dashboard, and validate all acceptance criteria.

### Phase 6: Accessibility & UX Polish (4-6 hours)

- [ ] [XS-T046] [P3] [All Stories] Add keyboard navigation to all interactive elements → All components
  - Language toggle: Tab to focus, Enter/Space to toggle
  - Chat input: Tab to focus, Enter to send
  - Microphone button: Tab to focus, Enter/Space to start/stop
  - Task table actions: Tab through checkboxes, delete buttons, edit links
  - Pagination: Tab to buttons, Enter to navigate
  - **Validation**: All actions work with keyboard only (no mouse)

- [ ] [XS-T047] [P3] [All Stories] Add focus states to all interactive elements → All components
  - Use Tailwind `focus:ring-2 focus:ring-brand-500` for buttons, inputs
  - Focus outline visible on all focusable elements
  - **Validation**: Focus indicators visible when tabbing through UI

- [ ] [XS-T048] [P3] [All Stories] Add ARIA labels for screen readers → All components
  - Language toggle: `aria-label="Switch to Urdu"`
  - Microphone button: `aria-label="Start voice input"`
  - Chat input: `aria-label="Type a message"`
  - Task checkboxes: `aria-label="Toggle task completion"`
  - Delete buttons: `aria-label="Delete task"`
  - Charts: `aria-label="Status distribution chart"`
  - **Validation**: Screen reader announces all elements correctly

- [ ] [XS-T049] [P3] [All Stories] Check color contrast (WCAG AA compliance) → All components
  - Run contrast checker on all text (labels, buttons, chat messages)
  - Minimum ratio: 4.5:1 for normal text, 3:1 for large text
  - Fix low-contrast issues
  - **Validation**: All text passes WCAG AA contrast requirements

- [ ] [XS-T050] [P3] [All Stories] Add loading indicators for async operations → All components
  - Dashboard mount: Skeleton loaders for KPIs, charts, table while fetching tasks
  - Chat API call: "Thinking..." with pulsing dots
  - Voice transcription: "Listening..." with animated mic icon
  - Task CRUD: Spinner on button while API call in progress
  - **Validation**: Loading indicators display during all async operations

- [ ] [XS-T051] [P3] [All Stories] Add micro-interactions for professional feel → All components
  - Hover effects: Scale buttons on hover (`hover:scale-105`)
  - Click feedback: Button press animation (`active:scale-95`)
  - Chat message fade-in: New messages fade in with CSS transition
  - Task table row highlight: Hover over row highlights background
  - Language toggle flip: Icon flips 180° on toggle
  - **Validation**: Animations smooth and subtle, no jank

- [ ] [XS-T052] [P3] [All Stories] Add tooltips to interactive elements → All components
  - Microphone button: "Voice input (HTTPS required in production)"
  - Language toggle: "Switch to Urdu"
  - Voice disabled state: "Voice input not supported in this browser"
  - Task actions: "Toggle completion", "Delete task", "Edit task"
  - Use Tailwind `group` and `group-hover` for CSS tooltips
  - **Validation**: Tooltips appear on hover

- [ ] [XS-T053] [P3] [All Stories] Add React Error Boundary → `frontend/components/common/ErrorBoundary.js`
  - Wrap dashboard page in Error Boundary
  - Fallback UI: "Something went wrong. Please refresh the page."
  - Log errors to console
  - **Validation**: Component errors don't crash entire app

- [ ] [XS-T054] [P3] [All Stories] Add confirmation prompts for destructive actions → All components
  - Delete task: `window.confirm("Are you sure you want to delete this task?")`
  - Logout: `window.confirm("Are you sure you want to logout?")` (optional)
  - **Validation**: Confirmation prompts appear before destructive actions

- [ ] [XS-T055] [P3] [All Stories] Add empty state illustrations (optional) → All components
  - No tasks: Illustration + "No tasks yet. Create your first task via chat!"
  - No chat messages: Illustration + "Start a conversation with your AI assistant"
  - Use simple SVG illustrations or icons
  - **Validation**: Empty states look polished, not bare

### Phase 7: Real-Time Sync & Final Integration (6-8 hours)

- [ ] [XS-T056] [P1] [Story2] Create sync manager for real-time task synchronization → `frontend/lib/sync-manager.js`
  - Export functions: `startPolling(userId, onTasksUpdate)`, `stopPolling()`, `optimisticAdd(task)`, `optimisticUpdate(taskId, updates)`, `optimisticDelete(taskId)`
  - Polling logic: setInterval with 500ms (active) or 5s (idle) based on `isChatActive`
  - Optimistic update queue: Track pending changes, rollback on API error
  - **Validation**: Sync manager starts/stops polling, handles optimistic updates

- [ ] [XS-T057] [P1] [Story2] Create `useTaskSync` hook for task state management → `frontend/hooks/useTaskSync.js`
  - State: `tasks`, `loading`, `error`, `lastFetch`
  - Methods: `addTask(task)`, `updateTask(taskId, updates)`, `deleteTask(taskId)`, `refreshTasks()`
  - Integrates with sync-manager for polling
  - Returns: `{ tasks, loading, error, addTask, updateTask, deleteTask, refreshTasks }`
  - **Validation**: Hook manages task state, syncs with API

- [ ] [XS-T058] [P1] [Story2] Integrate optimistic updates in chat → `frontend/components/chatbot/ChatWidget.js`
  - After AI response received, parse for task operations
  - Pattern matching: "I've added the task", "Task marked as complete", "Task deleted"
  - Call `addTask()`, `updateTask()`, or `deleteTask()` optimistically
  - Polling will confirm sync within 500ms
  - **Validation**: Creating task via chat updates dashboard immediately

- [ ] [XS-T059] [P1] [Story2] Start polling on chat activity → `frontend/app/dashboard/page.js`
  - `isChatActive` flag: `true` when chat input has focus or last message <5 seconds ago
  - Active polling: `setInterval(() => refreshTasks(), 500)`
  - Idle polling: `setInterval(() => refreshTasks(), 5000)`
  - Stop polling when user navigates away from dashboard
  - **Validation**: Polling interval changes based on chat activity

- [ ] [XS-T060] [P1] [Story2] Handle sync conflicts and concurrent edits → `frontend/lib/sync-manager.js`
  - Compare optimistic task ID with API response
  - If mismatch: API response is source of truth (overwrite optimistic update)
  - Match tasks by ID (primary) or title+description hash (fallback)
  - Last write wins (API response timestamp determines winner)
  - **Validation**: API response overwrites optimistic updates on conflict

- [ ] [XS-T061] [P1] [Story2] Add sync error handling → `frontend/lib/sync-manager.js`
  - If polling fails: Show error banner "Failed to sync with server. Retrying..."
  - Retry with exponential backoff (500ms, 1s, 2s, max 5s)
  - If optimistic update fails: Rollback change, show error toast
  - **Validation**: Sync errors display, retries work

- [ ] [XS-T062] [P1] [All Stories] Test real-time sync end-to-end → Manual testing
  - Scenario 1: User creates task via chat → Task appears in KPIs, charts, table within 2s
  - Scenario 2: User completes task via chat → Task status updates, KPIs recalculate
  - Scenario 3: User deletes task via table → Task disappears from dashboard
  - Scenario 4: User edits task via table → Changes reflected immediately
  - Scenario 5: Network error during sync → Error message displays, retries work
  - **Validation**: All scenarios work as expected (meets SC-002: <2 seconds)

- [ ] [XS-T063] [P1] [All Stories] Test responsive behavior on all screen sizes → Manual testing
  - Desktop (1920x1080): Two-zone layout, chat sidebar visible
  - Tablet (768x1024): Layout stacks, chat FAB appears
  - Mobile (375x667): Vertical stack, chat modal, all features accessible
  - RTL on mobile: Urdu layout works on mobile (FAB position, modal direction)
  - **Validation**: Dashboard fully functional on all screen sizes (meets SC-005)

- [ ] [XS-T064] [P1] [All Stories] Run full acceptance testing (24 scenarios) → Manual testing
  - User Story 1 (Visual Task Management): 6 scenarios ✓
  - User Story 2 (Persistent AI Chat): 6 scenarios ✓
  - User Story 3 (Voice Input): 6 scenarios ✓
  - User Story 4 (Bilingual Support): 6 scenarios ✓
  - Edge Cases: 10 scenarios ✓
  - **Validation**: All 24 acceptance scenarios pass from spec.md

- [ ] [XS-T065] [P1] [All Stories] Performance testing against success criteria → Manual testing
  - SC-001: Dashboard load time <3s (test with 100 tasks)
  - SC-002: Chat-to-dashboard sync <2s
  - SC-003: Language switching <1s
  - SC-007: Chat widget scrolling with 100 messages (smooth, no jank)
  - **Validation**: All performance metrics meet success criteria

- [ ] [XS-T066] [P1] [All Stories] Browser compatibility testing → Manual testing
  - Chrome/Edge 89+: Full support (Web Speech API works)
  - Safari 14.1+: Full support (iOS Safari tested)
  - Firefox 116+: Web Speech API requires flag (mic button hidden if unsupported)
  - Older browsers: Graceful degradation (mic button hidden, text input works)
  - **Validation**: Dashboard functional on all browsers, voice degrades gracefully (meets SC-009)

---

## Dependency Graph

```
Phase 1: Dashboard Foundation (US1-T001 to US1-T005)
    ↓
Phase 2: Advanced Task Dashboard (US1-T006 to US1-T014)
    ↓
    ├──→ Phase 3: Chatbot Widget (US2-T015 to US2-T022) ──┐
    │                                                       │
    └──→ Phase 5: Urdu & RTL (US4-T033 to US4-T045) ──────┤
                                                           │
         Phase 4: Voice Input (US3-T023 to US3-T032) ──┐  │
                                                        │  │
                                                        ↓  ↓
         Phase 6: Accessibility (XS-T046 to XS-T055) ──┐ │
                                                        │ │
                                                        ↓ ↓
                  Phase 7: Real-Time Sync & Final Integration
                        (XS-T056 to XS-T066)
```

**Parallel Execution Opportunities**:
- Phase 3 (Chat Widget) + Phase 5 (Urdu/RTL) can run in parallel after Phase 2
- Phase 4 (Voice Input) can run in parallel with Phase 5 after Phase 3
- Phase 6 (Accessibility) can overlap with Phase 7 (testing)

**Critical Path**: Phase 1 → Phase 2 → Phase 7 (18-25 hours)

---

## Task Summary

| Phase | Task Count | Effort (hours) | Priority | Agent |
|-------|-----------|----------------|----------|-------|
| Phase 1: Foundation | 5 tasks | 2-3 | P1 | UI/UX + Frontend Integration |
| Phase 2: Dashboard UI | 9 tasks | 4-6 | P1 | UI/UX + Frontend Integration |
| Phase 3: Chat Widget | 8 tasks | 6-8 | P2 | Conversation UX + Frontend Integration |
| Phase 4: Voice Input | 10 tasks | 6-8 | P3 | Conversation UX + Frontend Integration |
| Phase 5: Urdu & RTL | 13 tasks | 8-10 | P2 | UI/UX + Frontend Integration |
| Phase 6: Accessibility | 10 tasks | 4-6 | P3 | Accessibility + UI/UX |
| Phase 7: Sync & Testing | 11 tasks | 6-8 | P1 | Frontend Integration + Conversation UX |
| **Total** | **66 tasks** | **36-49 hours** | **Mixed** | **Multi-agent** |

---

## Validation Checklist (55 items from plan.md)

**User Story 1 - Visual Task Management (P1)**: 7 items
**User Story 2 - Persistent AI Chat (P2)**: 6 items
**User Story 3 - Voice Input (P3)**: 8 items
**User Story 4 - Bilingual Support (P2)**: 8 items
**Responsive Design**: 5 items
**Performance & Quality**: 7 items
**Edge Cases**: 10 items
**Constitution Check**: 4 items (all passed)

---

## Next Steps

1. ✅ **Tasks Generated**: This file (tasks.md)
2. **Begin Implementation**: Execute tasks in phase order with multi-agent parallel execution
3. **User Acceptance Testing**: Validate all 55 checklist items after Phase 7
4. **Create PHR**: Document task generation session in `history/prompts/dashboard-ui-voice-urdu/`
5. **Merge & Deploy**: After user acceptance, merge to main and deploy

---

**Task Generation Status**: ✅ **COMPLETE** - Ready for multi-agent execution. Branch `001-dashboard-ui-voice-urdu` ready for implementation.
