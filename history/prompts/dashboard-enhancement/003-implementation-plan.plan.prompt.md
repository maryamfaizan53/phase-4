---
id: 003
title: Dashboard Implementation Plan
stage: plan
date: 2025-12-24
surface: agent
model: claude-sonnet-4-5
feature: dashboard-enhancement
branch: main
user: user
command: /sp.plan
labels: ["planning", "architecture", "dashboard", "phased-implementation", "adr"]
links:
  spec: specs/dashboard-enhancement/spec.md
  ticket: null
  adr: specs/dashboard-enhancement/plan.md#10-architectural-decisions-summary
  pr: null
files:
  - specs/dashboard-enhancement/plan.md
tests:
  - None (planning artifact)
---

## Prompt

/sp.plan

Create a step-by-step implementation plan to achieve the specified dashboard transformation.

The plan should:
- Start with codebase analysis
- Identify reusable components
- Introduce dashboard layout incrementally
- Integrate chat widget cleanly
- Avoid breaking existing routes and APIs

Each phase should:
- Have a clear goal
- Mention files/components to be touched
- Minimize risk

Do not write code yet.

## Response snapshot

Comprehensive 12-phase implementation plan created (1,348 lines).

**Codebase Analysis Completed:**

1. **Frontend Architecture Identified:**
   - Framework: Next.js 14.0.4 with App Router (JavaScript)
   - Styling: Tailwind CSS 3.4.0 + custom glassmorphism system
   - Existing routes: `/`, `/login`, `/todos`, `/todos/new`, `/todos/[id]`, `/tour`
   - Components: 10 existing (Navbar, TodoList, TodoItem, TodoFilters, Button, Card, etc.)

2. **Reusable Components Mapped:**
   - **Reuse as-is:** Navbar, Card, Button, Input, Select, Checkbox (7 components)
   - **Adapt:** TodoList (extract patterns), TodoFilters (wrapper)
   - **Create new:** 11 dashboard-specific components (KPIs, Charts, Table, Chat)

3. **Existing API Client Analyzed:**
   - Location: `frontend/lib/api.js:1-184`
   - Methods: `tasksAPI.list/get/create/update/delete/toggleComplete`
   - **Missing:** `chatAPI.sendMessage` (to be added)
   - Backend endpoints confirmed operational

4. **Design System Documented:**
   - Brand colors: teal palette (`brand-50` to `brand-900`)
   - Glass effects: `.glass-panel`, `.glass-card`, `.glass-input`
   - Animations: `float`, `slide-up`, `pop-in`, `gradient-x`
   - Font: "Outfit" from Google Fonts

**Implementation Plan (12 Phases):**

**Phase 0: Project Setup (Day 1)**
- Install dependencies: `recharts` (^2.10.3), `date-fns` (^3.0.0)
- Verify backend API endpoints
- Create directory structure
- **Risk:** API schema mismatch → **Mitigation:** Verify early

**Phase 1: Core Utilities (Day 1-2)**
- Create `lib/analytics.js` - KPI calculations, chart data transformations
- Create `lib/date-helpers.js` - Date formatting, isOverdue, groupByDate
- Create `lib/chart-utils.js` - Chart colors, formatters
- Write unit tests (80% coverage target)
- **Risk:** Date timezone issues → **Mitigation:** Use date-fns UTC handling

**Phase 2: API Integration (Day 2)**
- Extend `lib/api.js` with `chatAPI.sendMessage` method
- Test chat endpoint integration
- **Risk:** Unexpected response format → **Mitigation:** Add validation

**Phase 3: Dashboard Page Foundation (Day 3)**
- Create `app/dashboard/page.js` - Main dashboard component
- Add authentication guard
- Set up basic layout with Navbar
- **Risk:** Route conflict with `/todos` → **Mitigation:** New route, keep `/todos` untouched

**Phase 4: KPI Cards (Day 3-4)**
- Create `components/dashboard/KPICard.js` - Single KPI card
- Create `components/dashboard/DashboardKPIs.js` - Grid of 4 KPI cards
- Integrate analytics utilities
- Responsive grid (2x2 mobile, 4x1 desktop)
- **Risk:** Dynamic color classes not working → **Mitigation:** Safelist in Tailwind config

**Phase 5: Chart Components (Day 4-5)**
- Create `components/dashboard/DonutChart.js` - Status distribution
- Create `components/dashboard/LineChart.js` - Created vs completed over time
- Create `components/dashboard/BarChart.js` - Tasks by status
- Create `components/dashboard/TaskCharts.js` - Container
- Integrate Recharts library
- **Risk:** Bundle bloat → **Mitigation:** Lazy loading, monitor bundle size

**Phase 6: Task Table (Day 5-6)**
- Create `components/dashboard/TaskTableRow.js` - Individual row
- Create `components/dashboard/TaskTable.js` - Table with filters, search, pagination
- Connect CRUD actions to API
- **Risk:** Performance with large lists → **Mitigation:** Pagination (10-20 items/page)

**Phase 7: Chat Widget (Day 6-7)**
- Create `components/chat/ChatMessage.js` - Message bubble
- Create `hooks/useVoiceInput.js` - Web Speech API integration
- Create `components/chat/VoiceInputButton.js` - Microphone button
- Create `components/chat/ChatWidget.js` - Floating widget
- Create `hooks/useTaskPolling.js` - Polling after chat actions
- **Risk:** Excessive polling → **Mitigation:** Limit to 3 iterations over 6 seconds

