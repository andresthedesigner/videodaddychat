import { PostHog } from "posthog-node"

let posthogClient: PostHog | null = null

/**
 * Get the PostHog client singleton for LLM analytics.
 * Returns null if POSTHOG_API_KEY is not configured.
 *
 * @see https://posthog.com/docs/llm-analytics/installation/vercel-ai
 */
export function getPostHogClient(): PostHog | null {
  if (!process.env.POSTHOG_API_KEY) {
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST || "https://us.i.posthog.com",
    })
  }

  return posthogClient
}
