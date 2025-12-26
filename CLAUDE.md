# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Phase-4: AI-Powered Todo Dashboard** - A full-stack web application featuring a Next.js 14 frontend with an analytics dashboard and a FastAPI backend with conversational AI capabilities.

**Current Status**: MVP dashboard released (v1.0.0-mvp) with 24/46 tasks complete. Core features (KPIs, charts, task management) are production-ready.

## Architecture

### Frontend (Next.js 14)
- **Location**: `frontend/`
- **Framework**: Next.js 14 with App Router (Pages: `/`, `/login`, `/todos`, `/todos/new`, `/todos/[id]`, `/dashboard`)
- **Styling**: Tailwind CSS with glassmorphism design system
- **Data Visualization**: Recharts 2.10.3 for dashboard charts
- **State**: React hooks (useState, useEffect, useMemo) - no Redux/Zustand
- **Auth**: Simplified JWT in localStorage (production should use Better Auth)

**Key Architecture Patterns**:
- **Container/Presentational**: Dashboard components split into containers (DashboardKPIs, TaskCharts, TaskTable) and presentational (KPICard, DonutChart, LineChart, BarChart, TaskTableRow)
- **Utility-First**: Centralized utilities in `lib/` (analytics.js for KPI calculations, date-helpers.js for date formatting, chart-utils.js for chart config)
- **API Client**: Single source in `lib/api.js` with JWT attachment and error handling (401 → auto-redirect to login)
- **Authentication Guard**: Dashboard page checks `isAuthenticated()` and redirects to `/login` before rendering

### Backend (FastAPI)
- **Location**: `backend/src/`
- **Entry Point**: `src/api/main.py` (run with `uvicorn src.api.main:app --reload` from `backend/` directory)
- **Database**: PostgreSQL via SQLModel ORM
- **Migrations**: Alembic (migrations in `backend/migrations/versions/`)
- **AI Integration**: Anthropic Claude API via orchestrator pattern in `src/agents/`

**Key Architecture Patterns**:
- **Agentic Architecture**: Multi-agent system with orchestrator, intent parser, language detector, and response synthesizer
- **MCP Tools**: Task operations exposed as Model Context Protocol tools in `src/mcp/tools/` (add_task, list_tasks, complete_task, update_task, delete_task)
- **Route Structure**:
  - Auth routes in `src/api/auth_routes.py`
  - Chat routes in `src/api/routes.py`
  - JWT verification in `src/api/dependencies.py`
- **Models**: SQLModel classes in `src/models/` (User, Task, Conversation, Message)

### Critical Integration Points

1. **JWT Authentication**: Frontend creates JWT tokens in `lib/auth.js` using shared secret (`JWT_SECRET_KEY` in backend `.env`, currently hardcoded in frontend for demo). Backend validates in `src/api/dependencies.py` using same secret.

2. **API Contracts**: All task CRUD operations follow pattern `/api/{user_id}/tasks` with JWT in `Authorization: Bearer <token>` header. Chat endpoint at `/api/{user_id}/chat` accepts `{ message: string }` and returns `{ response: string, conversation_id: string }`.

3. **Dashboard Data Flow**:
   - `DashboardPage` fetches tasks via `tasksAPI.list(userId)`
   - Passes tasks to `DashboardKPIs` (calculates metrics), `TaskCharts` (visualizes data), and `TaskTable` (displays with filters)
   - All CRUD operations (`handleToggleComplete`, `handleDelete`, `handleEdit`) call API then refresh via `fetchTasks()`

## Development Commands

### Frontend (from `frontend/` directory)

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

### Backend (from `backend/` directory)

**Important**: Backend entry point is `src/api/main.py` not `src/main.py`

```bash
# Create virtual environment (first time)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt  # NOTE: requirements.txt doesn't exist yet - dependencies managed manually

# Run development server
uvicorn src.api.main:app --reload --port 8000

# Run database migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"

# Validate database indexes (custom script)
python scripts/validate_db_indexes.py
```

