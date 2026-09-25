import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'sreal_admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSecret(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 16) return null
  return new TextEncoder().encode(secret)
}

export interface SessionPayload {
  sub: string
  email: string
}

/** Create a signed session token (HS256 JWT). Returns null when SESSION_SECRET is missing. */
export async function createSessionToken(payload: SessionPayload): Promise<string | null> {
  const secret = getSecret()
  if (!secret) return null
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secret)
}

/** Verify a session token. Returns the payload or null (invalid/expired/missing secret). */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null
  const secret = getSecret()
  if (!secret) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    if (!payload.sub) return null
    return { sub: payload.sub, email: String(payload.email ?? '') }
  } catch {
    return null
  }
}

/** Server-side session read from the request cookie store. */
export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Naive in-memory login rate limiter (per IP). Best-effort on serverless
 * (per-instance), still slows down credential stuffing.
 */
const attempts = new Map<string, { count: number; resetAt: number }>()

export function checkLoginRate(ip: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 })
    return { ok: true, retryAfterSec: 0 }
  }
  entry.count += 1
  if (entry.count > 10) {
    return { ok: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { ok: true, retryAfterSec: 0 }
}
