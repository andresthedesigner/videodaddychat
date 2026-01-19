import { APP_DOMAIN } from "@/lib/config"
import type { Metadata } from "next"
import Article from "./article"

export const dynamic = "force-static"

/**
 * Public chat sharing page
 * Note: With Convex, this page fetches public chat data server-side
 * TODO: Implement Convex HTTP client for server-side data fetching
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chatId: string }>
}): Promise<Metadata> {
  const { chatId } = await params

  // TODO: Fetch chat metadata from Convex
  const title = "Shared Chat"
  const description = "A conversation in vid0"

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

  // TODO: Implement Convex HTTP client for server-side data fetching
  // For now, return a placeholder that will be enhanced with client-side data
  
  // This page needs to be updated to use Convex for fetching public chat data
  // Current implementation returns a placeholder
  console.log("Share page for chat:", chatId)

  return (
    <Article
      messages={[]}
      date={new Date().toISOString()}
      title="Shared Chat"
      subtitle="A conversation in vid0"
    />
  )
}
