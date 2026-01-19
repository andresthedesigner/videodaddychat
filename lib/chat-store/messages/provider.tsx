"use client"

import { toast } from "@/components/ui/toast"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import type { Message as MessageAISDK } from "ai"
import { useMutation, useQuery } from "convex/react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { writeToIndexedDB } from "../persist"
import { useChatSession } from "../session/provider"

interface MessagesContextType {
  messages: MessageAISDK[]
  isLoading: boolean
  setMessages: React.Dispatch<React.SetStateAction<MessageAISDK[]>>
  refresh: () => Promise<void>
  saveAllMessages: (messages: MessageAISDK[]) => Promise<void>
  cacheAndAddMessage: (message: MessageAISDK) => Promise<void>
  resetMessages: () => Promise<void>
  deleteMessages: () => Promise<void>
}

const MessagesContext = createContext<MessagesContextType | null>(null)

export function useMessages() {
  const context = useContext(MessagesContext)
  if (!context)
    throw new Error("useMessages must be used within MessagesProvider")
  return context
}

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { chatId } = useChatSession()

  // Only query if chatId is a valid Convex ID (not optimistic)
  const isValidConvexId = Boolean(chatId && !chatId.startsWith("optimistic-"))

  // Convex real-time query for messages
  const convexMessages = useQuery(
    api.messages.getForChat,
    isValidConvexId ? { chatId: chatId as Id<"chats"> } : "skip"
  )

  // Convex mutations
  const addBatchMutation = useMutation(api.messages.addBatch)
  const clearMessagesMutation = useMutation(api.messages.clearForChat)

  // Convert Convex messages to AI SDK format
  const messages: MessageAISDK[] = useMemo(() => {
    if (!convexMessages) return []
    return convexMessages.map((msg) => ({
      id: msg._id,
      role: msg.role as "user" | "assistant" | "system" | "data",
      content: msg.content ?? "",
      createdAt: new Date(msg._creationTime),
      parts: msg.parts as MessageAISDK["parts"],
      experimental_attachments:
        msg.attachments as MessageAISDK["experimental_attachments"],
    }))
  }, [convexMessages])

  const isLoading = convexMessages === undefined && isValidConvexId

  const [localMessages, setLocalMessages] = useState<MessageAISDK[]>([])

  // Sync Convex messages with local state
  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(messages)
    }
  }, [messages])

  // Reset messages when chatId changes
  useEffect(() => {
    if (chatId === null) {
      setLocalMessages([])
    }
  }, [chatId])

  const refresh = async () => {
    // With Convex, data is real-time, so refresh is a no-op
  }

  const cacheAndAddMessage = async (message: MessageAISDK) => {
    if (!chatId) return

    // Optimistic update
    setLocalMessages((prev) => [...prev, message])

    // Also cache locally
    if (chatId) {
      const updated = [...localMessages, message]
      writeToIndexedDB("messages", { id: chatId, messages: updated })
    }

    // Note: The actual database insert happens via addMessageMutation
    // when saveAllMessages is called at the end of a chat turn
  }

  const saveAllMessages = async (newMessages: MessageAISDK[]) => {
    if (!chatId || chatId.startsWith("optimistic-")) return

    try {
      // Find new messages that need to be saved
      const existingIds = new Set(messages.map((m) => m.id))
      const messagesToSave = newMessages.filter((m) => !existingIds.has(m.id))

      if (messagesToSave.length > 0) {
        await addBatchMutation({
          chatId: chatId as Id<"chats">,
          messages: messagesToSave.map((msg) => ({
            role: msg.role as "user" | "assistant" | "system" | "data",
            content: msg.content,
            parts: msg.parts,
            attachments: msg.experimental_attachments,
            model: (msg as unknown as { model?: string }).model,
            messageGroupId: (msg as unknown as { message_group_id?: string })
              .message_group_id,
          })),
        })
      }

      setLocalMessages(newMessages)
      // Also cache locally
      await writeToIndexedDB("messages", { id: chatId, messages: newMessages })
    } catch (error) {
      console.error("Failed to save messages:", error)
      toast({ title: "Failed to save messages", status: "error" })
    }
  }

  const deleteMessages = async () => {
    if (!chatId || chatId.startsWith("optimistic-")) return

    setLocalMessages([])

    try {
      await clearMessagesMutation({ chatId: chatId as Id<"chats"> })
      await writeToIndexedDB("messages", { id: chatId, messages: [] })
    } catch (error) {
      console.error("Failed to delete messages:", error)
      toast({ title: "Failed to delete messages", status: "error" })
    }
  }

  const resetMessages = async () => {
    setLocalMessages([])
  }

  return (
    <MessagesContext.Provider
      value={{
        messages: localMessages.length > 0 ? localMessages : messages,
        isLoading,
        setMessages: setLocalMessages,
        refresh,
        saveAllMessages,
        cacheAndAddMessage,
        resetMessages,
        deleteMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  )
}
