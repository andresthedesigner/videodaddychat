# Database Schema & Patterns

> **Last Updated:** January 2026  
> **Current:** Supabase PostgreSQL  
> **Planned:** Migration to Convex

## Migration Status

⚠️ **Active Migration:** We are migrating from Supabase to Convex for improved AI/RAG capabilities and TypeScript-first DX.

| Feature | Supabase Status | Convex Status |
|---------|-----------------|---------------|
| Schema | ✅ Active | 📋 Planned |
| Auth | ✅ Active | 📋 Clerk migration |
| Real-time | ✅ Manual subscriptions | 📋 Native reactive |
| Vector search | ❌ Not implemented | 📋 Built-in RAG |

## Current Schema (Supabase)

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │    chats    │       │  messages   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │──┐    │ id (PK)     │
│ email       │  │    │ user_id (FK)│──┘    │ chat_id (FK)│──┘
│ display_name│  │    │ project_id  │       │ user_id (FK)│──┐
│ profile_img │  │    │ title       │       │ role        │  │
│ premium     │  │    │ model       │       │ content     │  │
│ anonymous   │  │    │ public      │       │ parts       │  │
│ daily_*     │  │    │ pinned      │       │ attachments │  │
│ system_prmpt│  │    │ created_at  │       │ model       │  │
└─────────────┘  │    │ updated_at  │       │ created_at  │  │
                 │    └─────────────┘       └─────────────┘  │
                 │           │                               │
                 │    ┌──────┴──────┐                        │
                 │    │             │                        │
                 │    ▼             ▼                        │
            ┌─────────────┐  ┌─────────────┐                 │
            │  projects   │  │chat_attach- │                 │
            ├─────────────┤  │   ments     │                 │
            │ id (PK)     │  ├─────────────┤                 │
            │ user_id (FK)│──┤ id (PK)     │                 │
            │ name        │  │ chat_id (FK)│                 │
            │ created_at  │  │ user_id (FK)│─────────────────┘
            └─────────────┘  │ file_url    │
                             │ file_name   │
                             │ file_type   │
                             │ file_size   │
                             └─────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  user_keys  │       │user_prefs   │       │  feedback   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ user_id(FK) │       │ user_id(FK) │       │ id (PK)     │
│ provider    │       │ layout      │       │ user_id(FK) │
│ encrypted_* │       │ prompt_sugg │       │ message     │
│ iv          │       │ tool_invoc  │       │ created_at  │
│ created_at  │       │ conv_prev   │       └─────────────┘
│ updated_at  │       │ multi_model │
└─────────────┘       │ hidden_mdls │
                      └─────────────┘
```

### Table Definitions

#### users

Primary user table with authentication and usage tracking.

```typescript
type User = {
  id: string                    // UUID, matches Supabase auth.users.id
  email: string                 // Required, unique
  display_name: string | null   // Optional display name
  profile_image: string | null  // Avatar URL
  premium: boolean | null       // Premium subscription status
  anonymous: boolean | null     // Guest user flag
  
  // Usage tracking
  message_count: number | null        // Total messages sent
  daily_message_count: number | null  // Today's message count
  daily_reset: string | null          // When daily count was last reset
  daily_pro_message_count: number | null  // Pro model usage
  daily_pro_reset: string | null
  
  // Preferences
  favorite_models: string[] | null    // User's preferred models
  system_prompt: string | null        // Custom system prompt
  
  // Timestamps
  created_at: string | null
  last_active_at: string | null
}
```

#### chats

Chat sessions container.

```typescript
type Chat = {
  id: string                // UUID
  user_id: string           // FK to users.id
  project_id: string | null // Optional project grouping
  title: string | null      // Chat title (auto-generated or custom)
  model: string | null      // Current AI model
  public: boolean           // Shareable chat flag
  pinned: boolean           // Pinned to top
  pinned_at: string | null  // When pinned
  created_at: string | null
  updated_at: string | null
}
```

#### messages

Individual chat messages.

```typescript
type Message = {
  id: number                // Auto-increment
  chat_id: string           // FK to chats.id
  user_id: string | null    // FK to users.id
  role: "system" | "user" | "assistant" | "data"
  content: string | null    // Message text
  parts: Json | null        // Structured content (reasoning, sources)
  experimental_attachments: Attachment[]  // File attachments
  message_group_id: string | null  // For grouping edits
  model: string | null      // Model that generated (for assistant)
  created_at: string | null
}
```

#### projects

Optional organization structure for chats.

```typescript
type Project = {
  id: string                // UUID
  name: string              // Project name
  user_id: string           // FK to users.id
  created_at: string | null
}
```

#### user_keys

Encrypted user-provided API keys.

```typescript
type UserKey = {
  user_id: string           // FK to users.id
  provider: string          // "openai", "anthropic", etc.
  encrypted_key: string     // AES-256-GCM encrypted
  iv: string                // Initialization vector
  created_at: string | null
  updated_at: string | null
}
```

#### user_preferences

User UI/UX preferences.

```typescript
type UserPreferences = {
  user_id: string                      // FK to users.id (unique)
  layout: string | null                // "default" | "compact"
  prompt_suggestions: boolean | null   // Show prompt suggestions
  show_tool_invocations: boolean | null
  show_conversation_previews: boolean | null
  multi_model_enabled: boolean | null
  hidden_models: string[] | null       // Models to hide from selector
  created_at: string | null
  updated_at: string | null
}
```

## Query Patterns

### Fetching User's Chats

```typescript
// Get all chats for user, sorted by pinned then updated
const { data: chats } = await supabase
  .from("chats")
  .select("*")
  .eq("user_id", userId)
  .order("pinned", { ascending: false })
  .order("pinned_at", { ascending: false, nullsFirst: false })
  .order("updated_at", { ascending: false })
