import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { categoryUpdateSchema } from '@/lib/validation'
import { slugify } from '@/lib/slug'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  const { id } = await params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = categoryUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 },
    )
  }
  const data = parsed.data

  try {
    const existing = await db.category.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

    const update: Record<string, unknown> = { ...data }
    if (data.name !== undefined) {
      const slug = slugify(data.name)
      if (!slug) return NextResponse.json({ error: 'Name produces an empty slug' }, { status: 400 })
      update.slug = slug
      const clash = await db.category.findFirst({
        where: { OR: [{ name: data.name }, { slug }], NOT: { id } },
        select: { id: true },
      })
      if (clash) return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 })
    }

    const updated = await db.category.update({ where: { id }, data: update })
    return NextResponse.json({ category: updated })
  } catch (e) {
    console.error('[admin/categories] update failed:', e)
    return NextResponse.json({ error: 'Could not update category' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  const { id } = await params
  try {
    const existing = await db.category.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    // Projects keep existing with no category (onDelete: SetNull in schema).
    await db.category.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[admin/categories] delete failed:', e)
    return NextResponse.json({ error: 'Could not delete category' }, { status: 500 })
  }
}
