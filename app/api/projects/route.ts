import { NextResponse } from "next/server"

/**
 * Projects API - DEPRECATED
 * 
 * This endpoint is deprecated. Use Convex mutations/queries directly:
 * - Create: useMutation(api.projects.create)
 * - List: useQuery(api.projects.getForCurrentUser)
 * - Update: useMutation(api.projects.updateName)
 * - Delete: useMutation(api.projects.remove)
 */

export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint is deprecated. Use Convex mutation api.projects.create instead.",
      hint: "Import { useMutation } from 'convex/react' and use useMutation(api.projects.create)",
    },
    { status: 410 } // 410 Gone - indicates the resource is no longer available
  )
}

export async function GET() {
  return NextResponse.json(
    {
      error: "This endpoint is deprecated. Use Convex query api.projects.getForCurrentUser instead.",
      hint: "Import { useQuery } from 'convex/react' and use useQuery(api.projects.getForCurrentUser)",
    },
    { status: 410 }
  )
}
