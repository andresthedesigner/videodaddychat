/**
 * Sub-Agent Orchestrator
 *
 * Main orchestration layer that routes tasks to specialized sub-agents
 * based on task classification. Implements Anthropic's sub-agent pattern
 * to prevent context pollution and optimize token usage.
 *
 * @see AI_CONTEXT_SETUP_GUIDE.md - Sub-Agent Architecture section
 * @see docs/agents-research.md - Implementation rationale
 *
 * TODO: Implement after Convex migration is complete
 * TODO: Add streaming support for real-time responses
 */

import type {
  OrchestratorConfig,
  OrchestratorResult,
  SubAgentConfig,
  SubAgentResponse,
  SubAgentTaskInput,
  SubAgentType,
  TaskClassification,
} from "./types"

// ============================================================================
// Default Configuration
// ============================================================================

/**
 * Default sub-agent configurations for YouTube content analysis.
 *
 * Model selection rationale:
 * - Haiku: Fast, cheap for transcript processing
 * - Sonnet: Balanced for SEO/analytics tasks
 * - Sonnet + Vision: Required for thumbnail analysis
 */
export const DEFAULT_SUB_AGENT_CONFIGS: Record<SubAgentType, SubAgentConfig> = {
  "transcript-analyzer": {
    type: "transcript-analyzer",
    name: "Transcript Analyzer",
    model: "claude-haiku-4-5-20250929",
    systemPrompt: `You are a YouTube transcript analyzer. Your job is to:
- Summarize video content concisely
- Extract key points and hooks
- Identify strong and weak retention segments
- Find quotable moments for clips/shorts
- Suggest script improvements

Focus on actionable insights that help creators improve their content.`,
    maxTokens: 4096,
    temperature: 0.3,
    tools: ["search", "read"],
  },

  "title-optimizer": {
    type: "title-optimizer",
    name: "Title/SEO Optimizer",
    model: "claude-sonnet-4-5-20250929",
    systemPrompt: `You are a YouTube title and SEO optimizer. Your job is to:
- Generate click-worthy titles that deliver on promises
- Create SEO-optimized tags and descriptions
- Suggest A/B test variants
- Analyze keyword opportunities
- Balance clickability with accuracy (no misleading clickbait)

Consider the creator's niche, target audience, and current trends.`,
    maxTokens: 2048,
    temperature: 0.7,
    tools: ["search"],
  },

  "thumbnail-advisor": {
    type: "thumbnail-advisor",
    name: "Thumbnail Advisor",
    model: "claude-sonnet-4-5-20250929", // Uses vision capabilities
    systemPrompt: `You are a YouTube thumbnail design advisor. Your job is to:
- Analyze thumbnail visual hierarchy
- Evaluate text readability and placement
- Assess color contrast and emotional impact
- Suggest specific improvements
- Compare against successful thumbnails in the niche

Focus on CTR optimization while maintaining brand consistency.`,
    maxTokens: 2048,
    temperature: 0.5,
    tools: ["vision"],
  },

  "analytics-interpreter": {
    type: "analytics-interpreter",
    name: "Analytics Interpreter",
    model: "claude-sonnet-4-5-20250929",
    systemPrompt: `You are a YouTube analytics interpreter. Your job is to:
- Explain metrics in plain language
- Identify trends and patterns
- Benchmark against niche averages
- Prioritize improvement areas
- Provide actionable recommendations

Focus on insights that lead to tangible growth, not vanity metrics.`,
    maxTokens: 3072,
    temperature: 0.4,
    tools: ["calculate"],
  },
}

// ============================================================================
// Task Classification
// ============================================================================

/**
 * Keywords that indicate specific task types.
 * Used for simple rule-based classification.
 *
 * TODO: Replace with LLM-based classification for better accuracy
 */
const TASK_KEYWORDS: Record<SubAgentType, string[]> = {
  "transcript-analyzer": [
    "transcript",
    "video content",
    "summarize",
    "hook",
    "retention",
    "script",
    "clip",
    "short",
  ],
  "title-optimizer": [
    "title",
    "seo",
    "tag",
    "keyword",
    "description",
    "clickbait",
    "a/b test",
  ],
  "thumbnail-advisor": [
    "thumbnail",
    "image",
    "visual",
    "design",
    "ctr",
    "click-through",
  ],
  "analytics-interpreter": [
    "analytics",
    "metrics",
    "views",
    "watch time",
    "retention",
    "subscribers",
    "performance",
  ],
}

/**
 * Classifies a user request to determine which sub-agent should handle it.
 *
 * Current implementation: Simple keyword matching
 * TODO: Replace with LLM-based classification using Claude Haiku
 *
 * @param userRequest - The user's request text
 * @returns Task classification with type and confidence
 */
