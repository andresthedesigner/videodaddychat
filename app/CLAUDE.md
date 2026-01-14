# App Directory — Claude Context

This directory contains the Next.js App Router pages, API routes, and app-specific components.

> See `@AGENTS.md` for universal guidelines and `@CLAUDE.md` (root) for project-wide Claude context.

## Structure Overview

```
app/
├── api/              # API routes (streaming, validation)
├── auth/             # Authentication pages and actions
├── c/[chatId]/       # Dynamic chat pages
├── p/[projectId]/    # Project pages
├── share/[chatId]/   # Public share pages
├── components/       # App-specific components (chat, layout, history)
├── hooks/            # App-specific hooks
├── types/            # TypeScript types for this module
├── layout.tsx        # Root layout (providers, metadata)
└── page.tsx          # Home page
```

## Key Patterns

### Server vs Client Components

- **Server Components (default)**: Use for pages, layouts, data fetching
- **Client Components (`"use client"`)**: Use for interactivity, hooks, browser APIs

```typescript
// Server Component (page.tsx)
export default async function Page({ params }: { params: { chatId: string } }) {
  // Can use async/await directly
  const data = await fetchData(params.chatId)
  return <ClientComponent initialData={data} />
}

// Client Component (chat.tsx)
"use client"
import { useState } from "react"
// Can use hooks, event handlers
```

### Dynamic Routes

- `c/[chatId]/` — Individual chat conversations
- `p/[projectId]/` — Project views with associated chats
- `share/[chatId]/` — Public read-only share pages

### Layout Hierarchy

```
layout.tsx (root)
├── Providers (TanStack Query, Chat Store, User Store)
├── ThemeProvider
└── Toaster
```

## Gold Standard Files

| Pattern | File | Key Strengths |
|---------|------|---------------|
| **Page** | `c/[chatId]/page.tsx` | Params typing, server component |
| **Layout** | `layout.tsx` | Provider composition, metadata |
| **Not Found** | `not-found.tsx` | Error boundary pattern |

## Module-Specific Context

- `app/api/CLAUDE.md` — API route patterns
- `app/auth/CLAUDE.md` — Authentication specifics
- `app/components/CLAUDE.md` — Component patterns

## Conventions

1. **File Naming**: `kebab-case.tsx` for files, `PascalCase` for components
2. **Page Exports**: Default export for pages, named exports for actions
3. **Metadata**: Use `generateMetadata` for dynamic pages
4. **Loading States**: Use `loading.tsx` for Suspense boundaries

## Common Tasks

### Adding a New Page

1. Create directory with `page.tsx`
2. Add `loading.tsx` if data fetching is slow
3. Use Server Component unless interactivity needed
4. Add to sitemap if public

### Adding Client Interactivity

1. Create a Client Component wrapper
2. Pass server-fetched data as props
3. Keep Client Components as small as possible

## Notes

<!-- TODO: Add notes about patterns discovered during development -->
