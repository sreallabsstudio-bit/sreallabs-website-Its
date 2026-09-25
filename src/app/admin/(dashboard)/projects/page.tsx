'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Pencil,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Loader2,
} from 'lucide-react'
import type { PublicProject } from '@/lib/types'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<PublicProject[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setProjects(data.projects ?? [])
      setError(null)
    } catch {
      setError('Could not load projects. Is the database configured?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const act = async (id: string, fn: () => Promise<Response>) => {
    setBusyId(id)
    try {
      const res = await fn()
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        alert(d.error || 'Action failed')
      }
      await load()
    } finally {
      setBusyId(null)
    }
  }

  const toggle = (p: PublicProject, field: 'published' | 'featured') =>
    act(p.id, () =>
      fetch(`/api/admin/projects/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !p[field] }),
      }),
    )

  const duplicate = (p: PublicProject) =>
    act(p.id, () => fetch(`/api/admin/projects/${p.id}/duplicate`, { method: 'POST' }))

  const remove = (p: PublicProject) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    return act(p.id, () => fetch(`/api/admin/projects/${p.id}`, { method: 'DELETE' }))
  }

  const reorder = (p: PublicProject, direction: 'up' | 'down') =>
    act(p.id, () =>
      fetch('/api/admin/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: p.id, direction }),
      }),
    )

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Projects</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {projects.length} projects · order matches the public Work page
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-electric-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-electric-blue/90"
        >
          <Plus className="h-4 w-4" />
          Add project
        </Link>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-10 flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading projects…
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {projects.map((p, idx) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 md:flex-nowrap"
            >
              {/* Thumbnail */}
              <div className="h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                {p.thumbnailUrl ? (
                   
                  <img src={p.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">#{idx + 1}</span>
                  <p className="truncate text-sm font-medium text-white">{p.title}</p>
                </div>
                <p className="mt-0.5 truncate text-xs text-neutral-500">
                  /work/{p.slug}
                  {p.categoryName ? ` · ${p.categoryName}` : ''}
                  {p.youtubeVideoId ? ' · YouTube' : p.legacyVideoUrl ? ' · hosted video' : ' · no video yet'}
                </p>
              </div>

              {/* Status toggles */}
              <div className="flex flex-shrink-0 items-center gap-1.5">
                <button
                  onClick={() => toggle(p, 'published')}
                  disabled={busyId === p.id}
                  title={p.published ? 'Published — click to unpublish' : 'Unpublished — click to publish'}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    p.published
                      ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {p.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {p.published ? 'Live' : 'Draft'}
                </button>
                <button
                  onClick={() => toggle(p, 'featured')}
                  disabled={busyId === p.id}
                  title={p.featured ? 'Featured — click to unfeature' : 'Click to feature (homepage)'}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    p.featured
                      ? 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {p.featured ? <Star className="h-3.5 w-3.5" /> : <StarOff className="h-3.5 w-3.5" />}
                  Featured
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-shrink-0 items-center gap-1">
                <div className="mr-1 flex items-center">
                  <button
                    onClick={() => reorder(p, 'up')}
                    disabled={busyId === p.id || idx === 0}
                    title="Move up"
                    className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => reorder(p, 'down')}
                    disabled={busyId === p.id || idx === projects.length - 1}
                    title="Move down"
                    className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  title="Edit"
                  className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => duplicate(p)}
                  disabled={busyId === p.id}
                  title="Duplicate"
                  className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(p)}
                  disabled={busyId === p.id}
                  title="Delete"
                  className="rounded-md p-2 text-neutral-400 hover:bg-red-500/15 hover:text-red-400 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {busyId === p.id && (
                <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-neutral-500" />
              )}
            </div>
          ))}

          {projects.length === 0 && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-10 text-center">
              <p className="text-sm text-neutral-400">No projects yet.</p>
              <Link
                href="/admin/projects/new"
                className="mt-3 inline-block text-sm font-medium text-electric-blue hover:underline"
              >
                Add your first project →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
