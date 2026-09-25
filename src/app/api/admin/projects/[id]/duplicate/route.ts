import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { ensureUniqueSlug, toPublicProject } from '@/lib/portfolio-server'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

/** Duplicate a project: "(Copy)" title, fresh unique slug, starts unpublished & unfeatured. */
export async function POST(req: NextRequest, { params }: Params) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  const { id } = await params
  try {
    const src = await db.project.findUnique({ where: { id } })
    if (!src) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const maxOrder = await db.project.aggregate({ _max: { sortOrder: true } })
    const slug = await ensureUniqueSlug(`${src.slug}-copy`)

    const created = await db.project.create({
      data: {
        title: `${src.title} (Copy)`,
        slug,
        description: src.description,
        categoryId: src.categoryId,
        client: src.client,
        industry: src.industry,
        service: src.service,
        youtubeUrl: src.youtubeUrl,
        youtubeVideoId: src.youtubeVideoId,
        googleDriveUrl: src.googleDriveUrl,
        thumbnailUrl: src.thumbnailUrl,
        legacyVideoUrl: src.legacyVideoUrl,
        featured: false,
        published: false,
        sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
        year: src.year,
        tags: [...src.tags],
        fullDescription: src.fullDescription,
        challenge: src.challenge,
        solution: src.solution,
        result: src.result,
        additionalImages: [...src.additionalImages],
      },
      include: { category: true },
    })
    return NextResponse.json({ project: toPublicProject(created) }, { status: 201 })
  } catch (e) {
    console.error('[admin/projects] duplicate failed:', e)
    return NextResponse.json({ error: 'Could not duplicate project' }, { status: 500 })
  }
}
