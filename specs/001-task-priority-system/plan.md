# Implementation Plan: Task Priority System

**Branch**: `001-task-priority-system` | **Date**: 2025-12-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-task-priority-system/spec.md`

## Summary

Add a 4-level priority system (low, medium, high, urgent) to tasks with database storage, color-coded UI badges, filtering capabilities, dashboard analytics, and chatbot integration. This enhancement transforms basic task management into a prioritization-aware productivity system, enabling users to focus on high-impact work.

**Technical Approach**: Extend existing Task model with priority field (CHECK constraint), create reusable PriorityBadge and PrioritySelector UI components, add priority filtering to dashboard with URL state persistence, integrate priority extraction into chatbot's intent parser, and add Priority Distribution chart to analytics dashboard.

## Technical Context

**Language/Version**:
- Frontend: JavaScript (Next.js 14.0.4, React 18.2.0)
- Backend: Python 3.10+ (FastAPI 0.115.5, SQLModel 0.0.27)

**Primary Dependencies**:
- Frontend: Next.js, React, Tailwind CSS, Recharts 2.10.3
- Backend: FastAPI, SQLModel, Alembic 1.17.1, PostgreSQL driver
- Database: PostgreSQL (Neon hosted)

**Storage**: PostgreSQL with SQLModel ORM, Alembic migrations

**Testing**:
- Frontend: Manual testing (automated tests deferred to Phase 11 per CLAUDE.md)
- Backend: Manual API testing via curl/Postman

**Target Platform**: Web application (desktop + mobile responsive)

**Project Type**: Web (frontend + backend)

**Performance Goals**:
- Priority filtering: < 500ms dashboard update (SC-003)
- Priority queries: < 500ms with 10k tasks per user (SC-008)
- UI updates: < 2 seconds for priority changes across all views (SC-007)

**Constraints**:
- Zero data loss during migration (SC-009)
- Backward compatibility with existing tasks (FR-004)
- No refactoring of existing business logic (Constitution Principle I)
- Accessibility: color + icon for colorblind users (FR-008, SC-010)

**Scale/Scope**:
- Add 1 database column + 1 index
- Create 2 new frontend components (PrioritySelector, PriorityBadge)
- Update 5 existing components (TodoForm, TaskTable, Dashboard, DashboardKPIs, TaskCharts)
- Modify 3 backend MCP tools (add_task, update_task, list_tasks)
- Add 1 new dashboard chart (Priority Distribution)
- Update chatbot intent parser for priority extraction

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Preservation Over Rewriting ✅ PASS
- **Status**: COMPLIANT
- **Justification**: Feature is purely additive. Existing task CRUD logic remains untouched. Only extending Task model schema and adding new UI components. No removal of existing functionality.

### Principle II: Spec-Driven Development ✅ PASS
- **Status**: COMPLIANT
- **Justification**: Following SDD workflow: Spec (complete) → Plan (this document) → Tasks → Implementation. PHR created for spec phase.

### Principle III: Human-in-the-Loop ✅ PASS
- **Status**: COMPLIANT
- **Justification**: Specification had zero [NEEDS CLARIFICATION] markers. All design decisions based on reference implementation analysis and industry standards. No assumptions requiring user confirmation.

### Principle IV: Type Safety & Code Quality ✅ PASS
- **Status**: COMPLIANT
- **Implementation**:
  - Frontend: PropTypes for PrioritySelector, PriorityBadge components
  - Backend: Type hints for priority parameter in MCP tools, Pydantic validation
  - Database: CHECK constraint ensures priority ∈ {low, medium, high, urgent}

### Principle V: Security & Production Readiness ✅ PASS
- **Status**: COMPLIANT
- **Security Measures**:
  - Priority value validated server-side (FR-024: reject invalid with 422)
  - No new authentication surface area
  - Input validation via Pydantic models
  - Database constraint prevents invalid data

### Principle VI: Accessibility & UX ✅ PASS
- **Status**: COMPLIANT
- **Accessibility Features**:
  - FR-008: Priority badges include BOTH color AND icon
  - SC-010: Tested with colorblind users
  - Keyboard navigation for priority selector (dropdown)
  - ARIA labels for screen readers

**Re-evaluation Post-Design**: (To be completed after Phase 1)

## Project Structure

### Documentation (this feature)

```text
specs/001-task-priority-system/
├── spec.md                      # Feature specification
├── plan.md                      # This file (implementation plan)
├── research.md                  # Phase 0: Technology research
├── data-model.md                # Phase 1: Database schema design
├── quickstart.md                # Phase 1: Developer guide
├── contracts/                   # Phase 1: API contracts
│   ├── openapi-priority.yaml    # Priority-related endpoint specs
│   └── priority-schemas.json    # Pydantic/PropTypes schemas
├── checklists/
│   └── requirements.md          # Spec quality validation
└── tasks.md                     # Phase 2: Implementation tasks (from /sp.tasks)
```

### Source Code (repository root)

```text
# Web application structure (frontend + backend)

