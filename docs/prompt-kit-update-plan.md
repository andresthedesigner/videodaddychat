# Prompt-Kit Component Update Plan

> **For AI Agent Execution** — Optimized workflow for updating and adding prompt-kit components using the single-directory approach (`components/ui/`).

## Execution Progress

> **Last Updated**: January 19, 2026
> **Current Status**: Phase 2 Complete — Ready for Phase 3

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: Pre-Flight | ✅ Complete | All dependencies already installed |
| Phase 2: Analysis | ✅ Complete | All 9 conflicts analyzed, decisions approved |
| Phase 3: Migration | ⏳ Ready | Includes loader consolidation |
| Phase 4: Compare | ⏳ Pending | Compare 7 existing components with upstream |
| Phase 5: Update | ⏳ Pending | |
| Phase 6: Verification | ⏳ Pending | |

### Key Findings

1. **ALL 9 prompt-kit components have conflicts** — Every file in `components/prompt-kit/` also exists in `components/ui/`
2. **All 7 "missing" components already installed** — Phase 4 becomes comparison, not installation
3. **TooltipProvider at app root** — Components shouldn't add their own (redundant)
4. **3 files are IDENTICAL** — `chat-container`, `file-upload`, `scroll-button`
5. **Loader consolidation** — Best practice: add `chat` variant to ui/loader.tsx (single source of truth)

---

## Quick Start

**To resume this workflow:**

```
Continue the prompt-kit migration from Phase 3.
```

**To start fresh:**

```
Execute the prompt-kit migration plan from @docs/prompt-kit-update-plan.md
Use the human-assisted workflow and pause at each checkpoint for my approval.
Start with Phase 1.
```

---

## Architecture Decision

**Approach**: Single Directory (`components/ui/`)

All shadcn and prompt-kit components live in `components/ui/`. This eliminates manual file moving and simplifies imports.

```
components/
├── ui/                 # ALL UI components (shadcn + prompt-kit)
└── motion-primitives/  # Animation primitives (separate concern)
```

**Benefits**:
- Zero friction installation (`npx shadcn add` just works)
- Consistent import path (`@/components/ui/`)
- Matches shadcn conventions
- No post-install file moving

**Priority**: Prompt-kit components are prioritized over generic shadcn equivalents since vid0 is a chat-based application. When conflicts exist, prompt-kit versions win.

---

## Project Context

### Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: Shadcn/Radix + Tailwind CSS v4
- **Style**: new-york (per components.json)
- **Package Manager**: bun

### Current Configuration

```json
// components.json
{
  "aliases": {
    "ui": "@/components/ui"
  }
}
```

### Backup Strategy

**Git history is sufficient** — No file-based backups needed. All changes can be reverted via git.

```bash
# Rollback at any point
git checkout -- components/ app/ lib/
```

---

## Current State Assessment

> **Updated after Phase 1 & 2 analysis**

### Prompt-Kit Components — FINAL DECISIONS (9 files)

