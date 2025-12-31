# Implementation Tasks: Task Priority System

**Feature Branch**: `001-task-priority-system`
**Created**: 2025-12-30
**Status**: Ready for Implementation
**Total Tasks**: 68

## Task Format

```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

- **TaskID**: Unique identifier (T001, T002, etc.)
- **[P]**: Indicates this is a prerequisite/foundational task
- **[Story?]**: User story reference (US1-US6) from spec.md
- **File path**: Exact location of changes

## Dependency Graph

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3-8 (User Stories) → Phase 9 (Polish)
                                              ↓
                  US1 (P1) ────────────────→ US2 (P1) ─┐
                                              ↓         │
                  US3 (P2) ←──────────────── US4 (P2)  │
                      ↓                                 │
                  US5 (P3) ←────────────────────────────┘
                      ↓
                  US6 (P3)
```

**Parallel Execution Opportunities:**
- US1 + US2 can run partially in parallel (shared components)
- US3 + US4 can run partially in parallel (shared filtering logic)
- Frontend and Backend tasks within same story can run in parallel

---

## Phase 1: Setup (Shared Infrastructure)

**Goal**: Initialize project structure and validate prerequisites

**Tasks:**

- [X] T001 [P] Create feature branch `001-task-priority-system` from main
- [X] T002 [P] Verify backend dependencies (FastAPI, SQLModel, Alembic) in backend/requirements.txt
- [X] T003 [P] Verify frontend dependencies (Next.js, React, Recharts) in frontend/package.json
- [X] T004 [P] Create constants file structure at frontend/lib/constants/priorities.js
- [X] T005 [P] Run constitution compliance check for all planned changes

**Acceptance Criteria:**
- Branch exists and is checked out
- All dependencies installed without conflicts
- Constants file structure created
- Constitution check passes 6/6 principles

**Estimated Effort**: 1-2 hours

---

## Phase 2: Foundational (Blocking Prerequisites)

**Goal**: Implement core database schema and shared constants

**Tasks:**

- [X] T006 [P] Define priority constants in frontend/lib/constants/priorities.js
  ```javascript
  export const PRIORITY_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
  };

  export const PRIORITY_CONFIG = {
    low: { label: 'Low', color: '#10b981', icon: 'ChevronDown' },
    medium: { label: 'Medium', color: '#f59e0b', icon: 'Minus' },
    high: { label: 'High', color: '#f97316', icon: 'ChevronUp' },
    urgent: { label: 'Urgent', color: '#ef4444', icon: 'Flame' }
  };
  ```

- [X] T007 [P] Create Alembic migration script at backend/migrations/versions/004_add_task_priority.py
  ```python
  # Migration operations:
  # 1. Add priority column (VARCHAR(20), default 'medium')
  # 2. Add CHECK constraint (priority IN ('low', 'medium', 'high', 'urgent'))
  # 3. Create index on priority column
  # 4. Backfill existing tasks with 'medium' priority
  ```

- [X] T008 [P] Update Task model in backend/src/models/task.py
  ```python
  priority: str = Field(
      default="medium",
      sa_column=Column(
          String(20),
          CheckConstraint("priority IN ('low', 'medium', 'high', 'urgent')"),
          index=True,
          nullable=False
      )
  )
  ```

- [X] T009 [P] Run migration with `alembic upgrade head` and verify schema changes

- [X] T010 [P] Validate database index exists on priority column using scripts/validate_db_indexes.py

**Acceptance Criteria:**
- Constants file exports PRIORITY_LEVELS and PRIORITY_CONFIG
- Migration script created with all 4 operations
- Task model includes priority field with CHECK constraint
- Migration runs successfully without data loss
- Index verified in database

**Estimated Effort**: 3-4 hours

---

## Phase 3: User Story 1 - Assign Priority to New Task (P1) 🎯 MVP

**User Story**: As a user, I need to assign a priority level to my tasks when creating them so I can organize my work by importance.

