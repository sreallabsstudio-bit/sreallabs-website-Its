import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { reorderSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

/** Move a project up/down in the admin-ordered list (swap sortOrder with the neighbour). */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = reorderSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  const { projectId, direction } = parsed.data

  try {
    const all = await db.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: { id: true },
    })
    const idx = all.findIndex((p) => p.id === projectId)
    if (idx === -1) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= all.length) {
      return NextResponse.json({ ok: true }) // already at the edge
    }

    const a = all[idx]
    const b = all[swapIdx]
    const orderA = await db.project.findUnique({ where: { id: a.id }, select: { sortOrder: true } })
    const orderB = await db.project.findUnique({ where: { id: b.id }, select: { sortOrder: true } })
    if (!orderA || !orderB) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    await db.$transaction([
      db.project.update({ where: { id: a.id }, data: { sortOrder: orderB.sortOrder } }),
      db.project.update({ where: { id: b.id }, data: { sortOrder: orderA.sortOrder } }),
    ])
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[admin/projects] reorder failed:', e)
    return NextResponse.json({ error: 'Could not reorder' }, { status: 500 })
  }
}
