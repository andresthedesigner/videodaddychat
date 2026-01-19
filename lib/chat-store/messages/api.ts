import type { Tables } from "@/app/types/database.types"
import { USE_CONVEX } from "@/lib/config"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import type { Message as MessageAISDK } from "ai"
import { readFromIndexedDB, writeToIndexedDB } from "../persist"

type MessageRow = Tables<"messages">

export interface ExtendedMessageAISDK extends MessageAISDK {
  message_group_id?: string
  model?: string
}

// ============================================================================
// Supabase Implementation (Legacy)
// ============================================================================

async function getMessagesFromDbSupabase(
  chatId: string
): Promise<MessageAISDK[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, content, role, experimental_attachments, created_at, parts, message_group_id, model"
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })

  if (!data || error) {
    console.error("Failed to fetch messages:", error)
    return []
  }

  return data.map((message: Pick<MessageRow, "id" | "content" | "role" | "experimental_attachments" | "created_at" | "parts" | "message_group_id" | "model">) => ({
    ...message,
    id: String(message.id),
    content: message.content ?? "",
    role: message.role,
    createdAt: new Date(message.created_at || ""),
    parts: (message?.parts as MessageAISDK["parts"]) || undefined,
    message_group_id: message.message_group_id,
    model: message.model,
  }))
}

async function getLastMessagesFromDbSupabase(
  chatId: string,
  limit: number = 2
): Promise<MessageAISDK[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, content, role, experimental_attachments, created_at, parts, message_group_id, model"
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (!data || error) {
    console.error("Failed to fetch last messages: ", error)
    return []
  }

  const ascendingData = [...data].reverse()
  return ascendingData.map((message) => ({
    ...message,
    id: String(message.id),
    content: message.content ?? "",
    createdAt: new Date(message.created_at || ""),
    parts: (message?.parts as MessageAISDK["parts"]) || undefined,
    message_group_id: message.message_group_id,
    model: message.model,
  }))
}

async function insertMessageToDbSupabase(
  chatId: string,
  message: ExtendedMessageAISDK
) {
  const supabase = createClient()
  if (!supabase) return

  await supabase.from("messages").insert({
    chat_id: chatId,
    role: message.role,
    content: message.content,
    experimental_attachments: message.experimental_attachments,
    created_at: message.createdAt?.toISOString() || new Date().toISOString(),
    message_group_id: message.message_group_id || null,
    model: message.model || null,
  })
}

async function insertMessagesToDbSupabase(
  chatId: string,
  messages: ExtendedMessageAISDK[]
) {
  const supabase = createClient()
  if (!supabase) return

  const payload = messages.map((message) => ({
    chat_id: chatId,
    role: message.role,
    content: message.content,
    experimental_attachments: message.experimental_attachments,
    created_at: message.createdAt?.toISOString() || new Date().toISOString(),
    message_group_id: message.message_group_id || null,
    model: message.model || null,
  }))

  await supabase.from("messages").insert(payload)
}

async function deleteMessagesFromDbSupabase(chatId: string) {
  const supabase = createClient()
  if (!supabase) return

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("chat_id", chatId)

  if (error) {
    console.error("Failed to clear messages from database:", error)
  }
}

// ============================================================================
// Unified API (chooses Convex or Supabase based on feature flag)
// ============================================================================

type ChatMessageEntry = {
  id: string
  messages: MessageAISDK[]
}

export async function getCachedMessages(
  chatId: string
): Promise<MessageAISDK[]> {
  const entry = await readFromIndexedDB<ChatMessageEntry>("messages", chatId)

  if (!entry || Array.isArray(entry)) return []

  return (entry.messages || []).sort(
    (a, b) => +new Date(a.createdAt || 0) - +new Date(b.createdAt || 0)
  )
}

export async function cacheMessages(
  chatId: string,
  messages: MessageAISDK[]
): Promise<void> {
  await writeToIndexedDB("messages", { id: chatId, messages })
}

export async function getMessagesFromDb(
  chatId: string
): Promise<MessageAISDK[]> {
  // With Convex, messages are fetched via the provider using useQuery
  // This function is kept for backward compatibility
  if (USE_CONVEX) {
    return await getCachedMessages(chatId)
  }

  // fallback to local cache only
  if (!isSupabaseEnabled) {
    return await getCachedMessages(chatId)
  }

  return getMessagesFromDbSupabase(chatId)
}

export async function getLastMessagesFromDb(
  chatId: string,
  limit: number = 2
): Promise<MessageAISDK[]> {
  if (USE_CONVEX) {
    const cached = await getCachedMessages(chatId)
    return cached.slice(-limit)
  }

  if (!isSupabaseEnabled) {
    const cached = await getCachedMessages(chatId)
    return cached.slice(-limit)
  }

  return getLastMessagesFromDbSupabase(chatId, limit)
}

export async function addMessage(
  chatId: string,
  message: MessageAISDK
): Promise<void> {
  // With Convex, the provider handles database operations
  if (!USE_CONVEX) {
    await insertMessageToDbSupabase(chatId, message as ExtendedMessageAISDK)
  }
  
  const current = await getCachedMessages(chatId)
  const updated = [...current, message]
  await writeToIndexedDB("messages", { id: chatId, messages: updated })
}

export async function setMessages(
  chatId: string,
  messages: MessageAISDK[]
): Promise<void> {
  // With Convex, the provider handles database operations
  if (!USE_CONVEX) {
    await insertMessagesToDbSupabase(chatId, messages as ExtendedMessageAISDK[])
  }
  
  await writeToIndexedDB("messages", { id: chatId, messages })
}

export async function clearMessagesCache(chatId: string): Promise<void> {
  await writeToIndexedDB("messages", { id: chatId, messages: [] })
}

export async function clearMessagesForChat(chatId: string): Promise<void> {
  // With Convex, the provider handles database operations
  if (!USE_CONVEX) {
    await deleteMessagesFromDbSupabase(chatId)
  }
  
  await clearMessagesCache(chatId)
}
