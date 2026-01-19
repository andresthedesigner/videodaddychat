import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { chatId, pinned } = await request.json()

    if (!chatId || typeof pinned !== "boolean") {
      return NextResponse.json(
        { error: "Missing chatId or pinned" },
        { status: 400 }
      )
    }

    // With Convex, mutations are handled client-side via the ChatsProvider
    // This endpoint is kept for backward compatibility
    console.log("Pin toggle handled client-side via Convex")
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("toggle-chat-pin unhandled error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
