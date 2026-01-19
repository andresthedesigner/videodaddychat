import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

/**
 * Submit feedback from authenticated user
 */
export const submit = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, { message }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Must be authenticated to submit feedback")
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!user) {
      throw new Error("User not found")
    }

    return await ctx.db.insert("feedback", {
      userId: user._id,
      message,
    })
  },
})

/**
 * Get all feedback for admin purposes (internal query)
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("feedback").order("desc").collect()
  },
})
