# Project Specification

Video Daddy Chat — AI-powered platform for YouTube content creators.

---

## Product Vision

Help YouTube creators make data-driven decisions about their content through AI-powered analysis of transcripts, titles, thumbnails, and analytics.

---

## Requirements

### Functional Requirements

#### Phase 1: Core Chat (Current)
- [x] User authentication (Clerk)
- [x] Multi-model AI chat (Vercel AI SDK)
- [x] Chat history persistence
- [x] Streaming responses
- [ ] Migrate to Convex database

#### Phase 2: YouTube Integration
- [ ] YouTube Data API v3 integration
- [ ] Video metadata retrieval
- [ ] Transcript extraction and analysis
- [ ] Competitor analysis tools

#### Phase 3: Creator Tools
- [ ] Title generation and A/B testing suggestions
- [ ] Thumbnail analysis (vision model)
- [ ] Script improvement recommendations
- [ ] Analytics interpretation

#### Phase 4: Monetization
- [ ] Flowglad payment integration
- [ ] Subscription tiers (Free/Pro/Enterprise)
- [ ] Usage-based billing for API calls

### Non-Functional Requirements

| Requirement | Target | Priority |
|-------------|--------|----------|
| Response time (streaming start) | < 500ms | High |
| Uptime | 99.9% | High |
| Context window efficiency | < 80% usage | Medium |
| Mobile responsiveness | Full support | Medium |

---

## Architecture Decisions

### Database: Convex

**Decision**: Migrate from Supabase to Convex

**Rationale**:
- Built-in RAG and vector search for AI memory
- Real-time reactive queries (essential for chat)
- TypeScript-first (matches our stack)
- Native Clerk integration

**Trade-offs**:
- ❌ No local development (cloud-only)
- ❌ Vendor lock-in (proprietary)
- ✅ Faster development for AI features
- ✅ Better developer experience

### Auth: Clerk

**Decision**: Use Clerk for authentication

**Rationale**:
- Pre-built UI components
- Native integrations: Convex, Flowglad
- Handles OAuth complexity (for YouTube API later)
- Good free tier for MVP

### AI: Multi-Provider via Vercel AI SDK

**Decision**: Abstract AI providers through Vercel AI SDK

**Rationale**:
- Switch models without code changes
- Consistent streaming API
- Future-proof for new models

**Model Selection**:
| Use Case | Model | Reason |
|----------|-------|--------|
| Primary chat | Claude Opus 4.5 | Best reasoning, 1M context |
| Fast tasks | Claude Haiku 4.5 | Speed, cost efficiency |
| Vision (thumbnails) | Claude Sonnet 4.5 | Good balance, vision support |

### Payments: Flowglad

**Decision**: Use Flowglad over Stripe

**Rationale**:
- Open-source
- Native Clerk integration
- Better DX for subscription management
- Growing ecosystem

---

## Data Models

### Core Entities (Post-Convex Migration)

```typescript
// convex/schema.ts (TODO: Create after Convex setup)

// User - Managed by Clerk, synced to Convex
interface User {
  clerkId: string
  email: string
  name?: string
  subscriptionTier: "free" | "pro" | "enterprise"
  createdAt: number
}

// Chat
interface Chat {
  _id: Id<"chats">
  userId: string
  title: string
  createdAt: number
  updatedAt: number
}

// Message
interface Message {
  _id: Id<"messages">
  chatId: Id<"chats">
  role: "user" | "assistant" | "system"
  content: string
  model?: string
  tokens?: number
  createdAt: number
}

// YouTubeVideo (Phase 2)
interface YouTubeVideo {
  _id: Id<"videos">
  videoId: string  // YouTube video ID
  title: string
  channelId: string
  transcript?: string
  analyzedAt?: number
}
```

### Relationships

```
User (1) ──→ (n) Chat
Chat (1) ──→ (n) Message
User (1) ──→ (n) YouTubeVideo (saved analyses)
```

---

## API Contracts

### Chat API

#### POST /api/chat
Stream a chat completion.

**Request**:
```typescript
{
  messages: Array<{
    role: "user" | "assistant" | "system"
    content: string
  }>
  model?: string  // Default: claude-opus-4.5
  chatId?: string // For persistence
}
```

**Response**: Server-Sent Events (streaming)

#### GET /api/chat/history
Get user's chat history.

**Response**:
```typescript
{
  chats: Array<{
    id: string
    title: string
    lastMessage: string
    updatedAt: string
  }>
}
```

### YouTube API (Phase 2)

#### POST /api/youtube/analyze
Analyze a YouTube video.

**Request**:
```typescript
{
  videoId: string  // or URL
  analysisType: "transcript" | "metadata" | "full"
}
```

**Response**:
```typescript
{
  video: {
    title: string
    description: string
    transcript?: string
  }
  analysis: {
    summary: string
    hooks: string[]
    suggestions: string[]
  }
}
```

---

## Testing Strategy

### What to Test

| Category | Priority | Approach |
|----------|----------|----------|
| Auth flows | 🔴 Critical | Integration tests |
| Data transforms | 🔴 Critical | Unit tests |
| Rate limiting | 🔴 Critical | Unit tests |
| API routes | 🟠 High | Integration tests |
| Chat persistence | 🟠 High | Integration tests |
| UI interactions | 🟡 Medium | E2E (Playwright) |

### What NOT to Test

- AI response quality (non-deterministic)
- UI rendering/snapshots (too brittle)
- Animation timing
- Third-party API responses (mock them)

---

## Success Criteria

### MVP (Phase 1-2)
- [ ] Users can sign up and chat with AI
- [ ] Chat history persists across sessions
- [ ] Basic YouTube video analysis works
- [ ] Response time < 500ms to first token

### Product-Market Fit (Phase 3-4)
- [ ] 1,000 active users
- [ ] 10% free-to-paid conversion
- [ ] < 5% monthly churn
- [ ] NPS > 40

---

## Open Questions

<!-- Capture questions that need answers -->

1. **Quota management**: How to handle YouTube API quota limits (10K/day)?
2. **Caching strategy**: Cache video transcripts? For how long?
3. **Privacy**: How long to retain user chat data?
4. **International**: Support for non-English transcripts?

---

*See `plan.md` for implementation roadmap.*
