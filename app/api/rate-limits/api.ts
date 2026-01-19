import {
  AUTH_DAILY_MESSAGE_LIMIT,
  DAILY_LIMIT_PRO_MODELS,
  NON_AUTH_DAILY_MESSAGE_LIMIT,
} from "@/lib/config"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

export type UsageResult = {
  dailyCount: number
  dailyProCount: number
  dailyLimit: number
  remaining: number
  remainingPro: number
}

/**
 * Get message usage for a user from Convex
 * @param token - Convex auth token (for authenticated users)
 * @param anonymousId - Anonymous ID (for unauthenticated users)
 * @param isAuthenticated - Whether the user is authenticated
 */
export async function getMessageUsage(
  token: string | undefined,
  anonymousId: string | undefined,
  isAuthenticated: boolean
): Promise<UsageResult> {
  const dailyLimit = isAuthenticated
    ? AUTH_DAILY_MESSAGE_LIMIT
    : NON_AUTH_DAILY_MESSAGE_LIMIT

  try {
    // Fetch regular model usage
    const regularUsage = await fetchQuery(
      api.usage.checkUsage,
      { isProModel: false, anonymousId },
      token ? { token } : undefined
    )

    // For authenticated users, also fetch pro model usage
    let proUsage = { count: 0, remaining: DAILY_LIMIT_PRO_MODELS }
    if (isAuthenticated) {
      const proResult = await fetchQuery(
        api.usage.checkUsage,
        { isProModel: true, anonymousId },
        token ? { token } : undefined
      )
      proUsage = {
        count: proResult.count ?? 0,
        remaining: proResult.remaining,
      }
    }

    return {
      dailyCount: regularUsage.count ?? 0,
      dailyProCount: proUsage.count,
      dailyLimit,
      remaining: regularUsage.remaining,
      remainingPro: proUsage.remaining,
    }
  } catch (error) {
    console.error("Error fetching usage from Convex:", error)
    // Return default values on error to avoid blocking users
    return {
      dailyCount: 0,
      dailyProCount: 0,
      dailyLimit,
      remaining: dailyLimit,
      remainingPro: DAILY_LIMIT_PRO_MODELS,
    }
  }
}
