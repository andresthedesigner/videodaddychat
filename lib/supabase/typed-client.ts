import type { Database } from "@/app/types/database.types"
import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Type helper to cast Supabase client to properly typed version.
 * This is needed because @supabase/ssr doesn't properly preserve Database generic types.
 */
export type TypedSupabaseClient = SupabaseClient<Database>

/**
 * Cast a Supabase client to the properly typed version.
 * Use this when TypeScript can't infer the correct types for .from() operations.
 */
export function asTypedClient(
  client: unknown
): TypedSupabaseClient {
  return client as TypedSupabaseClient
}
