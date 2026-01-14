import type { Database } from "@/app/types/database.types"
import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { isSupabaseEnabled } from "./config"

export function createClient(): SupabaseClient<Database> | null {
  if (!isSupabaseEnabled) {
    return null
  }

  // Cast to properly typed client (workaround for @supabase/ssr type inference issues)
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) as unknown as SupabaseClient<Database>
}
