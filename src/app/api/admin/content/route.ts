import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { contentUpdateSchema } from '@/lib/validation'
import { DEFAULT_SITE_CONTENT } from '@/lib/defaults'

export const dynamic = 'force-dynamic'

const EDITABLE_KEYS = Object.keys(DEFAULT_SITE_CONTENT)

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  try {
    const rows = await db.siteContent.findMany()
    const values: Record<string, string> = { ...DEFAULT_SITE_CONTENT }
    for (const row of rows) {
      if (row.value) values[row.key] = row.value
    }
    return NextResponse.json({ values, labels: EDITABLE_KEYS })
  } catch (e) {
    console.error('[admin/content] read failed:', e)
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PUT(req: NextRequest) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = contentUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 },
    )
  }

  try {
    for (const [key, value] of Object.entries(parsed.data.values)) {
      if (!EDITABLE_KEYS.includes(key)) continue // ignore unknown keys
      await db.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[admin/content] write failed:', e)
    return NextResponse.json({ error: 'Could not save content' }, { status: 500 })
  }
}
