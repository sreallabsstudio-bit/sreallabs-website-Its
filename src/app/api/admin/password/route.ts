import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { passwordUpdateSchema } from '@/lib/validation'
import { hashPassword, verifyPassword } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  const { session } = guard

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = passwordUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 },
    )
  }

  try {
    const admin = await db.adminUser.findUnique({ where: { id: session.sub } })
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

    const ok = await verifyPassword(parsed.data.currentPassword, admin.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })

    const passwordHash = await hashPassword(parsed.data.newPassword)
    await db.adminUser.update({ where: { id: admin.id }, data: { passwordHash } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[admin/password] update failed:', e)
    return NextResponse.json({ error: 'Could not update password' }, { status: 500 })
  }
}
