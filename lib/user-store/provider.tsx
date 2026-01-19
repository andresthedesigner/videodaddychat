/**
 * User Provider
 *
 * Provides user context throughout the application.
 * User data is sourced from:
 * - Clerk for authentication (passed as initialUser from server)
 * - Convex for real-time updates (via Convex queries in consuming components)
 *
 * Note: This provider mainly holds the initial user profile from Clerk.
 * For real-time user data updates, prefer using Convex queries directly.
 */
"use client"

import type { UserProfile } from "@/lib/user/types"
import { createContext, useContext, useState, useCallback } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (updates: Partial<UserProfile>) => Promise<void>
  // Note: For sign out, use useClerk().signOut() from @clerk/nextjs
  // Note: refreshUser was removed - use Convex real-time queries or ModelProvider.favoriteModels instead
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: UserProfile | null
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const updateProfileMutation = useMutation(api.users.updateProfile)

  // Update user profile and persist to Convex
  const updateUser = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      // Map UserProfile fields to Convex schema fields
      const convexUpdates: { systemPrompt?: string; displayName?: string } = {}
      if (updates.system_prompt !== undefined) {
        convexUpdates.systemPrompt = updates.system_prompt ?? undefined
      }
      if (updates.display_name !== undefined) {
        convexUpdates.displayName = updates.display_name
      }

      // Persist to Convex if there are supported fields to update
      if (Object.keys(convexUpdates).length > 0) {
        await updateProfileMutation(convexUpdates)
      }

      // Update local state optimistically
      setUser((prev) => (prev ? { ...prev, ...updates } : null))
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, updateProfileMutation])

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
