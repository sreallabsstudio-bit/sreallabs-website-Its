'use client'

import { create } from 'zustand'
import { DEFAULT_SITE_CONTENT, DEFAULT_SEO } from '@/lib/defaults'

interface SiteContentState {
  content: Record<string, string>
  seo: { siteTitle: string; metaDescription: string; ogImageUrl: string }
  status: 'idle' | 'loading' | 'ready' | 'error'
  fetchSiteContent: () => Promise<void>
}

/**
 * Admin-editable site content (hero text, about, contact email, Calendly,
 * socials, SEO). Starts from the current live defaults and swaps in database
 * values once loaded — so the site renders instantly and correctly even
 * before the fetch resolves, and stays correct if the database is down.
 */
export const useSiteContentStore = create<SiteContentState>((set, get) => ({
  content: { ...DEFAULT_SITE_CONTENT },
  seo: { ...DEFAULT_SEO },
  status: 'idle',
  fetchSiteContent: async () => {
    if (get().status === 'loading' || get().status === 'ready') return
    set({ status: 'loading' })
    try {
      const res = await fetch('/api/site-content', { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as {
        content: Record<string, string>
        seo: SiteContentState['seo']
      }
      set({
        content: { ...DEFAULT_SITE_CONTENT, ...(data.content ?? {}) },
        seo: { ...DEFAULT_SEO, ...(data.seo ?? {}) },
        status: 'ready',
      })
    } catch {
      set({ status: 'error' })
    }
  },
}))

/** Convenience accessor for a content key with fallback. */
export function contentValue(content: Record<string, string>, key: string): string {
  return content[key] ?? DEFAULT_SITE_CONTENT[key] ?? ''
}