export function classifyTask(userRequest: string): TaskClassification {
  const lowerRequest = userRequest.toLowerCase()

  const scores: Record<SubAgentType, number> = {
    "transcript-analyzer": 0,
    "title-optimizer": 0,
    "thumbnail-advisor": 0,
    "analytics-interpreter": 0,
  }

  // Simple keyword scoring
  for (const [agentType, keywords] of Object.entries(TASK_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerRequest.includes(keyword)) {
        scores[agentType as SubAgentType] += 1
      }
    }
  }

  // Find best match
  const entries = Object.entries(scores) as [SubAgentType, number][]
  const [bestType, bestScore] = entries.reduce((a, b) =>
    b[1] > a[1] ? b : a
  )

  // If no strong match, classify as general
  if (bestScore === 0) {
    return {
      type: "general",
      confidence: 1,
      parameters: {},
    }
  }

  // Calculate confidence based on score relative to total keywords
  const maxPossible = TASK_KEYWORDS[bestType].length
  const confidence = Math.min(bestScore / maxPossible, 1)

  return {
    type: bestType,
    confidence,
    parameters: {}, // TODO: Extract parameters with LLM
  }
}

// ============================================================================
// Orchestrator Implementation
// ============================================================================

/**
 * Creates a new orchestrator instance with the given configuration.
 *
 * @param config - Orchestrator configuration
 * @returns Orchestrator instance
 *
 * TODO: Implement actual API calls after Convex migration
 */
export function createOrchestrator(
  config: Partial<OrchestratorConfig> = {}
): Orchestrator {
  const subAgents = new Map<SubAgentType, SubAgentConfig>()

  // Initialize sub-agents with default configs
  for (const [type, defaultConfig] of Object.entries(
    DEFAULT_SUB_AGENT_CONFIGS
  )) {
    subAgents.set(type as SubAgentType, defaultConfig)
  }

  const fullConfig: OrchestratorConfig = {
    model: "claude-opus-4-5-20250929",
    subAgents,
    enableParallelProcessing: true,
    maxConcurrentTasks: 3,
    contextManagement: {
      compactionThreshold: 100_000,
      preserveRecentMessages: 10,
    },
    ...config,
  }

  return new Orchestrator(fullConfig)
}

/**
 * Main orchestrator class.
 *
 * Responsibilities:
 * - Classify incoming tasks
 * - Route to appropriate sub-agents
 * - Manage context and prevent pollution
 * - Aggregate and synthesize responses
 *
 * TODO: Implement streaming responses
 * TODO: Add error handling and retry logic
 * TODO: Implement parallel task execution
 */
class Orchestrator {
  private config: OrchestratorConfig

  constructor(config: OrchestratorConfig) {
    this.config = config
  }

  /**
   * Process a user request, potentially delegating to sub-agents.
   *
   * @param input - The task input
   * @returns Orchestrated result
   */
  async process(input: SubAgentTaskInput): Promise<OrchestratorResult> {
    const startTime = Date.now()

    // 1. Classify the task
    const classification = classifyTask(input.userRequest)

    // 2. If general task, handle directly (no sub-agent)
    if (classification.type === "general") {
      return this.handleGeneralTask(input, startTime)
    }

    // 3. Delegate to appropriate sub-agent
    const subAgentResult = await this.delegateToSubAgent(
      classification.type,
      input
    )

    // 4. Synthesize response
    return {
      response: this.synthesizeResponse(subAgentResult),
      subAgentResults: [subAgentResult],
      totalTime: Date.now() - startTime,
      totalTokens: subAgentResult.tokenUsage,
    }
  }

  /**
   * Handle a general task that doesn't require sub-agent delegation.
   */
  private async handleGeneralTask(
    _input: SubAgentTaskInput,
    startTime: number
  ): Promise<OrchestratorResult> {
    // TODO: Implement main agent conversation handling
    // This would use Claude Opus for complex reasoning

    return {
      response:
        "[Placeholder] General task handling not yet implemented. This would use the main Claude Opus agent for conversation.",
      subAgentResults: [],
      totalTime: Date.now() - startTime,
      totalTokens: { input: 0, output: 0, total: 0 },
    }
  }

  /**
   * Delegate a task to a specific sub-agent.
   */
  private async delegateToSubAgent(
    agentType: SubAgentType,
    _input: SubAgentTaskInput
  ): Promise<SubAgentResponse> {
    const agentConfig = this.config.subAgents.get(agentType)

    if (!agentConfig) {
      throw new Error(`Sub-agent not configured: ${agentType}`)
    }

    // TODO: Implement actual API call to Claude with agent-specific config
    // For now, return placeholder response

    return {
      success: true,
      agent: agentType,
      processingTime: 0,
      tokenUsage: { input: 0, output: 0, total: 0 },
      data: {
        message: `[Placeholder] ${agentConfig.name} response not yet implemented.`,
        note: "Implement after Convex migration. See lib/ai/sub-agents/types.ts for response structures.",
      },
    }
  }

  /**
   * Synthesize a user-friendly response from sub-agent results.
   */
  private synthesizeResponse(result: SubAgentResponse): string {
    if (!result.success) {
      return `I encountered an error while analyzing your request: ${result.error}`
    }

    // TODO: Use LLM to synthesize natural language response
    return JSON.stringify(result.data, null, 2)
  }

  /**
   * Get the current orchestrator configuration.
   */
  getConfig(): OrchestratorConfig {
    return this.config
  }

  /**
   * Update sub-agent configuration.
   */
  updateSubAgent(type: SubAgentType, config: Partial<SubAgentConfig>): void {
    const current = this.config.subAgents.get(type)
    if (current) {
      this.config.subAgents.set(type, { ...current, ...config })
    }
  }
}

export { Orchestrator }
