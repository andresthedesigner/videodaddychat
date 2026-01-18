# vid0

AI-powered chat platform for YouTube content creators. Data-driven recommendations for scripts, titles, and thumbnails.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | Convex (reactive DB + built-in RAG) |
| Auth | Clerk |
| Payments | Flowglad |
| AI | Vercel AI SDK → Claude Opus 4.5 (primary) |
| State | Zustand + TanStack Query |
| UI | Shadcn/Radix + Tailwind 4 |

## Commands

```bash
bun install           # Install deps
bun run dev           # Dev server (:3000)
bun run lint          # ESLint
bun run typecheck     # tsc --noEmit
bun run build         # Production build
bun run test          # Vitest (critical paths)
```

## Development Workflow

This project follows a **four-phase coding cycle**:

1. **Research** → Gather context, read files, understand patterns
2. **Plan** → Create detailed plan, use `ultrathink` for complex problems
3. **Code & Verify** → Implement step-by-step, verify after each step
4. **Commit** → Commit incrementally with conventional messages

**Workflow Commands:**
- `/research` - Start research phase
- `/plan` - Create implementation plan
- `/tdd` - Test-Driven Development workflow
- `/verify` - Run all verification checks
- `/commit` - Commit with conventional message

See `docs/workflows.md` for complete workflow documentation.

## Directory Structure

```
app/                  # Next.js App Router
├── api/              # API routes (streaming)
├── auth/             # Auth pages/actions
├── components/chat/  # Chat UI
└── (app)/            # Main routes

lib/                  # Shared utilities
├── chat-store/       # Chat state
├── config.ts         # Constants
└── openproviders/    # AI provider abstraction

components/           # Shadcn UI components
convex/               # DB schema & functions <!-- TODO -->
```

## Gold Standard Examples

Follow these patterns when creating new code:

- **API Route:** `app/api/chat/route.ts` — streaming, validation, auth
- **Custom Hook:** `app/components/chat/use-chat-core.ts` — useCallback, typed returns
- **Context Provider:** `lib/chat-store/chats/provider.tsx` — optimistic updates
- **Component:** `app/components/chat/chat.tsx` — dynamic imports, memoization

## Code Conventions

- **TypeScript:** Explicit types, avoid `any`, use `unknown` + guards
- **Components:** Server Components for pages, Client for interactivity
- **Hooks:** `useMemo` for computations, `useCallback` for stable refs
- **Imports:** React → External → `@/` aliases → Relative

## AI Agent Permissions

### ✅ Allowed

- Read any source file
- Run: `dev`, `build`, `lint`, `typecheck`, `test`
- Create/edit in: `app/`, `lib/`, `components/`, `hooks/`

### ⚠️ Ask First

- `bun add <package>`
- Modify: `package.json`, `tsconfig.json`, `next.config.*`
- Git operations
- Auth logic (`lib/auth/`, `app/auth/`, `middleware.ts`)
- Delete files
- DB schema (`convex/schema.ts`)
- CI/CD (`.github/workflows/`)

### 🚫 Forbidden

- Read/write `.env*` files
- Force push
- Commit secrets
- Modify prod configs without review

## Security

**Never log:** OAuth tokens, API keys, credentials, session tokens

**Encrypt at rest:** OAuth refresh tokens, user-provided keys

## Testing Strategy

Critical paths only: auth flows, OAuth handling, message persistence, rate limiting, transcripts.

Skip: UI rendering tests, animations, AI response quality.

## YouTube Integration <!-- TODO -->

- **MVP:** YouTube Data API v3 (public data, 10K units/day)
- **Phase 2:** YouTube Analytics API (creator metrics, OAuth)

## Environment Variables <!-- TODO: Finalize after migration -->

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

---

*~100 lines. Link to `/docs` for detailed research and architecture.*
