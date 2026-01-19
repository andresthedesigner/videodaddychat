import { auth } from "@clerk/nextjs/server"
import { ProviderWithoutOllama } from "@/lib/user-keys"
import { NextRequest, NextResponse } from "next/server"

/**
 * Check if user has API key for a specific provider
 * Note: With Convex, this should be done client-side via userKeys queries
 */
export async function POST(request: NextRequest) {
  try {
    const { provider, userId } = await request.json()

    const { userId: authUserId } = await auth()
    if (!authUserId || authUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Skip Ollama since it doesn't use API keys
    if (provider === "ollama") {
      return NextResponse.json({
        hasUserKey: false,
        provider,
      })
    }

    // With Convex, key checking should be done client-side
    // Check if environment has a key for this provider
    const envKeyMap: Record<ProviderWithoutOllama, string | undefined> = {
      openai: process.env.OPENAI_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      perplexity: process.env.PERPLEXITY_API_KEY,
      google: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      xai: process.env.XAI_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY,
    }

    const hasEnvKey = !!envKeyMap[provider as ProviderWithoutOllama]

    return NextResponse.json({
      hasUserKey: false, // User keys should be checked via Convex
      hasEnvKey,
      provider,
    })
  } catch (error) {
    console.error("Error checking provider keys:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
