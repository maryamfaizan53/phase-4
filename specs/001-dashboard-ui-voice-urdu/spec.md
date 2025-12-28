# Feature Specification: Advanced Todo Dashboard UI with Conversational AI, Voice & Urdu Support

**Feature Branch**: `001-dashboard-ui-voice-urdu`
**Created**: 2025-12-28
**Status**: Draft
**Input**: User description: "Advanced Todo Dashboard with Conversational AI, Voice & Urdu Support - UI/UX enhancement for post-login dashboard with visual task management, persistent AI chatbot widget, natural language task control, voice-based interaction, and full English + Urdu (RTL) language support"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Task Management with Dashboard Overview (Priority: P1)

After logging in, users land on a modern dashboard that displays their tasks visually through KPIs, charts, and an interactive task table, allowing them to quickly understand their workload and manage tasks through traditional UI controls.

**Why this priority**: This is the core value proposition - users need to see and manage their tasks immediately after login. Without this, there's no functional dashboard.

**Independent Test**: Can be fully tested by logging in, viewing the dashboard page, and performing CRUD operations on tasks through the visual UI. Delivers immediate value by replacing or enhancing the existing `/todos` page with a dashboard-first experience.

**Acceptance Scenarios**:

1. **Given** user has successfully authenticated, **When** they complete login, **Then** they are redirected to `/dashboard` showing their task overview
2. **Given** user is viewing the dashboard, **When** the page loads, **Then** they see KPI cards (Total, Completed, Pending, Overdue tasks) with current metrics
3. **Given** user has tasks in the system, **When** dashboard loads, **Then** they see visual charts (status distribution, activity trends, task breakdown)
4. **Given** user is viewing the task table, **When** they interact with tasks, **Then** they can toggle completion status, delete tasks, and edit tasks inline
5. **Given** user wants to filter tasks, **When** they use search or status filters, **Then** the task table updates in real-time
6. **Given** user has many tasks, **When** viewing the task table, **Then** pagination controls allow browsing through task pages (10 per page)

---

### User Story 2 - Persistent AI Chat Widget for Conversational Task Management (Priority: P2)

Users see a persistent chatbot widget on the right sidebar of the dashboard that allows them to manage tasks through natural language conversations, leveraging the existing conversational AI backend without changing any chatbot logic.

**Why this priority**: This enhances the dashboard with conversational capabilities that complement visual management. It's P2 because the dashboard is functional without it (P1), but it's the differentiating feature that makes the dashboard "advanced".

**Independent Test**: Can be tested independently by opening the dashboard, clicking the chat widget, typing natural language commands (e.g., "add task: buy groceries"), and verifying tasks appear in both the chat history and the visual dashboard. Existing chatbot logic is reused - only UI integration is new.

**Acceptance Scenarios**:

1. **Given** user is on the dashboard, **When** the page loads, **Then** they see a persistent chat widget in the right sidebar (always visible, not a modal)
2. **Given** user wants to interact with the AI, **When** they type a message in the chat input, **Then** the message is sent to the existing chat API endpoint and the response appears in the chat history
3. **Given** user creates a task via chat (e.g., "add task: call client"), **When** the AI responds with confirmation, **Then** the new task appears in the visual dashboard task table immediately (real-time sync)
4. **Given** user completes a task via chat (e.g., "mark 'buy groceries' as done"), **When** the AI confirms, **Then** the task's completion status updates in the visual dashboard
5. **Given** user has a conversation history, **When** they scroll through the chat widget, **Then** they can see previous messages with proper formatting (user messages right-aligned, AI messages left-aligned)
6. **Given** user types a long conversation, **When** the chat history grows, **Then** the widget remains scrollable and retains message history for the current session

---

### User Story 3 - Voice Input for Hands-Free Task Management (Priority: P3)

Users can interact with the chatbot using voice input by clicking a microphone button, allowing hands-free task creation and management through speech-to-text conversion.

**Why this priority**: This is a convenience enhancement for accessibility and power users. The dashboard is fully functional without it (P1 + P2), making this a nice-to-have feature.

**Independent Test**: Can be tested independently by clicking the microphone icon in the chat widget, speaking a command (e.g., "Add task: schedule meeting tomorrow"), and verifying the text appears in the chat input and is processed by the AI. Requires browser microphone permissions but no backend changes.

