# Component Installation Guide

This document contains CLI commands to install missing components from shadcn/ui, Motion-Primitives, and Prompt-Kit.

---

## 🚀 Quick Start (Install All Missing Components)

Run these commands to install all 58 missing components:

```bash
# Step 1: Install required npm dependencies first
npm install date-fns recharts embla-carousel-react input-otp-react

# Step 2: Install missing shadcn/ui components (20)
npx shadcn@latest add accordion alert aspect-ratio breadcrumb calendar carousel chart collapsible context-menu form input-otp menubar navigation-menu pagination radio-group resizable table toggle toggle-group

# Step 3: Install missing Motion-Primitives components (28)
npx motion-primitives@latest add animated-background animated-group border-trail cursor disclosure in-view infinite-slider transition-panel
npx motion-primitives@latest add text-effect text-loop text-roll text-scramble text-shimmer text-shimmer-wave
npx motion-primitives@latest add animated-number sliding-number
npx motion-primitives@latest add dock glow-effect image-comparison scroll-progress spotlight spinning-text tilt
npx motion-primitives@latest add toolbar-dynamic toolbar-expandable magnetic

# Step 4: Install missing Prompt-Kit components (10)
npx shadcn@latest add "https://prompt-kit.com/c/chain-of-thought.json"
npx shadcn@latest add "https://prompt-kit.com/c/feedback-bar.json"
npx shadcn@latest add "https://prompt-kit.com/c/image.json"
npx shadcn@latest add "https://prompt-kit.com/c/reasoning.json"
npx shadcn@latest add "https://prompt-kit.com/c/source.json"
npx shadcn@latest add "https://prompt-kit.com/c/steps.json"
npx shadcn@latest add "https://prompt-kit.com/c/system-message.json"
npx shadcn@latest add "https://prompt-kit.com/c/text-shimmer.json"
npx shadcn@latest add "https://prompt-kit.com/c/thinking-bar.json"
npx shadcn@latest add "https://prompt-kit.com/c/tool.json"
```

---

## 📊 Status Summary

| Library | Installed | Missing | Total |
|---------|-----------|---------|-------|
| shadcn/ui | 28 | **20** | 48 |
| Motion-Primitives | 4 | **28** | 32 |
| Prompt-Kit | 9 | **10** | 19 |
| **Total** | **41** | **58** | **99** |

### Prerequisites
- [x] `components.json` properly configured
- [x] `tsconfig.json` has `@/*` path aliases
- [x] Tailwind CSS v4 with CSS variables in `globals.css`
- [x] All base dependencies installed

---

## ⭐ Recommended Components for AI Chat Apps

These components are **most useful** for your AI chat application. Install these first:

### High Priority (Essential for AI Chat)

```bash
# Prompt-Kit - AI-specific components
npx shadcn@latest add "https://prompt-kit.com/c/reasoning.json"      # Show AI thinking process
npx shadcn@latest add "https://prompt-kit.com/c/chain-of-thought.json"  # Step-by-step reasoning
npx shadcn@latest add "https://prompt-kit.com/c/thinking-bar.json"   # AI processing indicator
npx shadcn@latest add "https://prompt-kit.com/c/tool.json"           # Tool/function call outputs
npx shadcn@latest add "https://prompt-kit.com/c/source.json"         # Source citations

# shadcn/ui - Useful UI patterns
npx shadcn@latest add form          # Form handling with validation
npx shadcn@latest add table         # Data display
npx shadcn@latest add alert         # User notifications
npx shadcn@latest add collapsible   # Expandable content
npx shadcn@latest add toggle        # Toggle buttons
```

### Medium Priority (Nice to Have)

```bash
# Motion-Primitives - Enhanced UX
npx motion-primitives@latest add text-shimmer      # Loading text effect
npx motion-primitives@latest add animated-number   # Animated counters
npx motion-primitives@latest add in-view           # Viewport animations

# Prompt-Kit
npx shadcn@latest add "https://prompt-kit.com/c/text-shimmer.json"   # Loading shimmer
npx shadcn@latest add "https://prompt-kit.com/c/steps.json"          # Multi-step progress
npx shadcn@latest add "https://prompt-kit.com/c/feedback-bar.json"   # User feedback

# shadcn/ui
npx shadcn@latest add pagination    # Chat history pagination
npx shadcn@latest add breadcrumb    # Navigation
npx shadcn@latest add radio-group   # Single selection
```

### Lower Priority (Specialized Use)

```bash
# Visual effects and specialized components
npx motion-primitives@latest add spotlight glow-effect magnetic
npx shadcn@latest add carousel chart calendar aspect-ratio
```

---

## ⚠️ Important Warnings

### Component Name Conflicts

