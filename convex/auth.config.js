// Convex Auth Configuration for Clerk
// See: https://docs.convex.dev/auth/clerk
//
// IMPORTANT: Replace the domain below with your Clerk Frontend API URL
// Find it in Clerk Dashboard > API Keys > "Frontend API" or "JWT Issuer"
// Format: https://YOUR_INSTANCE.clerk.accounts.dev

const authConfig = {
  providers: [
    {
      // TODO: Replace with your Clerk JWT Issuer domain
      // Example: "https://helpful-mammal-12.clerk.accounts.dev"
      domain: "https://tidy-bluegill-93.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
}

export default authConfig