**Acceptance Scenarios**:

1. **Given** user is viewing the chat widget, **When** they click the microphone button, **Then** the browser requests microphone permission (if not already granted)
2. **Given** user has granted microphone permission, **When** they click the microphone button and speak, **Then** their speech is converted to text in real-time and appears in the chat input field
3. **Given** user has spoken a command, **When** they finish speaking (after brief silence), **Then** the transcribed text is automatically sent to the AI chatbot
4. **Given** user is speaking, **When** voice input is active, **Then** a visual indicator (pulsing animation, red recording icon) shows the microphone is listening
5. **Given** microphone permission is denied, **When** user clicks the microphone button, **Then** they see a helpful error message prompting them to enable microphone access
6. **Given** voice recognition fails or returns gibberish, **When** text appears in the input, **Then** user can edit the text before sending to the AI

---

### User Story 4 - Bilingual Interface with English and Urdu Support (Priority: P2)

Users can switch between English and Urdu languages via a toggle in the top navigation bar, which updates all UI text, changes layout direction (LTR for English, RTL for Urdu), and sets the chatbot's language preference.

**Why this priority**: This is P2 because it's a key differentiating feature for the target audience (Urdu speakers) but the dashboard is functional in English-only (P1). It's higher priority than voice (P3) because it expands the user base significantly.

**Independent Test**: Can be tested independently by clicking the language toggle, verifying all UI text changes to Urdu, confirming RTL layout (text alignment, navigation bar, sidebar position), and sending a chat message to verify the AI responds in Urdu. Requires translation strings but no backend AI logic changes (AI already supports multilingual conversations).

**Acceptance Scenarios**:

1. **Given** user is on the dashboard, **When** they click the language toggle (English ↔ اردو), **Then** all static UI text (labels, buttons, headings) changes to the selected language
2. **Given** user switches to Urdu, **When** the page re-renders, **Then** the layout direction changes from LTR to RTL (navigation bar items, sidebar position, text alignment all flip)
3. **Given** user has selected Urdu, **When** they send a chat message in Urdu, **Then** the AI responds in Urdu (language preference sent with chat API request)
4. **Given** user switches language, **When** the page reloads or they navigate to another page, **Then** the selected language persists (stored in localStorage)
5. **Given** user is viewing charts and KPIs, **When** language changes, **Then** chart labels, axis titles, and KPI card labels update to the selected language
6. **Given** user switches to RTL (Urdu), **When** viewing the chat widget, **Then** the chat input and message bubbles align correctly for RTL reading (user messages left, AI messages right)

---

### Edge Cases

- **What happens when user has no tasks?** Dashboard shows zero metrics in KPI cards, empty state messages in charts ("No data available"), and an empty task table with a prompt to create the first task via chat or traditional UI.

- **What happens when chat API is unavailable or slow?** Chat widget shows loading spinner during requests. If API fails, display error message in chat ("Unable to connect to AI assistant. Please try again.") and allow retry. Visual dashboard remains functional.

- **What happens when user denies microphone permission?** Microphone button shows disabled state with tooltip ("Microphone access required"). Clicking it displays a modal with instructions to enable permissions in browser settings. Text input remains available.

- **What happens when voice recognition produces no text or errors?** Show brief error message in chat widget ("Could not understand. Please try again or type your message."). Fallback to text input always available.

- **What happens when user switches language mid-conversation?** Existing chat history remains in the original language (messages are immutable), but new AI responses use the newly selected language. UI labels update immediately.

- **What happens on mobile/tablet screens?** Chat widget becomes a floating button (bottom-right corner) that opens a modal overlay when clicked. Dashboard layout stacks vertically (KPIs → Charts → Task Table). RTL layout still applies for Urdu on mobile.

- **What happens when user creates a task via chat while viewing the dashboard?** Task table and KPI metrics update in real-time without requiring a manual refresh. Visual feedback (subtle animation, highlight) shows the new task appearing.

- **What happens when user's session expires while on dashboard?** Redirect to `/login` page with a message ("Session expired. Please log in again."). After re-login, redirect back to `/dashboard`.

- **What happens with very long task titles or descriptions in RTL mode?** Text truncates with ellipsis (`...`) in table view. Full text visible on hover (tooltip) or when editing. Ensure text overflow doesn't break layout in RTL.

