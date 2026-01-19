"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useMessages } from "@/lib/chat-store/messages/provider"
import { clearAllIndexedDBStores } from "@/lib/chat-store/persist"
import { useClerk } from "@clerk/nextjs"
import { SignOut } from "@phosphor-icons/react"

export function AccountManagement() {
  const { signOut } = useClerk()
  const { resetChats } = useChats()
  const { resetMessages } = useMessages()

  const handleSignOut = async () => {
    try {
      await resetMessages()
      await resetChats()
      await clearAllIndexedDBStores()
      // Clerk signOut handles session clearing and redirect
      await signOut({ redirectUrl: "/" })
    } catch (e) {
      console.error("Sign out failed:", e)
      toast({ title: "Failed to sign out", status: "error" })
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium">Account</h3>
        <p className="text-muted-foreground text-xs">Log out on this device</p>
      </div>
      <Button
        variant="default"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleSignOut}
      >
        <SignOut className="size-4" />
        <span>Sign out</span>
      </Button>
    </div>
  )
}
