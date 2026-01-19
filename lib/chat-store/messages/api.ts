import type { Message as MessageAISDK } from "ai"
import { readFromIndexedDB, writeToIndexedDB } from "../persist"

export interface ExtendedMessageAISDK extends MessageAISDK {
  message_group_id?: string
  model?: string
}

// ============================================================================
// Cache Operations (IndexedDB)
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

// ============================================================================
// Convex-backed Operations (via provider)
// Note: With Convex, real-time queries handle most data fetching.
// These functions primarily manage the local IndexedDB cache.
// ============================================================================

export async function getMessagesFromDb(
  chatId: string
): Promise<MessageAISDK[]> {
  // With Convex, messages are fetched via the provider using useQuery
  return await getCachedMessages(chatId)
}

export async function getLastMessagesFromDb(
  chatId: string,
  limit: number = 2
): Promise<MessageAISDK[]> {
  const cached = await getCachedMessages(chatId)
  return cached.slice(-limit)
}

export async function addMessage(
  chatId: string,
  message: MessageAISDK
): Promise<void> {
  // With Convex, the provider handles database operations
  const current = await getCachedMessages(chatId)
  const updated = [...current, message]
  await writeToIndexedDB("messages", { id: chatId, messages: updated })
}

export async function setMessages(
  chatId: string,
  messages: MessageAISDK[]
): Promise<void> {
  // With Convex, the provider handles database operations
  await writeToIndexedDB("messages", { id: chatId, messages })
}

export async function clearMessagesCache(chatId: string): Promise<void> {
  await writeToIndexedDB("messages", { id: chatId, messages: [] })
}

export async function clearMessagesForChat(chatId: string): Promise<void> {
  // With Convex, the provider handles database operations
  await clearMessagesCache(chatId)
}