- **What happens when browser doesn't support Web Speech API (voice input)?** Microphone button is hidden entirely or shows disabled state with tooltip ("Voice input not supported in this browser"). Feature degrades gracefully to text-only input.

## Requirements *(mandatory)*

### Functional Requirements

#### Dashboard Layout & Navigation

- **FR-001**: System MUST redirect authenticated users to `/dashboard` as the default post-login landing page
- **FR-002**: System MUST protect `/dashboard` route and redirect unauthenticated users to `/login`
- **FR-003**: Dashboard MUST display a top navigation bar containing application logo, language toggle, and user profile menu (with username and logout action)
- **FR-004**: Dashboard MUST use a two-zone layout: main dashboard area (left/center) and persistent chat widget (right sidebar)
- **FR-005**: System MUST preserve existing task CRUD functionality and chatbot logic without modification (UI enhancement only)

#### Visual Task Management (Main Dashboard Area)

- **FR-006**: Dashboard MUST display four KPI cards showing: Total Tasks, Completed Tasks, Pending Tasks, and Overdue Tasks (using existing `calculateKPIs` logic from `frontend/lib/analytics.js`)
- **FR-007**: Dashboard MUST render at least three chart types: donut chart (status distribution), line chart (7-day activity trend), and bar chart (tasks by status breakdown) using existing chart utilities
- **FR-008**: Dashboard MUST display an interactive task table with columns for task title, status, due date, and actions (toggle completion, edit, delete)
- **FR-009**: Task table MUST support real-time search filtering by title/description (case-insensitive)
- **FR-010**: Task table MUST include status filter dropdown (All, Pending, Completed)
- **FR-011**: Task table MUST implement pagination showing 10 tasks per page with previous/next navigation controls
- **FR-012**: Task table MUST allow inline task completion toggling via checkbox
- **FR-013**: Task table MUST allow task deletion with confirmation prompt ("Are you sure you want to delete this task?")
- **FR-014**: Task table MUST allow task editing by navigating to `/todos/[id]` when edit button is clicked

#### Persistent AI Chat Widget

- **FR-015**: Dashboard MUST display a persistent chat widget in the right sidebar (always visible, not a modal)
- **FR-016**: Chat widget MUST include a message history area showing user and AI messages with distinct styling (user: right-aligned, AI: left-aligned)
- **FR-017**: Chat widget MUST include a text input field for typing messages
- **FR-018**: Chat widget MUST include a send button to submit messages to the existing chat API endpoint (`/api/{user_id}/chat`)
- **FR-019**: Chat widget MUST send user's selected language preference with each chat API request (as metadata or in request body)
- **FR-020**: Chat widget MUST display AI responses in the message history immediately upon receiving API response
- **FR-021**: Chat widget MUST auto-scroll to the latest message when new messages are added
- **FR-022**: Chat widget MUST support message history scrolling for reviewing previous conversation (session-based, not persisted across page reloads unless conversation ID is tracked)
- **FR-023**: System MUST synchronize task changes made via chat with the visual dashboard in real-time (task creation, completion, updates reflected immediately in KPIs, charts, and task table)

#### Voice Input

- **FR-024**: Chat widget MUST include a microphone button adjacent to the text input field
- **FR-025**: System MUST request browser microphone permission when microphone button is first clicked
- **FR-026**: System MUST use Web Speech API (or equivalent browser speech recognition) to convert speech to text
- **FR-027**: System MUST display transcribed text in the chat input field in real-time as user speaks
- **FR-028**: System MUST automatically send transcribed text to the AI after a brief silence period (e.g., 2 seconds of no speech)
- **FR-029**: System MUST display a visual indicator (pulsing icon, recording badge) while microphone is actively listening
- **FR-030**: System MUST allow user to manually stop voice recording by clicking the microphone button again
- **FR-031**: System MUST handle microphone permission denial gracefully with an error message and instructions to enable access
- **FR-032**: System MUST hide or disable microphone button if browser does not support Web Speech API

#### Bilingual Support (English & Urdu)

