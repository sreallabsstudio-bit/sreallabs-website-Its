import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-guard'
import { seoUpdateSchema } from '@/lib/validation'
import { DEFAULT_SEO } from '@/lib/defaults'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req)
  if ('response' in guard) return guard.response
  try {
    const row = await db.seoSettings.findUnique({ where: { id: 'default' } })
    return NextResponse.json({
      seo: row
        ? {
            siteTitle: row.siteTitle || DEFAULT_SEO.siteTitle,
            metaDescription: row.metaDescription || DEFAULT_SEO.metaDescription,
            ogImageUrl: row.ogImageUrl ?? DEFAULT_SEO.ogImageUrl,
          }
        : { ...DEFAULT_SEO },
    })
  } catch (e) {
    console.error('[admin/seo] read failed:', e)
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
  const parsed = seoUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 },
    )
  }

  try {
    const { siteTitle, metaDescription, ogImageUrl } = parsed.data
    const seo = await db.seoSettings.upsert({
      where: { id: 'default' },
      update: { siteTitle, metaDescription, ogImageUrl },
      create: { id: 'default', siteTitle, metaDescription, ogImageUrl },
    })
    return NextResponse.json({ seo })
  } catch (e) {
    console.error('[admin/seo] write failed:', e)
    return NextResponse.json({ error: 'Could not save SEO settings' }, { status: 500 })
  }
}
