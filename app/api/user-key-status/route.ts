import { auth } from "@clerk/nextjs/server"
import { PROVIDERS } from "@/lib/providers"
import { NextResponse } from "next/server"

const SUPPORTED_PROVIDERS = PROVIDERS.map((p) => p.id)

/**
 * Get status of which providers the user has API keys for
 * Note: With Convex, user keys are managed via userKeys queries
 * This endpoint provides backward compatibility
 */
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // With Convex, key status should be fetched client-side via userKeys.getAll
    // Return all providers as false for backward compatibility
    // Client should use Convex queries for actual status
    const providerStatus = SUPPORTED_PROVIDERS.reduce(
      (acc, provider) => {
        acc[provider] = false
        return acc
      },
      {} as Record<string, boolean>
    )

    console.log("User key status should be fetched via Convex userKeys.getAll")

    return NextResponse.json(providerStatus)
  } catch (err) {
    console.error("Key status error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
