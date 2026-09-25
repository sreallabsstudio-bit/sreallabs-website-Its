import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { projectCreateSchema } from '@/lib/validation'
import { parseYouTubeUrl } from '@/lib/youtube'
import { slugify } from '@/lib/slug'
import { ensureUniqueSlug, toPublicProject } from '@/lib/portfolio-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  try {
    const rows = await db.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: { category: true },
    })
    return NextResponse.json({ projects: rows.map(toPublicProject) })
  } catch (e) {
    console.error('[admin/projects] list failed:', e)
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
  const parsed = projectCreateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 },
    )
  }
  const data = parsed.data

  const yt = parseYouTubeUrl(data.youtubeUrl)
  if (data.youtubeUrl && !yt) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
  }

  try {
    if (data.categoryId) {
      const cat = await db.category.findUnique({ where: { id: data.categoryId }, select: { id: true } })
      if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    const baseSlug = data.slug ? slugify(data.slug) : slugify(data.title)
    if (!baseSlug) return NextResponse.json({ error: 'Title produces an empty slug' }, { status: 400 })
    const slug = await ensureUniqueSlug(baseSlug)

    const maxOrder = await db.project.aggregate({ _max: { sortOrder: true } })
    const sortOrder = data.sortOrder || (maxOrder._max.sortOrder ?? 0) + 1

    const created = await db.project.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        categoryId: data.categoryId,
        client: data.client,
        industry: data.industry,
        service: data.service,
        youtubeUrl: yt?.canonicalUrl ?? null,
        youtubeVideoId: yt?.videoId ?? null,
        googleDriveUrl: data.googleDriveUrl,
        thumbnailUrl: data.thumbnailUrl,
        legacyVideoUrl: data.legacyVideoUrl,
        featured: data.featured,
        published: data.published,
        sortOrder,
        year: data.year,
        tags: data.tags,
        fullDescription: data.fullDescription,
        challenge: data.challenge,
        solution: data.solution,
        result: data.result,
        additionalImages: data.additionalImages,
      },
      include: { category: true },
    })
    return NextResponse.json({ project: toPublicProject(created) }, { status: 201 })
  } catch (e) {
    console.error('[admin/projects] create failed:', e)
    return NextResponse.json({ error: 'Could not create project' }, { status: 500 })
  }
}
