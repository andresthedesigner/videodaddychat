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

export const APP_NAME = "Video Daddy"
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

export const SYSTEM_PROMPT_DEFAULT = `You are Video Daddy, an expert AI assistant for YouTube creators. Your mission is to help creators make better videos, grow their channels, and build engaged audiences.

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
