# Auth Module — Claude Context

This directory handles authentication for Video Daddy Chat.

> ⚠️ **Migration Pending**: Currently using Supabase Auth, migrating to Clerk.
> See `@docs/agents-research.md` for migration rationale.

## Current Structure

```
auth/
├── callback/
│   └── route.ts      # OAuth callback handler
├── error/
│   └── page.tsx      # Auth error page
├── login/
│   └── actions.ts    # Server actions (signOut)
├── login-page.tsx    # Login UI component
└── page.tsx          # Auth page
```

## Current Auth Flow (Supabase)

```
User → Login Page → Supabase OAuth → Callback → Session Cookie → App
```

### Server Actions Pattern

```typescript
// login/actions.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signOut() {
  if (!isSupabaseEnabled) {
    // Guard: handle disabled state gracefully
    return
  }

  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/auth/login")
}
```

## Planned Migration to Clerk

### Why Clerk?

1. Native Convex integration (our new database)
2. Native Flowglad integration (our payment provider)
3. Better DX with pre-built components
4. Supports YouTube OAuth for future analytics features

### Migration Steps

<!-- TODO: Implement these steps -->

1. [ ] Install Clerk SDK (`@clerk/nextjs`)
2. [ ] Add Clerk environment variables
3. [ ] Replace `lib/supabase/server.ts` auth calls with Clerk
4. [ ] Update middleware.ts for Clerk
5. [ ] Replace login page with Clerk components
6. [ ] Migrate user sessions
7. [ ] Remove Supabase auth code

### Future Clerk Structure

```
auth/
├── sign-in/
│   └── [[...sign-in]]/
│       └── page.tsx    # Clerk <SignIn /> component
├── sign-up/
│   └── [[...sign-up]]/
│       └── page.tsx    # Clerk <SignUp /> component
└── callback/           # May not be needed with Clerk
```

## Security Rules

- **⚠️ ASK BEFORE**: Modifying any auth code
- **⚠️ ASK BEFORE**: Changing middleware.ts
- **🚫 FORBIDDEN**: Logging tokens or credentials
- **🚫 FORBIDDEN**: Storing plain-text secrets

## Related Files

- `middleware.ts` — Auth middleware (root level)
- `lib/supabase/server.ts` — Server-side Supabase client
- `lib/supabase/client.ts` — Client-side Supabase client

## Notes

<!-- TODO: Document Clerk setup after migration -->
<!-- TODO: Add YouTube OAuth scope requirements for analytics -->