### Environment Configuration

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend** (`backend/.env`):
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/phase4_db
OPENAI_API_KEY=your-key-here
OPENROUTER_API_KEY=your-key-here  # Optional
LLM_PROVIDER=openrouter  # or "openai"
LLM_MODEL=xiaomi/mimo-v2-flash:free
LLM_BASE_URL=https://openrouter.ai/api/v1
JWT_SECRET_KEY=your-secret-key-minimum-32-characters-long
JWT_ALGORITHM=HS256
API_HOST=0.0.0.0
API_PORT=8000
ENV=development
DEBUG=true
```

## Spec-Driven Development (SDD-RI)

This project follows **Spec-Driven Development with Reference Implementation**:

1. **Specification**: `specs/<feature>/spec.md` defines requirements and user stories
2. **Plan**: `specs/<feature>/plan.md` documents architecture decisions
3. **Tasks**: `specs/<feature>/tasks.md` breaks down implementation into testable tasks with acceptance criteria
4. **Implementation**: Execute tasks incrementally, creating code that matches specs
5. **Prompt History Records (PHRs)**: Document each session in `history/prompts/<feature>/`

### Current Feature: dashboard-enhancement

- **Spec**: `specs/dashboard-enhancement/spec.md`
- **Plan**: `specs/dashboard-enhancement/plan.md`
- **Tasks**: `specs/dashboard-enhancement/tasks.md` (24/46 complete)
- **PHRs**: `history/prompts/dashboard-enhancement/001-009`
- **Release Doc**: `DASHBOARD_MVP_RELEASE.md`

**Completed Phases (0-6)**:
- Phase 0: Project setup (dependencies, directory structure)
- Phase 1: Core utilities (analytics, date helpers, chart config)
- Phase 2: API integration (chat endpoint)
- Phase 3: Dashboard foundation (page with auth guard)
- Phase 4: KPI cards (4 metric cards)
- Phase 5: Charts (donut, line, bar)
- Phase 6: Task table (CRUD, filters, search, pagination)

**Remaining Phases (7-12)**: Chat widget, loading states, accessibility, performance, testing, deployment

## Code Conventions

### Frontend

**Component Structure**:
```javascript
'use client';  // Required for interactive components
import { useState, useEffect } from 'react';

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Event handlers
  const handleAction = () => { /* ... */ };

  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
}
```

**Naming Conventions**:
- Components: PascalCase (`DashboardKPIs`, `TaskTable`)
- Functions/variables: camelCase (`fetchTasks`, `handleToggleComplete`)
- Files: Match component name (`DashboardKPIs.js`)
- Utilities: kebab-case files (`date-helpers.js`), camelCase exports

**Tailwind Patterns**:
- Glass panels: `glass-panel rounded-xl p-6 border border-white/20`
- Buttons: `px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600`
- Responsive: `flex flex-col md:flex-row gap-4` (mobile-first)
- Brand colors: `brand-{200,300,400,500,600}` (teal palette)

### Backend

**File Structure**:
- Models: `src/models/model_name.py` (SQLModel classes with type hints)
- Routes: `src/api/routes.py` (FastAPI routers)
- Agents: `src/agents/agent_name.py` (AI orchestration logic)
- Tools: `src/mcp/tools/tool_name.py` (MCP tool implementations)

**Naming Conventions**:
- Classes: PascalCase (`Task`, `User`, `IntentParser`)
- Functions: snake_case (`get_user_by_id`, `parse_intent`)
- Constants: UPPER_SNAKE_CASE (`API_HOST`, `JWT_ALGORITHM`)
- Private: prefix with underscore (`_validate_token`)

**Type Hints**: Required for all function signatures
```python
def create_task(user_id: str, title: str, description: str | None = None) -> Task:
    """Create a new task for user."""
    ...
```

## Critical Constraints

### Preservation Over Rewriting (from constitution)
- **DO NOT** refactor existing business logic in `frontend/app/todos/` or backend task CRUD
- **DO NOT** remove features (only add/enhance)
- **DO** make smallest viable changes
- **DO** preserve existing patterns (don't introduce new state management libraries)

### Authentication
- Frontend currently uses **mock JWT creation** in `lib/auth.js` (client-side signing)
- **PRODUCTION TODO**: Replace with Better Auth for real authentication
- Backend validates JWTs using shared secret in `src/api/dependencies.py`
- User ID extracted from JWT `sub` claim

### CORS Configuration
- Backend allows `http://localhost:3000` in development (see `src/api/main.py`)
- **PRODUCTION TODO**: Update CORS origins via environment variable

### Database
- PostgreSQL required (no SQLite)
- Migrations managed by Alembic
- Connection string in `DATABASE_URL` environment variable
- Models use SQLModel (Pydantic + SQLAlchemy)

## Dashboard Implementation Details

