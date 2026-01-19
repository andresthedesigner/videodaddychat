import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

/**
 * Get all API keys for current user (encrypted)
 */
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!user) return []

    return await ctx.db
      .query("userKeys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
  },
})

/**
 * Get API key for a specific provider
 */
export const getByProvider = query({
  args: { provider: v.string() },
  handler: async (ctx, { provider }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!user) return null

    const keys = await ctx.db
      .query("userKeys")
      .withIndex("by_user_provider", (q) =>
        q.eq("userId", user._id).eq("provider", provider)
      )
      .collect()

    return keys[0] ?? null
  },
})

/**
 * Upsert API key (encrypted key stored)
 */
export const upsert = mutation({
  args: {
    provider: v.string(),
    encryptedKey: v.string(),
    iv: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!user) throw new Error("User not found")

    // Check for existing key
    const existing = await ctx.db
      .query("userKeys")
      .withIndex("by_user_provider", (q) =>
        q.eq("userId", user._id).eq("provider", args.provider)
      )
      .collect()

    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, {
        encryptedKey: args.encryptedKey,
        iv: args.iv,
      })
      return existing[0]._id
    }

    return await ctx.db.insert("userKeys", {
      userId: user._id,
      provider: args.provider,
      encryptedKey: args.encryptedKey,
      iv: args.iv,
    })
  },
})

/**
 * Delete API key for a provider
 */
export const remove = mutation({
  args: { provider: v.string() },
  handler: async (ctx, { provider }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!user) throw new Error("User not found")

    const keys = await ctx.db
      .query("userKeys")
      .withIndex("by_user_provider", (q) =>
        q.eq("userId", user._id).eq("provider", provider)
      )
      .collect()

    if (keys[0]) {
      await ctx.db.delete(keys[0]._id)
    }
  },
})