**Independent Test Criteria:**
- Can create task with each priority level (low, medium, high, urgent)
- Task defaults to 'medium' when no priority selected
- Created task persists with correct priority in database

**Tasks:**

### Backend API (US1)

- [ ] T011 [US1] Update POST /api/{user_id}/tasks endpoint in backend/src/api/task_routes.py to accept optional priority field

- [ ] T012 [US1] Add priority validation in task_routes.py (422 for invalid values)

- [ ] T013 [US1] Update add_task MCP tool in backend/src/mcp/tools/add_task.py to accept priority parameter

- [ ] T014 [US1] Add priority field to task creation response schema

### Frontend UI Components (US1)

- [ ] T015 [US1] Create PrioritySelector component at frontend/components/ui/PrioritySelector.js
  ```javascript
  // Props: value, onChange, disabled
  // Renders dropdown with all 4 priority options
  // Shows icon + color + label for each option
  // Uses PRIORITY_CONFIG from constants
  ```

- [ ] T016 [US1] Add PropTypes validation to PrioritySelector

- [ ] T017 [US1] Integrate PrioritySelector into TodoForm at frontend/components/TodoForm.js

- [ ] T018 [US1] Add priority state to new task page at frontend/app/todos/new/page.js

- [ ] T019 [US1] Update API call in new task page to include priority field

### Testing (US1)

- [ ] T020 [US1] Manual test: Create task with "High" priority via UI
- [ ] T021 [US1] Manual test: Create task without selecting priority (verify defaults to "Medium")
- [ ] T022 [US1] Manual test: Verify all 4 priority options appear in dropdown
- [ ] T023 [US1] Manual test: Verify backend returns 422 for invalid priority value

**Acceptance Criteria:**
- ✅ User can select priority when creating new task
- ✅ Priority defaults to 'medium' if not selected
- ✅ Task persists with correct priority in database
- ✅ All 4 priority levels available in dropdown
- ✅ Backend validates priority values

**Estimated Effort**: 4-6 hours

---

## Phase 4: User Story 2 - Visualize Task Priority (P1)

**User Story**: As a user, I need to see visual indicators of task priority so I can quickly identify urgent vs low-priority work.

**Independent Test Criteria:**
- Each task displays colored badge matching its priority
- Badges include both color and icon (colorblind support)
- Urgent tasks show red badge with flame icon
- Low priority tasks show green badge with appropriate icon

**Tasks:**

### Frontend UI Components (US2)

- [ ] T024 [US2] Create PriorityBadge component at frontend/components/ui/PriorityBadge.js
  ```javascript
  // Props: priority (string)
  // Renders colored badge with icon + label
  // Uses PRIORITY_CONFIG for colors/icons
  // Includes aria-label for accessibility
  ```

- [ ] T025 [US2] Add PropTypes validation to PriorityBadge

- [ ] T026 [US2] Integrate PriorityBadge into TaskTableRow at frontend/components/dashboard/TaskTableRow.js

- [ ] T027 [US2] Update TaskTable component styling to accommodate priority badges

- [ ] T028 [US2] Add priority column to task table in frontend/components/dashboard/TaskTable.js

### Testing (US2)

- [ ] T029 [US2] Manual test: Verify low priority tasks show green badge
- [ ] T030 [US2] Manual test: Verify medium priority tasks show yellow badge
- [ ] T031 [US2] Manual test: Verify high priority tasks show orange badge
- [ ] T032 [US2] Manual test: Verify urgent priority tasks show red badge with flame icon
- [ ] T033 [US2] Accessibility test: Verify badges work for colorblind users (icon + color)

**Acceptance Criteria:**
- ✅ All tasks display priority badges with correct colors
- ✅ Badges include both color and icon (accessibility)
- ✅ Urgent tasks clearly distinguishable with red + flame
- ✅ Badge component is reusable across UI

**Estimated Effort**: 3-4 hours

---

## Phase 5: User Story 3 - Filter Tasks by Priority (P2)