### KPI Calculations (`frontend/lib/analytics.js`)
```javascript
calculateKPIs(tasks) => {
  totalTasks: tasks.length,
  completedTasks: tasks.filter(t => t.completed).length,
  pendingTasks: tasks.filter(t => !t.completed).length,
  overdueTasks: tasks.filter(t => !t.completed && olderThan7Days).length
}
```

### Chart Data Transformations
- **Donut Chart**: Status distribution (pending vs completed counts)
- **Line Chart**: 7-day activity trend (tasks created/completed per day)
- **Bar Chart**: Tasks by status breakdown

### Task Table Features
- **Search**: Filters by title/description (case-insensitive)
- **Status Filter**: Dropdown for all/pending/completed
- **Pagination**: 10 tasks per page with prev/next navigation
- **CRUD**: Inline toggle (checkbox), delete with confirmation, edit navigates to `/todos/[id]`

## Common Patterns

### Adding a New Dashboard Component

1. Create component in `frontend/components/dashboard/ComponentName.js`
2. Import and use in `frontend/app/dashboard/page.js`
3. Pass `tasks` prop from dashboard state
4. Use `glass-panel` and brand colors for consistency
5. Handle empty states gracefully
6. Add responsive classes (`sm:`, `md:`, `lg:`)

### Adding a New API Endpoint

1. Define route in `backend/src/api/routes.py` or create new router
2. Add authentication with `get_current_user` dependency
3. Validate input with Pydantic models
4. Implement business logic (call MCP tools if needed)
5. Return proper HTTP status codes (200, 201, 404, 422, 500)
6. Update `frontend/lib/api.js` with client method
7. Handle errors in frontend (try/catch, display to user)

### Creating a PHR

After significant work (implementation, planning, debugging):

1. Read template: `.specify/templates/phr-template.prompt.md`
2. Determine stage: spec, plan, tasks, green, misc, etc.
3. Route to correct directory:
   - Constitution work → `history/prompts/constitution/`
   - Feature work → `history/prompts/<feature-name>/`
   - General → `history/prompts/general/`
4. Increment ID (check existing PHRs for last number)
5. Fill ALL template fields (no placeholders)
6. Write to `<ID>-<slug>.<stage>.prompt.md`

## Known Issues & TODOs

1. **Backend Startup**: Entry point is `src/api/main.py` not `src/main.py`
2. **Requirements.txt**: Missing - dependencies installed manually
3. **Rate Limiting**: Disabled in `src/api/main.py` due to slowapi compatibility issue
4. **JWT Secret**: Hardcoded in `frontend/lib/auth.js` - should be in env var
5. **Better Auth**: Not implemented - using mock JWT creation client-side
6. **Chat Widget**: Deferred to Phase 7 (optional based on user feedback)
7. **Testing**: No automated tests yet - manual QA only (Phase 11 deferred)

## Testing

**Current Approach**: Manual verification only

**Testing Checklist** (from README):
- [ ] Login redirects to `/todos`
- [ ] Dashboard loads at `/dashboard` with auth guard
- [ ] KPI cards show correct metrics
- [ ] Charts render with data
- [ ] Task table CRUD operations work (create, toggle, edit, delete)
- [ ] Search filters tasks by title/description
- [ ] Status filter works (all/pending/completed)
- [ ] Pagination works with 10 tasks per page
- [ ] Responsive on mobile (< 768px), tablet (768-1024px), desktop (> 1024px)

**Future**: Add Jest (unit), React Testing Library (component), Playwright (E2E) in Phase 11

## Deployment

**Staging/Production Setup**:

1. Backend: Run with `gunicorn src.api.main:app -w 4 -k uvicorn.workers.UvicornWorker`
2. Frontend: Build with `npm run build`, serve with `npm start` or PM2
3. Nginx: Reverse proxy frontend (port 3000) and backend (port 8000)
4. SSL: Use Certbot for HTTPS certificates
5. Environment: Update `NEXT_PUBLIC_API_URL` and CORS origins

See `DASHBOARD_MVP_RELEASE.md` for complete deployment instructions.

## Support & Documentation

- **Release Notes**: `DASHBOARD_MVP_RELEASE.md` (v1.0.0-mvp details)
- **Constitution**: `.specify/memory/constitution.md` (development principles)
- **Spec Files**: `specs/dashboard-enhancement/` (requirements, architecture, tasks)
- **PHR History**: `history/prompts/dashboard-enhancement/` (implementation journal)
- **Frontend README**: `frontend/README.md` (setup, structure, API usage)
