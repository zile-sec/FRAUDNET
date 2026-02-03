import React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AuthProvider } from "@/components/auth/auth-provider"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <AuthProvider initialUser={session.user}>
      <div className="min-h-screen bg-background">
        <DashboardHeader user={session.user} />
        {children}
      </div>
    </AuthProvider>
  )
}
