import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSessionToken, getSessionCookieOptions, COOKIE_CONFIG } from "@/lib/auth"

// =============================================================================
// MOCK USER DATABASE
// For demonstration purposes. In production, this would be replaced by
// actual database operations to the accounts service.
// =============================================================================

interface StoredUser {
  id: number
  username: string
  email: string
  password: string
}

// In-memory store (in production, this would be a real database)
const MOCK_USERS: StoredUser[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@fraudnet.io",
    password: "admin123",
  },
  {
    id: 2,
    username: "analyst",
    email: "analyst@fraudnet.io",
    password: "analyst123",
  },
]

let nextUserId = 3

// =============================================================================
// REGISTER ENDPOINT
// =============================================================================

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      )
    }

    // Check if username already exists
    const existingUsername = MOCK_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    )
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      )
    }

    // Create new user
    // In production: hash password with bcrypt before storing
    const newUser: StoredUser = {
      id: nextUserId++,
      username,
      email,
      password, // In production: await bcrypt.hash(password, 12)
    }

    MOCK_USERS.push(newUser)

    // Create session token
    const sessionUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
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
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
