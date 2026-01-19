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

type UserContextType = {
  user: UserProfile | null
  isLoading: boolean
  updateUser: (updates: Partial<UserProfile>) => Promise<void>
  refreshUser: () => Promise<void>
  // Note: For sign out, use useClerk().signOut() from @clerk/nextjs
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

  // Refresh user data
  // Note: With Convex, prefer using real-time queries instead
  const refreshUser = useCallback(async () => {
    // With Convex integration, user data is typically fetched via Convex queries
    // This function is kept for API compatibility but doesn't fetch externally
    // Consuming components should use Convex useQuery for real-time updates
  }, [])

  // Update user profile
  // Note: With Convex, prefer using mutations directly
  const updateUser = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      // Optimistically update local state
      // Actual persistence should be handled via Convex mutations in consuming components
      setUser((prev) => (prev ? { ...prev, ...updates } : null))
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser, refreshUser }}>
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
