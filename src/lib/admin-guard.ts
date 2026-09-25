import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import type { SessionPayload } from '@/lib/auth'

/**
 * Server-side guard for admin API route handlers (defense in depth —
 * middleware already blocks unauthenticated calls).
 * Also enforces same-origin for state-changing requests (CSRF hardening).
 */
export async function requireAdmin(
  req: NextRequest,
): Promise<{ session: SessionPayload } | { response: NextResponse }> {
  const session = await getAdminSession()
  if (!session) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  const method = req.method.toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') {
    const origin = req.headers.get('origin')
    if (origin) {
      const host = req.headers.get('host')
      try {
        if (new URL(origin).host !== host) {
          return {
            response: NextResponse.json({ error: 'Cross-origin request rejected' }, { status: 403 }),
          }
        }
      } catch {
        return { response: NextResponse.json({ error: 'Invalid origin' }, { status: 403 }) }
      }
    }
  }

  return { session }
}
