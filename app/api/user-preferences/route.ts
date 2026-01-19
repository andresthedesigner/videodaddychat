import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

/**
 * DEPRECATED: User preferences are now managed via Convex client-side hooks.
 * 
 * This endpoint is kept for backward compatibility but clients should use:
 * - useQuery(api.userPreferences.get) for reading
 * - useMutation(api.userPreferences.update) for writing
 * 
 * See: lib/user-preference-store/provider.tsx
 */

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

    // Return default preferences
    // Actual preferences are fetched via Convex client-side hooks
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

export async function PUT() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // DEPRECATED: This endpoint no longer persists data.
    // Preferences should be updated via Convex useMutation hook client-side.
    // See: lib/user-preference-store/provider.tsx
    return NextResponse.json(
      { 
        error: "This endpoint is deprecated. Use Convex mutations client-side.",
        deprecated: true,
      },
      { status: 410 } // 410 Gone - indicates the resource is no longer available
    )
  } catch (error) {
    console.error("Error in user-preferences PUT API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