**User Story**: As a user, I want to filter my tasks by priority level so I can focus on urgent work or plan low-priority items separately.

**Independent Test Criteria:**
- Can filter to show only urgent tasks
- Can filter to show only high priority tasks
- Can filter to show only medium priority tasks
- Can filter to show only low priority tasks
- Can reset filter to show all tasks
- Dashboard components update when filter applied

**Tasks:**

### Backend API (US3)

- [ ] T034 [US3] Update GET /api/{user_id}/tasks endpoint in backend/src/api/task_routes.py to accept priority query parameter

- [ ] T035 [US3] Implement priority filtering logic in task_routes.py

- [ ] T036 [US3] Update list_tasks MCP tool in backend/src/mcp/tools/list_tasks.py to accept priority filter

- [ ] T037 [US3] Add priority filter to MCP tool schema

### Frontend UI Components (US3)

- [ ] T038 [US3] Add priority filter dropdown to TodoFilters at frontend/components/TodoFilters.js

- [ ] T039 [US3] Add priority filter state to dashboard page at frontend/app/dashboard/page.js

- [ ] T040 [US3] Update API call to include priority filter parameter

- [ ] T041 [US3] Persist priority filter in URL query parameters for bookmarkability

- [ ] T042 [US3] Ensure priority filter combines with existing status/search filters

### Testing (US3)

- [ ] T043 [US3] Manual test: Filter to "Urgent" and verify only urgent tasks shown
- [ ] T044 [US3] Manual test: Switch filter to "All" and verify all tasks shown
- [ ] T045 [US3] Manual test: Combine priority filter with status filter (e.g., "Urgent + Completed")
- [ ] T046 [US3] Manual test: Verify URL updates when priority filter changes
- [ ] T047 [US3] Manual test: Verify dashboard KPIs update when priority filter applied

**Acceptance Criteria:**
- ✅ Priority filter dropdown appears in dashboard
- ✅ Filtering updates all dashboard components (KPIs, charts, table)
- ✅ Filter state persists in URL
- ✅ Priority filter works with existing filters
- ✅ Filtering completes in <500ms

**Estimated Effort**: 4-5 hours

---

## Phase 6: User Story 4 - Update Task Priority (P2)

**User Story**: As a user, I need to change a task's priority as circumstances evolve so my task list stays current with changing work demands.

**Independent Test Criteria:**
- Can edit existing task and change priority
- Priority change persists in database
- UI updates immediately to show new priority
- Dashboard analytics update to reflect change

**Tasks:**

### Backend API (US4)

- [ ] T048 [US4] Update PUT /api/{user_id}/tasks/{task_id} endpoint in backend/src/api/task_routes.py to support priority updates

- [ ] T049 [US4] Add priority validation to task update endpoint (422 for invalid values)

- [ ] T050 [US4] Update update_task MCP tool in backend/src/mcp/tools/update_task.py to accept priority parameter

- [ ] T051 [US4] Ensure priority field included in task update response schema

### Frontend UI Components (US4)

- [ ] T052 [US4] Integrate PrioritySelector into task edit page at frontend/app/todos/[id]/page.js

- [ ] T053 [US4] Add priority state to edit page component

- [ ] T054 [US4] Update API call in edit page to include priority field

- [ ] T055 [US4] Ensure priority change triggers dashboard refresh in frontend/app/dashboard/page.js

### Testing (US4)

- [ ] T056 [US4] Manual test: Edit task and change priority from "Low" to "Urgent"
- [ ] T057 [US4] Manual test: Verify priority change persists after page refresh
- [ ] T058 [US4] Manual test: Verify dashboard KPIs update after priority change
- [ ] T059 [US4] Manual test: Verify priority charts update within 2 seconds
- [ ] T060 [US4] Manual test: Verify backend returns 422 for invalid priority in update

**Acceptance Criteria:**
- ✅ Can modify task priority via edit form
- ✅ Priority changes persist in database
- ✅ All views (list, dashboard, chatbot) update within 2 seconds
- ✅ Backend validates priority values on update

