/**
 * User store API
 * 
 * Note: With Convex + Clerk, user data is managed through:
 * - Clerk for authentication and basic profile (email, name, image)
 * - Convex for application-specific user data (preferences, usage, etc.)
 * 
 * These functions are kept for backward compatibility but actual
 * user operations should use Convex mutations/queries.
 */

import { toast } from "@/components/ui/toast"
import type { UserProfile } from "@/lib/user/types"

/**
 * Fetch user profile by ID
 * @deprecated Use Convex query `users.getCurrent` instead
 */
export async function fetchUserProfile(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id: string
): Promise<UserProfile | null> {
  // With Convex, user profiles are fetched via Convex queries
  // This function is kept for backward compatibility
  console.warn("fetchUserProfile is deprecated, use Convex queries instead")
  return null
}

/**
 * Update user profile
 * @deprecated Use Convex mutation instead
 */
export async function updateUserProfile(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _id: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updates: Partial<UserProfile>
): Promise<boolean> {
  // With Convex, user updates are handled via Convex mutations
  console.warn("updateUserProfile is deprecated, use Convex mutations instead")
  return false
}

/**
 * Sign out the current user
 * Use the Clerk hook instead: const { signOut } = useClerk()
 */
export async function signOutUser(): Promise<boolean> {
  // Note: This should be called from a component using useClerk().signOut()
  toast({
    title: "Use the Clerk signOut method instead",
    description: "This function is deprecated",
    status: "info",
  })
  return false
}

/**
 * Subscribe to user updates
 * @deprecated Use Convex real-time queries instead
 */
export function subscribeToUserUpdates(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onUpdate: (newData: Partial<UserProfile>) => void
) {
  // With Convex, real-time updates are handled automatically via useQuery
  console.warn("subscribeToUserUpdates is deprecated, Convex handles real-time updates")
  return () => {}
}
