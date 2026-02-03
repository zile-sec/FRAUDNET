import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { COOKIE_CONFIG } from "@/lib/auth"

// =============================================================================
// LOGOUT ENDPOINT
// Clears the session cookie to log the user out
// =============================================================================

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Clear the session cookie by setting it to expire immediately
    cookieStore.set({
      name: COOKIE_CONFIG.name,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // Expire immediately
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
}
