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

    // With Clerk + Convex, guest users are managed differently
    // Return a mock user for backward compatibility
    console.log("Guest user creation handled via local storage or Clerk")
    
    return new Response(
      JSON.stringify({ 
        user: { 
          id: userId, 
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