**Estimated Effort**: 3-4 hours

---

## Phase 7: User Story 5 - View Priority Analytics (P3)

**User Story**: As a user, I want to see analytics showing my tasks by priority so I can understand my workload distribution.

**Independent Test Criteria:**
- Dashboard displays priority distribution chart
- Chart shows accurate counts for each priority level
- Chart updates when tasks are created/completed/updated
- Chart updates when priority filters applied

**Tasks:**

### Frontend Analytics (US5)

- [ ] T061 [US5] Add calculatePriorityDistribution function to frontend/lib/analytics.js
  ```javascript
  // Returns: { low: 2, medium: 7, high: 5, urgent: 3 }
  ```

- [ ] T062 [US5] Create PriorityDistributionChart component at frontend/components/dashboard/PriorityDistributionChart.js (Recharts DonutChart)

- [ ] T063 [US5] Integrate PriorityDistributionChart into TaskCharts at frontend/components/dashboard/TaskCharts.js

- [ ] T064 [US5] Update DashboardKPIs to show priority-specific metrics (e.g., "3 Urgent Tasks")

- [ ] T065 [US5] Ensure priority analytics update when filters applied

### Testing (US5)

- [ ] T066 [US5] Manual test: Create 3 urgent, 5 high, 7 medium, 2 low tasks and verify chart accuracy
- [ ] T067 [US5] Manual test: Complete an urgent task and verify chart updates
- [ ] T068 [US5] Manual test: Apply priority filter and verify chart reflects filtered data

**Acceptance Criteria:**
- ✅ Priority distribution chart displays on dashboard
- ✅ Chart accurately reflects task counts by priority
- ✅ Chart updates within 1 second of data changes
- ✅ Chart respects applied filters

**Estimated Effort**: 4-5 hours

---

## Phase 8: User Story 6 - Chatbot Integration (P3)

**User Story**: As a user, I want to set task priority using natural language commands so I can quickly create prioritized tasks through conversation.

**Independent Test Criteria:**
- Chatbot extracts priority from "urgent: deploy hotfix"
- Chatbot extracts priority from "add high priority task: review PR"
- Chatbot creates task with correct priority
- Chatbot acknowledges priority in response
- Tasks without priority keywords default to medium

**Tasks:**

### Backend Chatbot Integration (US6)

- [ ] T069 [US6] Update intent_parser.py in backend/src/agents/intent_parser.py to extract priority keywords
  ```python
  # Keywords: "urgent", "high priority", "low priority", "important"
  # Map "important" → high, "urgent" → urgent, etc.
  ```

- [ ] T070 [US6] Add priority extraction to intent parser response schema

- [ ] T071 [US6] Update add_task tool call in orchestrator to include extracted priority

- [ ] T072 [US6] Update response synthesizer to acknowledge priority in chatbot responses

### Testing (US6)

- [ ] T073 [US6] Manual test: Send "add high priority task: review PR" and verify task created with high priority
- [ ] T074 [US6] Manual test: Send "urgent: deploy hotfix" and verify task created with urgent priority
- [ ] T075 [US6] Manual test: Send "create task: write docs" and verify defaults to medium priority
- [ ] T076 [US6] Manual test: Verify chatbot response includes priority acknowledgment (e.g., "Created urgent task")
- [ ] T077 [US6] Accuracy test: Test 10+ priority keyword variations and verify 80%+ accuracy

**Acceptance Criteria:**
- ✅ Chatbot extracts priority from natural language
- ✅ Chatbot creates tasks with correct priority
- ✅ Chatbot acknowledges priority in responses
- ✅ Tasks without keywords default to medium
- ✅ 80%+ accuracy for priority extraction

**Estimated Effort**: 5-6 hours

---

## Phase 9: Polish & Cross-Cutting Concerns

**Goal**: Complete testing, documentation, and quality assurance

