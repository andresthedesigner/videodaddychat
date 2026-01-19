# Lint Errors to Fix

> Generated from Vercel deployment check on 2026-01-19
> Build: ✅ SUCCESS | TypeScript: ✅ PASSED | ESLint: ❌ 44 errors, 19 warnings

## Quick Reference

```bash
# Verify fixes
bun run typecheck          # TypeScript check
npx eslint app lib components hooks convex --ext .ts,.tsx  # ESLint check
bun run build              # Full production build
```

---

## Priority 1: Unused Variables/Imports (Errors)

These are the most common errors. Fix by either:
1. **Remove** the unused import/variable entirely
2. **Use** the variable if it was intended to be used
3. **Prefix with `_`** only if the variable is intentionally unused (e.g., rest destructuring)

> **Note:** Variables already prefixed with `_` that show as "unused" should have the underscore prefix removed from the error—ESLint is flagging them because they're destructured but not used at all. Either remove them from destructuring or actually use them.

### `lib/config.ts`

**Issue:** 4 unused Lucide icon imports

```
Line 2:  'BookOpenText' is defined but never used
Line 4:  'Code' is defined but never used
Line 5:  'Lightbulb' is defined but never used
Line 8:  'Sparkle' is defined but never used
```

**Fix:** Remove unused imports from the import statement.

---

### `lib/api.ts`

**Issue:** 2 unused variables

```
Line 1:   'APP_DOMAIN' is defined but never used
Line 100: '_unused' is defined but never used
```

**Fix:** 
- Remove `APP_DOMAIN` from imports if not needed
- Remove `_unused` from destructuring or use it

---

### `lib/usage.ts`

**Issue:** 7 unused function parameters

```
Line 28: '_userId' is defined but never used
Line 40: '_userId' is defined but never used
Line 47: '_userId' is defined but never used
Line 57: '_userId' is defined but never used
Line 89: '_userId' is defined but never used
Line 90: '_modelId' is defined but never used
Line 91: '_isAuthenticated' is defined but never used
```

**Fix:** These appear to be placeholder parameters in stub functions. Either:
- Implement the actual logic using these parameters
- Remove parameters if they're truly not needed
- Use `_` prefix correctly: `(_userId: string)` if the signature must be preserved

---

### `lib/user-keys.ts`

**Issue:** 2 unused function parameters

```
Line 14: '_userId' is defined but never used
Line 15: '_provider' is defined but never used
```

**Fix:** Same as above—implement logic or clean up signature.

---

### `lib/server/api.ts`

**Issue:** 2 unused function parameters

```
Line 20: '_userId' is defined but never used
Line 21: '_isAuthenticated' is defined but never used
```

**Fix:** Implement authentication logic or remove unused params.

---

### `lib/user-store/api.ts`

**Issue:** 6 unused variables/imports

```
Line 14: 'useClerk' is defined but never used
Line 21: '_id' is defined but never used
Line 34: '_id' is defined but never used
Line 35: '_updates' is defined but never used
Line 61: '_userId' is defined but never used
Line 62: '_onUpdate' is defined but never used
```

**Fix:** Remove `useClerk` import if unused. For function params, implement logic or clean up.

---

### `lib/file-handling.ts`

**Issue:** 1 unused import

```
Line 4: 'DAILY_FILE_UPLOAD_LIMIT' is defined but never used
```

**Fix:** Remove from imports or use it in the file.

---

### `lib/ai/context-management.ts`

**Issue:** 1 unused variable

```
Line 297: '_messages' is defined but never used
```

**Fix:** Remove from destructuring or implement logic using it.

---

### `lib/ai/sub-agents/orchestrator.ts`

**Issue:** 1 unused variable

```
Line 325: '_input' is defined but never used
```

**Fix:** Remove from destructuring or implement logic using it.

---

### `lib/user-preference-store/provider.tsx`

**Issue:** 1 unused variable

```
Line 139: 'error' is defined but never used
```

**Fix:** Either log the error, handle it, or remove from destructuring.

---

### `app/api/chat/db.ts`

**Issue:** 2 unused destructured variables

```
Line 12: '_messageGroupId' is defined but never used
Line 13: '_model' is defined but never used
```

**Fix:** Remove from destructuring if not needed for the current implementation.

---

### `app/api/chat/route.ts`

**Issue:** 1 unused variable

```
Line 39: 'editCutoffTimestamp' is assigned a value but never used
```

**Fix:** Either use this timestamp in the logic or remove the assignment.

---

### `app/share/[chatId]/page.tsx`

**Issue:** 1 unused import

```
Line 3: 'notFound' is defined but never used
```

**Fix:** Remove import or implement 404 handling with `notFound()`.

