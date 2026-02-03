import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

// =============================================================================
// TYPES
// =============================================================================

export interface User {
  id: number
  username: string
  email: string
  balance?: number
}

export interface Session {
  user: User
  expires: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "your-secret-key-change-in-production"
)
const ALGORITHM = "HS256"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
const COOKIE_NAME = "fraudnet-session"

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

/**
 * Creates a signed JWT token for the user session
 */
export async function createSessionToken(user: User): Promise<string> {
  const expires = new Date(Date.now() + SESSION_DURATION)

  const token = await new SignJWT({
    userId: user.id,
    username: user.username,
    email: user.email,
  })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(SECRET_KEY)

  return token
}

/**
 * Verifies and decodes a JWT token
 */
export async function verifySessionToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: [ALGORITHM],
    })

    return {
      id: payload.userId as number,
      username: payload.username as string,
      email: payload.email as string,
    }
  } catch {
    return null
  }
}

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

/**
 * Gets the current session from cookies (Server Component compatible)
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)

  if (!sessionCookie?.value) {
    return null
  }

  const user = await verifySessionToken(sessionCookie.value)

  if (!user) {
    return null
  }

  return {
    user,
    expires: new Date(Date.now() + SESSION_DURATION).toISOString(),
  }
}

/**
 * Creates session cookie options
 */
export function getSessionCookieOptions(expires: Date) {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  }
}

export const COOKIE_CONFIG = {
  name: COOKIE_NAME,
  duration: SESSION_DURATION,
}
