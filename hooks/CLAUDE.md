# Hooks Directory — Claude Context

This directory contains root-level custom React hooks shared across the application.

> Note: App-specific hooks live in `app/hooks/` — see `@app/CLAUDE.md`

## Structure

```
hooks/
├── use-mobile.ts       # Responsive breakpoint detection
└── useClickOutside.tsx # Click outside detection
```

## Current Hooks

### use-mobile.ts

Detects mobile viewport for responsive layouts.

```typescript
import { useMobile } from "@/hooks/use-mobile"

function Component() {
  const isMobile = useMobile()
  
  return isMobile ? <MobileView /> : <DesktopView />
}
```

### useClickOutside.tsx

Detects clicks outside a referenced element.

```typescript
import { useClickOutside } from "@/hooks/useClickOutside"

function Dropdown() {
  const ref = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  
  useClickOutside(ref, () => setIsOpen(false))
  
  return <div ref={ref}>{/* dropdown content */}</div>
}
```

## Hook Conventions

### Naming

- **File**: `use-[name].ts` (kebab-case)
- **Export**: `use[Name]` (camelCase)

### Structure

```typescript
import { useCallback, useEffect, useState } from "react"

type UseExampleProps = {
  initialValue?: string
}

type UseExampleReturn = {
  value: string
  setValue: (v: string) => void
  reset: () => void
}

export function useExample({ initialValue = "" }: UseExampleProps = {}): UseExampleReturn {
  const [value, setValue] = useState(initialValue)
  
  const reset = useCallback(() => {
    setValue(initialValue)
  }, [initialValue])
  
  return { value, setValue, reset }
}
```

### Best Practices

1. **Type Props**: Define input props type
2. **Type Returns**: Define return type explicitly
3. **Memoize Callbacks**: Use `useCallback` for returned functions
4. **Memoize Values**: Use `useMemo` for expensive computations
5. **Cleanup Effects**: Return cleanup functions from `useEffect`

## Related Hook Locations

| Location | Purpose |
|----------|---------|
| `hooks/` | Root-level, truly shared hooks |
| `app/hooks/` | App-specific hooks |
| `app/components/chat/` | Chat-specific hooks (`use-chat-core.ts`, etc.) |
| `lib/hooks/` | Library-level hooks |

## When to Add Here

Add a hook to this directory when:

1. It's used by multiple unrelated components
2. It's not tied to specific app features
3. It's a general utility (viewport, events, etc.)

## Notes

<!-- TODO: Consider consolidating app/hooks and hooks/ -->
<!-- TODO: Add useMediaQuery for more granular breakpoints -->
