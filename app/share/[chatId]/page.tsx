import { APP_DOMAIN } from "@/lib/config"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Article from "./article"

export const dynamic = "force-dynamic"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

/**
 * Helper to safely convert string to Convex ID
 * Returns null if the string is not a valid Convex ID format
 */
function toConvexId(chatId: string): Id<"chats"> | null {
  // Convex IDs are base64-like strings, typically 32 chars
  // Basic validation to avoid throwing errors on invalid IDs
  if (!chatId || chatId.length < 10) return null
  try {
    return chatId as Id<"chats">
  } catch {
    return null
  }
}

/**
 * Public chat sharing page
 * Fetches public chat data server-side using Convex HTTP client
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chatId: string }>
}): Promise<Metadata> {
  const { chatId } = await params
  const convexId = toConvexId(chatId)

  let title = "Shared Chat"
  let description = "A conversation in vid0"

  if (convexId) {
    try {
      const chat = await convex.query(api.chats.getPublicById, {
        chatId: convexId,
      })
      if (chat?.title) {
        title = chat.title
        description = `Read this conversation: ${chat.title}`
      }
    } catch {
      // Fall back to defaults on error
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${APP_DOMAIN}/share/${chatId}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function ShareChat({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params
  const convexId = toConvexId(chatId)

  if (!convexId) {
    notFound()
  }

  // Fetch chat and messages from Convex
  const [chat, messages] = await Promise.all([
    convex.query(api.chats.getPublicById, { chatId: convexId }),
    convex.query(api.messages.getPublicForChat, { chatId: convexId }),
  ])

  // If chat doesn't exist or is not public, return 404
  if (!chat) {
    notFound()
  }

  return (
    <Article
      messages={messages}
      date={new Date(chat._creationTime).toISOString()}
      title={chat.title ?? "Shared Chat"}
      subtitle="A conversation in vid0"
    />
  )
}
