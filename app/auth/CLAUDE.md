# Auth Module — Claude Context

This directory handles authentication for vid0.

> ✅ **Migration Complete**: Using Clerk for authentication with native Convex integration.

## Current Structure

```
auth/
├── login/
│   └── page.tsx      # Clerk <SignIn /> component
├── sign-up/
│   └── page.tsx      # Clerk <SignUp /> component
├── error/
│   └── page.tsx      # Auth error page
└── callback/         # OAuth callback (if needed)
```

## Auth Flow (Clerk)

```
User → Login Page → Clerk Auth → JWT Token → Convex Auth → App
```

### Integration Pattern

```typescript
// Using Clerk auth in API routes
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }
  
  // Proceed with authenticated request
}
```

### Client-Side Auth

```typescript
// Using Clerk hooks in components
import { useUser, useAuth } from "@clerk/nextjs"

function MyComponent() {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  
  if (!isLoaded) return <Loading />
  if (!isSignedIn) return <SignInPrompt />
  
  return <AuthenticatedContent user={user} />
}
```

### Convex Integration

```typescript
// Clerk + Convex auth in convex functions
import { v } from "convex/values"
import { query, mutation } from "./_generated/server"

export const getUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null
    
    return ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first()
  },
})
```

## Environment Variables

```bash
# Required Clerk variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_JWT_ISSUER_DOMAIN=https://your-instance.clerk.accounts.dev

# Optional: Webhook for user sync
CLERK_WEBHOOK_SECRET=whsec_...

# Auth URLs (customize if needed)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## Security Rules

- **⚠️ ASK BEFORE**: Modifying any auth code
- **⚠️ ASK BEFORE**: Changing middleware.ts
- **🚫 FORBIDDEN**: Logging tokens or credentials
- **🚫 FORBIDDEN**: Storing plain-text secrets

## Related Files

- `middleware.ts` — Clerk auth middleware (root level)
- `convex/auth.config.js` — Convex auth configuration
- `convex/users.ts` — User operations with Clerk integration

## Notes

- User data is synced from Clerk to Convex via webhooks
- JWT tokens are validated by Convex using Clerk's issuer domain
- YouTube OAuth for analytics is planned for Phase 2