> **Warning:** Both shadcn/ui and Motion-Primitives have components with the same name:
> - `accordion` - exists in both libraries
> - `carousel` - exists in both libraries
>
> **Recommendation:** Skip the Motion-Primitives `accordion` and `carousel` since you already use shadcn/ui patterns. The Motion-Primitives versions are already excluded from the Quick Start commands above.

### Backup Before Installing

Many components in this project have been **customized**. Installing new components won't overwrite existing ones, but updating will:

```bash
# Create a backup of your current components
cp -r components/ui components/ui.backup
cp -r components/motion-primitives components/motion-primitives.backup
cp -r components/prompt-kit components/prompt-kit.backup
```

---

## 📦 Missing Components by Library

### 1. shadcn/ui Components (20 missing)

#### Required Dependencies

```bash
# Some components need additional packages
npm install date-fns           # Required for: calendar
npm install recharts           # Required for: chart
npm install embla-carousel-react  # Required for: carousel
npm install input-otp          # Required for: input-otp
# Note: form uses react-hook-form + zod (already installed)
```

#### Install All Missing

```bash
npx shadcn@latest add accordion alert aspect-ratio breadcrumb calendar carousel chart collapsible context-menu form input-otp menubar navigation-menu pagination radio-group resizable table toggle toggle-group
```

#### Individual Components

| Component | Description | Dependencies |
|-----------|-------------|--------------|
| `accordion` | Collapsible content sections | - |
| `alert` | Callout for user attention | - |
| `aspect-ratio` | Maintain content aspect ratio | - |
| `breadcrumb` | Navigation breadcrumb trail | - |
| `calendar` | Date picker calendar | `date-fns` |
| `carousel` | Image/content slider | `embla-carousel-react` |
| `chart` | Data visualization | `recharts` |
| `collapsible` | Expandable/collapsible content | - |
| `context-menu` | Right-click menus | - |
| `form` | Form handling with validation | `react-hook-form`, `zod` |
| `input-otp` | One-time password input | `input-otp` |
| `menubar` | Horizontal menu bar | - |
| `navigation-menu` | Complex navigation menus | - |
| `pagination` | Page navigation controls | - |
| `radio-group` | Single selection options | - |
| `resizable` | Resizable panel layouts | - |
| `table` | Data table component | - |
| `toggle` | Two-state toggle button | - |
| `toggle-group` | Group of toggle buttons | - |

```bash
# Install individually
npx shadcn@latest add accordion
npx shadcn@latest add alert
npx shadcn@latest add aspect-ratio
npx shadcn@latest add breadcrumb
npx shadcn@latest add calendar
npx shadcn@latest add carousel
npx shadcn@latest add chart
npx shadcn@latest add collapsible
npx shadcn@latest add context-menu
npx shadcn@latest add form
npx shadcn@latest add input-otp
npx shadcn@latest add menubar
npx shadcn@latest add navigation-menu
npx shadcn@latest add pagination
npx shadcn@latest add radio-group
npx shadcn@latest add resizable
npx shadcn@latest add table
npx shadcn@latest add toggle
npx shadcn@latest add toggle-group
```

---

### 2. Motion-Primitives Components (28 missing)

> **Note:** Excluding `accordion` and `carousel` to avoid conflicts with shadcn/ui.

#### Install All Missing

```bash
# Core Components (8) - excluding accordion, carousel
npx motion-primitives@latest add animated-background animated-group border-trail cursor disclosure in-view infinite-slider transition-panel

# Text Effects (6)
npx motion-primitives@latest add text-effect text-loop text-roll text-scramble text-shimmer text-shimmer-wave

# Number Effects (2)
npx motion-primitives@latest add animated-number sliding-number

# Interactive Elements (7)
npx motion-primitives@latest add dock glow-effect image-comparison scroll-progress spotlight spinning-text tilt

# Toolbars (2)
npx motion-primitives@latest add toolbar-dynamic toolbar-expandable

# Advanced Effects (1)
npx motion-primitives@latest add magnetic
```

#### Components by Category

**Core Components (8)**
| Component | Description |
|-----------|-------------|
| `animated-background` | Animated background effects |
| `animated-group` | Group animation orchestration |
| `border-trail` | Animated border trail effect |
| `cursor` | Custom animated cursor |
| `disclosure` | Show/hide content toggle |
| `in-view` | Animate on viewport entry |
| `infinite-slider` | Infinitely scrolling content |
| `transition-panel` | Animated panel transitions |

**Text Effects (6)**
| Component | Description |
|-----------|-------------|
| `text-effect` | General text animations |
| `text-loop` | Looping text animation |
| `text-roll` | Rolling text animation |
| `text-scramble` | Scrambling text effect |
| `text-shimmer` | Shimmering text effect |
| `text-shimmer-wave` | Wave-based shimmer |

**Number Effects (2)**
| Component | Description |
|-----------|-------------|
| `animated-number` | Animated number transitions |
| `sliding-number` | Sliding number display |

