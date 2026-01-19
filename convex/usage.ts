import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Import limits - these should match lib/config.ts
const NON_AUTH_DAILY_MESSAGE_LIMIT = 5
const AUTH_DAILY_MESSAGE_LIMIT = 1000
const DAILY_LIMIT_PRO_MODELS = 500

/**
 * Check if user has reached their daily limit
 */
export const checkUsage = query({
  args: { isProModel: v.boolean() },
  handler: async (ctx, { isProModel }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      return {
        canSend: true,
        remaining: NON_AUTH_DAILY_MESSAGE_LIMIT,
        limit: NON_AUTH_DAILY_MESSAGE_LIMIT,
        isAnonymous: true,
      }
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!user) {
      return {
        canSend: false,
        remaining: 0,
        limit: 0,
        error: "User not found",
      }
    }

    const startOfDay = new Date()
    startOfDay.setUTCHours(0, 0, 0, 0)
    const startOfDayMs = startOfDay.getTime()

    if (isProModel) {
      const lastReset = user.dailyProReset ?? 0
      const isNewDay = lastReset < startOfDayMs
      const count = isNewDay ? 0 : (user.dailyProMessageCount ?? 0)
      const remaining = Math.max(0, DAILY_LIMIT_PRO_MODELS - count)

      return {
        canSend: count < DAILY_LIMIT_PRO_MODELS,
        remaining,
        limit: DAILY_LIMIT_PRO_MODELS,
        count,
        isProModel: true,
      }
    }

    // Regular model limits
    const limit = user.anonymous
      ? NON_AUTH_DAILY_MESSAGE_LIMIT
      : AUTH_DAILY_MESSAGE_LIMIT
    const lastReset = user.dailyReset ?? 0
    const isNewDay = lastReset < startOfDayMs
    const count = isNewDay ? 0 : (user.dailyMessageCount ?? 0)
    const remaining = Math.max(0, limit - count)

    return {
      canSend: count < limit,
      remaining,
      limit,
      count,
      isAnonymous: user.anonymous,
    }
  },
})

/**
 * Increment usage counters
 */
export const incrementUsage = mutation({
  args: { isProModel: v.boolean() },
  handler: async (ctx, { isProModel }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!user) return

    const now = Date.now()
    const startOfDay = new Date()
    startOfDay.setUTCHours(0, 0, 0, 0)
    const startOfDayMs = startOfDay.getTime()

    if (isProModel) {
      const lastReset = user.dailyProReset ?? 0
      const isNewDay = lastReset < startOfDayMs

      await ctx.db.patch(user._id, {
        dailyProMessageCount: isNewDay
          ? 1
          : (user.dailyProMessageCount ?? 0) + 1,
        dailyProReset: isNewDay ? startOfDayMs : user.dailyProReset,
        lastActiveAt: now,
      })
    } else {
      const lastReset = user.dailyReset ?? 0
      const isNewDay = lastReset < startOfDayMs

      await ctx.db.patch(user._id, {
        messageCount: (user.messageCount ?? 0) + 1,
        dailyMessageCount: isNewDay ? 1 : (user.dailyMessageCount ?? 0) + 1,
        dailyReset: isNewDay ? startOfDayMs : user.dailyReset,
        lastActiveAt: now,
      })
    }
  },
})
