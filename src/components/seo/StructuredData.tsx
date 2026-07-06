'use client'

import { useEffect, useState } from 'react'
import { useNavigation } from '@/store/navigation'
import {
  getProjectBySlug,
} from '@/data/portfolio'
import {
  siteUrl,
  buildOrganizationSchema,
  buildWebsiteSchema,
  buildBreadcrumbSchema,
  buildVideoObjectSchema,
  buildImageObjectSchema,
  buildWebPageSchema,
} from '@/config/seo'

/**
 * Injects JSON-LD structured data into <head> for every page view.
 *
 * Global schemas (Organization, WebSite) are always present.
 * Project-specific schemas (VideoObject, ImageObject, Breadcrumb, WebPage)
 * are injected when a project is open.
 */
export default function StructuredData() {
  const { currentPage, currentProjectSlug } = useNavigation()
  const [schemas, setSchemas] = useState<Record<string, object>>({
    organization: buildOrganizationSchema(),
    website: buildWebsiteSchema(),
  })

  useEffect(() => {
    const next: Record<string, object> = {
      organization: buildOrganizationSchema(),
      website: buildWebsiteSchema(),
    }

    // Breadcrumb for current page
    if (currentPage === 'project') {
      const project = currentProjectSlug
        ? getProjectBySlug(currentProjectSlug)
        : undefined
      if (project) {
        next.breadcrumb = buildBreadcrumbSchema([
          { name: 'Home', url: siteUrl },
          { name: 'Work', url: `${siteUrl}/work` },
          { name: project.title, url: `${siteUrl}/work/${project.slug}` },
        ])
        next.videoObject = buildVideoObjectSchema(project)
        next.imageObject = buildImageObjectSchema(project)
        next.webPage = buildWebPageSchema(project)
      }
    } else if (currentPage !== 'home' && currentPage !== 'project') {
      const labels: Record<string, string> = {
        work: 'Work',
        services: 'Services',
        about: 'About',
        contact: 'Contact',
      }
      next.breadcrumb = buildBreadcrumbSchema([
        { name: 'Home', url: siteUrl },
        { name: labels[currentPage] || currentPage, url: `${siteUrl}/${currentPage}` },
      ])
    }

    setSchemas(next)
  }, [currentPage, currentProjectSlug])

  return (
    <>
      {Object.entries(schemas).map(([key, schema]) => (
        <script
          key={key}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}