'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FolderOpen, Eye, Star, Tags, Loader2 } from 'lucide-react'

interface Stats {
  total: number
  published: number
  featured: number
  categories: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/projects').then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ])
      .then(([p, c]) => {
        const projects: { published: boolean; featured: boolean }[] = p.projects ?? []
        setStats({
          total: projects.length,
          published: projects.filter((x) => x.published).length,
          featured: projects.filter((x) => x.featured && x.published).length,
          categories: (c.categories ?? []).length,
        })
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total projects', value: stats?.total, icon: FolderOpen, href: '/admin/projects' },
    { label: 'Published', value: stats?.published, icon: Eye, href: '/admin/projects' },
    { label: 'Featured (live on homepage)', value: stats?.featured, icon: Star, href: '/admin/projects' },
    { label: 'Categories', value: stats?.categories, icon: Tags, href: '/admin/categories' },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Overview of your portfolio content.
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

      {loading ? (
        <div className="mt-10 flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon
            return (
              <Link
                key={c.label}
                href={c.href}
                className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-electric-blue/40"
              >
                <Icon className="h-5 w-5 text-electric-blue" />
                <p className="mt-3 text-3xl font-semibold text-white">
                  {c.value ?? '—'}
                </p>
                <p className="mt-1 text-xs text-neutral-400">{c.label}</p>
              </Link>
            )
          })}
        </div>
      )}

      <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
        <h2 className="text-sm font-semibold text-white">Quick workflow</h2>
        <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm text-neutral-400">
          <li>
            Go to <Link className="text-electric-blue hover:underline" href="/admin/projects/new">Projects → Add Project</Link>
          </li>
          <li>Enter the title, paste the YouTube URL, pick a category and write a short description</li>
          <li>Optionally add a Google Drive link and toggle Featured / Published</li>
          <li>Save — the project appears on the public site immediately (no redeploy needed)</li>
        </ol>
      </div>
    </div>
  )
}
