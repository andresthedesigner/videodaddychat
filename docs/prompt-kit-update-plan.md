# Prompt-Kit Component Update Plan

> **For AI Agent Execution** — This document provides complete context for updating and adding prompt-kit components in the vid0 project.

---

## Project Context

### Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **UI**: Shadcn/Radix + Tailwind CSS v4
- **Style**: new-york (per components.json)
- **Package Manager**: bun

### Directory Structure
```
components/
├── ui/               # Shadcn UI primitives (default install location)
├── prompt-kit/       # Custom prompt-kit location (ACTIVE - used in imports)
└── motion-primitives/
```

### Critical Path Information
- **Import path used in codebase**: `@/components/prompt-kit/`
- **Default shadcn install path**: `@/components/ui/`
- **Action required**: After installing, move files from `ui/` to `prompt-kit/`

---

## Current State

### Installed Components (9)
Located in `components/prompt-kit/`:

| Component | File | Status |
|-----------|------|--------|
| Chat Container | `chat-container.tsx` | ✅ Installed |
| Code Block | `code-block.tsx` | ✅ Installed |
| File Upload | `file-upload.tsx` | ✅ Installed |
| Loader | `loader.tsx` | ✅ Installed |
| Markdown | `markdown.tsx` | ✅ Installed |
| Message | `message.tsx` | ✅ Installed |
| Prompt Input | `prompt-input.tsx` | ✅ Installed |
| Prompt Suggestion | `prompt-suggestion.tsx` | ✅ Installed |
| Scroll Button | `scroll-button.tsx` | ✅ Installed |

### Missing Components (12)

| Component | JSON URL | Priority | Notes |
|-----------|----------|----------|-------|
| Reasoning | `reasoning.json` | ⭐ High | AI thinking display |
| Thinking Bar | `thinking-bar.json` | ⭐ High | Processing indicator (new) |
| Tool | `tool.json` | ⭐ High | Function call outputs |
| Source | `source.json` | ⭐ High | Citation display |
| Chain of Thought | `chain-of-thought.json` | ⭐ High | Step-by-step reasoning |
| Feedback Bar | `feedback-bar.json` | Medium | User feedback (new) |
| Steps | `steps.json` | Medium | Multi-step progress |
| Text Shimmer | `text-shimmer.json` | Medium | Loading effect (new) |
| System Message | `system-message.json` | Medium | Context messages |
| Image | `image.json` | Medium | Image display |
| Response Stream | `response-stream.json` | Low | Experimental |
| JSX Preview | `jsx-preview.json` | Low | Experimental |

---

## Execution Plan

### Phase 1: Backup (REQUIRED)

```bash
# Create timestamped backup
cp -r components/prompt-kit components/prompt-kit.backup.$(date +%Y%m%d)

# Verify backup exists
ls -la components/ | grep prompt-kit
```

**Success criteria**: Backup directory exists with all 9 component files.

---

### Phase 2: Install Missing Components

#### Step 2.1: Install High Priority Components

```bash
npx shadcn@latest add "https://prompt-kit.com/c/reasoning.json"
npx shadcn@latest add "https://prompt-kit.com/c/thinking-bar.json"
npx shadcn@latest add "https://prompt-kit.com/c/tool.json"
npx shadcn@latest add "https://prompt-kit.com/c/source.json"
npx shadcn@latest add "https://prompt-kit.com/c/chain-of-thought.json"
```

#### Step 2.2: Install Medium Priority Components

```bash
npx shadcn@latest add "https://prompt-kit.com/c/feedback-bar.json"
npx shadcn@latest add "https://prompt-kit.com/c/steps.json"
npx shadcn@latest add "https://prompt-kit.com/c/text-shimmer.json"
npx shadcn@latest add "https://prompt-kit.com/c/system-message.json"
npx shadcn@latest add "https://prompt-kit.com/c/image.json"
```

#### Step 2.3: Install Experimental Components (Optional)

```bash
npx shadcn@latest add "https://prompt-kit.com/c/response-stream.json"
npx shadcn@latest add "https://prompt-kit.com/c/jsx-preview.json"
```

**Note**: Components will install to `components/ui/` by default.

---

### Phase 3: Relocate Components

After installation, move new components to the correct directory:

```bash
# List newly installed prompt-kit components in ui/
ls components/ui/ | grep -E "(reasoning|thinking-bar|tool|source|chain-of-thought|feedback-bar|steps|text-shimmer|system-message|image|response-stream|jsx-preview)"

# Move each new component to prompt-kit/
# Example for each component:
mv components/ui/reasoning.tsx components/prompt-kit/
mv components/ui/thinking-bar.tsx components/prompt-kit/
mv components/ui/tool.tsx components/prompt-kit/
mv components/ui/source.tsx components/prompt-kit/
mv components/ui/chain-of-thought.tsx components/prompt-kit/
mv components/ui/feedback-bar.tsx components/prompt-kit/
mv components/ui/steps.tsx components/prompt-kit/
mv components/ui/text-shimmer.tsx components/prompt-kit/
mv components/ui/system-message.tsx components/prompt-kit/
mv components/ui/image.tsx components/prompt-kit/
```

---

### Phase 4: Fix Import Paths

After moving, update internal imports in each moved file.

**Pattern to find and replace**:
- Find: `from "@/components/ui/`
- Replace with: `from "@/components/prompt-kit/`

**Files to check** (only for cross-references to other prompt-kit components):

```bash
# Search for ui imports in prompt-kit directory
grep -r "@/components/ui" components/prompt-kit/
```

**Common fixes needed**:
- `reasoning.tsx` may import from `markdown.tsx`
- `chain-of-thought.tsx` may import from `reasoning.tsx`
- Components may import shared utilities

