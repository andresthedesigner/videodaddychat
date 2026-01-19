import { auth } from "@clerk/nextjs/server"
import { getMessageUsage } from "./api"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  // anonymousId is used for unauthenticated users to track their usage
  const anonymousId = searchParams.get("userId") ?? undefined

  try {
    // Get auth state from Clerk
    const { userId: authUserId, getToken } = await auth()
    const isAuthenticated = !!authUserId

    // Validate: must have either authenticated user or anonymousId for tracking
    if (!isAuthenticated && !anonymousId) {
      return new Response(
        JSON.stringify({
          error: "Missing user identification",
          code: "MISSING_USER_ID",
          message: "Either authentication or anonymousId is required for usage tracking",
        }),
        { status: 400 }
      )
    }

    // Get Convex token for authenticated users
    const convexToken = isAuthenticated
      ? (await getToken({ template: "convex" })) ?? undefined
      : undefined

    const usage = await getMessageUsage(convexToken, anonymousId, isAuthenticated)

    return new Response(JSON.stringify(usage), { status: 200 })
  } catch (err: unknown) {
    console.error("Error in /api/rate-limits:", err)
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 })
  }
}
