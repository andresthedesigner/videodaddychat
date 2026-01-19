import type {
  ChatApiParams,
  LogUserMessageParams,
  StoreAssistantMessageParams,
} from "@/app/types/api.types"
import { FREE_MODELS_IDS, NON_AUTH_ALLOWED_MODELS } from "@/lib/config"
import { getProviderForModel } from "@/lib/openproviders/provider-map"
import { sanitizeUserInput } from "@/lib/sanitize"
import { getUserKey, type ProviderWithoutOllama } from "@/lib/user-keys"

/**
 * Validate user access to model and check for required API keys
 * Note: With Convex, usage tracking is handled client-side via the usage module
 */
export async function validateAndTrackUsage({
  userId,
  model,
  isAuthenticated,
}: ChatApiParams): Promise<null> {
  // Check if user is authenticated
  if (!isAuthenticated) {
    // For unauthenticated users, only allow specific models
    if (!NON_AUTH_ALLOWED_MODELS.includes(model)) {
      throw new Error(
        "This model requires authentication. Please sign in to access more models."
      )
    }
  } else {
    // For authenticated users, check API key requirements
    const provider = getProviderForModel(model)

    if (provider !== "ollama") {
      const userApiKey = await getUserKey(
        userId,
        provider as ProviderWithoutOllama
      )

      // If no API key and model is not in free list, deny access
      if (!userApiKey && !FREE_MODELS_IDS.includes(model)) {
        throw new Error(
          `This model requires an API key for ${provider}. Please add your API key in settings or use a free model.`
        )
      }
    }
  }

  // With Convex, usage tracking is handled client-side via mutations
  return null
}

/**
 * Increment message count for the user
 * Note: With Convex, this is handled via the usage.incrementUsage mutation
 * @deprecated Use Convex mutation `usage.incrementUsage` client-side instead
 */
export async function incrementMessageCount({
  userId,
}: {
  userId: string
}): Promise<void> {
  // With Convex, usage increment is handled client-side via mutations
  // This is a no-op for backward compatibility
  void userId
}

/**
 * Log user message
 * Note: With Convex, messages are saved via the MessagesProvider
 */
export async function logUserMessage({
  userId,
  chatId,
  content,
  attachments,
  model,
  isAuthenticated,
  message_group_id,
}: LogUserMessageParams): Promise<void> {
  // With Convex, messages are saved client-side via the MessagesProvider
  // This function is kept for backward compatibility but is a no-op
  console.log("User message logging should use Convex messages.add", {
    userId,
    chatId,
    content: sanitizeUserInput(content).substring(0, 50) + "...",
    hasAttachments: !!attachments?.length,
    model,
    isAuthenticated,
    message_group_id,
  })
}

/**
 * Store assistant message
 * Note: With Convex, messages are saved via the MessagesProvider
 */
export async function storeAssistantMessage({
  chatId,
  messages,
  message_group_id,
  model,
}: StoreAssistantMessageParams): Promise<void> {
  // With Convex, messages are saved client-side via the MessagesProvider
  // This function is kept for backward compatibility but is a no-op
  console.log("Assistant message storage should use Convex messages.addBatch", {
    chatId,
    messageCount: messages.length,
    message_group_id,
    model,
  })
}