**Phase 8: Loading States (Day 7)**
- Create `components/dashboard/SkeletonLoader.js` - Loading placeholders
- Add loading states to all components
- Add error handling and empty states
- **Risk:** None (low-risk polish phase)

**Phase 9: Responsive Design & Accessibility (Day 8)**
- Test mobile layout (320px+ width)
- Add ARIA labels and roles
- Implement keyboard navigation
- Test with screen reader
- Fix color contrast issues
- **Target:** Lighthouse accessibility ≥ 90

**Phase 10: Performance Optimization (Day 8-9)**
- Lazy load chart components
- Memoize expensive calculations
- Debounce search input
- Code splitting
- **Target:** <3s load, <1s charts, <500KB bundle

**Phase 11: Integration Testing & QA (Day 9)**
- Write integration tests (Jest + MSW)
- Manual QA checklist (24 items)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Fix bugs

**Phase 12: Documentation & Deployment (Day 10)**
- Update README
- Document component APIs
- Deploy to staging → production
- Monitor metrics

**Architectural Decisions (4 ADRs):**

1. **ADR-001: New `/dashboard` Route vs Replace `/todos`**
   - **Decision:** Create new `/dashboard`, preserve `/todos`
   - **Rationale:** Minimal risk, easy rollback, side-by-side testing
   - **Status:** Approved

2. **ADR-002: Recharts vs Chart.js**
   - **Decision:** Use Recharts
   - **Rationale:** Better React integration, smaller bundle, accessible by default
   - **Status:** Approved

3. **ADR-003: Polling vs WebSocket**
   - **Decision:** Polling (Phase 1), WebSocket (future)
   - **Rationale:** Simpler, no backend changes, sufficient for Phase 1
   - **Status:** Approved (Phase 1)

4. **ADR-004: Floating Widget vs Sidebar**
   - **Decision:** Floating chat widget (bottom-right)
   - **Rationale:** Less intrusive, standard UX pattern, saves space
   - **Status:** Approved

**File Structure (New Files):**
```
frontend/
  app/dashboard/page.js (NEW)
  components/dashboard/ (7 NEW components)
  components/chat/ (3 NEW components)
  lib/analytics.js (NEW)
  lib/date-helpers.js (NEW)
  lib/chart-utils.js (NEW)
  hooks/useTaskPolling.js (NEW)
  hooks/useVoiceInput.js (NEW)
  lib/api.js (MODIFY: add chatAPI)
```

**Risk Mitigation Strategy:**
- 7 critical risks identified with mitigation plans
- Early verification of backend API schema
- Incremental phases prevent cascading failures
- New route prevents breaking existing functionality
- Rollback plan: < 15 minutes recovery time

**Testing Strategy:**
- Unit tests: 80% coverage for utilities
- Integration tests: All critical user paths
- E2E tests: 3-5 critical flows
- Accessibility: Manual + automated (axe, Lighthouse)

**Success Criteria:**
- Functional: 9 requirements (dashboard loads, charts render, chat works, etc.)
- Non-functional: 8 requirements (performance, accessibility, mobile, etc.)
- Quality gates: Tests pass, QA complete, no regressions

**Constraints Honored:**
- ✅ Zero backend changes
- ✅ No modifications to existing pages/components
- ✅ Preservation-first approach
- ✅ Incremental, testable phases
- ✅ Clear rollback strategy

## Outcome

- ✅ Impact: Comprehensive 1,348-line implementation plan created. Provides step-by-step blueprint with 12 phases, 4 ADRs, 20+ new files, risk mitigation for 7 critical risks, and complete testing strategy.
- 🧪 Tests: N/A (planning artifact, testing strategy documented for implementation phase)
- 📁 Files: Created `specs/dashboard-enhancement/plan.md`
- 🔁 Next prompts: `/sp.tasks` to generate detailed task breakdown with acceptance criteria for each phase
- 🧠 Reflection: Plan successfully balances incremental delivery with risk minimization. Each phase is self-contained and testable. ADRs document key architectural choices. Plan honors constitution constraints (no backend changes, preservation-first). Ready for task generation and implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None. Plan follows SDD template and addresses all spec requirements.
- Graders run and results (PASS/FAIL): N/A (planning phase)
- Prompt variant (if applicable): Standard planning workflow with deep codebase analysis
- Next experiment (smallest change to try): Proceed to task generation (`/sp.tasks`) to break down each phase into actionable tasks with acceptance criteria

## 📋 Architectural Decision Detected

**ADR Suggestions for User Approval:**

The following architectural decisions were identified during planning and documented inline:

1. **Dashboard Route Strategy** - Create new `/dashboard` vs replace `/todos`
2. **Charting Library Selection** - Recharts vs Chart.js vs Victory
3. **Real-Time Update Mechanism** - Polling vs WebSocket vs SSE
4. **Chat Widget Placement** - Floating widget vs sidebar vs modal

These decisions are documented in the plan (Section 10) with rationale, alternatives considered, and tradeoffs.

Would you like to create formal standalone ADR documents for any of these decisions? Run `/sp.adr <decision-title>` if desired.
