'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'

const inputCls =
  'w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-electric-blue focus:outline-none'

interface Seo {
  siteTitle: string
  metaDescription: string
  ogImageUrl: string
}

export default function AdminSeoPage() {
  const [seo, setSeo] = useState<Seo>({ siteTitle: '', metaDescription: '', ogImageUrl: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/seo', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setSeo(d.seo))
      .catch(() => setError('Could not load SEO settings'))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seo),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error || 'Save failed')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-white">SEO</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Site title and meta description used across the site; project pages generate
        their metadata automatically from each project.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="space-y-1.5">
          <label htmlFor="siteTitle" className="text-xs font-medium text-neutral-300">Site title</label>
          <input
            id="siteTitle"
            value={seo.siteTitle}
            onChange={(e) => setSeo((s) => ({ ...s, siteTitle: e.target.value }))}
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="metaDescription" className="text-xs font-medium text-neutral-300">Meta description</label>
          <textarea
            id="metaDescription"
            value={seo.metaDescription}
            onChange={(e) => setSeo((s) => ({ ...s, metaDescription: e.target.value }))}
            rows={3}
            className={inputCls}
          />
          <p className="text-xs text-neutral-500">{seo.metaDescription.length} characters</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ogImageUrl" className="text-xs font-medium text-neutral-300">Default social share (OG) image URL</label>
          <input
            id="ogImageUrl"
            value={seo.ogImageUrl}
            onChange={(e) => setSeo((s) => ({ ...s, ogImageUrl: e.target.value }))}
            className={inputCls}
            placeholder="https://…"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-electric-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-electric-blue/90 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
        {saved && <span className="text-sm text-green-400">Saved ✓</span>}
      </div>
    </div>
  )
}
