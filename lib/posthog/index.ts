import { PostHog } from "posthog-node"

let posthogClient: PostHog | null = null

/**
 * Get the PostHog client singleton for LLM analytics.
 * Returns null if POSTHOG_API_KEY is not configured.
 *
 * Configured for serverless environments (Vercel/Next.js):
 * - flushAt: 1 - Send events immediately (no batching)
 * - flushInterval: 0 - Don't wait for batch timer
 *
 * IMPORTANT: In serverless, you MUST call `await posthog.shutdown()`
 * before the function returns to ensure events are flushed.
 * Use Next.js `after()` for streaming responses.
 *
 * @see https://posthog.com/docs/llm-analytics/installation/vercel-ai
 * @see https://posthog.com/docs/libraries/vercel
 */
export function getPostHogClient(): PostHog | null {
  if (!process.env.POSTHOG_API_KEY) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[PostHog] POSTHOG_API_KEY not configured, skipping LLM analytics")
    }
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
      // Serverless-optimized settings: send events immediately
      flushAt: 1,
      flushInterval: 0,
    })

    if (process.env.NODE_ENV === "development") {
      console.debug("[PostHog] Client initialized for LLM analytics")
    }
  }

  return posthogClient
}

/**
 * Flush and shutdown the PostHog client.
 * Call this in `after()` callbacks for streaming responses.
 */
export async function shutdownPostHog(): Promise<void> {
  if (posthogClient) {
    try {
      await posthogClient.shutdown()
    } catch (error) {
      console.error("[PostHog] Error during shutdown:", error)
    }
  }
}