---

### `components/motion-primitives/animated-group.tsx`

**Issue:** 1 unused import

```
Line 2: 'ComponentProps' is defined but never used
```

**Fix:** Remove from imports.

---

### `components/motion-primitives/text-effect.tsx`

**Issue:** 1 unused variable

```
Line 183: '_' is assigned a value but never used
```

**Fix:** This is likely from array destructuring like `[_, value]`. Use `[, value]` instead.

---

### `components/prompt-kit/code-block.tsx`

**Issue:** 1 unused variable

```
Line 38: 'theme' is assigned a value but never used
```

**Fix:** Remove assignment or use the theme variable.

---

## Priority 2: Type Safety (Errors)

### `app/components/multi-chat/multi-chat.tsx`

**Issue:** 6 uses of `any` type

```
Line 56:  Unexpected any. Specify a different type
Line 57:  Unexpected any. Specify a different type
Line 71:  Unexpected any. Specify a different type
Line 72:  Unexpected any. Specify a different type
Line 145: Unexpected any. Specify a different type
```

**Fix:** Replace `any` with proper types. Check what the actual data structures are and type them correctly.

---

### `lib/user-preference-store/utils.ts`

**Issue:** 2 uses of `any` type

```
Line 22: Unexpected any. Specify a different type
Line 34: Unexpected any. Specify a different type
```

**Fix:** Replace with proper types based on the data being handled.

---

### `components/motion-primitives/animated-background.tsx`

**Issue:** 1 use of `any` type

```
Line 49: Unexpected any. Specify a different type
```

**Fix:** Type the parameter/variable properly.

---

### `components/ui/morphing-popover.tsx`

**Issue:** 1 use of `any` type

```
Line 128: Unexpected any. Specify a different type
```

**Fix:** Type the parameter/variable properly.

---

## Priority 3: React Best Practices (Errors)

### `app/components/multi-chat/multi-chat.tsx`

**Issue:** Unescaped apostrophe

```
Line 384: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`
```

**Fix:** Replace `'` with `&apos;` or use template literals/curly braces: `{"don't"}`.

---

## Priority 4: Warnings (Lower Priority)

### React Hook Dependency Warnings

These may or may not need fixing depending on intent:

| File | Lines | Missing Dependencies |
|------|-------|---------------------|
| `components/motion-primitives/cursor.tsx` | 47, 67, 93 | `cursorX`, `cursorY`, `attachToParent`, ref cleanup |
| `components/motion-primitives/magnetic.tsx` | 64 | `x`, `y` |
| `components/motion-primitives/text-scramble.tsx` | 78 | `scramble` |
| `components/ui/morphing-popover.tsx` | 193 | `context` |
| `components/ui/response-stream.tsx` | 138 | `onError` |

**Fix Options:**
1. Add missing dependencies to the array
2. Use `useCallback` to memoize functions
3. Add `// eslint-disable-next-line react-hooks/exhaustive-deps` if intentional

---

### Next.js Image Warnings

Using `<img>` instead of `<Image />`:

| File | Line |
|------|------|
| `app/components/chat-input/popover-content-auth.tsx` | 69 |
| `app/components/chat/dialog-auth.tsx` | 71 |
| `app/components/chat/link-markdown.tsx` | 25 |
| `components/ui/image.tsx` | 68 |
| `components/ui/source.tsx` | 71, 109 |

**Fix:** Import and use `Image` from `next/image` for better performance, or add `// eslint-disable-next-line @next/next/no-img-element` if `<img>` is intentional.

---

### Anonymous Default Export Warnings

| File | Line |
|------|------|
| `components/motion-primitives/disclosure.tsx` | 184 |
| `convex/auth.config.js` | 8 |

**Fix:** Assign to a named variable before exporting:

```typescript
// Before
export default { ... }

// After
const config = { ... }
export default config
```

---

## Build Warnings (Non-blocking) ✅ RESOLVED

### 1. Middleware Deprecation ✅

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**Location:** `middleware.ts` → **Renamed to `proxy.ts`**
**Status:** RESOLVED - File renamed to follow Next.js 16 proxy convention.

### 2. Missing metadataBase ✅

```
⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images
```

**Location:** `app/layout.tsx`
**Status:** RESOLVED - Added `metadataBase: new URL(APP_DOMAIN)` to metadata export.

---

## Verification Checklist

After fixing, run these commands to verify:

- [ ] `bun run typecheck` — No TypeScript errors
- [ ] `npx eslint app lib components hooks convex --ext .ts,.tsx` — No ESLint errors
- [ ] `bun run build` — Build succeeds without errors

---

*Total: 44 errors, 19 warnings to address*
