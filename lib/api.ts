// =============================================================================
// API UTILITIES
// =============================================================================

/**
 * Gets the base URL for API requests.
 *
 * In Next.js, the base URL depends on the environment:
 *
 * 1. **Server-side (SSR/RSC)**: Cannot use relative URLs, must have absolute URL
 *    - Production: Uses VERCEL_URL (e.g., https://your-app.vercel.app)
 *    - Development: Falls back to localhost:3000
 *
 * 2. **Client-side**: Can use relative URLs (empty string works)
 *    - The browser automatically resolves relative paths
 *
 * This function detects the environment and returns the appropriate base URL.
 */
export function getBaseUrl(): string {
  // Client-side: use relative URLs
  if (typeof window !== "undefined") {
    return ""
  }

  // Server-side: need absolute URL
  // Check for Vercel deployment URL first
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Fallback to localhost for local development
  return "http://localhost:3000"
}

/**
 * Builds a full API URL from a path.
 *
 * @param path - The API path (e.g., "/api/transactions")
 * @returns The full URL for the API endpoint
 *
 * @example
 * // In development: "http://localhost:3000/api/transactions"
 * // On Vercel: "https://your-app.vercel.app/api/transactions"
 * const url = buildApiUrl("/api/transactions")
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getBaseUrl()
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}
