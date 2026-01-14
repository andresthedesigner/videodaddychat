# Implementation Plan

Living document for tracking current work and next steps.

---

## Current Sprint

### Focus: Database Migration & AI Context Setup

**Goal**: Complete Convex migration foundation and establish AI agent context files.

---

## Task Status

### ✅ Completed
- [x] Research tech stack decisions (Convex, Clerk, Flowglad)
- [x] Document decisions in `docs/agents-research.md`
- [x] Create `AGENTS.md` with project overview
- [x] Create `CLAUDE.md` with Claude-specific context
- [x] Create `.copilot-instructions.md` for GitHub Copilot
- [x] Create `NOTES.md` for agentic memory
- [x] Create `spec.md` for requirements
- [x] Create `plan.md` (this file)
- [x] Create context directory structure
  - [x] `context/architecture.md`
  - [x] `context/conventions.md`
  - [x] `context/testing.md`
  - [x] `context/api.md`
  - [x] `context/database.md`
  - [x] `context/deployment.md`
- [x] Set up `.cursor/rules/` directory
  - [x] `001_core.mdc` (core workspace rules)
  - [x] `002_security.mdc` (security guidelines)
  - [x] `100_typescript.mdc` (TypeScript conventions)
  - [x] `101_react_nextjs.mdc` (React/Next.js patterns)
  - [x] `200_testing.mdc` (testing patterns)
  - [x] `201_api.mdc` (API patterns)
- [x] Configure `.claude/` directory
  - [x] `settings.json` (team permissions)
  - [x] `commands/analyze.md`
  - [x] `commands/refactor.md`
  - [x] `commands/review.md`
  - [x] `commands/test.md`
  - [x] `commands/security/scan.md`
- [x] Create nested CLAUDE.md files
  - [x] `app/CLAUDE.md`
  - [x] `app/api/CLAUDE.md`
  - [x] `app/auth/CLAUDE.md`
  - [x] `app/components/CLAUDE.md`
  - [x] `lib/CLAUDE.md`
  - [x] `lib/ai/CLAUDE.md`
  - [x] `components/CLAUDE.md`
  - [x] `hooks/CLAUDE.md`

### 🔄 In Progress
- [ ] Set up Convex project
  - [ ] Install Convex: `bun add convex`
  - [ ] Run `npx convex init`
  - [ ] Create `convex/schema.ts`
  - [ ] Configure Clerk integration

### 📋 Next Up
- [ ] Complete Convex migration
- [ ] Set up Clerk authentication
- [ ] YouTube Data API integration

### 🔮 Backlog
- [ ] YouTube Data API integration
- [ ] Transcript extraction
- [ ] Sub-agent architecture
- [ ] Flowglad payment setup

---

## Blockers

<!-- Track blockers here -->

| Blocker | Status | Resolution |
|---------|--------|------------|
| None currently | - | - |

---

## Decisions Pending

<!-- Decisions that need to be made -->

1. **Convex project name**: Use `video-daddy-chat` or shorter?
2. **Environment setup**: Development vs staging Convex instance?
3. **Migration strategy**: Incremental or big-bang Supabase → Convex?

---

## Notes from Current Work

<!-- Scratch space for current session -->

### 2026-01-13

**AI Context Setup Complete!** All foundational AI context files are now in place:

**Core Files:**
- `AGENTS.md` — Universal rules for all AI agents
- `CLAUDE.md` — Claude-specific behaviors and preferences
- `NOTES.md` — Persistent memory across sessions
- `spec.md` — Requirements and architecture decisions
- `plan.md` — This working document

**Context Directory (6 files):**
- `context/architecture.md`, `context/conventions.md`, `context/testing.md`
- `context/api.md`, `context/database.md`, `context/deployment.md`

**Nested CLAUDE.md Files (8 files):**
- `app/CLAUDE.md`, `app/api/CLAUDE.md`, `app/auth/CLAUDE.md`, `app/components/CLAUDE.md`
- `lib/CLAUDE.md`, `lib/ai/CLAUDE.md`, `components/CLAUDE.md`, `hooks/CLAUDE.md`

**Cursor Rules (6 files):**
- `001_core.mdc`, `002_security.mdc`, `100_typescript.mdc`
- `101_react_nextjs.mdc`, `200_testing.mdc`, `201_api.mdc`

**Claude Commands (5 files):**
- `analyze.md`, `refactor.md`, `review.md`, `test.md`, `security/scan.md`

Next session should focus on:
1. Convex project initialization (`bun add convex && npx convex init`)
2. Clerk authentication setup
3. Begin Supabase → Convex migration

---

## Quick Reference

### Commands
```bash
bun run dev          # Start dev server
bun run lint         # Check for issues
bun run typecheck    # TypeScript check
bun run build        # Production build
```

### Key Files
- `AGENTS.md` — Project overview for AI
- `spec.md` — Requirements
- `docs/agents-research.md` — Tech decisions

### Gold Standard Patterns
- API Route: `app/api/chat/route.ts`
- Hook: `app/components/chat/use-chat-core.ts`
- Provider: `lib/chat-store/chats/provider.tsx`
- Component: `app/components/chat/chat.tsx`

---

## Sprint History

### Sprint 1 (Completed)
- ✅ Initial research phase
- ✅ Tech stack decisions
- ✅ AGENTS.md creation

### Sprint 2 (Completed)
- ✅ AI context file setup (all files created)
- ✅ Context directory with 6 domain-specific docs
- ✅ Cursor rules with 6 numbered rule files
- ✅ Claude commands with 5 slash commands
- ✅ Nested CLAUDE.md files (8 modules covered)

### Sprint 3 (Current)
- 🔄 Convex project setup
- 📋 Clerk authentication
- 📋 Database migration

---

*Update this file as work progresses. AI agents should check and update task status.*
