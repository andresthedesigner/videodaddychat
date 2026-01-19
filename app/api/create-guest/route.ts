/**
 * Create Guest User API
 * 
 * Note: With Clerk + Convex, guest users are handled differently.
 * Clerk provides authentication, and anonymous users should use
 * Clerk's anonymous authentication or the app should work without auth.
 * 
 * This endpoint is kept for backward compatibility but returns a mock
 * guest user. For actual guest functionality, use Clerk's features.
 */
export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
      })
    }

    // Input validation: ensure userId is a string with safe characters
    if (typeof userId !== "string") {
      return new Response(JSON.stringify({ error: "Invalid userId" }), {
        status: 400,
      })
    }

    const trimmedUserId = userId.trim()
    const userIdPattern = /^[a-zA-Z0-9_\-:@.]{1,128}$/

    if (!trimmedUserId || !userIdPattern.test(trimmedUserId)) {
      return new Response(JSON.stringify({ error: "Invalid userId format" }), {
        status: 400,
      })
    }

    // With Clerk + Convex, guest users are managed differently
    // Return a mock user for backward compatibility
    console.log("Guest user creation handled via local storage or Clerk")
    
    return new Response(
      JSON.stringify({ 
        user: { 
          id: trimmedUserId, 
          anonymous: true,
          message_count: 0,
          daily_message_count: 0,
        } 
      }),
      { status: 200 }
    )
  } catch (err: unknown) {
    console.error("Error in create-guest endpoint:", err)

    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500 }
    )
  }
}
