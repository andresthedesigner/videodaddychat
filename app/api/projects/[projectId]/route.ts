import { auth } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { NextRequest, NextResponse } from "next/server"

// Lazy initialization to avoid build-time errors when env vars aren't set
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set")
  }
  return new ConvexHttpClient(url)
}

/**
 * Helper to safely convert string to Convex ID
 * Returns null if the string is not a valid Convex ID format
 */
function toConvexId(projectId: string): Id<"projects"> | null {
  // Convex IDs are base64-like strings, typically 32 chars
  // Basic validation to avoid throwing errors on invalid IDs
  if (!projectId || projectId.length < 10) return null
  try {
    return projectId as Id<"projects">
  } catch {
    return null
  }
}

/**
 * Single Project API
 * Fetches project from Convex with ownership verification
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

    // Validate project ID format
    const convexId = toConvexId(projectId)
    if (!convexId) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Fetch project from Convex with ownership info
    const convex = getConvexClient()
    const project = await convex.query(api.projects.getByIdWithOwner, {
      projectId: convexId,
    })

    // Return 404 if project doesn't exist
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Verify ownership
    if (project.ownerClerkId !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Return the actual project data
    return NextResponse.json({
      id: project._id,
      name: project.name,
      user_id: userId,
      created_at: new Date(project._creationTime).toISOString(),
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

    const { userId, getToken } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate project ID format
    const convexId = toConvexId(projectId)
    if (!convexId) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Get JWT token for authenticated Convex mutation
    const token = await getToken({ template: "convex" })
    if (!token) {
      return NextResponse.json(
        { error: "Failed to get auth token" },
        { status: 401 }
      )
    }

    // Call Convex mutation with auth
    const convex = getConvexClient()
    convex.setAuth(token)

    await convex.mutation(api.projects.updateName, {
      projectId: convexId,
      name: name.trim(),
    })

    return NextResponse.json({
      id: projectId,
      name: name.trim(),
      user_id: userId,
      updated_at: new Date().toISOString(),
    })
  } catch (err: unknown) {
    console.error("Error updating project:", err)
    const message = (err as Error).message || "Internal server error"

    // Handle specific Convex errors
    if (message.includes("Not authorized") || message.includes("Not authenticated")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }
    if (message.includes("not found")) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return new Response(
      JSON.stringify({ error: message }),
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
    const { userId, getToken } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate project ID format
    const convexId = toConvexId(projectId)
    if (!convexId) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Get JWT token for authenticated Convex mutation
    const token = await getToken({ template: "convex" })
    if (!token) {
      return NextResponse.json(
        { error: "Failed to get auth token" },
        { status: 401 }
      )
    }

    // Call Convex mutation with auth
    const convex = getConvexClient()
    convex.setAuth(token)

    await convex.mutation(api.projects.remove, {
      projectId: convexId,
    })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error("Error deleting project:", err)
    const message = (err as Error).message || "Internal server error"

    // Handle specific Convex errors
    if (message.includes("Not authorized") || message.includes("Not authenticated")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }
    if (message.includes("not found")) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500 }
    )
  }
}
