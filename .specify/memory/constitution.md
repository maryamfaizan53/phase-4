<!--
SYNC IMPACT REPORT
Version Change: 1.0.0 → 1.1.0
Date: 2025-12-25
Change Type: MINOR (new section added)

Modified Sections:
- Added: "Agent Model" section with 4 specialized agents + orchestrator

Principles Modified:
- None (all 6 core principles unchanged)

Added Sections:
- Agent Model (defines multi-agent architecture)
  - AGENT 1: UI/UX Agent
  - AGENT 2: Frontend Integration Agent
  - AGENT 3: Chat Experience Agent
  - AGENT 4: QA & Validation Agent
  - ORCHESTRATOR: Claude Code

Removed Sections:
- None

Templates Requiring Updates:
- ✅ No template updates required (architecture documentation only)

Follow-up TODOs:
- None

Rationale for MINOR version bump:
New "Agent Model" section materially expands governance by defining
specialized agent responsibilities and scope boundaries. This is an
additive change that doesn't modify existing principles but adds
significant new guidance for multi-agent workflows.
-->

# Phase-4 AI-Powered Todo Dashboard Constitution

## Core Principles

### I. Preservation Over Rewriting
**Immutability Rule:** Existing frontend and backend business logic MUST NOT be rewritten or simplified.
- Enhancement Only: Changes LIMITED to UI/UX improvements, dashboard layout, visual components, and chat integration
- No Functionality Removal: Business features must remain intact; only additive changes allowed
- Smallest Viable Diff: Make minimal changes necessary to achieve the goal

### II. Spec-Driven Development (SDD)
**Mandatory Flow:** Specification → Plan → Tasks → Implementation
- Documentation First: All features must be specified before implementation
- Traceability: Every change must be traceable to a spec document
- PHR Requirement: Prompt History Records created for every significant interaction
- ADR Suggestions: Propose Architectural Decision Records for significant decisions (user consent required)

### III. Human-in-the-Loop (NON-NEGOTIABLE)
**User as Tool:** Invoke user for clarification when requirements are ambiguous
- No Assumptions: Never invent APIs, data structures, or contracts without confirmation
- Targeted Clarification: Ask 2-3 specific questions when uncertain
- Decision Transparency: Present options with tradeoffs for architectural decisions
- Completion Checkpoints: Summarize what was done and confirm next steps

### IV. Type Safety & Code Quality
**Type Safety Enforced:** TypeScript strict mode and Python type hints required
- Frontend: PascalCase for components, camelCase for functions, explicit prop interfaces
- Backend: PEP 8 compliance, type hints for all functions, docstrings for public APIs
- No `any` Types: Use proper types or `unknown` with type guards
- Testing Required: 70% minimum coverage for critical paths

### V. Security & Production Readiness
**Security First:** No hardcoded secrets; use environment variables
- AuthN/AuthZ: JWT-based authentication with Better Auth
- Input Validation: Validate all user inputs at API boundaries
- Error Handling: Explicit error paths and graceful degradation
- Performance Budgets: p95 < 500ms for CRUD operations, < 3s initial load

### VI. Accessibility & UX
**WCAG 2.1 Level AA Compliance:** Minimum accessibility standard
- Keyboard Navigation: All interactions accessible via keyboard
- Screen Reader Support: Proper ARIA labels and roles
- Color Contrast: Minimum 4.5:1 for normal text
- Mobile First: Design for mobile, enhance for desktop
- Professional SaaS Look: Clean, modern card-based layouts

## Technology Stack

### Frontend
- **Framework:** Next.js 14+ with TypeScript (App Router)
- **Styling:** Tailwind CSS + shadcn/ui components
- **Authentication:** Better Auth with JWT tokens
- **State Management:** React Context API or Zustand
- **Language Support:** English (primary), Urdu (chatbot)
- **Voice Input:** Web Speech API

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL
- **ORM:** SQLModel (Pydantic + SQLAlchemy)
- **AI/LLM:** Anthropic Claude API
- **MCP Tools:** Custom task management tools (add, list, update, complete, delete)
- **Migrations:** Alembic

## Development Workflow

