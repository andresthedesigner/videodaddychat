# API Routes — Claude Context

This directory contains Next.js API routes for the Video Daddy Chat backend.

> See `@AGENTS.md` for universal guidelines. Gold standard: `app/api/chat/route.ts`

## Structure Overview

```
api/
├── chat/             # Main chat streaming endpoint (gold standard)
│   ├── route.ts      # POST handler with streaming
│   ├── api.ts        # Business logic (validation, storage)
│   ├── db.ts         # Database operations
│   └── utils.ts      # Error handling utilities
├── create-chat/      # Chat creation
├── models/           # Available AI models
├── providers/        # AI provider info
├── rate-limits/      # Usage tracking
├── user-keys/        # BYOK (Bring Your Own Key)
├── user-preferences/ # User settings
└── projects/         # Project management
```

## Key Patterns

### Streaming Response (chat/route.ts)

```typescript
import { streamText } from "ai"

export async function POST(req: Request) {
  // 1. Validate request
  const { messages, chatId, userId, model } = await req.json()
  if (!messages || !chatId || !userId) {
    return new Response(JSON.stringify({ error: "Missing information" }), { status: 400 })
  }

  // 2. Validate usage/auth
  const supabase = await validateAndTrackUsage({ userId, model, isAuthenticated })

  // 3. Stream response
  const result = streamText({
    model: modelConfig.apiSdk(apiKey, { enableSearch }),
    system: systemPrompt,
    messages,
    onFinish: async ({ response }) => {
      // Store assistant message to DB
      await storeAssistantMessage({ supabase, chatId, messages: response.messages })
    },
  })

  return result.toDataStreamResponse({
    sendReasoning: true,
    sendSources: true,
    getErrorMessage: (error) => extractErrorMessage(error),
  })
}
```

### Error Handling (utils.ts)

```typescript
export function createErrorResponse(error: { code?: string; message?: string; statusCode?: number }) {
  // Map error codes to user-friendly messages
  // Return appropriate HTTP status codes
}

export function extractErrorMessage(error: unknown): string {
  // Extract user-friendly error message from various error types
}
```

### Route Configuration

```typescript
// Set max duration for streaming routes
export const maxDuration = 60  // 60 seconds

// Define request type for validation
type ChatRequest = {
  messages: MessageAISDK[]
  chatId: string
  userId: string
  model: string
  // ...
}
```

## Conventions

1. **File Structure**: Each API folder has `route.ts` (handler) + `api.ts` (logic)
2. **Validation**: Always validate required fields at the start
3. **Error Responses**: Use `{ error: string, code?: string }` format
4. **Auth Check**: Use `isAuthenticated` flag from client, validate server-side
5. **Rate Limiting**: Check limits before processing expensive operations

## Common Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | Main chat streaming |
| `/api/create-chat` | POST | Create new chat |
| `/api/models` | GET | List available models |
| `/api/rate-limits` | GET | Check user limits |
| `/api/user-keys` | GET/POST | Manage API keys |

## Security Considerations

- **Never log**: API keys, tokens, user credentials
- **Always validate**: User ownership before mutations
- **Rate limit**: All expensive operations
- **BYOK**: User keys are encrypted at rest

## Testing

```bash
# Health check
curl http://localhost:3000/api/health

# Models list
curl http://localhost:3000/api/models
```

## Notes

<!-- TODO: Document Convex migration plan for API routes -->
<!-- TODO: Add webhook handlers for Clerk/Flowglad -->
