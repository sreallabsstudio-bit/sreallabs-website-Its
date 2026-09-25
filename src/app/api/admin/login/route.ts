import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import {
  verifyPassword,
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
  checkLoginRate,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
})

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  const rate = checkLoginRate(ip)
  if (!rate.ok) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rate.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email or password format' }, { status: 400 })
  }

  let admin
  try {
    admin = await db.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
  } catch (e) {
    console.error('[admin-login] database error:', e)
    return NextResponse.json(
      { error: 'Database unavailable. Check DATABASE_URL configuration.' },
      { status: 503 },
    )
  }

  // Generic error — never reveal whether the email exists.
  const ok = admin ? await verifyPassword(parsed.data.password, admin.passwordHash) : false
  if (!admin || !ok) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = await createSessionToken({ sub: admin.id, email: admin.email })
  if (!token) {
    return NextResponse.json(
      { error: 'Server misconfigured: SESSION_SECRET is missing or too short.' },
      { status: 503 },
    )
  }

  const res = NextResponse.json({ ok: true, email: admin.email })
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
  return res
}