### Feature Development Process
1. **Specification:** Create `specs/<feature>/spec.md`
2. **Planning:** Generate `specs/<feature>/plan.md` with architecture decisions
3. **Task Breakdown:** Generate `specs/<feature>/tasks.md` with acceptance criteria
4. **Implementation:** Execute tasks incrementally
5. **Testing:** Write and run tests for each task
6. **Review:** Code review and approval
7. **Documentation:** Update relevant documentation
8. **PHR Creation:** Create Prompt History Record in appropriate directory

### Architectural Decision Records (ADR)
**Three-Part Test for ADR Significance:**
1. **Impact:** Long-term consequences? (framework, data model, API, security, platform)
2. **Alternatives:** Multiple viable options considered?
3. **Scope:** Cross-cutting and influences system design?

**If ALL true:** Suggest to user with format:
```
📋 Architectural decision detected: [brief-description]
   Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`
```
**User Consent Required:** Never auto-create ADRs; wait for approval.

### Prompt History Records (PHR)
**Mandatory Creation After:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

**Routing (all under `history/prompts/`):**
- Constitution → `history/prompts/constitution/`
- Feature stages → `history/prompts/<feature-name>/`
- General → `history/prompts/general/`

**Validation Requirements:**
- No unresolved placeholders
- Complete PROMPT_TEXT (not truncated)
- File exists at expected path
- All metadata fields filled

## Agent Model

The project uses a multi-agent architecture. Claude Code acts as the Orchestrator and delegates work to specialized agents with explicit skills.

### AGENT 1: UI/UX Agent

**Role:**
- Dashboard layout
- Component composition
- Visual hierarchy
- Accessibility

**Skills:**
- Next.js App Router
- Tailwind CSS
- Recharts
- Responsive Design
- UX patterns for SaaS dashboards

**Allowed Scope:**
- `frontend/app/dashboard/*`
- `frontend/components/dashboard/*`
- `frontend/components/ui/*`

### AGENT 2: Frontend Integration Agent

**Role:**
- Wire UI components to existing APIs
- Manage state updates
- Ensure chat → dashboard sync

**Skills:**
- REST API integration
- React hooks
- State synchronization
- Error handling

**Allowed Scope:**
- `frontend/lib/api.js`
- `frontend/hooks/*`
- `frontend/components/chat/*`

### AGENT 3: Chat Experience Agent

**Role:**
- Chat widget behavior
- Voice input
- Language handling (Urdu/English)

**Skills:**
- Conversational UI
- Web Speech API
- UX for chat systems
- Graceful degradation

**Allowed Scope:**
- `frontend/components/chat/*`
- `frontend/hooks/useVoiceInput.js`

### AGENT 4: QA & Validation Agent

**Role:**
- Use skills and agents from .claude\agents  .claude\skills
- Validate task outcomes
- Run acceptance checks
- Identify regressions

**Skills:**
- Manual QA
- Integration testing
- Lighthouse audits
- Accessibility validation

**Allowed Scope:**
- `specs/dashboard-enhancement/tasks.md` (validation only)
- Testing artifacts

### ORCHESTRATOR: Claude Code

**Responsibilities:**
- Enforce constitution
- Assign tasks to agents
- Merge outputs
- Maintain task order
- Stop after each task

## Non-Goals & Constraints

### Non-Goals
- No Real-Time Collaboration (single-user application)
- No Native Mobile App (web-first only)
- No Complex Workflows (simple task management focus)
- No Third-Party Integrations in Phase 1

### Constraints
- **Manual Coding Forbidden:** Human must not write code beyond repository assembly
- **No Business Logic Changes:** Existing functionality must remain intact
- **Budget Conscious:** Optimize API calls to minimize LLM costs
- **Browser Support:** Modern browsers only (last 2 versions)

## Governance

This constitution supersedes all other development practices. All changes must:
- Follow Spec-Driven Development workflow
- Create PHRs for significant interactions
- Suggest ADRs for architectural decisions (with user consent)
- Maintain type safety and code quality standards
- Preserve existing business logic
- Be testable and traceable to specs

**Amendments require:**
1. Clear rationale and documentation
2. Review by project stakeholders
3. Communication to all team members
4. Version history update

**Version**: 1.1.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-25
