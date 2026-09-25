'use client'

import { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'

const FIELDS: { key: string; label: string; hint?: string; multiline?: boolean }[] = [
  { key: 'home.hero.heading', label: 'Homepage hero heading' },
  { key: 'home.hero.description', label: 'Homepage hero description', multiline: true },
  { key: 'home.hero.cta', label: 'Homepage CTA label', hint: 'e.g. View Selected Work' },
  { key: 'about.heading', label: 'About heading', hint: 'e.g. Our Story' },
  { key: 'about.description', label: 'About description', multiline: true },
  { key: 'contact.email', label: 'Contact email' },
  { key: 'contact.calendlyUrl', label: 'Calendly URL' },
  { key: 'social.facebook', label: 'Facebook URL' },
  { key: 'social.linkedin', label: 'LinkedIn URL' },
  { key: 'social.contra', label: 'Contra URL' },
]

const inputCls =
  'w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-electric-blue focus:outline-none'

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/content', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setValues(d.values ?? {}))
      .catch(() => setError('Could not load content'))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
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
      <h1 className="text-2xl font-semibold text-white">Site Content</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Edit key website text without touching code. Changes go live immediately.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label htmlFor={f.key} className="text-xs font-medium text-neutral-300">
              {f.label}
            </label>
            {f.multiline ? (
              <textarea
                id={f.key}
                value={values[f.key] ?? ''}
                onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                rows={3}
                className={inputCls}
              />
            ) : (
              <input
                id={f.key}
                value={values[f.key] ?? ''}
                onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                className={inputCls}
              />
            )}
            {f.hint && <p className="text-xs text-neutral-500">{f.hint}</p>}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 pb-6">
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
