import { SignIn } from "@clerk/nextjs"

export default function AuthPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none bg-transparent",
          },
        }}
        routing="path"
        path="/auth"
        signUpUrl="/auth"
        fallbackRedirectUrl="/"
      />
    </div>
  )
}
