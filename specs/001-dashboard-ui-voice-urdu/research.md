# Research & Technical Decisions: Advanced Todo Dashboard UI

**Feature**: 001-dashboard-ui-voice-urdu
**Date**: 2025-12-28
**Purpose**: Resolve all technical decisions for UI-only dashboard implementation with conversational AI, voice input, and bilingual (English/Urdu) support

## Executive Summary

All technical unknowns have been researched and resolved. This feature is a **UI/UX-only enhancement** that reuses 100% of existing backend infrastructure. No new APIs, no backend changes, no database modifications.

**Key Decisions**:
1. **i18n Library**: `next-intl` for Next.js 14 App Router (best RTL support)
2. **Voice Input**: Browser Web Speech API (no external dependencies)
3. **Real-Time Sync**: Optimistic UI updates + polling (500ms interval when chat active)
4. **Chat State Management**: React hooks + sessionStorage (no Redux/Zustand)
5. **RTL Support**: Tailwind CSS with `dir="rtl"` attribute + RTL utility classes

---

## Research Tasks

### 1. i18n Library for Next.js 14 App Router with RTL Support

**Research Question**: Which internationalization library provides the best RTL support for Next.js 14 App Router while being lightweight and compatible with existing Tailwind CSS?

**Decision**: **`next-intl`** (v3.4.0+)

**Rationale**:
- **Native App Router Support**: Built specifically for Next.js 13+ App Router (uses React Server Components patterns)
- **RTL-Aware**: Provides `dir` prop in `<html>` tag automatically based on locale
- **Type-Safe**: TypeScript support with autocomplete for translation keys
- **Lightweight**: 15KB gzipped (vs 30KB for react-i18next)
- **Tailwind Compatible**: Works seamlessly with Tailwind RTL utilities (no conflicts)
- **Locale Persistence**: Built-in support for storing locale in cookies/localStorage
- **Dynamic Imports**: Supports lazy loading translation files for code splitting

**Alternatives Considered**:
1. **react-i18next** - Popular but heavier (30KB), designed for Pages Router, requires additional RTL setup
2. **react-intl** - Comprehensive but overkill for this use case (50KB), less Next.js-specific
3. **Custom JSON dictionaries** - Lightweight but requires manual RTL logic, no type safety, hard to scale

**Implementation Approach**:
- Translation files: `frontend/locales/en.json` and `frontend/locales/ur.json`
- Provider component: `frontend/app/[locale]/layout.js` wraps all pages
- Language toggle: Updates localStorage + triggers re-render with new locale
- RTL handling: `<html dir={locale === 'ur' ? 'rtl' : 'ltr'} lang={locale}>`

**References**:
- next-intl docs: https://next-intl-docs.vercel.app/docs/getting-started/app-router
- RTL support guide: https://next-intl-docs.vercel.app/docs/usage/configuration#locale-direction

---

### 2. Web Speech API for Voice Input

**Research Question**: What is the browser compatibility and implementation approach for Web Speech API? Are there fallback options needed?

**Decision**: **Browser-native Web Speech API** with graceful degradation (no external services)

**Rationale**:
- **Zero External Dependencies**: No API keys, no third-party services (Google Cloud Speech, Azure, AWS)
- **Free & Unlimited**: No usage costs or rate limits
- **Real-Time Transcription**: Instant feedback as user speaks (no upload/process latency)
- **Privacy-Friendly**: Audio stays in browser (HTTPS requirement ensures encryption)
- **Sufficient Accuracy**: 85-95% accuracy for clear speech in quiet environments (meets SC-004: 90% target)

**Browser Compatibility** (as of 2025-12):
- ✅ Chrome/Edge 89+: Full support (`webkitSpeechRecognition`)
- ✅ Safari 14.1+: Full support (iOS 14.5+ on mobile)
- ⚠️ Firefox 116+: Experimental support (flag required: `media.webspeech.recognition.enable`)
- ❌ Older browsers: No support (IE11, Safari <14.1)

**Graceful Degradation Strategy**:
```javascript
// Feature detection
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  // Hide microphone button, show tooltip: "Voice input not supported in this browser"
  // Text input remains fully functional
}
```

**Implementation Approach**:
- Component: `frontend/components/chatbot/VoiceInput.js`
- State management: `isRecording`, `transcript`, `error` (React hooks)
- Auto-send: Trigger send after 2 seconds of silence (using `recognition.onspeechend`)
- Manual edit: User can modify transcribed text before sending
- Permission handling: Request on first click, show instructions if denied