backend/
├── src/
│   ├── models/
│   │   └── task.py                    # MODIFY: Add priority field
│   ├── api/
│   │   └── task_routes.py             # MODIFY: Add priority query param
│   ├── mcp/tools/
│   │   ├── add_task.py                # MODIFY: Accept priority param
│   │   ├── update_task.py             # MODIFY: Accept priority param
│   │   └── list_tasks.py              # MODIFY: Filter by priority
│   └── agents/
│       └── intent_parser.py           # MODIFY: Extract priority keywords
└── migrations/versions/
    └── 004_add_task_priority.py       # NEW: Migration script

frontend/
├── app/
│   ├── todos/
│   │   ├── page.js                    # MODIFY: Pass priority to form
│   │   ├── new/page.js                # MODIFY: Add priority selector
│   │   └── [id]/page.js               # MODIFY: Add priority selector
│   └── dashboard/
│       └── page.js                    # MODIFY: Add priority filter, pass to children
├── components/
│   ├── ui/
│   │   ├── PrioritySelector.js        # NEW: Priority dropdown component
│   │   └── PriorityBadge.js           # NEW: Priority display badge
│   ├── dashboard/
│   │   ├── DashboardKPIs.js           # MODIFY: Add priority metrics
│   │   ├── TaskCharts.js              # MODIFY: Add Priority Distribution chart
│   │   ├── PriorityDistributionChart.js # NEW: Donut chart for priorities
│   │   ├── TaskTable.js               # MODIFY: Display priority badges, add filter
│   │   └── TaskTableRow.js            # MODIFY: Render PriorityBadge
│   ├── TodoForm.js                    # MODIFY: Add PrioritySelector
│   └── TodoFilters.js                 # MODIFY: Add priority filter dropdown
└── lib/
    ├── analytics.js                   # MODIFY: Add priority distribution calculation
    └── constants/
        └── priorities.js              # NEW: Priority constants (colors, icons, labels)