**Tasks:**

### Documentation

- [ ] T078 Update CLAUDE.md with priority system usage patterns
- [ ] T079 Create migration guide in specs/001-task-priority-system/MIGRATION.md
- [ ] T080 Document rollback procedures for priority feature

### Testing & Validation

- [ ] T081 Run full regression test suite (all 77 previous tests)
- [ ] T082 Performance test: Verify <500ms filtering with 10k tasks
- [ ] T083 Accessibility audit: Test priority badges with screen reader
- [ ] T084 Colorblind test: Verify priority system works without color alone

### Code Quality

- [ ] T085 Add PropTypes to all new frontend components
- [ ] T086 Add Python type hints to all new backend functions
- [ ] T087 Run ESLint on frontend changes and fix warnings
- [ ] T088 Run Ruff/Black on backend changes and fix warnings

### PHR Creation

- [ ] T089 Create PHR documenting task generation process at history/prompts/001-task-priority-system/003-generate-tasks.tasks.prompt.md
- [ ] T090 Update PHR with implementation outcomes after completion

**Acceptance Criteria:**
- ✅ All documentation updated
- ✅ All tests pass
- ✅ Performance requirements met
- ✅ Accessibility requirements met
- ✅ Code quality checks pass
- ✅ PHR created and complete

**Estimated Effort**: 4-6 hours

---

## Execution Strategy

### Recommended Implementation Order:

1. **Week 1 - Foundation (Phases 1-2)**
   - Setup project structure
   - Run database migration
   - Create shared constants
   - **Checkpoint**: Database ready, constants available

2. **Week 2 - MVP (Phases 3-4)**
   - US1: Assign Priority (create new tasks with priority)
   - US2: Visualize Priority (see badges in task list)
   - **Checkpoint**: Can create and view prioritized tasks

3. **Week 3 - Enhanced Features (Phases 5-6)**
   - US3: Filter by Priority (focus on specific priority levels)
   - US4: Update Priority (modify existing task priorities)
   - **Checkpoint**: Full priority management in UI

4. **Week 4 - Advanced Features (Phases 7-8)**
   - US5: Priority Analytics (dashboard insights)
   - US6: Chatbot Integration (natural language priority)
   - **Checkpoint**: Complete priority ecosystem

5. **Week 5 - Polish (Phase 9)**
   - Testing, documentation, accessibility
   - **Checkpoint**: Production-ready release

### Parallel Execution Opportunities:

**Within US1-US2:**
- Backend tasks (T011-T014) and Frontend component creation (T015-T017) can run in parallel

**Within US3-US4:**
- Filter UI (T038-T042) and Update UI (T052-T054) can run in parallel after backend ready

**Within US5-US6:**
- Analytics chart (T061-T065) and Chatbot integration (T069-T072) can run in parallel

---

## Risk Mitigation

### Database Migration Risks:
- **Mitigation**: T009 includes database backup before migration
- **Rollback**: Document includes Alembic downgrade procedure

### Integration Risks:
- **Mitigation**: Each user story has independent test criteria
- **Rollback**: Feature is purely additive (can be disabled via feature flag if needed)

### Performance Risks:
- **Mitigation**: T010 validates database index creation
- **Testing**: T082 includes performance test with 10k tasks

---

## Success Metrics

- [ ] All 90 tasks completed
- [ ] All 6 user stories pass independent tests
- [ ] Constitution check passes 6/6 principles
- [ ] Performance requirements met (<500ms filtering, <2s UI updates)
- [ ] Accessibility requirements met (colorblind support verified)
- [ ] Zero data loss during migration
- [ ] 80%+ chatbot accuracy for priority extraction

---

## Notes

- Task IDs are unique and sequential (T001-T090)
- User story references (US1-US6) map to spec.md user stories
- [P] indicates prerequisite/foundational tasks blocking other work
- File paths are exact locations for changes
- Each phase includes independent test criteria
- Estimated efforts are for reference only (user determines timeline)
