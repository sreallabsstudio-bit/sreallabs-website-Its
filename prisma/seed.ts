/**
 * Seed the database:
 *  - 7 initial categories
 *  - Migrate the existing static portfolio (63 projects) preserving slugs,
 *    original listing order, featured flags, descriptions and existing
 *    self-hosted video URLs (legacyVideoUrl). NO YouTube URLs are invented.
 *  - Default site content + SEO (current live text) so admin editing starts
 *    from the real content.
 *
 * Idempotent: existing projects (by slug), categories (by name) and content
 * keys are skipped — re-running never clobbers your edits.
 *
 * Run: bunx prisma db push && bun run db:seed
 */
import { readFileSync } from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { parseYouTubeUrl } from '../src/lib/youtube'
import { DEFAULT_SITE_CONTENT, DEFAULT_SEO } from '../src/lib/defaults'
import { slugify } from '../src/lib/slug'
import { loadRepoEnv } from '../scripts/lib/repo-env'

loadRepoEnv()
const db = new PrismaClient()

interface SnapshotProject {
  id: string
  title: string
  slug: string
  industry: string | null
  category: string | null
  buyerCategory: string | null
  service: string | null
  description: string
  fullDescription: string | null
  challenge: string | null
  solution: string | null
  result: string | null
  video: string | null
  thumbnail: string | null
  featured: boolean
  year: string | null
  tags: string[]
  additionalImages: string[]
  client: string | null
}

const INITIAL_CATEGORIES = [
  'Product Animation',
  'Industrial',
  'Consumer Electronics',
  'Automotive',
  'Luxury',
  'Medical',
  'Technology',
]

/** Old buyerCategory → new category name */
function mapBuyerCategory(buyer: string | null): string {
  switch (buyer) {
    case 'Consumer Electronics':
      return 'Consumer Electronics'
    case 'Industrial Hardware':
      return 'Industrial'
    case 'Luxury Products':
      return 'Luxury'
    case 'Automotive & EV':
      return 'Automotive'
    case 'SaaS & Technology':
      return 'Technology'
    // Lifestyle & Consumer Goods and anything unmapped → the studio's core service category
    default:
      return 'Product Animation'
  }
}

async function main() {
  const snapshotPath = path.join(__dirname, 'portfolio-snapshot.json')
  const projects: SnapshotProject[] = JSON.parse(readFileSync(snapshotPath, 'utf-8'))

  // ── 1. Categories ─────────────────────────────────────────────
  console.log('Seeding categories…')
  for (let i = 0; i < INITIAL_CATEGORIES.length; i++) {
    const name = INITIAL_CATEGORIES[i]
    await db.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: slugify(name), sortOrder: i, active: true },
    })
  }
  const categories = await db.category.findMany()
  const catByName = new Map(categories.map((c) => [c.name, c]))

  // ── 2. Projects (migration) ───────────────────────────────────
  console.log(`Migrating ${projects.length} projects…`)
  let created = 0
  let skipped = 0
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    const exists = await db.project.findUnique({ where: { slug: p.slug } })
    if (exists) {
      // Backfill legacyId for idempotent re-seeds
      if (!exists.legacyId) {
        await db.project.update({ where: { id: exists.id }, data: { legacyId: p.id } })
      }
      skipped++
      continue
    }

    // The hardcoded homepage case study keeps the first position so the
    // homepage looks identical after migration; everything else keeps its
    // original relative order.
    const isHomepageFlagship = p.slug === 'shark-ai-ultra-robot-vacuum'
    const featured = p.featured || isHomepageFlagship
    const sortOrder = isHomepageFlagship ? 1 : i + 2

    const yt = parseYouTubeUrl(p.video) // existing MP4s are not YouTube — stays null
    const categoryName = mapBuyerCategory(p.buyerCategory)

    await db.project.create({
      data: {
        legacyId: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        categoryId: catByName.get(categoryName)?.id ?? null,
        client: p.client,
        industry: p.industry,
        service: p.service ?? p.category,
        youtubeUrl: yt?.canonicalUrl ?? null,
        youtubeVideoId: yt?.videoId ?? null,
        googleDriveUrl: null,
        thumbnailUrl: p.thumbnail,
        legacyVideoUrl: p.video,
        featured,
        published: true, // all existing projects are live today
        sortOrder,
        year: p.year,
        tags: p.tags,
        fullDescription: p.fullDescription,
        challenge: p.challenge,
        solution: p.solution,
        result: p.result,
        additionalImages: p.additionalImages,
      },
    })
    created++
  }
  console.log(`Projects: ${created} created, ${skipped} already existed (skipped)`)

  // ── 3. Site content (only if absent — never clobber admin edits) ──
  console.log('Seeding site content…')
  for (const [key, value] of Object.entries(DEFAULT_SITE_CONTENT)) {
    const exists = await db.siteContent.findUnique({ where: { key } })
    if (!exists) await db.siteContent.create({ data: { key, value } })
  }

  // ── 4. SEO defaults ───────────────────────────────────────────
  const seo = await db.seoSettings.findUnique({ where: { id: 'default' } })
  if (!seo) {
    await db.seoSettings.create({
      data: { id: 'default', ...DEFAULT_SEO },
    })
    console.log('SEO defaults created')
  }

  const counts = {
    categories: await db.category.count(),
    projects: await db.project.count(),
    published: await db.project.count({ where: { published: true } }),
    featured: await db.project.count({ where: { featured: true } }),
  }
  console.log('Done.', counts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