---

### Phase 5: Update Existing Components (Optional)

To check if existing components need updates:

```bash
# Compare each installed component with latest
npx shadcn@latest diff "https://prompt-kit.com/c/prompt-input.json"
npx shadcn@latest diff "https://prompt-kit.com/c/message.json"
npx shadcn@latest diff "https://prompt-kit.com/c/markdown.json"
npx shadcn@latest diff "https://prompt-kit.com/c/code-block.json"
npx shadcn@latest diff "https://prompt-kit.com/c/chat-container.json"
npx shadcn@latest diff "https://prompt-kit.com/c/loader.json"
npx shadcn@latest diff "https://prompt-kit.com/c/file-upload.json"
npx shadcn@latest diff "https://prompt-kit.com/c/prompt-suggestion.json"
npx shadcn@latest diff "https://prompt-kit.com/c/scroll-button.json"
```

**If updates needed**:
```bash
# Update with overwrite (CAUTION: loses customizations)
npx shadcn@latest add "https://prompt-kit.com/c/[component].json" --overwrite

# Then move to prompt-kit/ and fix imports
```

---

### Phase 6: Verification

#### 6.1 Check File Structure

```bash
# Verify all components exist in prompt-kit/
ls -la components/prompt-kit/

# Expected output should include:
# - chat-container.tsx
# - code-block.tsx
# - file-upload.tsx
# - loader.tsx
# - markdown.tsx
# - message.tsx
# - prompt-input.tsx
# - prompt-suggestion.tsx
# - scroll-button.tsx
# + reasoning.tsx (new)
# + thinking-bar.tsx (new)
# + tool.tsx (new)
# + source.tsx (new)
# + chain-of-thought.tsx (new)
# + feedback-bar.tsx (new)
# + steps.tsx (new)
# + text-shimmer.tsx (new)
# + system-message.tsx (new)
# + image.tsx (new)
```

#### 6.2 TypeScript Check

```bash
bun run typecheck
```

**Expected**: No new TypeScript errors related to prompt-kit components.

#### 6.3 Lint Check

```bash
bun run lint
```

**Expected**: No new lint errors.

#### 6.4 Build Test

```bash
bun run build
```

**Expected**: Successful build with no errors.

---

## Rollback Procedure

If issues occur:

```bash
# Remove new components
rm components/prompt-kit/reasoning.tsx
rm components/prompt-kit/thinking-bar.tsx
rm components/prompt-kit/tool.tsx
rm components/prompt-kit/source.tsx
rm components/prompt-kit/chain-of-thought.tsx
rm components/prompt-kit/feedback-bar.tsx
rm components/prompt-kit/steps.tsx
rm components/prompt-kit/text-shimmer.tsx
rm components/prompt-kit/system-message.tsx
rm components/prompt-kit/image.tsx

# Or restore from backup
rm -rf components/prompt-kit
cp -r components/prompt-kit.backup.YYYYMMDD components/prompt-kit
```

---

## Component Dependencies

Some components have external dependencies. Install if missing:

```bash
# Check package.json for these, install if needed:
bun add shiki                    # For code-block syntax highlighting
bun add react-markdown           # For markdown rendering
bun add remark-gfm remark-breaks # For markdown plugins
bun add marked                   # For markdown parsing
bun add use-stick-to-bottom      # For chat-container auto-scroll
bun add react-jsx-parser         # For jsx-preview (if installing)
```

---

## Import Reference

After installation, components should be imported as:

```typescript
// Chat components
import { Message, MessageContent, MessageAvatar } from "@/components/prompt-kit/message"
import { ChatContainerRoot, ChatContainerContent } from "@/components/prompt-kit/chat-container"
import { Loader } from "@/components/prompt-kit/loader"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"

// Input components
import { PromptInput, PromptInputTextarea, PromptInputActions } from "@/components/prompt-kit/prompt-input"
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion"
import { FileUpload, FileUploadTrigger } from "@/components/prompt-kit/file-upload"

// Content rendering
import { Markdown } from "@/components/prompt-kit/markdown"
import { CodeBlock, CodeBlockCode } from "@/components/prompt-kit/code-block"

// AI-specific (NEW)
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/prompt-kit/reasoning"
import { ThinkingBar } from "@/components/prompt-kit/thinking-bar"
import { Tool } from "@/components/prompt-kit/tool"
import { Source, SourceTrigger, SourceContent } from "@/components/prompt-kit/source"
import { ChainOfThought } from "@/components/prompt-kit/chain-of-thought"

// UI feedback (NEW)
import { FeedbackBar } from "@/components/prompt-kit/feedback-bar"
import { Steps } from "@/components/prompt-kit/steps"
import { TextShimmer } from "@/components/prompt-kit/text-shimmer"
import { SystemMessage } from "@/components/prompt-kit/system-message"
import { Image } from "@/components/prompt-kit/image"
```

---

## Success Criteria

- [ ] All 10 high/medium priority components installed
- [ ] All components located in `components/prompt-kit/`
- [ ] All imports use `@/components/prompt-kit/` path
- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes
- [ ] `bun run build` succeeds
- [ ] Backup preserved for rollback

---

## Reference Links

- [Prompt-Kit Documentation](https://prompt-kit.com/docs)
- [Prompt-Kit GitHub](https://github.com/ibelick/prompt-kit)
- [Vercel AI SDK Integration](https://prompt-kit.com/vercel-ai-sdk)
- [Component API Reference](https://prompt-kit.com/llms-full.txt)

---

*Generated: January 19, 2026*
*Source: prompt-kit.com documentation*
