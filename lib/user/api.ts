import { currentUser } from "@clerk/nextjs/server"
import {
  defaultPreferences,
} from "@/lib/user-preference-store/utils"
import type { UserProfile } from "./types"

/**
 * Get the current authenticated user from Clerk
 */
export async function getClerkUser() {
  const user = await currentUser()
  return user
}

/**
 * Get user profile from Clerk
 * Note: With Convex, additional user data is fetched via Convex queries
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await currentUser()
  if (!user) return null

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || "",
    display_name: user.firstName
      ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`
      : user.username || "",
    profile_image: user.imageUrl || "",
    anonymous: false,
    preferences: defaultPreferences,
  } as UserProfile
}
