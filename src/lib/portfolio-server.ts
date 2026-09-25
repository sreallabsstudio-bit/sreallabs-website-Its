import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'
import { parseYouTubeUrl, youTubeThumbnailUrl } from '@/lib/youtube'
import type { PublicProject, PublicCategory } from '@/lib/types'

/** Resolve the display thumbnail: custom override → YouTube thumb → legacy poster. */
export function resolveThumbnail(p: {
  youtubeVideoId: string | null
  thumbnailUrl: string | null
}): string | null {
  if (p.thumbnailUrl && p.thumbnailUrl.trim()) return p.thumbnailUrl
  if (p.youtubeVideoId) return youTubeThumbnailUrl(p.youtubeVideoId)
  return null
}

type ProjectWithCategory = Prisma.ProjectGetPayload<{ include: { category: true } }>

export function toPublicProject(p: ProjectWithCategory): PublicProject {
  return {
    id: p.id,
    legacyId: p.legacyId,
    title: p.title,
    slug: p.slug,
    description: p.description,
    categoryId: p.categoryId,
    categoryName: p.category?.name ?? null,
    client: p.client,
    industry: p.industry,
    service: p.service,
    youtubeVideoId: p.youtubeVideoId,
    googleDriveUrl: p.googleDriveUrl,
    thumbnailUrl: resolveThumbnail(p) ?? p.thumbnailUrl,
    legacyVideoUrl: p.legacyVideoUrl,
    featured: p.featured,
    published: p.published,
    sortOrder: p.sortOrder,
    year: p.year,
    tags: p.tags,
    fullDescription: p.fullDescription,
    challenge: p.challenge,
    solution: p.solution,
    result: p.result,
    additionalImages: p.additionalImages,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }
}

const projectInclude = { category: true }

/** All published projects, admin-ordered. Empty list if the database is unavailable. */
export async function getPublicProjects(): Promise<PublicProject[]> {
  try {
    const rows = await db.project.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: projectInclude,
    })
    return rows.map(toPublicProject)
  } catch (e) {
    console.error('[portfolio] getPublicProjects failed:', e)
    return []
  }
}

/** Featured AND published projects (homepage Selected Work, work page showcase). */
export async function getFeaturedPublicProjects(): Promise<PublicProject[]> {
  try {
    const rows = await db.project.findMany({
      where: { published: true, featured: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: projectInclude,
    })
    return rows.map(toPublicProject)
  } catch (e) {
    console.error('[portfolio] getFeaturedPublicProjects failed:', e)
    return []
  }
}

/** Single published project by slug (real /work/[slug] route). null if unpublished/missing/db-down. */
export async function getPublicProjectBySlug(slug: string): Promise<PublicProject | null> {
  try {
    const row = await db.project.findUnique({
      where: { slug },
      include: projectInclude,
    })
    if (!row || !row.published) return null
    return toPublicProject(row)
  } catch (e) {
    console.error('[portfolio] getPublicProjectBySlug failed:', e)
    return null
  }
}

/** Related projects: same category first (excluding the project), then top-level fallback. */
export async function getRelatedProjects(
  project: PublicProject,
  limit = 3,
): Promise<PublicProject[]> {
  try {
    const rows = await db.project.findMany({
      where: { published: true, id: { not: project.id } },
      orderBy: [{ sortOrder: 'asc' }],
      include: projectInclude,
      take: 24,
    })
    const publicRows = rows.map(toPublicProject)
    const sameCategory = project.categoryId
      ? publicRows.filter((p) => p.categoryId === project.categoryId)
      : []
    const others = publicRows.filter((p) => !sameCategory.includes(p))
    return [...sameCategory, ...others].slice(0, limit)
  } catch (e) {
    console.error('[portfolio] getRelatedProjects failed:', e)
    return []
  }
}

/** Active categories (filter chips on /work). Empty if db down. */
export async function getActiveCategories(): Promise<PublicCategory[]> {
  try {
    const rows = await db.category.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      sortOrder: c.sortOrder,
    }))
  } catch (e) {
    console.error('[portfolio] getActiveCategories failed:', e)
    return []
  }
}

/** Unique slug generation with -2, -3… suffixes. Optionally exclude a project id (edit). */
export async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const clean = base.replace(/-+$/g, '') || 'project'
  let candidate = clean
  let n = 2
  while (true) {
    const existing = await db.project.findUnique({ where: { slug: candidate }, select: { id: true } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${clean}-${n++}`
  }
}
