import { db } from '@/lib/db'
import { DEFAULT_SITE_CONTENT, DEFAULT_SEO } from '@/lib/defaults'

export interface SiteContentBundle {
  content: Record<string, string>
  seo: { siteTitle: string; metaDescription: string; ogImageUrl: string }
}

/**
 * Site content + SEO from the database, overlaid on defaults.
 * Falls back to defaults on any database error so the public site never breaks.
 */
export async function getSiteContentBundle(): Promise<SiteContentBundle> {
  const fallback: SiteContentBundle = {
    content: { ...DEFAULT_SITE_CONTENT },
    seo: { ...DEFAULT_SEO },
  }
  try {
    const [contentRows, seoRow] = await Promise.all([
      db.siteContent.findMany(),
      db.seoSettings.findUnique({ where: { id: 'default' } }),
    ])
    const content = { ...DEFAULT_SITE_CONTENT }
    for (const row of contentRows) {
      if (row.value && row.value.trim()) content[row.key] = row.value
    }
    return {
      content,
      seo: seoRow
        ? {
            siteTitle: seoRow.siteTitle || DEFAULT_SEO.siteTitle,
            metaDescription: seoRow.metaDescription || DEFAULT_SEO.metaDescription,
            ogImageUrl: seoRow.ogImageUrl || DEFAULT_SEO.ogImageUrl,
          }
        : fallback.seo,
    }
  } catch (e) {
    console.error('[site-content] falling back to defaults:', e)
    return fallback
  }
}

export async function getSeoSettings() {
  const bundle = await getSiteContentBundle()
  return bundle.seo
}
