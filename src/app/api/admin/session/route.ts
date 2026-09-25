import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-guard'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  return NextResponse.json({ authenticated: true, email: guard.session.email })
}
