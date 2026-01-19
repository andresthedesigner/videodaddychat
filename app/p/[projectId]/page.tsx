import { auth } from "@clerk/nextjs/server"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { ProjectView } from "@/app/p/[projectId]/project-view"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ projectId: string }>
}

export default async function Page({ params }: Props) {
  const { projectId } = await params
  const { userId } = await auth()

  // Redirect to home if not authenticated
  if (!userId) {
    redirect("/")
  }

  // Note: Project ownership verification is now handled client-side
  // via Convex queries with auth context

  return (
    <MessagesProvider>
      <LayoutApp>
        <ProjectView projectId={projectId} key={projectId} />
      </LayoutApp>
    </MessagesProvider>
  )
}
