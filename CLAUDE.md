# Claude-Specific Context

This file contains Claude-specific behaviors, preferences, and context for the Video Daddy Chat project.

> See `@AGENTS.md` for universal guidelines that apply to all AI agents.

## Claude Preferences

### Thinking Mode
- Use **extended thinking** for complex architectural decisions
- Use `ultrathink` trigger for multi-step refactoring or debugging sessions
- Standard thinking is fine for simple edits and additions

### Response Style
- Be concise; avoid over-explaining obvious code
- Use code references (`startLine:endLine:filepath`) when discussing existing code
- Prefer showing small, focused diffs over full file rewrites

### Tool Usage
- **Maximize parallel tool calls** when operations are independent
- Read multiple files simultaneously when exploring a feature
- Run lint/typecheck after edits to catch issues early

## Project-Specific Behaviors

### When Working on Chat Features
- Reference `app/components/chat/use-chat-core.ts` for hook patterns
- Follow optimistic update pattern from `lib/chat-store/chats/provider.tsx`
- Streaming responses use Vercel AI SDK patterns

### When Working on API Routes
- Follow `app/api/chat/route.ts` as the gold standard
- Always validate input with proper error handling
- Use structured error responses: `{ error: string, code?: string }`

### When Working on UI Components
- Use Shadcn/Radix primitives from `components/ui/`
- Follow existing patterns in `app/components/`
- Prefer composition over configuration

## Memory Hierarchy

This project uses the following memory structure:

```
CLAUDE.md (this file)     → Project-level Claude context
├── app/CLAUDE.md         → App-specific patterns (TODO: create when needed)
├── lib/CLAUDE.md         → Library patterns (TODO: create when needed)
└── ~/.claude/CLAUDE.md   → Personal user preferences
```

## Import Syntax for Context

When you need additional context, use the `@` import syntax:

```markdown
@AGENTS.md                           # Project overview, commands, permissions
@docs/agents-research.md             # Tech stack decisions, sub-agent architecture
@docs/youtube-transcript-evaluation.md # YouTube API research
@lib/config.ts                       # Centralized configuration constants
```

## Sub-Agent Architecture (Future)

<!-- TODO: Implement after Convex migration -->

When the sub-agent architecture is implemented, Claude should route tasks:

| Task Type | Agent | Model |
|-----------|-------|-------|
| Transcript analysis | Transcript Analyzer | Haiku 4.5 |
| Title generation | Title/SEO Optimizer | Sonnet 4.5 |
| Thumbnail feedback | Thumbnail Advisor | Sonnet 4.5 + Vision |
| Analytics interpretation | Analytics Interpreter | Sonnet 4.5 |
| General conversation | Main Orchestrator | Opus 4.5 |

## Context Compaction

For long sessions, Claude should:

1. Summarize older messages when approaching token limits
2. Write important discoveries to `NOTES.md`
3. Keep the last 10 messages in full context
4. Reference `@` files instead of keeping full content in context

## Debugging Workflow

When debugging issues:

1. **Read first**: Examine the relevant files before suggesting changes
2. **Check lints**: Run `bun run lint` and `bun run typecheck`
3. **Verify patterns**: Ensure changes follow gold standard examples
4. **Test incrementally**: Suggest running tests after each significant change

## Common Gotchas

<!-- Add project-specific issues as discovered -->

- **Streaming responses**: Must use `StreamingTextResponse` from AI SDK
- **Server Components**: Cannot use hooks; use Client Components wrapper
- **Supabase → Convex migration**: In progress, prefer Convex patterns for new code
- **Auth**: Uses Clerk; avoid touching `middleware.ts` without review

---

*This file is automatically loaded by Claude Code and Claude API tools.*
