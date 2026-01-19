import { APP_DOMAIN } from "@/lib/config"
import type { UserProfile } from "@/lib/user/types"
import { fetchClient } from "./fetch"
import { API_ROUTE_CREATE_GUEST, API_ROUTE_UPDATE_CHAT_MODEL } from "./routes"

/**
 * Creates a guest user record on the server
 */
export async function createGuestUser(guestId: string) {
  try {
    const res = await fetchClient(API_ROUTE_CREATE_GUEST, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: guestId }),
    })
    const responseData = await res.json()
    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to create guest user: ${res.status} ${res.statusText}`
      )
    }

    return responseData
  } catch (err) {
    console.error("Error creating guest user:", err)
    throw err
  }
}

export class UsageLimitError extends Error {
  code: string
  constructor(message: string) {
    super(message)
    this.code = "DAILY_LIMIT_REACHED"
  }
}

/**
 * Checks the user's daily usage and increments both overall and daily counters.
 * Note: With Convex, this should be done via the usage.checkUsage query
 */
export async function checkRateLimits(
  userId: string,
  isAuthenticated: boolean
) {
  try {
    const res = await fetchClient(
      `/api/rate-limits?userId=${userId}&isAuthenticated=${isAuthenticated}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    const responseData = await res.json()
    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to check rate limits: ${res.status} ${res.statusText}`
      )
    }
    return responseData
  } catch (err) {
    console.error("Error checking rate limits:", err)
    throw err
  }
}

/**
 * Updates the model for an existing chat
 */
export async function updateChatModel(chatId: string, model: string) {
  try {
    const res = await fetchClient(API_ROUTE_UPDATE_CHAT_MODEL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, model }),
    })
    const responseData = await res.json()

    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to update chat model: ${res.status} ${res.statusText}`
      )
    }

    return responseData
  } catch (error) {
    console.error("Error updating chat model:", error)
    throw error
  }
}

/**
 * Signs in user with Google OAuth
 * Note: With Clerk, use the Clerk sign-in methods instead
 * @deprecated Use Clerk's useSignIn hook instead
 */
export async function signInWithGoogle(_unused: unknown) {
  console.warn("signInWithGoogle is deprecated. Use Clerk sign-in instead.")
  throw new Error("Use Clerk for authentication")
}

/**
 * Get or create a guest user ID
 * Note: With Clerk, guests can use the app without authentication
 * or sign in via Clerk
 */
export const getOrCreateGuestUserId = async (
  user: UserProfile | null
): Promise<string | null> => {
  if (user?.id) return user.id

  // With Clerk, we generate a local guest ID if no user is authenticated
  // This is stored in localStorage and used for local state only
  const existingGuestId = localStorage.getItem("guestUserId")
  if (existingGuestId) {
    return existingGuestId
  }

  // Generate a new guest ID
  const newGuestId = `guest_${crypto.randomUUID()}`
  localStorage.setItem("guestUserId", newGuestId)

  // Optionally register the guest on the server
  try {
    await createGuestUser(newGuestId)
  } catch (error) {
    console.warn("Failed to register guest user on server:", error)
    // Continue anyway - guest can still use the app
  }

  return newGuestId
}
