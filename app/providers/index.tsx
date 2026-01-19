"use client"

import { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { ConvexClientProvider } from "./convex-client-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </ClerkProvider>
  )
}
