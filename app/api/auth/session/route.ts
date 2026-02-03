import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"

// =============================================================================
// SESSION ENDPOINT
// Returns the current user session if authenticated
// =============================================================================

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      )
    }

    return NextResponse.json({
      user: session.user,
      expires: session.expires,
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json(
      { user: null, error: "Failed to get session" },
      { status: 500 }
    )
  }
}
