'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useNavigation, PAGE_PATHS } from '@/store/navigation'

/**
 * Bridges the real /work/[slug] route with the SPA navigation store.
 *
 * The public project page is rendered by a real Next.js route (for correct
 * server-side metadata), while the rest of the site is a single-page app
 * served at "/" with client-side routing. This component:
 *  1. Initializes the navigation store so the shared ProjectPage component
 *     knows which project to render.
 *  2. When in-page navigation happens (navbar, related projects, prev/next),
 *     converts the store change into a real router navigation.
 */
export default function ProjectRouteBridge({ slug }: { slug: string }) {
  const router = useRouter()
  const currentPage = useNavigation((s) => s.currentPage)
  const currentProjectSlug = useNavigation((s) => s.currentProjectSlug)
  const ready = useRef(false)

  useEffect(() => {
    useNavigation.setState({
      currentPage: 'project',
      previousPage: 'work',
      currentProjectSlug: slug,
      initialized: true,
    })
    ready.current = true
  }, [slug])

  useEffect(() => {
    if (!ready.current) return
    if (currentPage !== 'project') {
      router.push(PAGE_PATHS[currentPage] || '/')
      return
    }
    if (currentProjectSlug && currentProjectSlug !== slug) {
      router.push(`/work/${currentProjectSlug}`)
    }
  }, [currentPage, currentProjectSlug, slug, router])

  return null
}
