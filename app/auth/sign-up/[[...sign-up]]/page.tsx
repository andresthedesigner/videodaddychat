import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none bg-transparent",
          },
        }}
        routing="path"
        path="/auth/sign-up"
        signInUrl="/auth/login"
        fallbackRedirectUrl="/"
      />
    </div>
  )
}
