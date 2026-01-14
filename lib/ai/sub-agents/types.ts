/**
 * Sub-Agent Architecture Types
 *
 * Defines the type system for the multi-agent architecture
 * used to delegate specialized tasks to purpose-built agents.
 *
 * @see AI_CONTEXT_SETUP_GUIDE.md - Sub-Agent Architecture section
 * @see docs/agents-research.md - Detailed research on sub-agent patterns
 */

// ============================================================================
// Agent Types
// ============================================================================

/**
 * Available sub-agent types for YouTube content analysis
 */
export type SubAgentType =
  | "transcript-analyzer"
  | "title-optimizer"
  | "thumbnail-advisor"
  | "analytics-interpreter"

/**
 * Claude model identifiers for different agent tiers
 */
export type ClaudeModel =
  | "claude-opus-4-5-20250929" // Complex orchestration
  | "claude-sonnet-4-5-20250929" // Balanced tasks
  | "claude-haiku-4-5-20250929" // Fast, simple tasks

/**
 * Base configuration for all sub-agents
 */
export interface SubAgentConfig {
  /** Unique identifier for the agent type */
  type: SubAgentType

  /** Display name for the agent */
  name: string

  /** Claude model to use for this agent */
  model: ClaudeModel

  /** System prompt defining the agent's role and capabilities */
  systemPrompt: string

  /** Maximum tokens for agent output */
  maxTokens: number

  /** Temperature setting (0-1) */
  temperature: number

  /** Tools available to this agent */
  tools: string[]
}

// ============================================================================
// Task Types
// ============================================================================

/**
 * Task classification result from the orchestrator
 */
export interface TaskClassification {
  /** Primary task type */
  type: SubAgentType | "general"

  /** Confidence score (0-1) */
  confidence: number

  /** Extracted parameters for the task */
  parameters: Record<string, unknown>
}

/**
 * Base interface for sub-agent task input
 */
export interface SubAgentTaskInput {
  /** The user's original request */
  userRequest: string

  /** Additional context from the conversation */
  conversationContext?: string

  /** Any attached files or data */
  attachments?: SubAgentAttachment[]
}

/**
 * Attachment types supported by sub-agents
 */
export interface SubAgentAttachment {
  type: "transcript" | "image" | "analytics" | "text"
  content: string
  mimeType?: string
  metadata?: Record<string, unknown>
}

// ============================================================================
// Task-Specific Input Types
// ============================================================================

/**
 * Input for transcript analysis tasks
 */
export interface TranscriptAnalysisInput extends SubAgentTaskInput {
  transcript: string
  videoMetadata?: {
    title?: string
    duration?: number
    publishDate?: string
  }
}

/**
 * Input for title/SEO optimization tasks
 */
export interface TitleOptimizationInput extends SubAgentTaskInput {
  topic: string
  keywords?: string[]
  niche?: string
  currentTitle?: string
  competitorTitles?: string[]
}

/**
 * Input for thumbnail analysis tasks
 */
export interface ThumbnailAnalysisInput extends SubAgentTaskInput {
  imageUrl?: string
  imageBase64?: string
  thumbnailDescription?: string
  targetAudience?: string
}

/**
 * Input for analytics interpretation tasks
 */
export interface AnalyticsInterpretationInput extends SubAgentTaskInput {
  metrics: AnalyticsMetrics
  dateRange?: {
    start: string
    end: string
  }
  benchmarks?: Record<string, number>
}

/**
 * YouTube Analytics metrics structure
 */
export interface AnalyticsMetrics {
  views?: number
  watchTime?: number
  averageViewDuration?: number
  averagePercentageViewed?: number
  subscribersGained?: number
  subscribersLost?: number
  likes?: number
  comments?: number
  shares?: number
  impressions?: number
  clickThroughRate?: number
  uniqueViewers?: number
  returningViewers?: number
  [key: string]: number | undefined
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Base interface for sub-agent responses
 */
export interface SubAgentResponse<T = unknown> {
  /** Whether the task completed successfully */
  success: boolean

  /** The agent that processed the task */
  agent: SubAgentType

  /** Processing time in milliseconds */
  processingTime: number

  /** Token usage for the task */
  tokenUsage: {
    input: number
    output: number
    total: number
  }

  /** The response data */
  data: T

  /** Error message if success is false */
  error?: string
}

/**
 * Transcript analysis response
 */
export interface TranscriptAnalysisResponse {
  summary: string
  keyPoints: string[]
  hooks: {
    timestamp: string
    text: string
    strength: "strong" | "medium" | "weak"
  }[]
  retentionAnalysis: {
    strongSegments: { start: string; end: string; reason: string }[]
    weakSegments: { start: string; end: string; suggestion: string }[]
  }
  quotableClips: string[]
  improvements: string[]
}

/**
 * Title optimization response
 */
export interface TitleOptimizationResponse {
  titles: {
    title: string
    score: number
    reasoning: string
  }[]
  tags: string[]
  description: string
  seoInsights: string[]
}

/**
 * Thumbnail analysis response
 */
export interface ThumbnailAnalysisResponse {
  overallScore: number
  analysis: {
    visualHierarchy: { score: number; feedback: string }
    textReadability: { score: number; feedback: string }
    colorContrast: { score: number; feedback: string }
    emotionalImpact: { score: number; feedback: string }
  }
  improvements: string[]
  competitorComparison?: string
}

/**
 * Analytics interpretation response
 */
export interface AnalyticsInterpretationResponse {
  summary: string
  keyInsights: string[]
  trends: {
    metric: string
    direction: "up" | "down" | "stable"
    change: number
    significance: string
  }[]
  recommendations: {
    priority: "high" | "medium" | "low"
    action: string
    expectedImpact: string
  }[]
  benchmarkComparison?: string
}

// ============================================================================
// Orchestrator Types
// ============================================================================

/**
 * Configuration for the main orchestrator agent
 */
export interface OrchestratorConfig {
  /** Primary model for orchestration (typically Opus) */
  model: ClaudeModel

  /** Sub-agents available for delegation */
  subAgents: Map<SubAgentType, SubAgentConfig>

  /** Whether to use parallel processing for independent tasks */
  enableParallelProcessing: boolean

  /** Maximum concurrent sub-agent tasks */
  maxConcurrentTasks: number

  /** Context compaction settings */
  contextManagement: {
    compactionThreshold: number
    preserveRecentMessages: number
  }
}

/**
 * Result from the orchestrator including all sub-agent results
 */
export interface OrchestratorResult {
  /** Primary response for the user */
  response: string

  /** Sub-agent tasks that were executed */
  subAgentResults: SubAgentResponse[]

  /** Total processing time */
  totalTime: number

  /** Total token usage across all agents */
  totalTokens: {
    input: number
    output: number
    total: number
  }
}