```

### Loading Chat Messages

```typescript
// Get messages for a specific chat
const { data: messages } = await supabase
  .from("messages")
  .select("*")
  .eq("chat_id", chatId)
  .order("created_at", { ascending: true })
```

### Storing Assistant Response

```typescript
// After streaming completes, store the message
await supabase.from("messages").insert({
  chat_id: chatId,
  role: "assistant",
  content: response.text,
  parts: response.parts,
  model: modelId,
  message_group_id: groupId,
})
```

### Editing Messages (Delete and Re-insert)

```typescript
// When user edits, delete all messages from edit point forward
await supabase
  .from("messages")
  .delete()
  .eq("chat_id", chatId)
  .gte("created_at", editCutoffTimestamp)

// Then insert the new user message
await supabase.from("messages").insert({
  chat_id: chatId,
  role: "user",
  content: newContent,
  // ...
})
```

## Rate Limiting Queries

### Check and Increment Usage

```typescript
// Get current usage
const { data: user } = await supabase
  .from("users")
  .select("daily_message_count, daily_reset, daily_pro_message_count")
  .eq("id", userId)
  .single()

// Check if reset needed (midnight Pacific)
const pacificMidnight = new Date()
pacificMidnight.setUTCHours(8, 0, 0, 0) // 00:00 Pacific = 08:00 UTC

if (new Date(user.daily_reset) < pacificMidnight) {
  await supabase
    .from("users")
    .update({ 
      daily_message_count: 1, 
      daily_reset: new Date().toISOString() 
    })
    .eq("id", userId)
} else {
  await supabase
    .from("users")
    .update({ daily_message_count: user.daily_message_count + 1 })
    .eq("id", userId)
}
```

## Planned Convex Schema

<!-- TODO: Implement after migration approved -->

```typescript
// convex/schema.ts (planned)
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    isPremium: v.boolean(),
    dailyMessageCount: v.number(),
    dailyResetAt: v.number(),
    systemPrompt: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
  
  chats: defineTable({
    userId: v.id("users"),
    projectId: v.optional(v.id("projects")),
    title: v.optional(v.string()),
    model: v.string(),
    isPublic: v.boolean(),
    isPinned: v.boolean(),
    pinnedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_pinned", ["userId", "isPinned"]),
  
  messages: defineTable({
    chatId: v.id("chats"),
    role: v.union(
      v.literal("system"),
      v.literal("user"),
      v.literal("assistant"),
      v.literal("data")
    ),
    content: v.string(),
    parts: v.optional(v.any()),
    attachments: v.optional(v.array(v.object({
      url: v.string(),
      name: v.string(),
      type: v.string(),
      size: v.number(),
    }))),
    model: v.optional(v.string()),
    groupId: v.optional(v.string()),
  }).index("by_chat", ["chatId"]),
  
  // Built-in RAG support
  embeddings: defineTable({
    userId: v.id("users"),
    namespace: v.string(),  // "transcripts", "notes", etc.
    content: v.string(),
    embedding: v.array(v.float64()),
    metadata: v.optional(v.any()),
  })
    .index("by_user_namespace", ["userId", "namespace"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId", "namespace"],
    }),
})
```

### Convex Benefits for AI/RAG

```typescript
// Example: Vector search for relevant context
const relevantDocs = await ctx.db
  .query("embeddings")
  .withIndex("by_embedding")
  .filter((q) => 
    q.and(
      q.eq(q.field("userId"), userId),
      q.eq(q.field("namespace"), "transcripts")
    )
  )
  .vectorSearch("embedding", queryEmbedding, { limit: 5 })

// Native real-time - no manual subscriptions
const chats = useQuery(api.chats.list, { userId })
// UI automatically updates when data changes
```

## Security

### Row-Level Security (Supabase)

```sql
-- Users can only read their own data
CREATE POLICY "Users read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only access their own chats
CREATE POLICY "Users access own chats" ON chats
  FOR ALL USING (auth.uid() = user_id);

-- Messages accessible if user owns the chat
CREATE POLICY "Messages via chat ownership" ON messages
  FOR ALL USING (
    chat_id IN (
      SELECT id FROM chats WHERE user_id = auth.uid()
    )
  );
```

### Encrypted API Keys

```typescript
// API keys are never stored in plaintext
// See lib/encryption.ts for implementation

// Store
const { encrypted, iv } = await encryptApiKey(apiKey)
await supabase.from("user_keys").upsert({
  user_id: userId,
  provider,
  encrypted_key: encrypted,
  iv,
})

// Retrieve
const { data } = await supabase
  .from("user_keys")
  .select("encrypted_key, iv")
  .eq("user_id", userId)
  .eq("provider", provider)
  .single()

const apiKey = await decryptApiKey(data.encrypted_key, data.iv)
```

## Migrations

### Current Migration Files

<!-- TODO: Document Supabase migrations -->

Migrations are managed via Supabase CLI:

```bash
# Generate new migration
supabase migration new add_feature_name

# Apply migrations locally
supabase db reset

# Push to production
supabase db push
```

### Convex Migration Plan

1. Set up Convex project with new schema
2. Create data export script from Supabase
3. Transform data to Convex format
4. Import to Convex
5. Update application code to use Convex client
6. Migrate auth to Clerk (Convex recommended)
7. Deprecate Supabase client

---

*See `@docs/agents-research.md` for Convex vs Supabase evaluation and `@context/architecture.md` for data flow patterns.*
