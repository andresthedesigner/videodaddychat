/**
 * Server-side API utilities
 *
 * Note: With Convex + Clerk, authentication is handled by:
 * - Clerk middleware for route protection
 * - Convex auth for database operations
 *
 * This file is kept for backward compatibility but most authentication
 * logic is now handled by the Convex provider and Clerk.
 */

/**
 * Validates the user's identity
 * @deprecated Use Convex queries with auth context instead
 * @param _userId - The ID of the user (unused).
 * @param _isAuthenticated - Whether the user is authenticated (unused).
 * @returns null - Authentication is handled by Convex + Clerk.
 */
export async function validateUserIdentity(
  _userId: string,
  _isAuthenticated: boolean
): Promise<null> {
  // With Convex + Clerk, authentication is handled by the Convex provider
  // User identity is validated via Clerk and the Convex auth context
  return null
}
