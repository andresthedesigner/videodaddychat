import {
  AUTH_DAILY_MESSAGE_LIMIT,
  DAILY_LIMIT_PRO_MODELS,
  NON_AUTH_DAILY_MESSAGE_LIMIT,
} from "@/lib/config"

/**
 * Get message usage for a user
 * Note: With Convex, usage data should be fetched via usage.checkUsage query
 * This function provides backward compatibility with default values
 */
export async function getMessageUsage(
  _userId: string,
  isAuthenticated: boolean
) {
  // With Convex, usage is tracked via the usage module
  // Return default values for backward compatibility
  const dailyLimit = isAuthenticated
    ? AUTH_DAILY_MESSAGE_LIMIT
    : NON_AUTH_DAILY_MESSAGE_LIMIT

  return {
    dailyCount: 0,
    dailyProCount: 0,
    dailyLimit,
    remaining: dailyLimit,
    remainingPro: DAILY_LIMIT_PRO_MODELS,
  }
}
