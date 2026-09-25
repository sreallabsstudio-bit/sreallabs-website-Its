import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { projectUpdateSchema } from '@/lib/validation'
import { parseYouTubeUrl } from '@/lib/youtube'
import { slugify } from '@/lib/slug'
import { ensureUniqueSlug, toPublicProject } from '@/lib/portfolio-server'

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
  const parsed = projectUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 },
    )
  }
  const data = parsed.data
  const raw = (body ?? {}) as Record<string, unknown>

  try {
    const existing = await db.project.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    // Only include fields actually present in the request — zod transforms
    // would otherwise turn absent optional fields into null and wipe data.
    const EDITABLE = [
      'title', 'slug', 'description', 'categoryId', 'client', 'industry',
      'youtubeUrl', 'googleDriveUrl', 'thumbnailUrl', 'legacyVideoUrl',
      'featured', 'published', 'sortOrder', 'service', 'year', 'tags',
      'fullDescription', 'challenge', 'solution', 'result', 'additionalImages',
    ] as const
    const update: Record<string, unknown> = {}
    for (const key of EDITABLE) {
      if (key in raw) update[key] = data[key]
    }

    // YouTube URL → video id + canonical form (only when the field is provided)
    if ('youtubeUrl' in update) {
      const yt = data.youtubeUrl ? parseYouTubeUrl(data.youtubeUrl) : null
      if (data.youtubeUrl && !yt) {
        return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
      }
      update.youtubeUrl = yt?.canonicalUrl ?? null
      update.youtubeVideoId = yt?.videoId ?? null
    }

    // Slug: only changes when explicitly provided (stable URLs otherwise)
    if ('slug' in update) {
      const base = data.slug ? slugify(data.slug) : ''
      if (!base) {
        return NextResponse.json({ error: 'Slug cannot be empty' }, { status: 400 })
      }
      update.slug = await ensureUniqueSlug(base, id)
    }

    if ('categoryId' in update && data.categoryId !== null && data.categoryId !== undefined) {
      const cat = await db.category.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      })
      if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    const updated = await db.project.update({
      where: { id },
      data: update,
      include: { category: true },
    })
    return NextResponse.json({ project: toPublicProject(updated) })
  } catch (e) {
    console.error('[admin/projects] update failed:', e)
    return NextResponse.json({ error: 'Could not update project' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  const { id } = await params
  try {
    const existing = await db.project.findUnique({ where: { id }, select: { id: true } })
    if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    await db.project.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[admin/projects] delete failed:', e)
    return NextResponse.json({ error: 'Could not delete project' }, { status: 500 })
  }
}
