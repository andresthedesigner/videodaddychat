import { auth } from "@clerk/nextjs/server"
import {
  getAllModels,
  getModelsWithAccessFlags,
  refreshModelsCache,
} from "@/lib/models"
import { NextResponse } from "next/server"

/**
 * Get available AI models
 * Note: With Convex, user-specific model access can be determined client-side
 * by checking user keys via Convex queries
 */
export async function GET() {
  try {
    const { userId } = await auth()

    // For unauthenticated users, return models with access flags
    if (!userId) {
      const models = await getModelsWithAccessFlags()
      return new Response(JSON.stringify({ models }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    // For authenticated users, return all models
    // User-specific access should be determined client-side based on their API keys
    const allModels = await getAllModels()
    const models = allModels.map((model) => ({
      ...model,
      accessible: true, // Let client determine actual access based on Convex userKeys
    }))

    return new Response(JSON.stringify({ models }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching models:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch models" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function POST() {
  try {
    refreshModelsCache()
    const models = await getAllModels()

    return NextResponse.json({
      message: "Models cache refreshed",
      models,
      timestamp: new Date().toISOString(),
      count: models.length,
    })
  } catch (error) {
    console.error("Failed to refresh models:", error)
    return NextResponse.json(
      { error: "Failed to refresh models" },
      { status: 500 }
    )
  }
}