- **FR-033**: Top navigation bar MUST include a language toggle button displaying "English ↔ اردو"
- **FR-034**: System MUST switch all static UI text (labels, buttons, headings, tooltips) to the selected language when toggle is clicked
- **FR-035**: System MUST change layout direction from LTR to RTL when Urdu is selected (affecting entire dashboard layout, navigation bar, sidebar position, text alignment)
- **FR-036**: System MUST change layout direction from RTL to LTR when English is selected
- **FR-037**: System MUST persist language selection in browser localStorage so preference survives page reloads and navigation
- **FR-038**: System MUST update chart labels, axis titles, and KPI card text to the selected language
- **FR-039**: System MUST send user's language preference with chat API requests so AI responds in the correct language
- **FR-040**: System MUST maintain translation strings for all static UI text in both English and Urdu (translation dictionary/i18n library)
- **FR-041**: Chat widget MUST adjust message bubble alignment for RTL mode (user messages: left-aligned, AI messages: right-aligned in Urdu; reversed in English)

#### Responsive Design

- **FR-042**: Dashboard MUST be fully responsive on desktop (≥1024px), tablet (768px-1023px), and mobile (≤767px) screen sizes
- **FR-043**: Chat widget MUST transform into a floating action button (FAB) on mobile/tablet, opening as a modal overlay when clicked
- **FR-044**: Dashboard layout MUST stack vertically on mobile (KPIs → Charts → Task Table) with each section taking full width
- **FR-045**: System MUST preserve RTL/LTR layout direction on all screen sizes when Urdu/English is selected

### Key Entities *(include if feature involves data)*

- **Language Preference**: User's selected language (English or Urdu), stored in localStorage with key `preferredLanguage`, values: `"en"` or `"ur"`
- **Chat Message**: A single message in the conversation, containing: `text` (message content), `sender` (user or AI), `timestamp` (when sent), `language` (language of the message)
- **Translation Dictionary**: Collection of key-value pairs mapping UI text keys (e.g., `"dashboard.title"`) to translated strings in English and Urdu
- **Voice Recording State**: Transient state tracking whether microphone is active, includes: `isRecording` (boolean), `transcript` (current transcribed text), `error` (error message if recognition fails)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view their complete task overview (KPIs, charts, task table) within 3 seconds of dashboard page load
- **SC-002**: Users can successfully create, complete, update, or delete tasks through the chat widget and see changes reflected in the visual dashboard within 2 seconds
- **SC-003**: Users can switch between English and Urdu languages, with all UI text updating and layout direction changing, within 1 second
- **SC-004**: Users can successfully transcribe and send a voice command to the AI chatbot with 90% accuracy for clear speech in a quiet environment
- **SC-005**: Dashboard remains fully functional and responsive on mobile devices (320px minimum width) with all core features accessible (task viewing, chat interaction, language toggle)
- **SC-006**: 95% of users can complete their first task management action (create, complete, or delete) on the dashboard within 1 minute of landing on the page (measured via user testing)
- **SC-007**: Chat widget maintains smooth scrolling performance with up to 100 messages in the conversation history
- **SC-008**: Dashboard supports RTL layout for Urdu without any visual bugs (text overflow, misaligned elements, broken charts) as verified by manual testing
- **SC-009**: Voice input feature degrades gracefully on unsupported browsers (microphone button hidden/disabled, no errors thrown, text input remains functional)
- **SC-010**: Task synchronization between chat and visual dashboard has zero data inconsistencies (tasks created in chat appear in table, completed tasks update KPI counts correctly)

## Assumptions *(mandatory)*

1. **Existing Authentication System**: Users are already authenticated before reaching `/dashboard`. JWT token is stored in localStorage and attached to all API requests via existing `api.js` client.

2. **Existing Task API Endpoints**: Backend provides functional CRUD endpoints at `/api/{user_id}/tasks` (list, create, update, delete) and chat endpoint at `/api/{user_id}/chat`. These endpoints will not be modified - only the UI integration changes.

3. **Existing Chatbot Logic**: The conversational AI backend (orchestrator, intent parser, MCP tools) is fully functional and supports multilingual conversations without code changes. Language preference can be sent as metadata in chat requests.

4. **Browser Support**: Target browsers include modern versions of Chrome, Firefox, Safari, and Edge (released within the last 2 years). Web Speech API is available in these browsers but may require HTTPS in production.

5. **Translation Resources**: English and Urdu translation strings will be provided or created during implementation. Urdu translations are accurate and culturally appropriate (verified by a native speaker).

