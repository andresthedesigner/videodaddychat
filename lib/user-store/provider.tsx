/**
 * User Provider
 *
 * Provides user context throughout the application.
 * User data is sourced from:
 * - Clerk for authentication (reactive via useUser hook + server-side initialUser)
 * - Convex for real-time updates (via Convex queries in consuming components)
 *
 * The provider uses Clerk's useUser hook to reactively update when auth state
 * changes (e.g., after login/logout), ensuring the UI reflects auth changes
 * without requiring a full page refresh.
 *
 * User Sync: When a Clerk user authenticates but doesn't exist in Convex,
 * this provider automatically creates them. This handles cases where:
 * - Webhooks fail or are delayed
 * - Local development without webhook configuration
 * - Users created before webhook was set up
 */
"use client"

import type { UserProfile } from "@/lib/user/types"
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser as useClerkUser } from "@clerk/nextjs"
import { defaultPreferences } from "@/lib/user-preference-store/utils"

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
  const createOrUpdateMutation = useMutation(api.users.createOrUpdate)
  
  // Use Clerk's useUser hook to reactively detect auth state changes
  const { user: clerkUser, isLoaded: isClerkLoaded } = useClerkUser()
  
  // Query Convex for the current user (will be null if not synced yet)
  const convexUser = useQuery(
    api.users.getByClerkId,
    clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  )
  
  // Track if we've already attempted sync this session to avoid duplicate calls
  const syncAttemptedRef = useRef<string | null>(null)
  
  // Sync Clerk user to Convex if they don't exist
  // This handles: webhook failures, local dev, users created before webhook setup
  useEffect(() => {
    async function syncUserToConvex() {
      if (!isClerkLoaded || !clerkUser) return
      
      // Skip if we've already synced this user in this session
      if (syncAttemptedRef.current === clerkUser.id) return
      
      // Skip if Convex query is still loading (convexUser is undefined)
      if (convexUser === undefined) return
      
      // Skip if user already exists in Convex
      if (convexUser !== null) {
        syncAttemptedRef.current = clerkUser.id
        return
      }
      
      // User doesn't exist in Convex - create them
      syncAttemptedRef.current = clerkUser.id
      
      const email = clerkUser.primaryEmailAddress?.emailAddress ?? ""
      const displayName = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ")
        .trim()
      
      try {
        await createOrUpdateMutation({
          clerkId: clerkUser.id,
          email,
          displayName: displayName || undefined,
          profileImage: clerkUser.imageUrl || undefined,
        })
        console.log("[UserProvider] Synced user to Convex:", clerkUser.id)
      } catch (error) {
        console.error("[UserProvider] Failed to sync user to Convex:", error)
        // Reset sync attempt so it can retry
        syncAttemptedRef.current = null
      }
    }
    
    syncUserToConvex()
  }, [isClerkLoaded, clerkUser, convexUser, createOrUpdateMutation])
  
  // Sync user state with Clerk auth state
  // Uses functional update to preserve Convex-managed fields without adding 'user' to deps
  useEffect(() => {
    if (!isClerkLoaded) return
    
    if (clerkUser) {
      // User is logged in - update our user state with Clerk data
      // Additional fields (usage tracking, etc.) are managed by Convex
      setUser((prevUser) => ({
        // Identity (from Clerk)
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        display_name: clerkUser.firstName
          ? `${clerkUser.firstName}${clerkUser.lastName ? ` ${clerkUser.lastName}` : ""}`
          : clerkUser.username || "",
        profile_image: clerkUser.imageUrl || "",
        // Status
        anonymous: false,
        premium: prevUser?.premium ?? null,
        // Usage tracking (managed by Convex, preserve existing values)
        message_count: prevUser?.message_count ?? null,
        daily_message_count: prevUser?.daily_message_count ?? null,
        daily_reset: prevUser?.daily_reset ?? null,
        daily_pro_message_count: prevUser?.daily_pro_message_count ?? null,
        daily_pro_reset: prevUser?.daily_pro_reset ?? null,
        // Activity
        last_active_at: prevUser?.last_active_at ?? null,
        created_at: prevUser?.created_at ?? null,
        // Preferences
        favorite_models: prevUser?.favorite_models ?? null,
        system_prompt: prevUser?.system_prompt ?? null,
        preferences: prevUser?.preferences || defaultPreferences,
      }))
    } else {
      // User is logged out
      setUser(null)
    }
  }, [clerkUser, isClerkLoaded])

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
