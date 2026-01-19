import { NextResponse } from "next/server"

// Note: Clerk handles OAuth callbacks automatically via its middleware.
// This route is kept for backwards compatibility during migration.
// It simply redirects to the home page where Clerk will handle auth state.

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/`)
}
