import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

const defaultPreferences = {
  layout: "fullscreen",
  promptSuggestions: true,
  showToolInvocations: true,
  showConversationPreviews: true,
  multiModelEnabled: false,
  hiddenModels: [],
}

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return default preferences for now
    // Client-side should use Convex useQuery hook instead
    return NextResponse.json({
      layout: defaultPreferences.layout,
      prompt_suggestions: defaultPreferences.promptSuggestions,
      show_tool_invocations: defaultPreferences.showToolInvocations,
      show_conversation_previews: defaultPreferences.showConversationPreviews,
      multi_model_enabled: defaultPreferences.multiModelEnabled,
      hidden_models: defaultPreferences.hiddenModels,
    })
  } catch (error) {
    console.error("Error in user-preferences GET API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const {
      layout,
      prompt_suggestions,
      show_tool_invocations,
      show_conversation_previews,
      multi_model_enabled,
      hidden_models,
    } = body

    // Validate the data types
    if (layout && typeof layout !== "string") {
      return NextResponse.json(
        { error: "layout must be a string" },
        { status: 400 }
      )
    }

    if (hidden_models && !Array.isArray(hidden_models)) {
      return NextResponse.json(
        { error: "hidden_models must be an array" },
        { status: 400 }
      )
    }

    // Note: Preferences are typically updated client-side via Convex mutations
    // This endpoint provides compatibility for server-side updates
    console.log("User preferences update received for user:", userId)
    console.log("Preferences should be updated via Convex client-side hooks")

    return NextResponse.json({
      success: true,
      layout: layout ?? defaultPreferences.layout,
      prompt_suggestions: prompt_suggestions ?? defaultPreferences.promptSuggestions,
      show_tool_invocations: show_tool_invocations ?? defaultPreferences.showToolInvocations,
      show_conversation_previews: show_conversation_previews ?? defaultPreferences.showConversationPreviews,
      multi_model_enabled: multi_model_enabled ?? defaultPreferences.multiModelEnabled,
      hidden_models: hidden_models ?? defaultPreferences.hiddenModels,
    })
  } catch (error) {
    console.error("Error in user-preferences PUT API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
