# Prompt-Kit Component Update Plan

> **For AI Agent Execution** — Optimized workflow for updating and adding prompt-kit components using the single-directory approach (`components/ui/`).

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

---

## Current State Assessment

### Prompt-Kit Components in `components/prompt-kit/` (9) — TO MIGRATE

| Component | Customizations | Migration |
|-----------|----------------|-----------|
| `chat-container.tsx` | Check | Move to ui/ |
| `code-block.tsx` | **Yes** — `useTheme()`, SSR fallback | Move to ui/ |
| `file-upload.tsx` | Check | Move to ui/ |
| `loader.tsx` | **Yes** — Custom 3-dot animation | Move to ui/ |
| `markdown.tsx` | Check | Move to ui/ |
| `message.tsx` | **Yes** — Dynamic import | Move to ui/ |
| `prompt-input.tsx` | Check | Move to ui/ |
| `prompt-suggestion.tsx` | Likely vanilla | Move to ui/ |
| `scroll-button.tsx` | Likely vanilla | Move to ui/ |

### Already in `components/ui/` (3) — NO ACTION

| Component | Status |
|-----------|--------|
| `thinking-bar.tsx` | ✅ Already in place |
| `text-shimmer.tsx` | ✅ Already in place |
| `loader.tsx` | ✅ Advanced 12+ variant version |

### Custom Implementation (1) — KEEP SEPARATE

| Component | Location | Reason |
|-----------|----------|--------|
| `reasoning.tsx` | `app/components/chat/` | App-specific streaming behavior |

### Missing Components (7) — TO INSTALL

| Component | Priority | Notes |
|-----------|----------|-------|
| `tool.json` | ⭐ High | Function call outputs |
| `source.json` | ⭐ High | Citation display |
| `chain-of-thought.json` | ⭐ High | Step-by-step reasoning |
| `feedback-bar.json` | Medium | User feedback |
| `steps.json` | Medium | Multi-step progress |
| `system-message.json` | Medium | Context messages |
| `image.json` | Medium | Image display |

**SKIP** (already installed or custom exists):
- ~~reasoning.json~~ → Custom at `app/components/chat/reasoning.tsx`
- ~~thinking-bar.json~~ → Already at `components/ui/thinking-bar.tsx`
- ~~text-shimmer.json~~ → Already at `components/ui/text-shimmer.tsx`

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

