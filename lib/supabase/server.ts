import type { Database } from "@/app/types/database.types"
import { createServerClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"
import { isSupabaseEnabled } from "./config"

type CookieOptions = Partial<ResponseCookie>
type CookieToSet = { name: string; value: string; options: CookieOptions }

export const createClient = async (): Promise<SupabaseClient<Database> | null> => {
  if (!isSupabaseEnabled) {
    return null
  }

  const cookieStore = await cookies()

  // Cast to properly typed client (workaround for @supabase/ssr type inference issues)
  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: CookieToSet[]) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // ignore for middleware
          }
        },
      },
    }
  )

  return client as unknown as SupabaseClient<Database>
}
