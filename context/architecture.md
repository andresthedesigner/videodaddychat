# System Architecture

> **Last Updated:** January 2026  
> **Status:** Active development

## Overview

vid0 is an AI-powered platform for YouTube content creators, providing data-driven recommendations for scripts, titles, and thumbnails through a chat-based interface.

```
┌─────────────────────────────────────────────────────────────┐
│                          vid0                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    NEXT.JS APP ROUTER                    ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ││
│  │  │ Server Comps │  │ Client Comps │  │  API Routes  │  ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
│                            │                                 │
│  ┌─────────────────────────┼─────────────────────────────┐  │
│  │                    STATE LAYER                         │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌────────────────┐   │  │
│  │  │  Zustand │  │TanStack Query│  │ Context/Hooks  │   │  │
│  │  │  (Local) │  │   (Server)   │  │   (Chat UI)    │   │  │
│  │  └──────────┘  └──────────────┘  └────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌─────────────────────────┼─────────────────────────────┐  │
│  │                  EXTERNAL SERVICES                     │  │
│  │                                                        │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐ │  │
│  │  │  Convex  │  │    Clerk     │  │    Flowglad      │ │  │
│  │  │ Database │  │     Auth     │  │    Payments      │ │  │
│  │  │ + AI/RAG │  │              │  │                  │ │  │
│  │  └──────────┘  └──────────────┘  └──────────────────┘ │  │
│  │                                                        │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐ │  │
│  │  │ Vercel   │  │   YouTube    │  │   AI Providers   │ │  │
│  │  │   AI SDK │  │     APIs     │  │ Claude/OpenAI/.. │ │  │
│  │  └──────────┘  └──────────────┘  └──────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### Frontend Layer

| Component | Purpose | Technology |
|-----------|---------|------------|
| **App Router** | Routing, layouts, server components | Next.js 16 |
| **UI Components** | Design system, accessibility | Shadcn/Radix |
| **Chat Interface** | Real-time messaging, streaming | Custom + Vercel AI SDK |
| **State Management** | Client-side state, caching | Zustand + TanStack Query |

### Backend Layer

| Component | Purpose | Technology |
|-----------|---------|------------|
| **API Routes** | REST endpoints, streaming | Next.js Route Handlers |
| **Database** | Data persistence, real-time | Convex |
| **Authentication** | User identity, sessions | Clerk |
| **AI Orchestration** | Multi-provider LLM routing | Vercel AI SDK |

## Data Flow

### Chat Message Flow

```
┌──────────┐    ┌───────────┐    ┌─────────────┐    ┌───────────┐
│  User    │───>│ Chat UI   │───>│ API Route   │───>│ AI SDK    │
│  Input   │    │ Component │    │ /api/chat   │    │           │
└──────────┘    └───────────┘    └─────────────┘    └───────────┘
                     │                  │                  │
                     │                  │                  │
                     ▼                  ▼                  ▼
              ┌───────────┐    ┌─────────────┐    ┌───────────┐
              │ Optimistic│    │ Validation  │    │ Streaming │
              │ Update UI │    │ + Rate Limit│    │ Response  │
              └───────────┘    └─────────────┘    └───────────┘
                     │                  │                  │
                     │                  │                  │
                     ▼                  ▼                  ▼
              ┌───────────┐    ┌─────────────┐    ┌───────────┐
              │  Display  │<───│   Store in  │<───│  Stream   │
              │  Response │    │   Database  │    │  Chunks   │
              └───────────┘    └─────────────┘    └───────────┘
```

### State Management Architecture

```
Chat.tsx (Orchestrator)
├── useChatCore          → Core chat state & AI SDK integration
├── useChatOperations    → Rate limiting, chat creation, deletion
├── useFileUpload        → File handling & attachments
├── useModel             → Model selection & persistence
└── useChatDraft         → Draft message persistence
```

Each hook has a single responsibility, uses proper memoization, and returns a clean typed interface.

## Key Patterns

### 1. Optimistic Updates with Rollback

Used throughout the application for responsive UI:

```typescript
// Pattern: Store previous state, update optimistically, rollback on error
const updateTitle = async (id: string, title: string) => {
  let previousState: Chats[] | null = null
  
  setChats((prev) => {
    previousState = prev
    return prev.map((c) => c.id === id ? { ...c, title } : c)
  })
  
  try {
    await updateChatTitle(id, title)
  } catch {
    if (previousState) setChats(previousState)
    toast({ title: "Failed to update title", status: "error" })
  }
}
```

### 2. Streaming Response Pattern

```typescript
// API Route pattern for streaming AI responses
const result = streamText({
  model: modelConfig.apiSdk(apiKey, { enableSearch }),
  system: effectiveSystemPrompt,
  messages: messages,
  onFinish: async ({ response }) => {
    await storeAssistantMessage({ chatId, messages: response.messages })
  },
})