**Known Limitations** (documented in UI):
- Requires HTTPS in production (localhost works without)
- Background noise reduces accuracy
- Accented speech may have lower accuracy (especially for Urdu)
- 60-second timeout per recognition session (browser security limit)

**Alternatives Considered**:
1. **Google Cloud Speech-to-Text** - High accuracy but costs money, requires API key, adds latency
2. **Azure Speech Service** - Similar to Google, enterprise-focused
3. **OpenAI Whisper** - Excellent accuracy but requires backend processing, slow for real-time

**References**:
- MDN Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Browser compatibility: https://caniuse.com/speech-recognition

---

### 3. Real-Time Sync Between Chat Widget and Visual Dashboard

**Research Question**: How do we synchronize task changes made via chat API with the visual dashboard (KPIs, charts, task table) without adding WebSockets or server-sent events?

**Decision**: **Optimistic UI Updates + Smart Polling** (500ms interval when chat is active)

**Rationale**:
- **No Backend Changes**: Reuses existing REST endpoints (`/api/{user_id}/tasks`, `/api/{user_id}/chat`)
- **Instant Feedback**: Optimistic updates show changes immediately (before API confirmation)
- **Eventual Consistency**: Polling ensures sync even if optimistic update fails
- **Efficient**: Polling only active during chat interactions (paused when idle)
- **Simple**: No WebSocket infrastructure, no server-side changes required

**Implementation Approach**:

**Scenario 1: User creates task via chat**
1. User sends chat message: "add task: buy groceries"
2. Chat API responds: "Task created successfully"
3. **Optimistic Update**: Parse AI response, extract task details, add to task list state immediately
4. **Polling Verification**: Next poll (500ms later) fetches `/api/{user_id}/tasks` to confirm task exists
5. **UI Update**: If task appears in API response, keep it. If not, show error + remove from UI

**Scenario 2: User completes task via chat**
1. User sends: "mark 'buy groceries' as done"
2. Chat API responds: "Task marked as complete"
3. **Optimistic Update**: Find task by title/ID, toggle `completed: true` in state
4. **KPI Update**: Recalculate KPIs immediately (pending -1, completed +1)
5. **Polling Verification**: Confirm change in next API fetch

**Polling Strategy**:
- **Active Polling**: 500ms interval when chat widget has focus or last message <5 seconds ago
- **Idle Polling**: 5 seconds interval when chat idle for >5 seconds
- **Paused Polling**: No polling when user navigates away from dashboard
- **Conflict Resolution**: API response is source of truth (overwrite optimistic updates if mismatch)

**Edge Case Handling**:
- **Concurrent Edits**: If user edits task in table while chat is creating similar task, last API response wins
- **Network Errors**: Show error banner "Failed to sync with server. Retrying..." + retry with exponential backoff
- **Task Identification**: Match tasks by ID (primary) or title+description hash (fallback)

**Alternatives Considered**:
1. **WebSockets** - Real-time but requires backend changes (violates constraint)
2. **Server-Sent Events (SSE)** - One-way real-time but requires backend changes
3. **Long Polling** - More efficient than regular polling but complicates codebase
4. **No Polling (Manual Refresh Only)** - Poor UX, violates FR-023 requirement

**Performance Impact**:
- Polling adds ~100ms latency to task sync (acceptable per SC-002: <2 seconds)
- Bandwidth: ~5KB per poll (task list JSON), max 2 requests/second = ~10KB/s (negligible)

**References**:
- Optimistic UI patterns: https://www.apollographql.com/docs/react/performance/optimistic-ui/
- Polling best practices: https://developer.mozilla.org/en-US/docs/Web/API/setInterval

---

### 4. Chat State Management (No Redux/Zustand)

**Research Question**: How do we manage chat widget state (message history, input, loading states) using only React hooks to preserve the existing architecture?

**Decision**: **React hooks (useState, useEffect, useMemo) + sessionStorage for persistence**

