"use client"

import { toast } from "@/components/ui/toast"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { MODEL_DEFAULT, SYSTEM_PROMPT_DEFAULT } from "../../config"
import type { Chats } from "../types"

interface ChatsContextType {
  chats: Chats[]
  refresh: () => Promise<void>
  isLoading: boolean
  updateTitle: (id: string, title: string) => Promise<void>
  deleteChat: (
    id: string,
    currentChatId?: string,
    redirect?: () => void
  ) => Promise<void>
  setChats: React.Dispatch<React.SetStateAction<Chats[]>>
  createNewChat: (
    userId: string,
    title?: string,
    model?: string,
    isAuthenticated?: boolean,
    systemPrompt?: string,
    projectId?: string
  ) => Promise<Chats | undefined>
  resetChats: () => Promise<void>
  getChatById: (id: string) => Chats | undefined
  updateChatModel: (id: string, model: string) => Promise<void>
  bumpChat: (id: string) => Promise<void>
  togglePinned: (id: string, pinned: boolean) => Promise<void>
  pinnedChats: Chats[]
}
const ChatsContext = createContext<ChatsContextType | null>(null)

export function useChats() {
  const context = useContext(ChatsContext)
  if (!context) throw new Error("useChats must be used within ChatsProvider")
  return context
}

