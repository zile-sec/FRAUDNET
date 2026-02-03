import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSessionToken, getSessionCookieOptions, COOKIE_CONFIG } from "@/lib/auth"

// =============================================================================
// MOCK USER DATABASE
// For demonstration purposes. In production, this would be replaced by
// actual database queries to the accounts service.
// =============================================================================

interface StoredUser {
  id: number
  username: string
  email: string
  password: string // In production, this would be a bcrypt hash
}

const MOCK_USERS: StoredUser[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@fraudnet.io",
    password: "admin123", // In production: bcrypt hash
  },
  {
    id: 2,
    username: "analyst",
    email: "analyst@fraudnet.io",
    password: "analyst123",
  },
]

// =============================================================================
// LOGIN ENDPOINT
// =============================================================================

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    // Validate credentials
    // In production: use bcrypt.compare(password, user.password)
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create session token
    const sessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    }

    const token = await createSessionToken(sessionUser)
    const expires = new Date(Date.now() + COOKIE_CONFIG.duration)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set({
      ...getSessionCookieOptions(expires),
      value: token,
    })

    return NextResponse.json({
      success: true,
      user: sessionUser,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
