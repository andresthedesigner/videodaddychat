"use client"

import { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ConvexClientProvider } from "./convex-client-provider"
import { PostHogProvider } from "./posthog-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <PostHogProvider>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </PostHogProvider>
    </ClerkProvider>
  )
}
