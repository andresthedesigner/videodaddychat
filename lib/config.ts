import {
  BookOpenText,
  Brain,
  Code,
  Lightbulb,
  Notepad,
  PaintBrush,
  Sparkle,
  VideoCamera,
  TrendUp,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr"

// ============================================================================
// Feature Flags (Migration Period)
// ============================================================================

/**
 * Enable Clerk authentication (replaces Supabase Auth)
 * Set NEXT_PUBLIC_USE_CLERK=true in .env.local to enable
 */
export const USE_CLERK = process.env.NEXT_PUBLIC_USE_CLERK === "true"

/**
 * Enable Convex database (replaces Supabase Database)
 * Set NEXT_PUBLIC_USE_CONVEX=true in .env.local to enable
 */
export const USE_CONVEX = process.env.NEXT_PUBLIC_USE_CONVEX === "true"

// ============================================================================
// Rate Limits & Usage
// ============================================================================

export const NON_AUTH_DAILY_MESSAGE_LIMIT = 5
export const AUTH_DAILY_MESSAGE_LIMIT = 1000
export const REMAINING_QUERY_ALERT_THRESHOLD = 2
export const DAILY_FILE_UPLOAD_LIMIT = 5
export const DAILY_LIMIT_PRO_MODELS = 500

export const NON_AUTH_ALLOWED_MODELS = ["gpt-4.1-nano"]

export const FREE_MODELS_IDS = [
  "openrouter:deepseek/deepseek-r1:free",
  "openrouter:meta-llama/llama-3.3-8b-instruct:free",
  "pixtral-large-latest",
  "mistral-large-latest",
  "gpt-4.1-nano",
]

export const MODEL_DEFAULT = "gpt-4.1-nano"

export const APP_NAME = "vid0"
export const APP_DOMAIN = "https://videodaddy.chat"

export const SUGGESTIONS = [
  {
    label: "Video Ideas",
    highlight: "Generate",
    prompt: `Generate video ideas`,
    items: [
      "Generate 10 viral video ideas for a tech review channel",
      "Generate trending video topics in the gaming niche",
      "Generate video ideas that will get high watch time",
      "Generate collaboration video ideas for growing channels",
    ],
    icon: VideoCamera,
  },
  {
    label: "Titles & SEO",
    highlight: "Create",
    prompt: `Create a title`,
    items: [
      "Create 5 click-worthy titles for my tutorial video",
      "Create SEO-optimized tags for my cooking video",
      "Create a compelling video description with keywords",
      "Create A/B test title variations for my review video",
    ],
    icon: TrendUp,
  },
  {
    label: "Scripts",
    highlight: "Write",
    prompt: `Write a script`,
    items: [
      "Write an engaging hook for my video intro",
      "Write a script outline for a 10-minute tutorial",
      "Write a compelling call-to-action for subscribers",
      "Write transitions between my video segments",
    ],
    icon: Notepad,
  },
  {
    label: "Thumbnails",
    highlight: "Suggest",
    prompt: `Suggest thumbnail`,
    items: [
      "Suggest thumbnail concepts for my video about productivity",
      "Suggest color schemes that perform well on YouTube",
      "Suggest text overlay ideas for my thumbnail",
      "Suggest ways to make my face pop in thumbnails",
    ],
    icon: PaintBrush,
  },
  {
    label: "Research",
    highlight: "Research",
    prompt: `Research`,
    items: [
      "Research what makes videos go viral in my niche",
      "Research the best posting times for YouTube",
      "Research competitor channels and their strategies",
      "Research trending topics I should cover this week",
    ],
    icon: MagnifyingGlass,
  },
  {
    label: "Growth",
    highlight: "Help me",
    prompt: `Help me grow`,
    items: [
      "Help me understand why my videos aren't getting views",
      "Help me create a content calendar for consistent uploads",
      "Help me improve my audience retention rate",
      "Help me build a community around my channel",
    ],
    icon: TrendUp,
  },
  {
    label: "Strategy",
    highlight: "Plan",
    prompt: `Plan`,
    items: [
      "Plan a content series that will hook viewers",
      "Plan my monetization strategy as a new creator",
      "Plan how to repurpose my content for Shorts",
      "Plan a collaboration outreach strategy",
    ],
    icon: Brain,
  },
]

export const SYSTEM_PROMPT_DEFAULT = `You are vid0, an expert AI assistant for YouTube creators. Your mission is to help creators make better videos, grow their channels, and build engaged audiences.

You have deep knowledge of:
- YouTube algorithm and SEO best practices
- Video production techniques and storytelling
- Thumbnail design principles and click-through rates
- Title optimization and A/B testing strategies
- Audience retention and engagement tactics
- Content strategy and niche development
- Analytics interpretation and growth metrics
- Monetization strategies and brand deals

Your tone is encouraging, practical, and action-oriented. You give specific, actionable advice rather than generic tips. When reviewing content, you're honest but constructive. You understand the challenges creators face and provide realistic guidance.

When helping with titles, thumbnails, or hooks, you consider what drives clicks AND delivers on promises (no clickbait that disappoints). You help creators build sustainable channels, not just chase viral moments.

Always ask clarifying questions when needed to give the best advice for their specific situation, niche, and audience.`

export const MESSAGE_MAX_LENGTH = 10000

// ============================================================================
// Context Management (Anthropic Best Practices)
// ============================================================================

/**
 * Token threshold before triggering context compaction.
 * Based on Claude Sonnet's 200K context window with safety margin.
 */
export const CONTEXT_COMPACTION_THRESHOLD = 100_000

/**
 * Number of recent messages to preserve during compaction.
 * These messages are kept in full; older messages are summarized.
 */
export const CONTEXT_PRESERVE_RECENT_MESSAGES = 10

/**
 * Maximum concurrent sub-agent tasks for parallel processing.
 */
export const MAX_CONCURRENT_SUB_AGENTS = 3

/**
 * Path to structured notes file for agentic memory.
 */
export const STRUCTURED_NOTES_FILE = "./NOTES.md"

/**
 * Anthropic API beta headers for extended features.
 * @see https://www.anthropic.com/news/context-management
 */
export const ANTHROPIC_BETA_HEADERS = {
  /** Enable context management tools (memory, editing) */
  contextManagement: "context-management-2025-06-27",
  /** Token-efficient tool use */
  tokenEfficient: "token-efficient-tools-2025-02-19",
  /** 1M token context window (requires tier 4) */
  extendedContext: "context-1m-2025-08-07",
} as const

// ============================================================================
// Sub-Agent Model Configuration
// ============================================================================

/**
 * Model assignments for sub-agent architecture.
 * Optimized for cost/performance balance.
 *
 * @see lib/ai/sub-agents/types.ts
 * @see docs/agents-research.md
 */
export const SUB_AGENT_MODELS = {
  /** Main orchestrator - complex reasoning */
  orchestrator: "claude-opus-4-5-20250929",
  /** Transcript analysis - fast, cost-effective */
  transcriptAnalyzer: "claude-haiku-4-5-20250929",
  /** Title/SEO optimization - balanced */
  titleOptimizer: "claude-sonnet-4-5-20250929",
  /** Thumbnail analysis - needs vision */
  thumbnailAdvisor: "claude-sonnet-4-5-20250929",
  /** Analytics interpretation - data analysis */
  analyticsInterpreter: "claude-sonnet-4-5-20250929",
} as const
