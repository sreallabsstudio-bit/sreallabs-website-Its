'use client'

import { create } from 'zustand'
import type { PublicProject, PublicCategory } from '@/lib/types'

interface ProjectsState {
  projects: PublicProject[]
  categories: PublicCategory[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  fetchProjects: () => Promise<void>
}

/**
 * Client-side mirror of the published portfolio, served by GET /api/projects.
 * Fetches once per page load; public pages subscribe for data.
 */
export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  categories: [],
  status: 'idle',
  fetchProjects: async () => {
    if (get().status === 'loading' || get().status === 'ready') return
    set({ status: 'loading' })
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { projects: PublicProject[]; categories: PublicCategory[] }
      set({
        projects: data.projects ?? [],
        categories: data.categories ?? [],
        status: 'ready',
      })
    } catch {
      set({ status: 'error' })
    }
  },
}))

// ── Selectors mirroring the previous static helpers ──────────────

export function selectPublished(projects: PublicProject[]): PublicProject[] {
  return projects // API already filters to published
}

export function selectFeatured(projects: PublicProject[]): PublicProject[] {
  return projects.filter((p) => p.featured)
}

export function selectBySlug(projects: PublicProject[], slug: string | null): PublicProject | undefined {
  if (!slug) return undefined
  return projects.find((p) => p.slug === slug)
}

export function selectByCategory(
  projects: PublicProject[],
  categoryName: string | null,
): PublicProject[] {
  if (!categoryName || categoryName === 'All') return projects
  return projects.filter((p) => p.categoryName === categoryName)
}
