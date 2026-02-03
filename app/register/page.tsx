import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { RegisterForm } from "@/components/auth/register-form"
import { AuthProvider } from "@/components/auth/auth-provider"

export const metadata = {
  title: "Register - FraudNet",
  description: "Create your FraudNet account for fraud detection monitoring",
}

export default async function RegisterPage() {
  // Redirect to dashboard if already logged in
  const session = await getSession()
  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
        {/* Background gradient effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Protected by FraudNet Security
        </p>
      </div>
    </AuthProvider>
  )
}
