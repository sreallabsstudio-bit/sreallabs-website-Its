'use client'

import { useEffect } from 'react'
import { useNavigation } from '@/store/navigation'
import { getProjectBySlug } from '@/data/portfolio'
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

  useEffect(() => {
    let title = pageSeoMap.home.title
    let description = pageSeoMap.home.description
    let canonical = siteUrl
    let ogImg = ogImage
    let ogType = 'website'

    if (currentPage === 'project' && currentProjectSlug) {
      const project = getProjectBySlug(currentProjectSlug)
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
  }, [currentPage, currentProjectSlug])
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