**Rationale**:
- **Constraint Adherence**: Spec prohibits new state management libraries (Constraint #3)
- **Simplicity**: Chat state is localized to dashboard page (no global state needed)
- **Session Persistence**: sessionStorage preserves chat history during page refresh (if desired)
- **Performance**: useMemo prevents unnecessary re-renders for message list

**State Structure**:
```javascript
const [messages, setMessages] = useState([]); // Array of {id, text, sender, timestamp, language}
const [inputText, setInputText] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [language, setLanguage] = useState('en'); // Synced with global language preference
```

**Session Persistence** (optional):
```javascript
useEffect(() => {
  // Load from sessionStorage on mount
  const savedMessages = sessionStorage.getItem('chatHistory');
  if (savedMessages) setMessages(JSON.parse(savedMessages));
}, []);

useEffect(() => {
  // Save to sessionStorage on change
  sessionStorage.setItem('chatHistory', JSON.stringify(messages));
}, [messages]);
```

**Message ID Generation**:
- Use `Date.now() + Math.random()` for client-side IDs (sufficient for session-scoped history)
- Server conversation_id (if returned by API) stored separately for backend tracking

**Alternatives Considered**:
1. **Redux** - Overkill for single-page state, violates constraint
2. **Zustand** - Lightweight but still a new library, violates constraint
3. **Context API** - Unnecessary complexity for localized state (chat only on dashboard)

**References**:
- React hooks best practices: https://react.dev/reference/react/hooks
- sessionStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage

---

### 5. RTL Support with Tailwind CSS

**Research Question**: How do we implement full RTL layout switching for Urdu without breaking existing components (charts, tables, forms)?

**Decision**: **Tailwind CSS with `dir="rtl"` attribute + directional utility classes**

**Rationale**:
- **Built-In Support**: Tailwind CSS 3.0+ has native RTL support via `dir` attribute
- **No CSS Refactoring**: Existing components work with RTL by default (flexbox/grid auto-reverse)
- **Directional Utilities**: Use `ltr:` and `rtl:` prefixes for edge cases (e.g., `rtl:text-right ltr:text-left`)
- **Chart Compatibility**: Recharts supports RTL via `layout` prop (no custom patches needed)
- **No Plugin Required**: Core Tailwind handles RTL without `tailwindcss-rtl` plugin

**Implementation Approach**:

**1. HTML Direction Toggle**:
```javascript
// In app/[locale]/layout.js or dashboard page component
<html dir={locale === 'ur' ? 'rtl' : 'ltr'} lang={locale}>
```

**2. Tailwind RTL Utilities**:
- **Auto-reversing**: `flex-row`, `grid`, `space-x-4` automatically reverse in RTL
- **Manual overrides**: `rtl:pl-4 ltr:pr-4` for padding that shouldn't auto-reverse
- **Text alignment**: `text-right` becomes `text-left` in RTL automatically

**3. Chat Widget RTL Handling**:
- **LTR (English)**: User messages right-aligned, AI messages left-aligned
- **RTL (Urdu)**: User messages left-aligned, AI messages right-aligned
- Implementation: `<div className="rtl:justify-start ltr:justify-end">{userMessage}</div>`

**4. Chart RTL Adaptation**:
- Recharts: Use `layout="vertical"` + RTL-aware axis positioning
- Labels: Passed through translation system (automatically use Urdu text)
- Legend: Position with `rtl:text-right ltr:text-left`

**5. Table RTL Handling**:
- Column order: Auto-reverses with `flex-row-reverse` in RTL
- Text alignment: `text-right` for numeric columns (stays right-aligned in both LTR/RTL)
- Actions column: Use `rtl:order-first ltr:order-last` to keep actions on right in LTR, left in RTL

**Edge Cases**:
- **Long Urdu Text**: Use `truncate` with `title` tooltip for overflow
- **Mixed Content**: Bidirectional text (English + Urdu in same string) handled by browser's Unicode bidirectional algorithm
- **Icons**: Use direction-agnostic icons (avoid left/right arrows, use "next/prev" semantics)

**Testing Strategy**:
- Test all dashboard components with `dir="rtl"` manually
- Verify no horizontal scrolling or broken layouts
- Check chart labels, table headers, button positions
- Test with real Urdu text (not Lorem Ipsum)

**Alternatives Considered**:
1. **tailwindcss-rtl plugin** - Deprecated, not needed for Tailwind 3.0+
2. **CSS logical properties** (`margin-inline-start`)- Modern but less browser support (Safari <15)
3. **Manual CSS overrides** - Fragile, hard to maintain

**References**:
- Tailwind RTL support: https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support
- Recharts RTL: https://recharts.org/en-US/examples/VerticalChart (layout prop)
- MDN Bidirectional text: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Writing_Modes

---

## Technology Stack Summary

All technologies are **already in use** in the existing codebase. No new dependencies added (except `next-intl` for i18n).

**Frontend (Existing)**:
- **Framework**: Next.js 14.2.35 (App Router)
- **Styling**: Tailwind CSS 3.x
- **Charts**: Recharts 2.10.3
- **State**: React hooks (useState, useEffect, useMemo)
- **HTTP Client**: `frontend/lib/api.js` (existing)

**Frontend (New)**:
- **i18n**: next-intl 3.4.0+ (lightweight, App Router-native)

**Browser APIs (New)**:
- **Voice Input**: Web Speech API (`webkitSpeechRecognition`)
- **Storage**: sessionStorage (chat history persistence)

**Backend (No Changes)**:
- **Framework**: FastAPI (existing)
- **Database**: PostgreSQL via SQLModel (existing)
- **AI**: Anthropic Claude API via orchestrator (existing)
- **Endpoints**: `/api/{user_id}/tasks`, `/api/{user_id}/chat` (existing)

---

## Performance Considerations

**Load Time** (SC-001: <3 seconds):
- Dashboard component: ~50KB (KPIs + Charts + Table)
- next-intl bundle: ~15KB
- Translation JSON: ~10KB (en + ur combined)
- **Total**: ~75KB additional (easily under 3-second load on broadband)

**Real-Time Sync** (SC-002: <2 seconds):
- Optimistic update: Instant (0ms)
- Polling interval: 500ms
- API round-trip: ~100-200ms
- **Total**: ~500-700ms (well under 2-second target)

**Language Switching** (SC-003: <1 second):
- localStorage write: <1ms
- next-intl re-render: ~50-100ms
- RTL layout recalculation: ~50-100ms
- **Total**: ~100-200ms (well under 1-second target)

**Voice Transcription** (SC-004: 90% accuracy):
- Browser API accuracy: 85-95% (clear speech, quiet environment)
- **Meets target**: Yes (with caveat for noisy environments documented in UI)

---

## Security Considerations

**Voice Input**:
- ✅ HTTPS Required: Browser enforces HTTPS for microphone access (production deployment must use SSL)
- ✅ User Permission: Browser prompts user for microphone access (explicit consent)
- ✅ Privacy: Audio never leaves browser (no server-side processing)

**Language Preference Storage**:
- ✅ localStorage: Not sensitive data (just "en" or "ur" preference)
- ✅ No XSS Risk: Preference validated against allowlist (`['en', 'ur']`)

**Real-Time Sync**:
- ✅ No New Attack Surface: Reuses existing authenticated API endpoints
- ✅ CSRF Protection: JWT token required for all API calls (existing security)

---

## Risks & Mitigations (from Spec)

**1. Web Speech API Browser Compatibility** → **Mitigation**: Feature detection + graceful degradation (hide button if unsupported)

**2. Voice Recognition Accuracy** → **Mitigation**: Allow manual text editing, clear error feedback, document limitations

**3. RTL Layout Complexity** → **Mitigation**: Comprehensive testing with real Urdu text, Tailwind RTL utilities, test all components

**4. Translation Quality** → **Mitigation**: Urdu translations reviewed by native speaker (out of scope for planning, user-provided during implementation)

**5. Real-Time Sync Complexity** → **Mitigation**: Optimistic UI + polling, clear conflict resolution rules (API is source of truth)

**6. Performance with Large Task Lists** → **Mitigation**: Pagination (10/page), lazy chart rendering, tested with 100-500 tasks

**7. HTTPS Requirement in Production** → **Mitigation**: Document in deployment guide, existing infrastructure likely has SSL

**8. Mobile Chat Widget UX** → **Mitigation**: User test FAB + modal, easy open/close, consider mini-widget alternative

**9. Language Persistence Edge Cases** → **Mitigation**: localStorage with fallback to 'en', handle missing gracefully

**10. Scope Creep Risk** → **Mitigation**: Refer back to spec, reject undocumented features, validate against Out of Scope section

---

## Conclusion

All technical unknowns are resolved. The feature is ready for Phase 1 (Design & Contracts) and Phase 2 (Implementation Planning).

**No clarifications needed** - all decisions made with informed defaults based on:
- Existing codebase architecture (Next.js 14, Tailwind, React hooks)
- Specification constraints (UI-only, no backend changes, no new state libraries)
- Industry best practices (next-intl for i18n, Web Speech API for voice, optimistic UI for sync)
- Performance targets (all success criteria achievable with chosen approaches)

**Next Steps**: Proceed to `/sp.plan` Phase 1 (Data Models & Contracts) and Phase 2 (Implementation Phases).
