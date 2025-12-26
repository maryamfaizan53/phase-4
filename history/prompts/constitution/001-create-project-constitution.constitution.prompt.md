---
id: 001
title: Create Project Constitution
stage: constitution
date: 2025-12-24
surface: agent
model: claude-sonnet-4-5
feature: none
branch: main
user: user
command: /sp.constitution
labels: ["constitution", "setup", "project-initialization", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - None (documentation artifact)
---

## Prompt

/sp.constitution

You are Claude Code acting as a Senior Product Engineer, UI/UX Architect, and Agentic DevOps Orchestrator.

ABSOLUTE RULES:
1. The existing frontend and backend logic MUST NOT be rewritten or simplified.
2. No business functionality may be removed or altered.
3. Enhancements are LIMITED to:
   - UI/UX improvements
   - Dashboard layout
   - Visual components (charts, cards, widgets)
   - Chat widget integration
4. Manual coding by the human is forbidden beyond repository assembly.
5. All changes must be incremental and traceable to specs.

PROJECT CONTEXT:
- Frontend: Phase-2 Todo App (Next.js + Tailwind)
- Backend: Phase-3 AI Chatbot with MCP tools
- Chatbot must manage tasks via chat, voice, and dashboard UI.

DESIGN PRINCIPLES:
- Professional SaaS dashboard look
- Accessible, responsive, and clean
- Modern card-based layout
- Embedded chat widget (floating or side panel)
- Charts and statistics must reflect real task data

LANGUAGE & FEATURES:
- English primary
- Urdu support in chatbot
- Voice input support where available

OUTPUT RULES:
- Follow Spec-Driven Development:
  Specification → Plan → Tasks → Implementation
- Explain reasoning briefly before implementation
- Generate production-ready code only

## Response snapshot

Constitution creation workflow executed successfully:

1. **Requirements Gathering (Interactive):**
   - Frontend Stack: Next.js 14+ with TypeScript (App Router)
   - Styling: Tailwind CSS + shadcn/ui components
   - Authentication: JWT with Better Auth
   - Database: PostgreSQL + SQLModel

2. **Constitution Document Created:**
   - Location: `.specify/memory/constitution.md`
   - Structure: 6 core principles + technology stack + development workflow + governance
   - Key principles established:
     - I. Preservation Over Rewriting (immutability rule)
     - II. Spec-Driven Development (mandatory flow)
     - III. Human-in-the-Loop (non-negotiable user involvement)
     - IV. Type Safety & Code Quality
     - V. Security & Production Readiness
     - VI. Accessibility & UX

3. **Technology Stack Documented:**
   - Frontend: Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui, Better Auth
   - Backend: FastAPI, PostgreSQL, SQLModel, Anthropic Claude API, Alembic
   - Testing: Jest/Vitest (frontend), pytest (backend)

4. **Development Workflow Defined:**
   - Feature development: Spec → Plan → Tasks → Implementation → Testing → Review → PHR
   - ADR process: Three-part test for significance + user consent required
   - PHR process: Mandatory creation with routing to appropriate directories

5. **Governance Rules Established:**
   - All changes follow SDD workflow
   - PHRs required for significant interactions
   - ADR suggestions for architectural decisions
   - Type safety and code quality enforced
   - Existing business logic preserved

## Outcome

- ✅ Impact: Project constitution successfully created and ratified (v1.0.0). Provides clear governance framework for Phase-4 development.
- 🧪 Tests: N/A (documentation artifact, no tests required)
- 📁 Files: Created `.specify/memory/constitution.md` (139 lines)
- 🔁 Next prompts: `/sp.specify <feature-name>` to create first feature specification following SDD workflow
- 🧠 Reflection: Constitution integrates CLAUDE.md rules with user-selected tech stack. Emphasizes preservation of existing logic while enabling UI/UX enhancements. Clear governance prevents scope creep and ensures all changes are traceable.

## Evaluation notes (flywheel)

- Failure modes observed: None. Constitution creation followed template and requirements.
- Graders run and results (PASS/FAIL): N/A (initial setup task)
- Prompt variant (if applicable): Standard constitution creation workflow
- Next experiment (smallest change to try): Test constitution adherence by creating first feature spec (dashboard enhancement or chat widget integration)
