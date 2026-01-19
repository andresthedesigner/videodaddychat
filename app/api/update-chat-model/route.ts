import { USE_CONVEX } from "@/lib/config"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { chatId, model } = await request.json()

    if (!chatId || !model) {
      return new Response(
        JSON.stringify({ error: "Missing chatId or model" }),
        { status: 400 }
      )
    }

    // With Convex enabled, mutations are handled client-side
    // This endpoint is kept for backward compatibility
    if (USE_CONVEX) {
      console.log("Convex enabled, chat model update handled client-side")
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    const supabase = await createClient()
    
    // If Supabase is not available, we still return success
    if (!supabase) {
      console.log("Supabase not enabled, skipping DB update")
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    }

    const { error } = await supabase
      .from("chats")
      .update({ model })
      .eq("id", chatId)

    if (error) {
      console.error("Error updating chat model:", error)
      return new Response(
        JSON.stringify({
          error: "Failed to update chat model",
          details: error.message,
        }),
        { status: 500 }
      )
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    })
  } catch (err: unknown) {
    console.error("Error in update-chat-model endpoint:", err)
    return new Response(
      JSON.stringify({ error: (err as Error).message || "Internal server error" }),
      { status: 500 }
    )
  }
}