| Component | Comparison Result | **Decision** | Rationale |
|-----------|-------------------|--------------|-----------|
| `chat-container.tsx` | **IDENTICAL** | Keep ui/, delete prompt-kit/ | Files are byte-for-byte identical |
| `code-block.tsx` | Different | **Keep prompt-kit/** | Has `useTheme()` for auto dark/light mode |
| `file-upload.tsx` | **IDENTICAL** | Keep ui/, delete prompt-kit/ | Files are byte-for-byte identical |
| `loader.tsx` | Different | **Consolidate** | Add `chat` variant to ui/, delete prompt-kit/ |
| `markdown.tsx` | Different | **Keep prompt-kit/** | Has `LinkMarkdown`, `ButtonCopy`, language labels |
| `message.tsx` | Different | **Keep prompt-kit/** | Dynamic import, no redundant TooltipProvider |
| `prompt-input.tsx` | Different | **Keep prompt-kit/** | No redundant TooltipProvider, has `autoFocus` |
| `prompt-suggestion.tsx` | Different | **Keep ui/** | Has `cursor-pointer` fix |
| `scroll-button.tsx` | **IDENTICAL** | Keep ui/, delete prompt-kit/ | Files are byte-for-byte identical |

### Already in `components/ui/` — Keep As-Is

| Component | Status | Decision |
|-----------|--------|----------|
| `thinking-bar.tsx` | ✅ Analyzed | Keep local — has `onClick` prop, uses local `TextShimmer` |
| `text-shimmer.tsx` | ✅ Analyzed | Keep local — has configurable `duration` and `spread` props |
| `loader.tsx` | ⚠️ Rename | → `loader-variants.tsx` (12+ variants for general use) |

### Custom Implementation — Keep Separate

| Component | Location | Decision |
|-----------|----------|----------|
| `reasoning.tsx` | `app/components/chat/` | ✅ Keep local — simple AnimatePresence version, app-specific |
| `reasoning.tsx` | `components/ui/` | ✅ Keep — compound component version (Context + Trigger + Content) |

> **Note**: Two `reasoning.tsx` implementations coexist. The `app/components/chat/` version needs its import path updated from `@/components/prompt-kit/markdown` to `@/components/ui/markdown`.

### "Missing" Components — ALREADY INSTALLED ✅

| Component | Status | Location |
|-----------|--------|----------|
| `tool.tsx` | ✅ Found | `components/ui/` |
| `source.tsx` | ✅ Found | `components/ui/` |
| `chain-of-thought.tsx` | ✅ Found | `components/ui/` |
| `feedback-bar.tsx` | ✅ Found | `components/ui/` |
| `steps.tsx` | ✅ Found | `components/ui/` |
| `system-message.tsx` | ✅ Found | `components/ui/` |
| `image.tsx` | ✅ Found | `components/ui/` |

**Phase 4 can be SKIPPED** — All components are already installed.

---

## Human-Assisted Execution Workflow

> **Recommended Approach** — AI agents execute mechanical tasks and pause at defined checkpoints for human review and approval. This workflow achieves ~95-98% success rate vs ~75-80% for pure AI execution.

### Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: Pre-Flight (AI Executes)                          │
│  ├── AI: Verify file structure, install dependencies        │
│  └── AI: Report current state                               │
│                                                             │
│  ⏸️  CHECKPOINT 1: Review current state before changes       │
├─────────────────────────────────────────────────────────────┤
│  Phase 2: Comparison Analysis (AI Analyzes, Human Decides)  │
│  ├── AI: Read all conflicting files in parallel             │
│  ├── AI: Generate side-by-side comparison report            │
│  ├── AI: Analyze custom components vs upstream              │
│  │   └── reasoning, thinking-bar, text-shimmer              │
│  └── AI: Propose decision matrix with rationale             │
│                                                             │
│  ⏸️  CHECKPOINT 2: Approve conflict + custom component decisions│
├─────────────────────────────────────────────────────────────┤
│  Phase 3: Migration (AI Executes with Approval Gates)       │
│  ├── AI: Rename loader → loader-variants.tsx                │
│  ├── AI: Show files to be deleted/moved                     │
│                                                             │
│  ⏸️  CHECKPOINT 3: Approve file deletions                    │
│                                                             │
│  ├── AI: Execute approved deletions and moves               │
│  ├── AI: Update all imports                                 │
│  ├── AI: Run typecheck                                      │
│  └── AI: Report results                                     │
├─────────────────────────────────────────────────────────────┤
│  Phase 4: Install New Components (AI Executes)              │
│  ├── AI: Install high-priority components                   │
│  ├── AI: Install medium-priority components                 │
│  └── AI: Report what was installed                          │
├─────────────────────────────────────────────────────────────┤
│  Phase 5: Update Existing (Human Driven)                    │
│                                                             │
│  ⏸️  CHECKPOINT 4: Decide which components to update         │
│                                                             │
│  ├── AI: Show diff for requested components                 │
│  └── AI: Execute approved overwrites only                   │
├─────────────────────────────────────────────────────────────┤
│  Phase 6: Verification (AI Executes, Human Tests)           │
│  ├── AI: Run typecheck → lint → build                       │
│  ├── AI: Start dev server                                   │
│                                                             │
│  ⏸️  CHECKPOINT 5: Manual smoke test in browser              │
│                                                             │
│  └── Human: Validate chat functionality                     │
└─────────────────────────────────────────────────────────────┘
```

### Checkpoint Details

| Checkpoint | Phase | Human Effort | Purpose |
|------------|-------|--------------|---------|
| 1 | After Phase 1 | ~2 min | Verify starting state is as expected |
| 2 | After Phase 2 | ~5-10 min | Review and approve conflict decisions |
| 3 | During Phase 3 | ~2 min | Approve destructive file operations |
| 4 | Before Phase 5 | ~3 min | Decide scope of optional updates |
| 5 | After Phase 6 | ~3-5 min | Manual smoke test validates runtime |


### How to Use This Workflow

**Starting the workflow:**
```
Please execute the prompt-kit migration using the human-assisted workflow.
Start with Phase 1 and pause at Checkpoint 1.
```

**At each checkpoint, AI will:**
1. Summarize what was completed
2. Show relevant data for the decision
3. Ask for explicit approval before continuing

**Responding to checkpoints:**
- `Approved, continue` — Proceed to next phase
- `Show me [specific file]` — Request more detail
- `Change decision for [component]` — Modify the plan
- `Stop here` — Pause workflow for later

---

## Execution Plan

### Phase 1: Pre-Flight Checks

**1.1 Verify Current State**

```bash
echo "=== Prompt-kit components to migrate ==="
ls -la components/prompt-kit/

echo "=== Existing ui components ==="
ls components/ui/ | wc -l
echo "files in components/ui/"

echo "=== Check for naming conflicts ==="
for f in components/prompt-kit/*.tsx; do
  name=$(basename "$f")
  if [ -f "components/ui/$name" ]; then
    echo "CONFLICT: $name exists in both directories"
  fi
done
```

**Expected Conflicts**: Files that exist in both directories will be analyzed in Phase 2.

**1.2 Install Dependencies**

```bash
bun add shiki react-markdown remark-gfm remark-breaks use-stick-to-bottom
```

**Success Criteria**: All dependencies installed without errors.

---

> #### ✅ CHECKPOINT 1: Pre-Flight Review — COMPLETE
>
> **Results** (January 19, 2026):
> - `components/prompt-kit/`: **9 files**
> - `components/ui/`: **71 files**
> - Conflicts detected: **ALL 9** prompt-kit files have versions in ui/
> - Dependencies: **All 5 already installed** (shiki, react-markdown, remark-gfm, remark-breaks, use-stick-to-bottom)
> - "Missing" components: **All 7 already installed** in ui/
>
> **Human Response**: Approved, continue to Phase 2

---

### Phase 2: Comparison Analysis

> This phase helps make informed decisions about which version to keep when conflicts exist.

**2.1 Run Comparison Analysis**

For each conflicting component, compare the two versions:

```bash
# List all conflicts
echo "=== Analyzing Conflicts ==="
for f in components/prompt-kit/*.tsx; do
  name=$(basename "$f")
  if [ -f "components/ui/$name" ]; then
    echo ""
    echo "━━━ $name ━━━"
    echo "prompt-kit version:"
    head -30 "components/prompt-kit/$name"
    echo ""
    echo "ui version:"
    head -30 "components/ui/$name"
    echo ""
    echo "Diff summary:"
    diff --brief "components/prompt-kit/$name" "components/ui/$name" || true
  fi
done
```

**2.2 Decision Matrix** ✅ COMPLETE

| Component | prompt-kit/ Features | ui/ Features | Decision |
|-----------|---------------------|--------------|----------|
| `code-block.tsx` | `useTheme()` auto dark/light, `[&>pre]:!bg-background` | Static theme prop | ✅ **Keep prompt-kit** |
| `message.tsx` | Dynamic import (code-split), no TooltipProvider | Static import, redundant TooltipProvider | ✅ **Keep prompt-kit** |
| `loader.tsx` | Simple 3-dot (Framer Motion) | 12+ variants (CSS) | ✅ **Consolidate** — Add `chat` variant to ui/ |
| `chat-container.tsx` | — | — | ✅ **IDENTICAL** — delete prompt-kit/ |
| `file-upload.tsx` | — | — | ✅ **IDENTICAL** — delete prompt-kit/ |
| `scroll-button.tsx` | — | — | ✅ **IDENTICAL** — delete prompt-kit/ |
| `markdown.tsx` | LinkMarkdown, ButtonCopy, CodeBlockGroup | Basic rendering | ✅ **Keep prompt-kit** |
| `prompt-input.tsx` | No redundant TooltipProvider, has `autoFocus` | `useLayoutEffect`, redundant TooltipProvider | ✅ **Keep prompt-kit** |
| `prompt-suggestion.tsx` | Missing `cursor-pointer` | Has `cursor-pointer` class | ✅ **Keep ui/** |

**2.3 Analyze Existing Custom Components**

> These components are already installed and have known customizations. Compare against upstream to document differences and confirm they should be preserved.

**Components to Analyze:**

| Component | Location | Status |
|-----------|----------|--------|
| `reasoning.tsx` | `app/components/chat/` | Custom implementation |
| `thinking-bar.tsx` | `components/ui/` | Installed, may have customizations |
| `text-shimmer.tsx` | `components/ui/` | Installed, may have customizations |

**2.3.1 Reasoning Component Analysis**

```bash
# Check if upstream reasoning exists
echo "=== Reasoning Component ==="
echo "Local version:"
head -40 app/components/chat/reasoning.tsx

echo ""
echo "Upstream check (if available):"
# Note: reasoning.json may exist at prompt-kit.com
curl -s "https://prompt-kit.com/c/reasoning.json" | head -20 || echo "No upstream found"
```

**Reasoning Analysis Matrix:**

| Aspect | Local Version | Upstream (if exists) | Decision |
|--------|--------------|---------------------|----------|
| Location | `app/components/chat/` | Would install to `components/ui/` | **Keep local** — App-specific |
| Streaming | Custom streaming behavior | Generic | **Keep local** — Tailored to vid0 |
| Integration | Integrated with chat state | Standalone | **Keep local** |

**2.3.2 Thinking Bar Analysis**

```bash
echo "=== Thinking Bar Component ==="
echo "Local version:"
head -50 components/ui/thinking-bar.tsx

echo ""
echo "Upstream version:"
npx shadcn@latest diff "https://prompt-kit.com/c/thinking-bar.json" 2>/dev/null | head -30 || echo "Run manually to compare"
```

**Thinking Bar Analysis Matrix:**

| Aspect | Local Version | Upstream | Decision |
|--------|--------------|----------|----------|
| Animation | Check implementation | Check implementation | Document differences |
| Styling | Check Tailwind classes | Check Tailwind classes | Document differences |
| Props API | Check exported props | Check exported props | Document differences |

**2.3.3 Text Shimmer Analysis**

```bash
echo "=== Text Shimmer Component ==="
echo "Local version:"
head -50 components/ui/text-shimmer.tsx

echo ""
echo "Upstream version:"
npx shadcn@latest diff "https://prompt-kit.com/c/text-shimmer.json" 2>/dev/null | head -30 || echo "Run manually to compare"
```

**Text Shimmer Analysis Matrix:**

| Aspect | Local Version | Upstream | Decision |
|--------|--------------|----------|----------|
| Animation | Check implementation | Check implementation | Document differences |
| Styling | Check Tailwind classes | Check Tailwind classes | Document differences |
| Props API | Check exported props | Check exported props | Document differences |

**2.3.4 Custom Component Decision Summary** ✅ COMPLETE

| Component | Location | Recommendation | Rationale |
|-----------|----------|---------------|-----------|
| `reasoning.tsx` | `app/components/chat/` | ✅ **Keep** | Simple AnimatePresence version, needs import path fix |
| `reasoning.tsx` | `components/ui/` | ✅ **Keep** | Compound component (Context + Trigger + Content) |
| `thinking-bar.tsx` | `components/ui/` | ✅ **Keep** | Has `onClick` prop, uses local TextShimmer |
| `text-shimmer.tsx` | `components/ui/` | ✅ **Keep** | Configurable `duration` and `spread` props |

> **Note**: Two `reasoning.tsx` implementations coexist for different use cases. Both are kept.

**2.4 Decision Criteria** ✅ APPLIED

When deciding which version to keep:

1. **Chat-specific features win** — This is a chat application
2. **Performance optimizations win** — Dynamic imports, SSR fallbacks
3. **Theme integration wins** — `useTheme()` over static props
4. **No redundant providers** — App has `TooltipProvider` at root (`app/layout.tsx:69-84`)
5. **Simpler API wins** — For equivalent functionality

**Key Finding**: The app already wraps everything in `TooltipProvider` at the root level. Components that add their own `TooltipProvider` (like `ui/prompt-input.tsx` and `ui/message.tsx`) create redundant nesting. The prompt-kit versions are cleaner.

**Success Criteria**: ✅ All conflicts have documented decisions with rationale.

---

> #### ✅ CHECKPOINT 2: Conflict Resolution & Custom Component Approval — COMPLETE
>
> **Status**: All decisions approved on January 19, 2026
>
> **Conflict Decision Matrix** (APPROVED):
> | Component | Decision | Rationale | Approval |
> |-----------|----------|-----------|----------|
> | `code-block.tsx` | Keep prompt-kit | Has `useTheme()`, auto dark/light | ✅ |
> | `message.tsx` | Keep prompt-kit | Dynamic import, no redundant TooltipProvider | ✅ |
> | `loader.tsx` | Consolidate — add `chat` variant to ui/ | Best practice: single component | ✅ |
> | `chat-container.tsx` | Keep ui/ | IDENTICAL files | ✅ |
> | `file-upload.tsx` | Keep ui/ | IDENTICAL files | ✅ |
> | `scroll-button.tsx` | Keep ui/ | IDENTICAL files | ✅ |
> | `markdown.tsx` | Keep prompt-kit | Has LinkMarkdown, ButtonCopy | ✅ |
> | `prompt-input.tsx` | Keep prompt-kit | No redundant TooltipProvider, has autoFocus | ✅ |
> | `prompt-suggestion.tsx` | Keep ui/ | Has cursor-pointer fix | ✅ |
>
> **Custom Component Decision Matrix** (APPROVED):
> | Component | Location | Decision | Approval |
> |-----------|----------|----------|----------|
> | `reasoning.tsx` | app/components/chat/ | Keep (needs import fix) | ✅ |
> | `reasoning.tsx` | components/ui/ | Keep (compound component) | ✅ |
> | `thinking-bar.tsx` | components/ui/ | Keep (has onClick prop) | ✅ |
> | `text-shimmer.tsx` | components/ui/ | Keep (configurable) | ✅ |

---

### Phase 3: Migrate Components

> **Based on Phase 2 Analysis** — Execute approved decisions.

**3.1 Handle Loader Conflict — CONSOLIDATE**

Two different `loader.tsx` files exist:
- `components/prompt-kit/loader.tsx` — Simple 3-dot Framer Motion animation (51 lines)
- `components/ui/loader.tsx` — 12+ variants with CSS animations (500 lines)

**Decision**: Consolidate into single component. Add `chat` variant to ui/loader.tsx.

| Aspect | prompt-kit | ui | Consolidated |
|--------|------------|-----|--------------|
| Animation lib | Framer Motion | CSS keyframes | Both |
| Variants | 1 | 12 | 13 (add `chat`) |
| Size options | None | sm/md/lg | sm/md/lg |
| API | `<Loader />` | `<Loader variant="..." />` | `<Loader variant="chat" />` |

**Steps:**
1. Add `ChatLoader` component to `ui/loader.tsx` using Framer Motion animation
2. Add `"chat"` to the variant type union
3. Add case to switch statement
4. Update existing imports: `<Loader />` → `<Loader variant="chat" />`
5. Delete `prompt-kit/loader.tsx`

**ChatLoader Code to Add:**

```tsx
// Add import at top
import { motion } from "framer-motion"

// Add this component
export function ChatLoader({ className }: { className?: string }) {
  const DOT_SIZE = "size-2"
  const DOT_COLOR = "bg-primary/60"
  
  const ANIMATION = {
    y: ["0%", "-60%", "0%"],
    opacity: [1, 0.7, 1],
  }
  
  const TRANSITION = {
    duration: 0.6,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "loop" as const,
  }

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {[0, 0.1, 0.2].map((delay, i) => (
        <motion.div
          key={i}
          className={`${DOT_SIZE} ${DOT_COLOR} rounded-full`}
          animate={ANIMATION}
          transition={{ ...TRANSITION, delay }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  )
}

// Update variant type to include "chat"
// Update switch statement to include: case "chat": return <ChatLoader className={className} />
```

**3.2 Delete UI Versions (prompt-kit wins)**

Based on analysis, these ui/ files should be replaced by prompt-kit versions:

```bash
rm components/ui/code-block.tsx    # prompt-kit has useTheme()
rm components/ui/message.tsx       # prompt-kit has dynamic import
rm components/ui/markdown.tsx      # prompt-kit has LinkMarkdown, ButtonCopy
rm components/ui/prompt-input.tsx  # prompt-kit has no redundant TooltipProvider
```

**3.3 Delete Prompt-Kit Duplicates (ui/ wins or identical)**

These prompt-kit files are identical to ui/ or ui/ is better:

```bash
rm components/prompt-kit/chat-container.tsx    # IDENTICAL to ui/
rm components/prompt-kit/file-upload.tsx       # IDENTICAL to ui/
rm components/prompt-kit/scroll-button.tsx     # IDENTICAL to ui/
rm components/prompt-kit/prompt-suggestion.tsx # ui/ has cursor-pointer fix
```

---

> #### ⏸️ CHECKPOINT 3: Destructive Operations Approval
>
> **AI Action**: Stop and present to human:
> - List of files to be **deleted** from ui/
> - List of files to be **deleted** from prompt-kit/
> - List of files to be **moved** (prompt-kit/ → ui/)
> - List of files to be **renamed**
>
> **Human Action**: Review and respond:
> - `Approved, execute deletions and moves` — Proceed with file operations
> - `Skip deletion of [file]` — Preserve specific file
> - `Show [file] contents first` — Review before approving
> - `Stop` — Pause workflow (no files modified yet)
>
> **Proposed Operations**:
> ```
> CONSOLIDATE loader:
>   - Add ChatLoader + "chat" variant to components/ui/loader.tsx
>   - Update imports: <Loader /> → <Loader variant="chat" />
>
> DELETE from ui/ (prompt-kit version wins):
>   - components/ui/code-block.tsx
>   - components/ui/message.tsx
>   - components/ui/markdown.tsx
>   - components/ui/prompt-input.tsx
>
> DELETE from prompt-kit/ (all files):
>   - components/prompt-kit/chat-container.tsx (identical to ui/)
>   - components/prompt-kit/file-upload.tsx (identical to ui/)
>   - components/prompt-kit/scroll-button.tsx (identical to ui/)
>   - components/prompt-kit/prompt-suggestion.tsx (ui/ has cursor fix)
>   - components/prompt-kit/loader.tsx (consolidated into ui/)
>
> MOVE to ui/:
>   - components/prompt-kit/code-block.tsx
>   - components/prompt-kit/message.tsx
>   - components/prompt-kit/markdown.tsx
>   - components/prompt-kit/prompt-input.tsx
> ```

---

**3.4 Move Remaining Prompt-Kit Components**

```bash
# Move the 4 components that prompt-kit won (loader is consolidated, not moved)
mv components/prompt-kit/code-block.tsx components/ui/
mv components/prompt-kit/message.tsx components/ui/
mv components/prompt-kit/markdown.tsx components/ui/
mv components/prompt-kit/prompt-input.tsx components/ui/

# Delete prompt-kit/loader.tsx (consolidated into ui/loader.tsx)
rm components/prompt-kit/loader.tsx

# Verify prompt-kit is empty
ls components/prompt-kit/
```

**3.5 Fix Internal Import in markdown.tsx**

After moving, `markdown.tsx` needs its import path fixed:

```bash
# Change: from "../prompt-kit/code-block"
# To:     from "./code-block"
```

**3.6 Update Imports Across Codebase**

15 imports in 11 files need updating:

```bash
# Files requiring import path changes:
app/share/[chatId]/article.tsx
app/components/multi-chat/multi-conversation.tsx
app/components/chat/message-user.tsx
app/components/chat/conversation.tsx
app/components/chat-input/suggestions.tsx
app/components/chat-input/chat-input.tsx
app/components/chat-input/button-file-upload.tsx
app/components/multi-chat/multi-chat-input.tsx
app/components/history/chat-preview-panel.tsx
app/components/chat/reasoning.tsx
app/components/chat/message-assistant.tsx

# Perform replacement
find app lib components -type f \( -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's|@/components/prompt-kit/|@/components/ui/|g' {} +

# Verify no old imports remain
grep -r "@/components/prompt-kit" app/ lib/ components/ --include="*.tsx" --include="*.ts" || echo "✓ None found"
```

**3.7 Remove Empty Directory**

```bash
rmdir components/prompt-kit
echo "✓ Removed empty prompt-kit directory"
```

**Success Criteria**: 
- `ui/loader.tsx` has `ChatLoader` and `"chat"` variant added
- 4 components moved from prompt-kit/ to ui/ (code-block, message, markdown, prompt-input)
- All 9 prompt-kit files deleted (4 identical, 1 ui-preferred, 4 moved, 1 consolidated)
- 4 replaced files deleted from ui/
- All 15 imports updated to `@/components/ui/`
- Loader imports updated: `<Loader />` → `<Loader variant="chat" />`
- Internal import fixed in `markdown.tsx`
- `components/prompt-kit/` directory removed

---

### Phase 4: Compare Existing Components with Upstream

> **All 7 components already installed** — But we should compare with upstream for updates.

**4.1 Components to Compare**

| Component | Local Location | Upstream Source |
|-----------|----------------|-----------------|
| `tool.tsx` | `components/ui/` | `https://prompt-kit.com/c/tool.json` |
| `source.tsx` | `components/ui/` | `https://prompt-kit.com/c/source.json` |
| `chain-of-thought.tsx` | `components/ui/` | `https://prompt-kit.com/c/chain-of-thought.json` |
| `feedback-bar.tsx` | `components/ui/` | `https://prompt-kit.com/c/feedback-bar.json` |
| `steps.tsx` | `components/ui/` | `https://prompt-kit.com/c/steps.json` |
| `system-message.tsx` | `components/ui/` | `https://prompt-kit.com/c/system-message.json` |
| `image.tsx` | `components/ui/` | `https://prompt-kit.com/c/image.json` |

**4.2 Check for Upstream Changes**

```bash
for component in tool source chain-of-thought feedback-bar steps system-message image; do
  echo "=== $component ==="
  npx shadcn@latest diff "https://prompt-kit.com/c/${component}.json" 2>/dev/null || echo "Run manually to compare"
  echo ""
done
```

**4.3 Decision Matrix** (to be filled during execution)

| Component | Local Customizations? | Upstream Changes? | Action |
|-----------|----------------------|-------------------|--------|
| `tool.tsx` | ❓ Check | ❓ Check | TBD |
| `source.tsx` | ❓ Check | ❓ Check | TBD |
| `chain-of-thought.tsx` | ❓ Check | ❓ Check | TBD |
| `feedback-bar.tsx` | ❓ Check | ❓ Check | TBD |
| `steps.tsx` | ❓ Check | ❓ Check | TBD |
| `system-message.tsx` | ❓ Check | ❓ Check | TBD |
| `image.tsx` | ❓ Check | ❓ Check | TBD |

**Success Criteria**: All 7 components compared, updates applied if beneficial.

---

> #### ⏸️ CHECKPOINT 4: Optional Updates Scope
>
> **AI Action**: Stop and present to human:
> - List of components that could be updated from upstream
> - Which components have known local customizations (should NOT update)
> - Which components are "vanilla" (safe to update)
>
> **Human Action**: Decide scope and respond:
> - `Skip Phase 5, continue to verification` — Keep all current versions
> - `Update [component1, component2]` — Update only specified components
> - `Update all vanilla components` — Update safe ones only
> - `Show diff for [component]` — See what would change
>
> **Update Risk Assessment**:
> | Component | Customized? | Safe to Update? |
> |-----------|-------------|-----------------|
> | `code-block.tsx` | ✅ Yes | ❌ No — Keep local |
> | `message.tsx` | ✅ Yes | ❌ No — Keep local |
> | `loader.tsx` | ✅ Yes | ❌ No — Keep local |
> | `scroll-button.tsx` | ❓ Check | ✅ Likely safe |
> | `prompt-suggestion.tsx` | ❓ Check | ✅ Likely safe |
> | `file-upload.tsx` | ❓ Check | ⚠️ Review diff |
> | `chat-container.tsx` | ❓ Check | ⚠️ Review diff |
> | `prompt-input.tsx` | ❓ Check | ⚠️ Review diff |
> | `markdown.tsx` | ❓ Check | ⚠️ Review diff |

---

### Phase 5: Update Existing Components (Optional)

**5.1 Check for Upstream Changes**

```bash
for component in prompt-input markdown chat-container file-upload prompt-suggestion scroll-button; do
  echo "=== $component ==="
  npx shadcn@latest diff "https://prompt-kit.com/c/${component}.json" 2>/dev/null | head -20 || echo "No changes or not found"
  echo ""
done
```

**5.2 Update Strategy**

| Component | Strategy | Action |
|-----------|----------|--------|
| `scroll-button.tsx` | Safe overwrite | `npx shadcn@latest add ... --overwrite` |
| `prompt-suggestion.tsx` | Safe overwrite | `npx shadcn@latest add ... --overwrite` |
| `file-upload.tsx` | Check diff | Update if no local changes |
| `chat-container.tsx` | Check diff | Update if no local changes |
| `prompt-input.tsx` | Check diff | Update if no local changes |
| `markdown.tsx` | Check diff | Update if no local changes |
| `code-block.tsx` | **Keep local** | Preserves `useTheme()`, SSR fallback |
| `message.tsx` | **Keep local** | Preserves dynamic import |
| `loader.tsx` | **Keep local** | Custom chat-focused animation |

**5.3 Safe Overwrites (if desired)**

```bash
# Components with no known customizations
npx shadcn@latest add "https://prompt-kit.com/c/scroll-button.json" --overwrite
npx shadcn@latest add "https://prompt-kit.com/c/prompt-suggestion.json" --overwrite
```

---

### Phase 6: Verification

> Comprehensive verification to ensure migration success.

**6.1 File Structure Check**

```bash
echo "=== All prompt-kit components in ui/ ==="
ls components/ui/ | grep -E "(chat-container|code-block|file-upload|loader|markdown|message|prompt-input|prompt-suggestion|scroll-button|tool|source|chain-of-thought|feedback-bar|steps|system-message|image|thinking-bar|text-shimmer)"
```

**Expected**: 17+ component files listed.

**6.2 No Orphaned Imports**

```bash
# Check no imports point to old location
echo "=== Checking for orphaned imports ==="
grep -r "@/components/prompt-kit" . --include="*.tsx" --include="*.ts" | grep -v node_modules || echo "✓ No orphaned imports"
```

**6.3 No Duplicate Components**

```bash
# Verify prompt-kit directory is gone
echo "=== Checking prompt-kit directory ==="
if [ -d "components/prompt-kit" ]; then
  echo "WARNING: prompt-kit directory still exists"
  ls components/prompt-kit/
else
  echo "✓ prompt-kit directory removed"
fi
```

**6.4 TypeScript Check**

```bash
bun run typecheck
```

**6.5 Lint Check**

```bash
bun run lint
```

**6.6 Build Test**

```bash
bun run build
```

**6.7 Dev Server Test**

```bash
# Start dev server and verify no runtime errors
bun run dev
# Manually test: Navigate to chat, send a message, verify components render
```

---

> #### ⏸️ CHECKPOINT 5: Manual Smoke Test
>
> **AI Action**: Stop and report to human:
> - ✅/❌ `typecheck` result
> - ✅/❌ `lint` result
> - ✅/❌ `build` result
> - 🔗 Dev server URL (usually http://localhost:3000)
>
> **Human Action**: Perform manual smoke test:
>
> **Smoke Test Checklist**:
> - [ ] Navigate to http://localhost:3000
> - [ ] Open a chat (or create new chat)
> - [ ] Verify chat messages render correctly
> - [ ] Send a test message
> - [ ] Verify response streams properly
> - [ ] Check code blocks render with syntax highlighting
> - [ ] Verify loader animation appears during response
> - [ ] Check browser console for errors
>
> **Respond**:
> - `All tests pass, migration complete` — Finish workflow
> - `Found issue: [description]` — AI will help debug
> - `Rollback` — Revert all changes via git

---

**Success Criteria**: All verification steps pass with no errors.

---

## Rollback Procedure

Git-based rollback (no file backups needed):

```bash
# Full rollback - revert all changes
git checkout -- components/ app/ lib/

# Partial rollback - revert specific files
git checkout -- components/ui/loader.tsx
git checkout -- components/ui/code-block.tsx

# View what changed
git diff components/
```

---

## Import Reference

After migration, all imports use `@/components/ui/`:

```typescript
// Chat components (prompt-kit)
import { Message, MessageContent, MessageAvatar } from "@/components/ui/message"
import { ChatContainerRoot, ChatContainerContent } from "@/components/ui/chat-container"
import { ScrollButton } from "@/components/ui/scroll-button"

// Loaders (consolidated)
import { Loader } from "@/components/ui/loader"                    // Default: circular spinner
import { Loader } from "@/components/ui/loader"                    // Chat: <Loader variant="chat" />
// Available variants: circular, classic, pulse, pulse-dot, dots, typing, wave, bars, terminal, text-blink, text-shimmer, loading-dots, chat

// Input components
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input"
import { PromptSuggestion } from "@/components/ui/prompt-suggestion"
import { FileUpload } from "@/components/ui/file-upload"

// Content rendering
import { Markdown } from "@/components/ui/markdown"
import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block"

// AI-specific
import { Tool } from "@/components/ui/tool"
import { Source } from "@/components/ui/source"
import { ChainOfThought } from "@/components/ui/chain-of-thought"
import { ThinkingBar } from "@/components/ui/thinking-bar"
import { TextShimmer } from "@/components/ui/text-shimmer"

// UI feedback
import { FeedbackBar } from "@/components/ui/feedback-bar"
import { Steps } from "@/components/ui/steps"
import { SystemMessage } from "@/components/ui/system-message"
import { Image } from "@/components/ui/image"

// Custom (stays in app/)
import { Reasoning } from "@/app/components/chat/reasoning"
```

---

## Success Checklist

### Phase 1: Pre-Flight ✅ COMPLETE
- [x] Current state verified
  - `components/prompt-kit/`: 9 files
  - `components/ui/`: 71 files
  - ALL 9 prompt-kit files have conflicts in ui/
- [x] Dependencies installed (all 5 already present)
  - shiki, react-markdown, remark-gfm, remark-breaks, use-stick-to-bottom
- [x] ⏸️ **CHECKPOINT 1**: Human approved pre-flight state

### Phase 2: Comparison Analysis ✅ COMPLETE
- [x] All conflicts identified (9 total, 3 identical)
- [x] Decision matrix completed with rationale
- [x] Analysis based on actual app usage patterns:
  - TooltipProvider is at app root (redundant in components)
  - LinkMarkdown and ButtonCopy actively used
  - Dynamic imports reduce bundle size
- [x] Custom component analysis completed:
  - [x] `reasoning.tsx` — Two versions coexist, both keep
  - [x] `thinking-bar.tsx` — Keep local (has onClick prop)
  - [x] `text-shimmer.tsx` — Keep local (configurable duration/spread)
- [x] ⏸️ **CHECKPOINT 2**: Human approved conflict + custom component decisions

### Phase 3: Migration ⏳ READY
- [ ] ⏸️ **CHECKPOINT 3**: Human approved destructive operations
- [ ] Consolidate loader: Add `ChatLoader` + `"chat"` variant to `ui/loader.tsx`
- [ ] Delete from ui/: `code-block.tsx`, `message.tsx`, `markdown.tsx`, `prompt-input.tsx`
- [ ] Delete from prompt-kit/: all 9 files (4 identical, 1 ui-preferred, 4 replaced by moves, 1 consolidated)
- [ ] Move from prompt-kit/ to ui/: `code-block.tsx`, `message.tsx`, `markdown.tsx`, `prompt-input.tsx`
- [ ] Update 15 imports across 11 files (`@/components/prompt-kit/` → `@/components/ui/`)
- [ ] Update loader imports: `<Loader />` → `<Loader variant="chat" />`
- [ ] Fix internal import in `markdown.tsx`
- [ ] `components/prompt-kit/` directory removed

### Phase 4: Compare ⏳ PENDING
- [ ] Compare 7 existing components with upstream prompt-kit sources
- [ ] Document any differences found
- [ ] Apply updates if beneficial (no local customizations)

### Phase 5: Update (Optional)
- [ ] ⏸️ **CHECKPOINT 4**: Human decided update scope
- [ ] Vanilla components updated if desired
- [ ] Customized components preserved

### Phase 6: Verification
- [ ] No orphaned imports
- [ ] No duplicate directories
- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes
- [ ] `bun run build` passes
- [ ] Dev server runs without errors
- [ ] ⏸️ **CHECKPOINT 5**: Human completed manual smoke test

---

## Future Workflow

After migration, installing new prompt-kit components is simple:

```bash
# Install directly to components/ui/ (no manual moving)
npx shadcn@latest add "https://prompt-kit.com/c/[component].json"

# Update existing component
npx shadcn@latest diff "https://prompt-kit.com/c/[component].json"
npx shadcn@latest add "https://prompt-kit.com/c/[component].json" --overwrite
```

---

## Reference Links

- [Prompt-Kit Documentation](https://prompt-kit.com/docs)
- [Prompt-Kit GitHub](https://github.com/ibelick/prompt-kit)
- [Shadcn CLI Reference](https://ui.shadcn.com/docs/cli)

---

*Version: 5.2 — Loader consolidation, Phase 4 comparison added*
*Updated: January 19, 2026*
*Status: Ready for Phase 3 execution*
