import { auth } from "@clerk/nextjs/server"
import { ChatContainer } from "@/app/components/chat/chat-container"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { redirect } from "next/navigation"

export default async function Page() {
  const { userId } = await auth()
  
  // Redirect to home if not authenticated
  if (!userId) {
    redirect("/")
  }

  return (
    <MessagesProvider>
      <LayoutApp>
        <ChatContainer />
      </LayoutApp>
    </MessagesProvider>
  )
}