**Interactive Elements (7)**
| Component | Description |
|-----------|-------------|
| `dock` | macOS-style dock |
| `glow-effect` | Glowing hover effects |
| `image-comparison` | Before/after slider |
| `scroll-progress` | Scroll progress indicator |
| `spotlight` | Spotlight/highlight effect |
| `spinning-text` | Circular spinning text |
| `tilt` | 3D tilt on hover |

**Toolbars (2)**
| Component | Description |
|-----------|-------------|
| `toolbar-dynamic` | Dynamic animated toolbar |
| `toolbar-expandable` | Expandable toolbar |

**Advanced Effects (1)**
| Component | Description |
|-----------|-------------|
| `magnetic` | Magnetic cursor attraction |

---

### 3. Prompt-Kit Components (10 missing)

#### Install All Missing

```bash
npx shadcn@latest add "https://prompt-kit.com/c/chain-of-thought.json"
npx shadcn@latest add "https://prompt-kit.com/c/feedback-bar.json"
npx shadcn@latest add "https://prompt-kit.com/c/image.json"
npx shadcn@latest add "https://prompt-kit.com/c/reasoning.json"
npx shadcn@latest add "https://prompt-kit.com/c/source.json"
npx shadcn@latest add "https://prompt-kit.com/c/steps.json"
npx shadcn@latest add "https://prompt-kit.com/c/system-message.json"
npx shadcn@latest add "https://prompt-kit.com/c/text-shimmer.json"
npx shadcn@latest add "https://prompt-kit.com/c/thinking-bar.json"
npx shadcn@latest add "https://prompt-kit.com/c/tool.json"
```

#### Components

| Component | Description | Priority |
|-----------|-------------|----------|
| `chain-of-thought` | Display AI reasoning step by step | ⭐ High |
| `reasoning` | Show AI reasoning/thinking process | ⭐ High |
| `thinking-bar` | AI thinking/processing indicator | ⭐ High |
| `tool` | Display tool/function call outputs | ⭐ High |
| `source` | Display source citations | ⭐ High |
| `feedback-bar` | User feedback collection | Medium |
| `steps` | Multi-step progress indicator | Medium |
| `text-shimmer` | Animated text loading effect | Medium |
| `image` | Display images in chat | Medium |
| `system-message` | Display system/context messages | Medium |

---

## ⚙️ Configuration & Troubleshooting

### Check for Updates Without Overwriting

```bash
npx shadcn@latest diff button
npx shadcn@latest diff dialog
```

### Update an Existing Component

```bash
npx shadcn@latest add button --overwrite
```

### Component Installs to Wrong Directory

Check `components.json`:

```json
{
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui"
  }
}
```

### "Registry not found" Errors

URLs for third-party registries may change. Check official docs:
- [ui.shadcn.com/docs](https://ui.shadcn.com/docs)
- [motion-primitives.com/docs](https://motion-primitives.com/docs)
- [prompt-kit.com/docs](https://prompt-kit.com/docs)

### Dependency Conflicts

```bash
npm install --legacy-peer-deps
```

### TypeScript Errors After Install

```bash
npm run type-check
```

---

## 📋 Appendix: Already Installed Components

### shadcn/ui (28 installed)
```
alert-dialog, avatar, badge, button, card, checkbox, command, dialog, 
drawer, dropdown-menu, hover-card, input, label, popover, progress, 
scroll-area, select, separator, sheet, sidebar, skeleton, slider, 
sonner, switch, tabs, textarea, toast, tooltip
```

### Motion-Primitives (4 installed)
```
morphing-dialog, morphing-popover, progressive-blur, text-morph
```

### Prompt-Kit (9 installed)
```
chat-container, code-block, file-upload, loader, markdown, 
message, prompt-input, prompt-suggestion, scroll-button
```

### Dependencies (all installed)
```
motion v12.25.0, react-markdown v10.1.0, remark-gfm v4.0.1,
remark-breaks v4.0.0, marked v15.0.12, shiki v3.21.0,
tailwindcss-animate v1.0.7, lucide-react v0.503.0,
@phosphor-icons/react v2.1.10, react-hook-form v7.71.0,
@hookform/resolvers v5.2.2, zod v3.25.76, zustand v5.0.9,
class-variance-authority v0.7.1, clsx v2.1.1, tailwind-merge v3.4.0,
All @radix-ui primitives
```

---

## 📁 Project Configuration

### components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

---

## 📝 Notes

- Components install to paths configured in `components.json`
- Project uses **new-york** style for shadcn/ui
- Project uses **Tailwind CSS v4** with CSS variables
- Motion-Primitives install to `components/motion-primitives/`
- Prompt-Kit installs to `components/prompt-kit/`
- Review installed components for customizations that may need reapplication

---

*Last updated: January 11, 2026*
