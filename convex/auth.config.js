// Convex Auth Configuration for Clerk
// See: https://docs.convex.dev/auth/clerk
//
// Requires CLERK_JWT_ISSUER_DOMAIN environment variable to be set.
// Find it in Clerk Dashboard > API Keys > "Frontend API" or "JWT Issuer"
// Format: https://YOUR_INSTANCE.clerk.accounts.dev

const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
}

export default authConfig
