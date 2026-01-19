import { USE_CONVEX } from "@/lib/config"
import { validateUserIdentity } from "@/lib/server/api"
import { checkUsageByModel } from "@/lib/usage"

type CreateChatInput = {
  userId: string
  title?: string
  model: string
  isAuthenticated: boolean
  projectId?: string
}

/**
 * Create a chat using Convex
 * Note: With Convex, chat creation typically happens client-side via mutations
 * This server-side function is provided for API route compatibility
 */
async function createChatInConvex({
  userId,
  title,
  model,
  projectId,
}: Omit<CreateChatInput, "isAuthenticated">) {
  // With Convex, we return a placeholder that will be replaced by the actual Convex ID
  // The actual creation happens client-side via useMutation
  // This API route is kept for backward compatibility but the provider handles creation
  return {
    id: crypto.randomUUID(), // Temporary ID, replaced by Convex
    user_id: userId,
    title: title || "New Chat",
    model,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    public: false,
    pinned: false,
    pinned_at: null,
    project_id: projectId || null,
  }
}

/**
 * Create a chat using Supabase (Legacy)
 */
async function createChatInSupabase({
  userId,
  title,
  model,
  isAuthenticated,
  projectId,
}: CreateChatInput) {
  const supabase = await validateUserIdentity(userId, isAuthenticated)
  if (!supabase) {
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      model,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  await checkUsageByModel(supabase, userId, model, isAuthenticated)

  const insertData = {
    user_id: userId,
    title: title || "New Chat",
    model,
    project_id: projectId,
  }

  const { data, error } = await supabase
    .from("chats")
    .insert(insertData)
    .select("*")
    .single()

  if (error || !data) {
    console.error("Error creating chat:", error)
    return null
  }

  return data
}

export async function createChatInDb(input: CreateChatInput) {
  if (USE_CONVEX) {
    return createChatInConvex(input)
  }
  return createChatInSupabase(input)
}
