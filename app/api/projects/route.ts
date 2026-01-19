import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

/**
 * Projects API
 * Note: With Convex, projects should be managed via Convex mutations/queries
 * This endpoint provides backward compatibility
 */

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    // With Convex, projects should be created via Convex mutations
    // Return a placeholder for backward compatibility
    console.log("Project creation should use Convex mutation")
    
    return NextResponse.json({
      id: crypto.randomUUID(),
      name,
      user_id: userId,
      created_at: new Date().toISOString(),
    })
  } catch (err: unknown) {
    console.error("Error in projects endpoint:", err)

    return new Response(
      JSON.stringify({
        error: (err as Error).message || "Internal server error",
      }),
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // With Convex, projects should be fetched via Convex queries
    // Return empty array for backward compatibility
    console.log("Projects should be fetched via Convex query")
    
    return NextResponse.json([])
  } catch (err: unknown) {
    console.error("Error in projects GET endpoint:", err)
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    )
  }
}
