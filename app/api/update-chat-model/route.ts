export async function POST(request: Request) {
  try {
    const { chatId, model } = await request.json()

    if (!chatId || !model) {
      return new Response(
        JSON.stringify({ error: "Missing chatId or model" }),
        { status: 400 }
      )
    }

    // With Convex, mutations are handled client-side via the ChatsProvider
    // This endpoint is kept for backward compatibility
    console.log("Chat model update handled client-side via Convex")
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: unknown) {
    console.error("Error in update-chat-model endpoint:", err)
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500 }
    )
  }
}
