import type { Database } from "@/app/types/database.types"
import { createServerClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { isSupabaseEnabled } from "./config"

export async function createGuestServerClient(): Promise<SupabaseClient<Database> | null> {
  if (!isSupabaseEnabled) {
    return null
  }

  // Cast to properly typed client (workaround for @supabase/ssr type inference issues)
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  ) as unknown as SupabaseClient<Database>
}