```

**Structure Decision**: Using existing web application structure (frontend + backend). No new directories required at root level. Feature fits naturally into current component organization. New components follow established patterns (ui/ for primitives, dashboard/ for analytics, mcp/tools/ for backend operations).

## Complexity Tracking

> No constitution violations - this section intentionally left empty.

All complexity is justified by functional requirements and stays within constitutional bounds. No additional abstraction layers, patterns, or projects needed beyond what already exists.

---

## Phase 0: Research & Technology Decisions

### Research Tasks

Based on Technical Context, these items require investigation to inform design:

1. **Priority Badge Icon Selection**
   - **Question**: Which icons best represent low/medium/high/urgent priorities for universal understanding?
   - **Options**: Flame/alert/circle hierarchy vs numeric indicators vs traffic light metaphor
   - **Decision Target**: Icon choices for FR-008

2. **Priority Filter UX Pattern**
   - **Question**: Should priority filter be dropdown, chips, or sidebar checkboxes?
   - **Options**: Single-select dropdown vs multi-select chips vs filter panel
   - **Decision Target**: Dashboard filter implementation (FR-011)

3. **Chatbot Priority Extraction Strategy**
   - **Question**: Which NLP keywords most reliably indicate priority levels?
   - **Options**: Rule-based keywords vs LLM-based extraction vs hybrid approach
   - **Decision Target**: Intent parser enhancement (FR-025)

4. **Database Migration Safety**
   - **Question**: How to add priority column to existing tasks table with zero downtime?
   - **Options**: ALTER TABLE with default vs blue-green deployment vs feature flag
   - **Decision Target**: Migration strategy for FR-004

### Research Output

See [research.md](research.md) for detailed findings, decisions, and rationale.

---

## Phase 1: Design & Contracts

### Prerequisites
- `research.md` complete with all decisions documented
- Constitution Check passed (✅ above)

### 1.1 Data Model Design

**Output**: [data-model.md](data-model.md)

**Contents**:
- Task entity updates (priority field specification)
- Database schema changes (column type, constraint, index)
- Migration strategy (backward compatibility approach)
- Validation rules (CHECK constraint, Pydantic schema)

### 1.2 API Contract Generation

**Output**: `contracts/openapi-priority.yaml`, `contracts/priority-schemas.json`

**Endpoints to Update**:
- `POST /api/{user_id}/tasks` - Add optional `priority` field
- `PUT /api/{user_id}/tasks/{task_id}` - Add optional `priority` field
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Preserve priority on toggle
- `GET /api/{user_id}/tasks` - Add optional `priority` query parameter

**New Schemas**:
- `PriorityEnum`: {low, medium, high, urgent}
- `TaskWithPriority`: Task schema with priority field
- `PriorityFilterRequest`: Query parameters for filtering

### 1.3 Component Contracts

**PrioritySelector Component**:
```javascript
PropTypes: {
  value: string,           // Current priority: 'low' | 'medium' | 'high' | 'urgent'
  onChange: func.isRequired, // (priority: string) => void
  disabled: bool,          // Optional, default false
  size: string,            // 'sm' | 'md' | 'lg', default 'md'
}
```

**PriorityBadge Component**:
```javascript
PropTypes: {
  priority: string.isRequired, // 'low' | 'medium' | 'high' | 'urgent'
  size: string,                // 'sm' | 'md' | 'lg', default 'md'
  showLabel: bool,             // Show text label, default true
  showIcon: bool,              // Show icon, default true
}
```

### 1.4 Developer Quickstart

**Output**: [quickstart.md](quickstart.md)

**Contents**:
- How to run database migration
- How to use PrioritySelector in forms
- How to display PriorityBadge in lists
- How to add priority filtering to views
- How to test priority integration with chatbot
- Common pitfalls and troubleshooting

### 1.5 Agent Context Update

**Action**: Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`

**Updates**:
- Add priority constants to Claude Code context
- Document priority filtering patterns
- Add MCP tool priority parameter usage examples

---

## Phase 2: Task Breakdown

**STOP**: This phase is handled by `/sp.tasks` command, NOT `/sp.plan`.

The implementation plan ends here. Next command: `/sp.tasks specs/001-task-priority-system/spec.md`

---

## Architecture Decisions

### AD-001: Priority Storage Type

**Decision**: Use `VARCHAR(20)` with CHECK constraint instead of ENUM

**Rationale**:
- PostgreSQL ENUMs require ALTER TYPE for changes (risky in production)
- VARCHAR + CHECK provides same validation with easier evolution
- Aligns with existing task.status implementation pattern
- CHECK constraint prevents invalid data at database level

**Alternatives Considered**:
- ENUM type: Rejected due to migration complexity
- Integer + mapping table: Overkill for 4 fixed values
- No constraint: Rejected for data integrity

### AD-002: Default Priority Value

**Decision**: Default to 'medium' for all tasks (new and existing)

**Rationale**:
- Neutral middle ground - most tasks are neither urgent nor low priority
- Reference implementation uses 'medium' default
- FR-002 requires explicit default
- Minimizes user decisions during task creation

**Alternatives Considered**:
- No default (require selection): Increases friction
- Default to 'low': Doesn't match user mental model
- User-configurable default: Adds unnecessary complexity

### AD-003: Color Scheme for Priorities

