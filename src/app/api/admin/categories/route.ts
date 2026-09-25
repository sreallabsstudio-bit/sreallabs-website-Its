import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { categorySchema } from '@/lib/validation'
import { slugify } from '@/lib/slug'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  try {
    const rows = await db.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { projects: true } } },
    })
    return NextResponse.json({
      categories: rows.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        sortOrder: c.sortOrder,
        active: c.active,
        projectCount: c._count.projects,
      })),
    })
  } catch (e) {
    console.error('[admin/categories] list failed:', e)
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = categorySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 },
    )
  }
  const { name, sortOrder, active } = parsed.data
  const slug = slugify(name)
  if (!slug) return NextResponse.json({ error: 'Name produces an empty slug' }, { status: 400 })

  try {
    const clash = await db.category.findFirst({
      where: { OR: [{ name }, { slug }] },
      select: { id: true },
    })
    if (clash) return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 })

    const created = await db.category.create({ data: { name, slug, sortOrder, active } })
    return NextResponse.json({ category: created }, { status: 201 })
  } catch (e) {
    console.error('[admin/categories] create failed:', e)
    return NextResponse.json({ error: 'Could not create category' }, { status: 500 })
  }
}
