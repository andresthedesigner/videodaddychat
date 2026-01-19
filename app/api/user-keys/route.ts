import { auth } from "@clerk/nextjs/server"
import { encryptKey } from "@/lib/encryption"
import { NextResponse } from "next/server"

/**
 * User API Keys Management
 * 
 * Note: With Convex, API key management should be done client-side using
 * the userKeys Convex mutations. This endpoint provides backward compatibility.
 */

export async function POST(request: Request) {
  try {
    const { provider, apiKey } = await request.json()

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Provider and API key are required" },
        { status: 400 }
      )
    }

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Encrypt the key for storage
    const { encrypted, iv } = encryptKey(apiKey)

    // Note: With Convex, this should be handled client-side via userKeys.upsert mutation
    // This endpoint validates and encrypts the key, but actual storage should use Convex
    console.log("API key received for provider:", provider)
    console.log("Key should be stored via Convex userKeys.upsert mutation")

    return NextResponse.json({
      success: true,
      isNewKey: true,
      encrypted, // Return encrypted key for client to store via Convex
      iv,
      message: `API key encrypted successfully. Store via Convex mutation.`,
    })
  } catch (error) {
    console.error("Error in POST /api/user-keys:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { provider } = await request.json()

    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required" },
        { status: 400 }
      )
    }

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Note: With Convex, deletion should be handled client-side via userKeys.remove mutation
    console.log("API key deletion requested for provider:", provider)
    console.log("Key should be deleted via Convex userKeys.remove mutation")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/user-keys:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