**Decision**: Use traffic light + red scheme
- Low: Green (#10b981)
- Medium: Yellow (#f59e0b)
- High: Orange (#f97316)
- Urgent: Red (#ef4444)

**Rationale**:
- Universal color semantics (green = safe, red = danger)
- Matches reference implementation
- High contrast for accessibility
- Aligns with existing Tailwind brand colors

**Alternatives Considered**:
- Blue-based scheme: Less intuitive
- Grayscale: Lacks visual distinction
- Custom gradients: Overdesigned

### AD-004: Priority Filter Implementation

**Decision**: Single-select dropdown in dashboard header

**Rationale**:
- Consistent with existing status filter pattern
- Minimal UI footprint
- Mobile-friendly
- FR-011 specifies dropdown approach

**Alternatives Considered**:
- Multi-select chips: Allows combining priorities but adds complexity
- Sidebar filter panel: Too much screen real estate
- Inline table filters: Clutters task table

### AD-005: Chatbot Priority Extraction

**Decision**: Rule-based keyword matching in intent parser

**Rationale**:
- Simple, predictable, testable
- No additional LLM calls required
- Fast response time
- Covers 80%+ of cases per SC-006

**Keywords**:
- Urgent: "urgent", "asap", "critical", "emergency"
- High: "high priority", "important", "high"
- Medium: (default, no keywords)
- Low: "low priority", "low", "later", "someday"

**Alternatives Considered**:
- LLM-based extraction: Too slow, inconsistent
- Intent-specific models: Overkill for 4 categories

---

## Risk Analysis

### Migration Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Data loss during migration | CRITICAL | LOW | Use Alembic ALTER TABLE with DEFAULT. Test on staging DB first. Backup before migration. |
| Existing API clients break | HIGH | MEDIUM | Priority field is optional in all endpoints. Existing requests work unchanged. Version API if needed. |
| Performance degradation | MEDIUM | LOW | Add index on priority column. Query planner will use it for filters. Monitor p95 latency. |
| Invalid priority values | MEDIUM | LOW | CHECK constraint at DB level + Pydantic validation at API level. Double defense. |

### Integration Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Chatbot misunderstands priority | LOW | MEDIUM | Start with conservative keyword list. Log mismatches. Iterate based on user feedback. |
| Color blindness accessibility | MEDIUM | MEDIUM | FR-008 mandates icon + color. Test with color blindness simulators. Add pattern/shape if needed. |
| Dashboard performance with filters | MEDIUM | LOW | Frontend filtering (tasks already loaded). Backend pagination + indexing for large datasets. |
| Mobile UX for priority selector | LOW | LOW | Tailwind responsive classes. Test on mobile breakpoints. Dropdown works well on touch. |

---

## Success Metrics (from Spec)

Restating SC-001 through SC-010 for reference during implementation:

1. **SC-001**: Users can create task with any priority in < 10 seconds
2. **SC-002**: 100% accurate color-coded badges
3. **SC-003**: Filtering updates dashboard in < 500ms
4. **SC-004**: Charts update within 1 second
5. **SC-005**: 90% can identify priority at a glance
6. **SC-006**: Chatbot 80%+ accuracy on priority extraction
7. **SC-007**: Priority changes reflected across views in < 2 seconds
8. **SC-008**: Sub-500ms queries with 10k tasks
9. **SC-009**: Zero data loss during migration
10. **SC-010**: Works correctly for colorblind users

**Measurement Plan**:
- SC-001, SC-003, SC-004, SC-007, SC-008: Automated performance testing
- SC-002: Visual regression testing
- SC-005: User testing with 10+ participants
- SC-006: Chatbot message corpus analysis
- SC-009: Pre/post migration data audit
- SC-010: Accessibility audit with simulators + screen readers

---

## Dependencies

**Upstream** (must exist before implementation):
- ✅ Task CRUD endpoints operational
- ✅ Alembic migration system configured
- ✅ Recharts library integrated
- ✅ Chatbot MCP tool infrastructure
- ✅ Dashboard filtering infrastructure

**Downstream** (will be needed after this feature):
- None identified - feature is self-contained

**External**:
- None - no third-party services required

---

## Rollout Strategy

### Phase 1: Database Migration (P1 Story Prerequisites)
1. Create migration script (004_add_task_priority.py)
2. Test on local PostgreSQL instance
3. Backup production database
4. Run migration during low-traffic window
5. Verify: All existing tasks have priority='medium'
6. Verify: CHECK constraint active

### Phase 2: Backend API (P1 Stories)
1. Update Task model with priority field
2. Modify MCP tools (add_task, update_task, list_tasks)
3. Add priority validation in task_routes.py
4. Test: Create task with each priority level
5. Test: Filter tasks by priority
6. Test: Invalid priority rejected with 422

### Phase 3: Frontend Components (P1 Stories)
1. Create PrioritySelector component
2. Create PriorityBadge component
3. Create priorities.js constants file
4. Test: Selector renders all 4 options
5. Test: Badge displays correct color + icon

### Phase 4: UI Integration (P1 + P2 Stories)
1. Add PrioritySelector to TodoForm
2. Add PriorityBadge to TaskTable
3. Add priority filter to Dashboard
4. Update analytics.js for priority distribution
5. Test: End-to-end priority workflow

### Phase 5: Analytics (P3 Story)
1. Create PriorityDistributionChart component
2. Integrate into TaskCharts
3. Update DashboardKPIs for priority metrics
4. Test: Chart accuracy with various datasets

### Phase 6: Chatbot Integration (P3 Story)
1. Update intent_parser.py with priority keywords
2. Test priority extraction with sample messages
3. Verify default to 'medium' when no keyword
4. Log extraction accuracy

### Rollback Plan

If critical issues arise:
1. **Frontend**: Remove priority components, hide priority UI elements (data preserved)
2. **Backend**: Set priority to 'medium' for all operations (ignore parameter)
3. **Database**: Cannot rollback migration without data loss - prefer forward fixes

---

## Open Questions

None at this stage. All technical decisions made during research phase and documented in Architecture Decisions above.

---

## Appendix A: File Modification Checklist

**Backend Files to Modify** (6 files):
- [ ] `backend/src/models/task.py` - Add priority field
- [ ] `backend/src/api/task_routes.py` - Add priority filtering
- [ ] `backend/src/mcp/tools/add_task.py` - Accept priority param
- [ ] `backend/src/mcp/tools/update_task.py` - Accept priority param
- [ ] `backend/src/mcp/tools/list_tasks.py` - Filter by priority
- [ ] `backend/src/agents/intent_parser.py` - Extract priority keywords

**Frontend Files to Modify** (10 files):
- [ ] `frontend/components/TodoForm.js` - Add PrioritySelector
- [ ] `frontend/components/TodoFilters.js` - Add priority filter
- [ ] `frontend/components/dashboard/DashboardKPIs.js` - Priority metrics
- [ ] `frontend/components/dashboard/TaskCharts.js` - Add priority chart
- [ ] `frontend/components/dashboard/TaskTable.js` - Priority filter, badges
- [ ] `frontend/components/dashboard/TaskTableRow.js` - Render badge
- [ ] `frontend/app/todos/new/page.js` - Pass priority to form
- [ ] `frontend/app/todos/[id]/page.js` - Pass priority to form
- [ ] `frontend/app/dashboard/page.js` - Priority filter state
- [ ] `frontend/lib/analytics.js` - Priority distribution calc

**New Files to Create** (4 files):
- [ ] `frontend/components/ui/PrioritySelector.js`
- [ ] `frontend/components/ui/PriorityBadge.js`
- [ ] `frontend/components/dashboard/PriorityDistributionChart.js`
- [ ] `frontend/lib/constants/priorities.js`
- [ ] `backend/migrations/versions/004_add_task_priority.py`

**Total**: 20 files (16 modifications + 5 creations)

---

## Appendix B: Testing Checklist (from Spec)

Copy of acceptance scenarios for quick reference during implementation:

**P1 - Assign Priority**:
- [ ] Selecting "High" priority saves task with high priority
- [ ] Omitting priority defaults to "Medium"
- [ ] Priority dropdown shows all 4 options

**P1 - Visualize Priority**:
- [ ] Tasks display colored badges matching priority
- [ ] Urgent tasks show red badge with flame icon
- [ ] Low tasks show green badge with appropriate icon

**P2 - Filter by Priority**:
- [ ] Filtering to "Urgent" shows only urgent tasks
- [ ] Switching to "All" shows all tasks
- [ ] Dashboard charts reflect filtered subset

**P2 - Update Priority**:
- [ ] Editing task changes priority display immediately
- [ ] Dashboard analytics update after priority change

**P3 - View Analytics**:
- [ ] Priority distribution chart shows accurate counts
- [ ] Completing task updates priority analytics

**P3 - Chatbot Priority**:
- [ ] "add high priority task: X" creates high priority task
- [ ] "urgent: Y" recognizes urgent keyword
- [ ] No priority keyword defaults to medium

---

**END OF IMPLEMENTATION PLAN**

Next command: `/sp.tasks specs/001-task-priority-system/spec.md` to generate actionable task breakdown.