export function ChatsProvider({
  children,
}: {
  userId?: string
  children: React.ReactNode
}) {
  // Convex real-time query for chats
  const convexChats = useQuery(api.chats.getForCurrentUser, {})

  // Convex mutations
  const createChatMutation = useMutation(api.chats.create)
  const updateTitleMutation = useMutation(api.chats.updateTitle)
  const updateModelMutation = useMutation(api.chats.updateModel)
  const togglePinMutation = useMutation(api.chats.togglePin)
  const deleteChatMutation = useMutation(api.chats.remove)

  // Convert Convex chats to unified format
  const chats: Chats[] = useMemo(() => {
    if (!convexChats) return []
    return convexChats.map(
      (chat): Chats => ({
        id: chat._id,
        user_id: chat.userId,
        title: chat.title ?? null,
        model: chat.model ?? null,
        system_prompt: chat.systemPrompt ?? null,
        project_id: chat.projectId ?? null,
        public: chat.public,
        pinned: chat.pinned,
        pinned_at: chat.pinnedAt ? new Date(chat.pinnedAt).toISOString() : null,
        created_at: new Date(chat._creationTime).toISOString(),
        updated_at: chat.updatedAt
          ? new Date(chat.updatedAt).toISOString()
          : null,
      })
    )
  }, [convexChats])

  const isLoading = convexChats === undefined

  const [localChats, setLocalChats] = useState<Chats[]>([])

  // Sync Convex chats with local state for optimistic updates
  useEffect(() => {
    if (chats.length > 0) {
      setLocalChats(chats)
    }
  }, [chats])

  const refresh = async () => {
    // With Convex, data is real-time, so refresh is a no-op
    // The useQuery hook automatically updates when data changes
  }

  const updateTitle = async (id: string, title: string) => {
    const previousState = [...localChats]

    // Optimistic update
    setLocalChats((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c
      )
      return updated.sort(
        (a, b) => +new Date(b.updated_at || "") - +new Date(a.updated_at || "")
      )
    })

    try {
      await updateTitleMutation({ chatId: id as Id<"chats">, title })
    } catch {
      setLocalChats(previousState)
      toast({ title: "Failed to update title", status: "error" })
    }
  }

  const deleteChat = async (
    id: string,
    currentChatId?: string,
    redirect?: () => void
  ) => {
    const prev = [...localChats]
    setLocalChats((prev) => prev.filter((c) => c.id !== id))

    try {
      await deleteChatMutation({ chatId: id as Id<"chats"> })
      if (id === currentChatId && redirect) redirect()
    } catch {
      setLocalChats(prev)
      toast({ title: "Failed to delete chat", status: "error" })
    }
  }

  const createNewChat = async (
    userId: string,
    title?: string,
    model?: string,
    _isAuthenticated?: boolean,
    systemPrompt?: string,
    projectId?: string
  ): Promise<Chats | undefined> => {
    if (!userId) return

    const optimisticId = `optimistic-${Date.now().toString()}`
    const optimisticChat: Chats = {
      id: optimisticId,
      title: title || "New Chat",
      created_at: new Date().toISOString(),
      model: model || MODEL_DEFAULT,
      system_prompt: systemPrompt || SYSTEM_PROMPT_DEFAULT,
      user_id: userId,
      public: false,
      updated_at: new Date().toISOString(),
      project_id: null,
      pinned: false,
      pinned_at: null,
    }

    const prev = [...localChats]
    setLocalChats((prev) => [optimisticChat, ...prev])

    try {
      const chatId = await createChatMutation({
        title: title || "New Chat",
        model: model || MODEL_DEFAULT,
        systemPrompt: systemPrompt || SYSTEM_PROMPT_DEFAULT,
        projectId: projectId as Id<"projects"> | undefined,
      })

      const newChat: Chats = {
        ...optimisticChat,
        id: chatId,
      }

      setLocalChats((prev) => [
        newChat,
        ...prev.filter((c) => c.id !== optimisticId),
      ])

      return newChat
    } catch {
      setLocalChats(prev)
      toast({ title: "Failed to create chat", status: "error" })
      return undefined
    }
  }

  const resetChats = async () => {
    setLocalChats([])
  }

  const getChatById = (id: string) => {
    return localChats.find((c) => c.id === id)
  }

  const updateChatModel = async (id: string, model: string) => {
    const prev = [...localChats]
    setLocalChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, model } : c))
    )

    try {
      await updateModelMutation({ chatId: id as Id<"chats">, model })
    } catch {
      setLocalChats(prev)
      toast({ title: "Failed to update model", status: "error" })
    }
  }

  const bumpChat = async (id: string) => {
    setLocalChats((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, updated_at: new Date().toISOString() } : c
      )
      return updated.sort(
        (a, b) => +new Date(b.updated_at || "") - +new Date(a.updated_at || "")
      )
    })
  }

  const togglePinned = async (id: string, pinned: boolean) => {
    const prevChats = [...localChats]
    const now = new Date().toISOString()

    const updatedChats = prevChats.map((chat) =>
      chat.id === id
        ? { ...chat, pinned, pinned_at: pinned ? now : null }
        : chat
    )
    const sortedChats = updatedChats.sort((a, b) => {
      const aTime = new Date(a.updated_at || a.created_at || 0).getTime()
      const bTime = new Date(b.updated_at || b.created_at || 0).getTime()
      return bTime - aTime
    })
    setLocalChats(sortedChats)

    try {
      await togglePinMutation({ chatId: id as Id<"chats">, pinned })
    } catch {
      setLocalChats(prevChats)
      toast({ title: "Failed to update pin", status: "error" })
    }
  }

  const pinnedChats = useMemo(
    () =>
      localChats
        .filter((c) => c.pinned && !c.project_id)
        .slice()
        .sort((a, b) => {
          const at = a.pinned_at ? +new Date(a.pinned_at) : 0
          const bt = b.pinned_at ? +new Date(b.pinned_at) : 0
          return bt - at
        }),
    [localChats]
  )

  return (
    <ChatsContext.Provider
      value={{
        chats: localChats.length > 0 ? localChats : chats,
        refresh,
        updateTitle,
        deleteChat,
        setChats: setLocalChats,
        createNewChat,
        resetChats,
        getChatById,
        updateChatModel,
        bumpChat,
        isLoading,
        togglePinned,
        pinnedChats,
      }}
    >
      {children}
    </ChatsContext.Provider>
  )
}
