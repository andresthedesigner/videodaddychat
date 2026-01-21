# Tailwind 4 CSS Variable Syntax Migration

## Overview

Tailwind 4 changed the syntax for CSS custom properties (variables) in arbitrary values. This document provides instructions for AI agents to scan and fix legacy syntax patterns.

## The Problem

| Tailwind Version | Syntax | Status |
|------------------|--------|--------|
| Tailwind 3 | `w-[--custom-property]` | **Deprecated** — Does NOT work |
| Tailwind 4 | `w-(--custom-property)` | **Correct** — Parentheses syntax |
| Tailwind 4 | `w-[var(--custom-property)]` | **Correct** — Explicit var() |

### Why This Breaks

In Tailwind 3, the shorthand `[--property]` was automatically expanded to `var(--property)`. Tailwind 4 removed this implicit behavior. The new parentheses syntax `(--property)` is now required for CSS variables.

## Search Patterns

### Files to Scan

```bash
# All TSX/JSX files with className attributes
**/*.tsx
**/*.jsx

# CSS/Tailwind files
**/*.css
```

### Regex Patterns to Find Issues

```regex
# Pattern 1: className with bracket syntax for CSS variables (BROKEN)
className="[^"]*\w+-\[--[a-zA-Z0-9-]+\][^"]*"

# Pattern 2: Any arbitrary value with bare CSS variable (BROKEN)
\w+-\[--[a-zA-Z0-9-]+\]

# Specific common Radix/Shadcn patterns to check:
w-\[--radix-
h-\[--radix-
max-w-\[--radix-
max-h-\[--radix-
min-w-\[--radix-
min-h-\[--radix-
origin-\[--radix-
```

## Transformation Rules

### Rule 1: Width/Height/Size Properties

```diff
# Before (Tailwind 3 - BROKEN)
- w-[--radix-popper-anchor-width]
- h-[--radix-popper-anchor-height]
- min-w-[--sidebar-width]
- max-h-[--radix-dropdown-menu-content-available-height]

# After (Tailwind 4 - FIXED)
+ w-(--radix-popper-anchor-width)
+ h-(--radix-popper-anchor-height)
+ min-w-(--sidebar-width)
+ max-h-(--radix-dropdown-menu-content-available-height)
```

### Rule 2: Transform Origin

```diff
# Before (BROKEN)
- origin-[--radix-dropdown-menu-content-transform-origin]

# After (FIXED)
+ origin-(--radix-dropdown-menu-content-transform-origin)
```

### Rule 3: Any Arbitrary CSS Variable

```diff
# Generic pattern
- {utility}-[--{variable-name}]
+ {utility}-(--{variable-name})
```

## AI Agent Instructions

### Step 1: Search for Broken Patterns

```bash
# Use ripgrep to find all instances
rg '\w+-\[--[a-zA-Z0-9-]+\]' --type tsx --type jsx -l

# Or with file extensions
rg '\w+-\[--[a-zA-Z0-9-]+\]' -g '*.tsx' -g '*.jsx'
```

### Step 2: Verify Each Match

For each match, check if it's:
1. Inside a `className` attribute or `cn()` function call
2. A CSS custom property (starts with `--`)
3. NOT already using `var()` syntax

### Step 3: Apply Fix

Transform: `[--property]` → `(--property)`

**Important**: Only change the brackets to parentheses. Do NOT:
- Change the property name
- Add or remove the `--` prefix
- Modify surrounding classes

### Step 4: Verify Fix

```bash
# Run lint and typecheck
bun run lint && bun run typecheck

# Or with npm
npm run lint && npm run typecheck
```

## Common Radix/Shadcn Variables

These are the most common CSS variables to check:

| Variable | Used For |
|----------|----------|
| `--radix-popper-anchor-width` | Dropdown/popover width matching trigger |
| `--radix-popper-anchor-height` | Dropdown/popover height matching trigger |
| `--radix-dropdown-menu-content-available-height` | Max height for dropdown content |
| `--radix-dropdown-menu-content-transform-origin` | Transform origin for animations |
| `--radix-popover-content-available-height` | Max height for popover content |
| `--radix-popover-content-transform-origin` | Transform origin for popovers |
| `--sidebar-width` | Sidebar width variable |
| `--sidebar-width-icon` | Collapsed sidebar width |

## Validation Checklist

After making changes:

- [ ] `bun run lint` passes
- [ ] `bun run typecheck` passes
- [ ] Visual inspection: affected components render correctly
- [ ] CSS variable values are applied (check DevTools computed styles)

## Example Fix

**File:** `app/components/layout/user-menu.tsx`

```diff
<DropdownMenuContent
  side="top"
  align="start"
- className="w-[--radix-popper-anchor-width]"
+ className="w-(--radix-popper-anchor-width)"
>
```

## References

- [Tailwind CSS v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Shadcn Sidebar Documentation](https://ui.shadcn.com/docs/components/sidebar)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)

---

*Document created for AI agent consumption. Optimized for automated codebase scanning and fixing.*