**Expected**: Only `loader.tsx` should show as conflict (we'll handle this).

**1.2 Install Dependencies**

```bash
bun add shiki react-markdown remark-gfm remark-breaks use-stick-to-bottom
```

**Success Criteria**: All dependencies installed without errors.

---

### Phase 2: Backup

```bash
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Backup both directories
cp -r components/prompt-kit "components/prompt-kit.backup.$TIMESTAMP"
cp -r components/ui "components/ui.backup.$TIMESTAMP"

# Verify
echo "=== Backups created ==="
ls -d components/*.backup.* 2>/dev/null || echo "ERROR: Backups not found"
```

**Success Criteria**: Two backup directories exist with timestamps.

---

### Phase 3: Migrate Existing Components

**3.1 Handle Loader Conflict**

Two different `loader.tsx` files exist:
- `components/prompt-kit/loader.tsx` — Simple 3-dot animation
- `components/ui/loader.tsx` — Advanced 12+ variants

**Decision**: Keep both, rename prompt-kit version.

```bash
# Rename prompt-kit loader to avoid conflict
mv components/prompt-kit/loader.tsx components/prompt-kit/loader-dots.tsx
```

**3.2 Move All Components**

```bash
# Move all prompt-kit components to ui/
for f in components/prompt-kit/*.tsx; do
  name=$(basename "$f")
  if [ -f "components/ui/$name" ]; then
    echo "SKIP: $name already exists in ui/"
  else
    mv "$f" components/ui/
    echo "MOVED: $name"
  fi
done

# Verify prompt-kit is empty (except backup)
ls components/prompt-kit/
```

**3.3 Update Imports Across Codebase**

```bash
# Find all files with old import path
echo "=== Files to update ==="
grep -rl "@/components/prompt-kit" app/ lib/ components/ --include="*.tsx" --include="*.ts"

# Perform replacement
find app lib components -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|@/components/prompt-kit/|@/components/ui/|g' {} +

# Handle renamed loader-dots
find app lib components -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|@/components/ui/loader"|@/components/ui/loader-dots"|g' {} +

# Verify no old imports remain
echo "=== Remaining old imports (should be empty) ==="
grep -r "@/components/prompt-kit" app/ lib/ components/ --include="*.tsx" --include="*.ts" || echo "None found - good!"
```

**3.4 Remove Empty Directory**

```bash
# Only remove if empty
if [ -z "$(ls -A components/prompt-kit 2>/dev/null)" ]; then
  rmdir components/prompt-kit
  echo "Removed empty prompt-kit directory"
else
  echo "WARNING: prompt-kit not empty, manual cleanup needed"
  ls components/prompt-kit/
fi
```

**3.5 Verify Migration**

```bash
bun run typecheck
```

**Success Criteria**: No TypeScript errors related to imports.

---

### Phase 4: Install Missing Components

**4.1 Install High Priority**

```bash
npx shadcn@latest add "https://prompt-kit.com/c/tool.json"
npx shadcn@latest add "https://prompt-kit.com/c/source.json"
npx shadcn@latest add "https://prompt-kit.com/c/chain-of-thought.json"
```

**4.2 Install Medium Priority**

```bash
npx shadcn@latest add "https://prompt-kit.com/c/feedback-bar.json"
npx shadcn@latest add "https://prompt-kit.com/c/steps.json"
npx shadcn@latest add "https://prompt-kit.com/c/system-message.json"
npx shadcn@latest add "https://prompt-kit.com/c/image.json"
```

**4.3 Verify Installation**

```bash
echo "=== New components installed ==="
ls -la components/ui/ | grep -E "(tool|source|chain-of-thought|feedback-bar|steps|system-message|image)"
```

**Success Criteria**: All 7 new files exist in `components/ui/`.

---

### Phase 5: Update Existing Components

**5.1 Check for Upstream Changes**

```bash
for component in prompt-input message markdown code-block chat-container file-upload prompt-suggestion scroll-button; do
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
| `code-block.tsx` | **Manual merge** | Preserve `useTheme()`, SSR fallback |
| `message.tsx` | **Manual merge** | Preserve dynamic import |
| `loader-dots.tsx` | **Keep local** | Custom implementation |

**5.3 Safe Overwrites**

```bash
# Components with no known customizations
npx shadcn@latest add "https://prompt-kit.com/c/scroll-button.json" --overwrite
npx shadcn@latest add "https://prompt-kit.com/c/prompt-suggestion.json" --overwrite
```

**5.4 Manual Merge Workflow**

For `code-block.tsx` and `message.tsx`:

```bash
# Download latest to temp for comparison
mkdir -p /tmp/prompt-kit-latest

npx shadcn@latest add "https://prompt-kit.com/c/code-block.json" --path /tmp/prompt-kit-latest --overwrite
diff components/ui/code-block.tsx /tmp/prompt-kit-latest/code-block.tsx

npx shadcn@latest add "https://prompt-kit.com/c/message.json" --path /tmp/prompt-kit-latest --overwrite
diff components/ui/message.tsx /tmp/prompt-kit-latest/message.tsx

# Review diffs and manually merge, preserving:
# - code-block.tsx: useTheme(), SSR fallback
# - message.tsx: dynamic import

rm -rf /tmp/prompt-kit-latest
```

---

### Phase 6: Final Verification

**6.1 File Structure Check**

```bash
echo "=== All prompt-kit components in ui/ ==="
ls components/ui/ | grep -E "(chat-container|code-block|file-upload|loader|markdown|message|prompt-input|prompt-suggestion|scroll-button|tool|source|chain-of-thought|feedback-bar|steps|system-message|image|thinking-bar|text-shimmer)"
```

**Expected**: 17+ component files listed.

**6.2 No Orphaned Imports**

```bash
# Check no imports point to old location
grep -r "@/components/prompt-kit" . --include="*.tsx" --include="*.ts" | grep -v backup | grep -v node_modules || echo "✓ No orphaned imports"
```

**6.3 TypeScript Check**

```bash
bun run typecheck
```

**6.4 Lint Check**

```bash
bun run lint
```

**6.5 Build Test**

```bash
bun run build
```

**Success Criteria**: All three commands pass with no errors.

---

## Rollback Procedure

### Quick Rollback (Full)

```bash
# Find latest backup timestamp
BACKUP=$(ls -d components/prompt-kit.backup.* 2>/dev/null | tail -1 | sed 's/.*backup\.//')

# Restore
rm -rf components/prompt-kit components/ui
cp -r "components/prompt-kit.backup.$BACKUP" components/prompt-kit
cp -r "components/ui.backup.$BACKUP" components/ui

# Revert import changes
git checkout -- app/ lib/ components/
```

### Partial Rollback (Remove New Components Only)

```bash
rm components/ui/tool.tsx
rm components/ui/source.tsx
rm components/ui/chain-of-thought.tsx
rm components/ui/feedback-bar.tsx
rm components/ui/steps.tsx
rm components/ui/system-message.tsx
rm components/ui/image.tsx
```

---

## Import Reference

After migration, all imports use `@/components/ui/`:

```typescript
// Chat components
import { Message, MessageContent, MessageAvatar } from "@/components/ui/message"
import { ChatContainerRoot, ChatContainerContent } from "@/components/ui/chat-container"
import { ScrollButton } from "@/components/ui/scroll-button"

// Loaders (two options)
import { Loader } from "@/components/ui/loader"           // 12+ variants
import { Loader as DotsLoader } from "@/components/ui/loader-dots"  // Simple 3-dot

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

### Phase 1: Pre-Flight
- [ ] No unexpected naming conflicts (only loader.tsx expected)
- [ ] Dependencies installed

### Phase 2: Backup
- [ ] `components/prompt-kit.backup.*` exists
- [ ] `components/ui.backup.*` exists

### Phase 3: Migration
- [ ] `loader.tsx` renamed to `loader-dots.tsx`
- [ ] All 9 components moved to `components/ui/`
- [ ] All imports updated to `@/components/ui/`
- [ ] `components/prompt-kit/` directory removed
- [ ] `bun run typecheck` passes

### Phase 4: Install
- [ ] 7 new components installed in `components/ui/`

### Phase 5: Update
- [ ] Vanilla components updated
- [ ] Customized components manually merged

### Phase 6: Verification
- [ ] No orphaned imports
- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes
- [ ] `bun run build` passes

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

*Version: 3.0 — Single-directory architecture (Option B)*
*Updated: January 18, 2026*
