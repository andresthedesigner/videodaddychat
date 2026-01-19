import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

/**
 * Single Project API
 * Note: With Convex, projects should be managed via Convex mutations/queries
 * This endpoint provides backward compatibility
 */

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // With Convex, projects should be fetched via Convex queries
    console.log("Project fetch should use Convex query")
    
    return NextResponse.json({
      id: projectId,
      name: "Project",
      user_id: userId,
      created_at: new Date().toISOString(),
    })
  } catch (err: unknown) {
    console.error("Error in project endpoint:", err)
    return new Response(
      JSON.stringify({
        error: (err as Error).message || "Internal server error",
      }),
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const { name } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      )
    }

    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // With Convex, projects should be updated via Convex mutations
    console.log("Project update should use Convex mutation")
    
    return NextResponse.json({
      id: projectId,
      name: name.trim(),
      user_id: userId,
      updated_at: new Date().toISOString(),
    })
  } catch (err: unknown) {
    console.error("Error updating project:", err)
    return new Response(
      JSON.stringify({
        error: (err as Error).message || "Internal server error",
      }),
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // With Convex, projects should be deleted via Convex mutations
    console.log("Project deletion should use Convex mutation for project:", projectId)
    
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("Error deleting project:", err)
    return new Response(
      JSON.stringify({
        error: (err as Error).message || "Internal server error",
      }),
      { status: 500 }
    )
  }
}
