'use client'

import { useEffect } from 'react'
import { useNavigation } from '@/store/navigation'
import { useProjectsStore, selectBySlug } from '@/store/projects'
import { useSiteContentStore } from '@/store/site-content'
import {
  siteUrl,
  pageSeoMap,
  getProjectSeo,
  ogImage,
} from '@/config/seo'

/**
 * Client-side <head> manager for SPA routing.
 */
export function useDocumentHead() {
  const { currentPage, currentProjectSlug } = useNavigation()
  const projects = useProjectsStore((s) => s.projects)
  const fetchProjects = useProjectsStore((s) => s.fetchProjects)
  const content = useSiteContentStore((s) => s.content)
  const fetchSiteContent = useSiteContentStore((s) => s.fetchSiteContent)

  useEffect(() => {
    fetchProjects()
    fetchSiteContent()
  }, [fetchProjects, fetchSiteContent])

  useEffect(() => {
    let title = pageSeoMap.home.title
    let description = pageSeoMap.home.description
    let canonical = siteUrl
    let ogImg = ogImage
    let ogType = 'website'

    // Admin-editable SEO overrides for the homepage
    if (currentPage === 'home') {
      if (content['seo.siteTitle']) title = content['seo.siteTitle']
      if (content['seo.metaDescription']) description = content['seo.metaDescription']
    }

    if (currentPage === 'project' && currentProjectSlug) {
      const project = selectBySlug(projects, currentProjectSlug)
      if (project) {
        const seo = getProjectSeo(project)
        title = seo.title
        description = seo.description
        canonical = `${siteUrl}${seo.path}`
        ogImg = seo.ogImage || ogImage
        ogType = seo.ogType || 'video.other'
      }
    } else if (currentPage !== 'home') {
      const seo = pageSeoMap[currentPage]
      if (seo) {
        title = seo.title
        description = seo.description
        canonical = `${siteUrl}${seo.path}`
        ogImg = seo.ogImage || ogImage
      }
    }

    document.title = title
    setMeta('description', description)
    setLink('canonical', canonical)

    setMetaProperty('og:title', title)
    setMetaProperty('og:description', description)
    setMetaProperty('og:url', canonical)
    setMetaProperty('og:image', ogImg)
    setMetaProperty('og:type', ogType)
    setMetaProperty('og:site_name', 'SREALLABS')

    setMeta('twitter:card', 'summary_large_image', 'name')
    setMeta('twitter:title', title, 'name')
    setMeta('twitter:description', description, 'name')
    setMeta('twitter:image', ogImg, 'name')
    setMeta('twitter:site', '@sreallabs', 'name')
  }, [currentPage, currentProjectSlug, projects, content])
}

function setMeta(name: string, content: string, attr = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}