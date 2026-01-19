import { auth } from "@clerk/nextjs/server"
import { SYSTEM_PROMPT_DEFAULT } from "@/lib/config"
import { getAllModels } from "@/lib/models"
import { getProviderForModel } from "@/lib/openproviders/provider-map"
import type { ProviderWithoutOllama } from "@/lib/user-keys"
import { Message as MessageAISDK, streamText, ToolSet } from "ai"
import {
  checkServerSideUsage,
  incrementServerSideUsage,
  logUserMessage,
  storeAssistantMessage,
  validateAndTrackUsage,
} from "./api"
import { createErrorResponse, extractErrorMessage } from "./utils"

export const maxDuration = 60

type ChatRequest = {
  messages: MessageAISDK[]
  chatId: string
  model: string
  systemPrompt: string
  enableSearch: boolean
  message_group_id?: string
  userId?: string // Client-provided userId (for anonymous users)
}

export async function POST(req: Request) {
  try {
    // Server-side authentication - derive userId from Clerk session
    const { userId: authUserId, getToken } = await auth()
    const isAuthenticated = !!authUserId

    // Get Convex token for authenticated usage tracking
    const convexToken = isAuthenticated
      ? (await getToken({ template: "convex" })) ?? undefined
      : undefined

    const {
      messages,
      chatId,
      model,
      systemPrompt,
      enableSearch,
      message_group_id,
      userId: clientUserId,
    } = (await req.json()) as ChatRequest

    // Use authenticated userId, or client-provided ID for anonymous users
    // The client-provided ID should be a stable guest ID from localStorage
    const userId = authUserId || clientUserId || `anon-${crypto.randomUUID()}`

    // For anonymous users, extract the anonymous ID for rate limiting
    // This should match the format from getOrCreateGuestUserId: "guest_<uuid>"
    const anonymousId = !isAuthenticated ? clientUserId : undefined

    if (!messages || !chatId) {
      return new Response(
        JSON.stringify({ error: "Error, missing information" }),
        { status: 400 }
      )
    }

    // Server-side usage check - enforces rate limits before processing
    // For anonymous users, pass the anonymousId for tracking
    await checkServerSideUsage(convexToken, model, anonymousId)

    await validateAndTrackUsage({
      userId,
      model,
      isAuthenticated,
    })

    // Increment usage count server-side with Convex
    await incrementServerSideUsage(convexToken, model, anonymousId)

    const userMessage = messages[messages.length - 1]

    // Log user message for debugging (actual storage via Convex client-side)
    if (userMessage?.role === "user") {
      await logUserMessage({
        userId,
        chatId,
        content: userMessage.content,
        model,
        isAuthenticated,
        message_group_id,
      })
    }

    const allModels = await getAllModels()
    const modelConfig = allModels.find((m) => m.id === model)

    if (!modelConfig || !modelConfig.apiSdk) {
      throw new Error(`Model ${model} not found`)
    }

    const effectiveSystemPrompt = systemPrompt || SYSTEM_PROMPT_DEFAULT

    let apiKey: string | undefined
    if (isAuthenticated && userId) {
      const { getEffectiveApiKey } = await import("@/lib/user-keys")
      const provider = getProviderForModel(model)
      apiKey =
        (await getEffectiveApiKey(userId, provider as ProviderWithoutOllama)) ||
        undefined
    }

    const result = streamText({
      model: modelConfig.apiSdk(apiKey, { enableSearch }),
      system: effectiveSystemPrompt,
      messages: messages,
      tools: {} as ToolSet,
      maxSteps: 10,
      onError: (err: unknown) => {
        console.error("Streaming error occurred:", err)
      },

      onFinish: async ({ response }) => {
        // Log assistant message for debugging (actual storage via Convex client-side)
        await storeAssistantMessage({
          chatId,
          messages:
            response.messages as unknown as import("@/app/types/api.types").Message[],
          message_group_id,
          model,
        })
      },
    })

    return result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
      getErrorMessage: (error: unknown) => {
        console.error("Error forwarded to client:", error)
        return extractErrorMessage(error)
      },
    })
  } catch (err: unknown) {
    console.error("Error in /api/chat:", err)
    const error = err as {
      code?: string
      message?: string
      statusCode?: number
    }

    return createErrorResponse(error)
  }
}
