/**
 * Usage tracking utilities
 *
 * DEPRECATED: With Convex, usage tracking is handled by `convex/usage.ts`.
 * These functions are kept for backward compatibility but should not be used
 * for new code. Use Convex queries/mutations instead:
 *
 * - api.usage.checkUsage({ isProModel: boolean })
 * - api.usage.incrementUsage({ isProModel: boolean })
 *
 * @deprecated Use Convex usage functions instead
 */

import { UsageLimitError } from "@/lib/api"
import {
  AUTH_DAILY_MESSAGE_LIMIT,
  DAILY_LIMIT_PRO_MODELS,
  FREE_MODELS_IDS,
  NON_AUTH_DAILY_MESSAGE_LIMIT,
} from "@/lib/config"

const isFreeModel = (modelId: string) => FREE_MODELS_IDS.includes(modelId)
const isProModel = (modelId: string) => !isFreeModel(modelId)

/**
 * @deprecated Use Convex query `usage.checkUsage` instead
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkUsage(_userId: string) {
  // Return a default allowing usage - actual checks happen via Convex
  return {
    userData: {},
    dailyCount: 0,
    dailyLimit: AUTH_DAILY_MESSAGE_LIMIT,
  }
}

/**
 * @deprecated Use Convex mutation `usage.incrementUsage` instead
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function incrementUsage(_userId: string): Promise<void> {
  // No-op - actual increment happens via Convex
}

/**
 * @deprecated Use Convex query `usage.checkUsage` with isProModel: true
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkProUsage(_userId: string) {
  return {
    dailyProCount: 0,
    limit: DAILY_LIMIT_PRO_MODELS,
  }
}

/**
 * @deprecated Use Convex mutation `usage.incrementUsage` with isProModel: true
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function incrementProUsage(_userId: string) {
  // No-op - actual increment happens via Convex
}

/**
 * @deprecated Use Convex query `usage.checkUsage` instead
 */
export async function checkUsageByModel(
  _userId: string,
  modelId: string,
  isAuthenticated: boolean
) {
  if (isProModel(modelId)) {
    if (!isAuthenticated) {
      throw new UsageLimitError("You must log in to use this model.")
    }
    return { dailyProCount: 0, limit: DAILY_LIMIT_PRO_MODELS }
  }

  return {
    userData: {},
    dailyCount: 0,
    dailyLimit: isAuthenticated
      ? AUTH_DAILY_MESSAGE_LIMIT
      : NON_AUTH_DAILY_MESSAGE_LIMIT,
  }
}

/**
 * @deprecated Use Convex mutation `usage.incrementUsage` instead
 */
export async function incrementUsageByModel(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _modelId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isAuthenticated: boolean
) {
  // No-op - actual increment happens via Convex
}
