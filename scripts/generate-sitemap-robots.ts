/**
 * Pre-build script: generates static sitemap.xml and robots.txt
 * into public/ so they are served as static assets in all
 * deployment modes (standalone, Vercel, Docker, etc.).
 *
 * Reads portfolio data automatically — any new project added to
 * the portfolio array will appear in the sitemap on next build.
 *
 * Run standalone:  bun scripts/generate-sitemap-robots.ts
 * Run in build:    included automatically via package.json "build" script
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

import { portfolio } from '../src/data/portfolio'
import { siteUrl } from '../src/config/seo'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(__dirname, '..', 'public')

// ─── Sitemap ────────────────────────────────────────────────────

interface SitemapEntry {
  url: string
  lastmod: string
  changefreq: string
  priority: string
}

function generateSitemap(): void {
  const today = new Date().toISOString().split('T')[0]

  const staticPages: SitemapEntry[] = [
    {
      url: siteUrl,
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      url: `${siteUrl}/work`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.9',
    },
    {
      url: `${siteUrl}/services`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
    },
    {
      url: `${siteUrl}/about`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      url: `${siteUrl}/contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
    },
  ]

  // Dynamically generate entries for every portfolio project
  const projectPages: SitemapEntry[] = portfolio.map((p) => ({
    url: `${siteUrl}/work/${p.slug}`,
    lastmod: `${p.year}-01-01`,
    changefreq: 'weekly',
    priority: '0.8',
  }))

  // Deduplicate by URL (safety guard)
  const seen = new Set<string>()
  const allPages: SitemapEntry[] = []

  for (const entry of [...staticPages, ...projectPages]) {
    if (!seen.has(entry.url)) {
      seen.add(entry.url)
      allPages.push(entry)
    }
  }

  const xml: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allPages.map(
      (p) =>
        `  <url>\n    <loc>${p.url}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
    ),
    '</urlset>',
    '',
  ]

  writeFileSync(resolve(publicDir, 'sitemap.xml'), xml.join('\n'), 'utf-8')
  console.log(
    `✅ sitemap.xml — ${allPages.length} URLs (${staticPages.length} pages + ${projectPages.length} portfolio projects)`
  )
}

// ─── Robots ─────────────────────────────────────────────────────

function generateRobots(): void {
  const txt = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')

  writeFileSync(resolve(publicDir, 'robots.txt'), txt, 'utf-8')
  console.log('✅ robots.txt')
}

// ─── Main ───────────────────────────────────────────────────────

mkdirSync(publicDir, { recursive: true })
generateSitemap()
generateRobots()