6. **Microphone Permissions**: Users understand browser permission prompts and can grant microphone access if they want to use voice input. HTTPS is required for microphone access in production (localhost works in development).

7. **RTL Framework Support**: Tailwind CSS (existing styling framework) supports RTL mode via `dir="rtl"` attribute and RTL-specific utility classes. No major CSS refactoring is required.

8. **Real-Time Updates**: Task changes made via chat API trigger re-fetches or state updates in the frontend to synchronize visual dashboard. This may require polling, WebSocket, or optimistic UI updates (implementation detail, not in spec).

9. **Session Management**: Chat conversation history is session-based (stored in component state or localStorage). Full conversation persistence across sessions is out of scope unless user explicitly requests it.

10. **No Backend Changes**: This is strictly a UI/UX enhancement. No new backend APIs, no changes to chatbot logic, no database schema modifications. All functionality reuses existing backend capabilities.

## Out of Scope *(mandatory)*

1. **Backend API Development**: No new backend endpoints, no modifications to existing chat API, no changes to MCP tools or agent orchestrator logic.

2. **Advanced Voice Features**: No speaker identification, no voice biometrics, no custom wake words, no offline voice recognition. Only browser-native Web Speech API for simple speech-to-text.

3. **Conversation History Persistence**: Chat history is session-based only. No database storage of chat messages, no conversation retrieval after page refresh (unless conversation ID is already tracked by backend).

4. **Advanced Translation Features**: No automatic language detection, no mixed-language conversations (user must manually toggle), no third-party translation APIs. Only static UI text translation.

5. **Accessibility Beyond Language**: While RTL supports Urdu speakers, advanced WCAG 2.1 AA compliance (screen reader optimization, keyboard navigation enhancements) is not explicitly in scope (though should follow existing accessibility patterns).

6. **Desktop/Mobile Native Apps**: This is a web-only enhancement. No React Native, Electron, or mobile app development.

7. **Custom Chart Types**: Only reuse existing chart components (donut, line, bar) from `frontend/components/dashboard/charts/`. No new chart types (e.g., Gantt, calendar view).

8. **Task Scheduling/Reminders**: No calendar integration, no push notifications, no email reminders. Focus is on UI presentation and interaction only.

9. **Collaborative Features**: No real-time collaboration, no task sharing between users, no comments/mentions. Dashboard is single-user focused.

10. **Performance Optimization Beyond Requirements**: Meeting the 3-second load time (SC-001) is in scope, but advanced optimizations like code splitting, lazy loading, or CDN integration are implementation details left to the planning phase.

## Constraints *(mandatory)*

1. **No Business Logic Changes**: Existing task CRUD logic in `frontend/app/todos/` and backend task operations MUST NOT be modified. Only UI presentation and interaction patterns change.

2. **No New Backend APIs**: All functionality MUST reuse existing endpoints (`/api/{user_id}/tasks`, `/api/{user_id}/chat`). No new routes, no schema changes.

3. **Technology Stack Preservation**: MUST use existing Next.js 14, Tailwind CSS, Recharts, and React hooks architecture. No new state management libraries (Redux, Zustand), no framework changes.

4. **HTTPS Requirement for Voice (Production)**: Web Speech API requires HTTPS in production. Development on localhost is fine, but deployment MUST use HTTPS for microphone access.

5. **Browser Compatibility**: MUST support modern browsers (Chrome, Firefox, Safari, Edge - last 2 years). Graceful degradation required for unsupported features (e.g., Web Speech API).

6. **RTL Layout Consistency**: RTL mode MUST flip the entire layout (navigation, sidebar, text alignment) without breaking any existing visual components or causing text overflow.

7. **Translation Accuracy**: Urdu translations MUST be verified by a native speaker or trusted translation resource. Machine-translated UI text is not acceptable.

8. **Session-Based Chat History**: Chat history MUST persist only for the current browser session (component state or sessionStorage). No server-side storage unless backend already supports it.

9. **Responsive Breakpoints**: MUST use consistent breakpoints (mobile: ≤767px, tablet: 768-1023px, desktop: ≥1024px) across all components for layout consistency.

10. **Authentication Guard**: `/dashboard` MUST check authentication status and redirect to `/login` if token is missing or invalid. This follows existing auth patterns in `frontend/lib/auth.js`.