return result.toDataStreamResponse({
  sendReasoning: true,
  sendSources: true,
})
```

### 3. Multi-Provider AI Abstraction

```typescript
// Provider map abstracts different AI providers
const providerMap: Record<string, ProviderConfig> = {
  anthropic: { sdk: createAnthropic, envKey: 'ANTHROPIC_API_KEY' },
  openai: { sdk: createOpenAI, envKey: 'OPENAI_API_KEY' },
  // ... other providers
}
```

## Sub-Agent Architecture (Planned)

For complex tasks, we use specialized sub-agents:

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN ORCHESTRATOR                         │
│            (Primary Chat Agent - Claude Opus 4.5)           │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  TRANSCRIPT   │ │   TITLE/SEO   │ │  THUMBNAIL    │ │  ANALYTICS    │
│   ANALYZER    │ │   OPTIMIZER   │ │   ADVISOR     │ │  INTERPRETER  │
│ (Haiku 4.5)   │ │ (Sonnet 4.5)  │ │ (Sonnet+Vision)│ │ (Sonnet 4.5)  │
└───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
```

| Agent | Model | Purpose |
|-------|-------|---------|
| **Transcript Analyzer** | Claude Haiku 4.5 | Summarize, extract key points, identify hooks |
| **Title/SEO Optimizer** | Claude Sonnet 4.5 | Generate titles, tags, A/B test variants |
| **Thumbnail Advisor** | Claude Sonnet 4.5 + Vision | Analyze images, suggest improvements |
| **Analytics Interpreter** | Claude Sonnet 4.5 | Interpret metrics, identify trends |

## Directory Structure

```
app/                    # Next.js App Router
├── api/               # API routes (streaming, REST)
│   ├── chat/         # Main chat endpoint
│   ├── create-chat/  # Chat creation
│   └── ...           # Other endpoints
├── auth/             # Auth pages and actions
├── components/       # App-specific components
│   ├── chat/        # Chat UI components
│   ├── chat-input/  # Input components
│   ├── layout/      # App layout components
│   └── history/     # Chat history components
├── hooks/           # App-specific hooks
└── types/           # Type definitions

lib/                   # Shared utilities
├── chat-store/       # Chat state management
├── models/          # AI model definitions
├── openproviders/   # AI provider abstraction
└── user-store/      # User state management

convex/               # Convex database
├── schema.ts        # Database schema
├── chats.ts         # Chat operations
├── messages.ts      # Message operations
└── users.ts         # User operations

components/           # Shadcn UI components (shared)
```

## Security Architecture

### Request Flow Security

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│  Client  │───>│  Middleware  │───>│  API Route   │───>│ Database │
│          │    │  - CSRF      │    │  - Validate  │    │          │
│          │    │  - Session   │    │  - Authorize │    │          │
│          │    │  - CSP       │    │  - Sanitize  │    │          │
└──────────┘    └──────────────┘    └──────────────┘    └──────────┘
```

### Key Security Measures

- **CSRF Protection**: Token validation on all state-changing requests
- **Content Security Policy**: Strict CSP headers in middleware
- **Input Validation**: Zod schemas for request validation
- **API Key Encryption**: User-provided API keys encrypted at rest
- **Rate Limiting**: Per-user daily message limits

## External Dependencies

### Required Services

| Service | Purpose | Status |
|---------|---------|--------|
| **Convex** | Database, real-time, AI/RAG | Active |
| **Clerk** | Authentication | Active |
| **Flowglad** | Payments | Planned |
| **Vercel** | Hosting, Edge | Active |

### AI Providers

| Provider | Primary Use | Fallback |
|----------|-------------|----------|
| **Anthropic (Claude)** | Main chat, complex tasks | — |
| **OpenAI** | Whisper, embeddings | GPT-4o |
| **Google** | Gemini for specific tasks | — |
| **OpenRouter** | Model aggregation | Multiple |

## Performance Considerations

### Caching Strategy

- **TanStack Query**: Server state caching with stale-while-revalidate
- **Zustand Persist**: Local storage for user preferences
- **IndexedDB**: Large data (chat drafts) via idb-keyval

### Optimization Techniques

- **Dynamic Imports**: Lazy load heavy components
- **Memoization**: `useMemo`/`useCallback` for expensive computations
- **Streaming**: AI responses streamed to reduce time-to-first-byte
- **Optimistic Updates**: Immediate UI feedback with rollback on error

## Future Considerations

<!-- TODO: Update after Convex migration -->

### Convex Migration Benefits

- Native real-time sync (no manual subscriptions)
- Built-in vector search for AI/RAG
- TypeScript-first schema definitions
- Automatic optimistic updates

### YouTube Integration

- **Phase 1**: YouTube Data API v3 (public data, competitor analysis)
- **Phase 2**: YouTube Analytics API (creator metrics, OAuth)

---

*See `@docs/agents-research.md` for detailed tech stack evaluation and decision rationale.*
