import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function HomePage() {
  const session = await getSession()

  // Redirect based on authentication status
  if (session?.user) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}