## Dependencies *(mandatory)*

1. **Existing Authentication System**: Requires functional JWT authentication with tokens stored in localStorage and validated by backend. Implementation depends on `frontend/lib/auth.js` and `backend/src/api/dependencies.py`.

2. **Existing Task API Endpoints**: Requires working CRUD endpoints at `/api/{user_id}/tasks` (GET, POST, PUT, DELETE) as defined in `backend/src/api/routes.py`.

3. **Existing Chat API Endpoint**: Requires functional chat endpoint at `/api/{user_id}/chat` that accepts `{ message: string, language?: string }` and returns `{ response: string, conversation_id?: string }`.

4. **Existing Dashboard Components**: Reuses components from `frontend/components/dashboard/` including `DashboardKPIs`, `TaskCharts`, `TaskTable`, and chart components (`DonutChart`, `LineChart`, `BarChart`).

5. **Existing Analytics Utilities**: Depends on `frontend/lib/analytics.js` for KPI calculations and `frontend/lib/chart-utils.js` for chart configurations.

6. **Tailwind CSS RTL Support**: Requires Tailwind CSS v3+ with RTL plugin or manual RTL utility classes. May need `tailwindcss-rtl` plugin installation during implementation.

7. **Web Speech API**: Requires browser support for `webkitSpeechRecognition` or `SpeechRecognition` API. Degrades gracefully on unsupported browsers.

8. **HTTPS for Production Voice**: Voice input requires HTTPS in production environments (browser security policy). Development on localhost works without HTTPS.

9. **Translation Library (Optional)**: May require i18n library like `next-intl` or `react-i18next` for managing translation strings, though can be implemented with simple JSON dictionaries.

10. **Session Storage/LocalStorage**: Depends on browser localStorage for language preference persistence and optionally sessionStorage for chat history (if not using component state).

## Risks *(mandatory)*

1. **Web Speech API Browser Compatibility**: Not all browsers support Web Speech API (e.g., older Firefox versions, some mobile browsers). **Mitigation**: Feature detection + graceful degradation (hide microphone button if unsupported, show informative tooltip).

2. **Voice Recognition Accuracy**: Speech-to-text accuracy varies by accent, background noise, and language (especially Urdu). **Mitigation**: Allow manual editing of transcribed text before sending, provide clear visual feedback when recognition fails, document limitations in UI tooltips.

3. **RTL Layout Complexity**: Switching to RTL may break existing visual components (charts, tables, forms) if not thoroughly tested. **Mitigation**: Comprehensive RTL testing, use Tailwind RTL utilities, test with long Urdu text and edge cases (overflow, truncation).

4. **Translation Quality**: Poor Urdu translations can confuse users or appear unprofessional. **Mitigation**: Have translations reviewed by a native Urdu speaker, use established translation resources, test with real Urdu-speaking users.

5. **Real-Time Sync Complexity**: Synchronizing tasks between chat widget and visual dashboard requires careful state management to avoid race conditions or stale data. **Mitigation**: Use optimistic UI updates, implement proper error handling, test concurrent operations (chat + table edits).

6. **Performance with Large Task Lists**: Dashboard may become slow with 100+ tasks due to chart rendering and table pagination. **Mitigation**: Implement pagination (already in FR-011), lazy load charts, test with realistic data volumes (100-500 tasks).

7. **HTTPS Requirement in Production**: Voice input won't work without HTTPS, which may complicate deployment if not already configured. **Mitigation**: Document HTTPS requirement clearly, provide deployment guide with SSL setup instructions (Certbot, Cloudflare).

8. **Mobile Chat Widget UX**: Converting sidebar chat to floating button + modal on mobile may feel disjointed or hide the conversational aspect. **Mitigation**: User test mobile UX, ensure modal is easy to open/close, consider persistent mini-widget instead of FAB.

9. **Language Persistence Edge Cases**: Language preference may not persist correctly across different browsers or incognito mode. **Mitigation**: Use localStorage with fallback to default (English), handle missing localStorage gracefully.

10. **Scope Creep Risk**: "Advanced dashboard" is open-ended and may lead to requests for features beyond spec (e.g., custom themes, additional languages, advanced voice commands). **Mitigation**: Clearly document out-of-scope items, refer back to this spec during implementation, resist feature additions unless user explicitly approves spec changes.
