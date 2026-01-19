import { auth } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { ProjectView } from "@/app/p/[projectId]/project-view"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { notFound, redirect } from "next/navigation"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

type Props = {
  params: Promise<{ projectId: string }>
}

/**
 * Helper to safely convert string to Convex ID
 * Returns null if the string is not a valid Convex ID format
 */
function toConvexId(projectId: string): Id<"projects"> | null {
  // Convex IDs are base64-like strings, typically 32 chars
  // Basic validation to avoid throwing errors on invalid IDs
  if (!projectId || projectId.length < 10) return null
  try {
    return projectId as Id<"projects">
  } catch {
    return null
  }
}

export default async function Page({ params }: Props) {
  const { projectId } = await params
  const { userId } = await auth()

  // Redirect to home if not authenticated
  if (!userId) {
    redirect("/")
  }

  // Validate project ID format
  const convexId = toConvexId(projectId)
  if (!convexId) {
    notFound()
  }

  // Server-side ownership verification
  // Query the project with owner info to verify the authenticated user owns it
  try {
    const project = await convex.query(api.projects.getByIdWithOwner, {
      projectId: convexId,
    })

    // If project doesn't exist, return 404
    if (!project) {
      notFound()
    }

    // Verify ownership: compare project owner's clerkId with authenticated userId
    if (project.ownerClerkId !== userId) {
      // User doesn't own this project - redirect to home
      redirect("/")
    }
  } catch {
    // If query fails (e.g., invalid ID), return 404
    notFound()
  }

  return (
    <MessagesProvider>
      <LayoutApp>
        <ProjectView projectId={projectId} key={projectId} />
      </LayoutApp>
    </MessagesProvider>
  )
}
