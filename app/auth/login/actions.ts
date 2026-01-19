"use server"

// Note: With Clerk, sign out is handled client-side via:
// import { useClerk } from "@clerk/nextjs"
// const { signOut } = useClerk()
// await signOut()
//
// Or use the <SignOutButton> component from @clerk/nextjs
// This file is kept for backwards compatibility during migration.

import { redirect } from "next/navigation"

export async function signOut() {
  // Clerk handles sign out client-side
  // This redirect sends users to home where Clerk will handle the signed-out state
  redirect("/")
}
