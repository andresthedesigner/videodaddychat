import { env } from "./openproviders/env"
import { Provider } from "./openproviders/types"

export type { Provider } from "./openproviders/types"
export type ProviderWithoutOllama = Exclude<Provider, "ollama">

/**
 * Get user's API key for a provider
 * Note: With Convex, user keys should be fetched via userKeys.getByProvider query
 * This function is kept for backward compatibility but returns null
 * @deprecated Use Convex userKeys queries instead
 */
export async function getUserKey(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _provider: Provider
): Promise<string | null> {
  // With Convex, user keys should be fetched client-side via userKeys.getByProvider
  console.warn("getUserKey is deprecated, use Convex userKeys queries instead")
  return null
}

/**
 * Get the effective API key for a provider
 * Checks user's key first, then falls back to environment variable
 * Note: User key lookup should use Convex queries client-side
 */
export async function getEffectiveApiKey(
  userId: string | null,
  provider: ProviderWithoutOllama
): Promise<string | null> {
  // With Convex, user keys should be checked client-side
  // Here we only return environment keys for server-side use
  
  const envKeyMap: Record<ProviderWithoutOllama, string | undefined> = {
    openai: env.OPENAI_API_KEY,
    mistral: env.MISTRAL_API_KEY,
    perplexity: env.PERPLEXITY_API_KEY,
    google: env.GOOGLE_GENERATIVE_AI_API_KEY,
    anthropic: env.ANTHROPIC_API_KEY,
    xai: env.XAI_API_KEY,
    openrouter: env.OPENROUTER_API_KEY,
  }

  return envKeyMap[provider] || null
}
