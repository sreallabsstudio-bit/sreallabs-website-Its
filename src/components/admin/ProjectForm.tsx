'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Save } from 'lucide-react'
import { parseYouTubeUrl, youTubeThumbnailUrl, isValidGoogleDriveUrl } from '@/lib/youtube'
import { slugify } from '@/lib/slug'
import type { PublicProject, PublicCategory } from '@/lib/types'

export interface ProjectFormValues {
  title: string
  slug: string
  description: string
  categoryId: string
  client: string
  industry: string
  youtubeUrl: string
  googleDriveUrl: string
  thumbnailUrl: string
  legacyVideoUrl: string
  featured: boolean
  published: boolean
  sortOrder: number
  service: string
  year: string
  tags: string
  fullDescription: string
  challenge: string
  solution: string
  result: string
}

export const EMPTY_PROJECT: ProjectFormValues = {
  title: '',
  slug: '',
  description: '',
  categoryId: '',
  client: '',
  industry: '',
  youtubeUrl: '',
  googleDriveUrl: '',
  thumbnailUrl: '',
  legacyVideoUrl: '',
  featured: false,
  published: true,
  sortOrder: 0,
  service: '',
  year: '',
  tags: '',
  fullDescription: '',
  challenge: '',
  solution: '',
  result: '',
}

const inputCls =
  'w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-electric-blue focus:outline-none'

export default function ProjectForm({
  mode,
  projectId,
  initial,
}: {
  mode: 'create' | 'edit'
  projectId?: string
  initial?: ProjectFormValues
}) {
  const router = useRouter()
  const [values, setValues] = useState<ProjectFormValues>(initial ?? EMPTY_PROJECT)
  const [categories, setCategories] = useState<PublicCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {})
  }, [])

  const set = <K extends keyof ProjectFormValues>(key: K, v: ProjectFormValues[K]) =>
    setValues((s) => ({ ...s, [key]: v }))

  const setField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const target = e.target as HTMLInputElement
    const name = target.name as keyof ProjectFormValues
    if (target.type === 'checkbox') {
      set(name, target.checked as ProjectFormValues[typeof name])
    } else if (name === 'sortOrder') {
      set(name, (parseInt(target.value, 10) || 0) as ProjectFormValues[typeof name])
    } else {
      set(name, target.value as ProjectFormValues[typeof name])
      if (name === 'title' && !slugTouched) {
        setValues((s) => ({ ...s, title: target.value, slug: slugify(target.value) }))
      }
    }
  }

  const yt = useMemo(() => parseYouTubeUrl(values.youtubeUrl), [values.youtubeUrl])
  const ytInvalid = values.youtubeUrl.trim().length > 0 && !yt
  const driveInvalid = values.googleDriveUrl.trim().length > 0 && !isValidGoogleDriveUrl(values.googleDriveUrl)
  const previewThumb = values.thumbnailUrl.trim()
    ? values.thumbnailUrl
    : yt
      ? youTubeThumbnailUrl(yt.videoId)
      : null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!values.title.trim()) return setError('Title is required')
    if (!values.description.trim()) return setError('Description is required')
    if (ytInvalid) return setError('The YouTube URL is not valid')

    setSaving(true)
    try {
      const payload = {
        title: values.title,
        slug: values.slug.trim() || null,
        description: values.description,
        categoryId: values.categoryId || null,
        client: values.client,
        industry: values.industry,
        youtubeUrl: values.youtubeUrl,
        googleDriveUrl: values.googleDriveUrl,
        thumbnailUrl: values.thumbnailUrl,
        legacyVideoUrl: values.legacyVideoUrl,
        featured: values.featured,
        published: values.published,
        sortOrder: values.sortOrder,
        service: values.service,
        year: values.year,
        tags: values.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        fullDescription: values.fullDescription,
        challenge: values.challenge,
        solution: values.solution,
        result: values.result,
      }

      const res = await fetch(
        mode === 'create' ? '/api/admin/projects' : `/api/admin/projects/${projectId}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Save failed')
        return
      }
      router.push('/admin/projects')
      router.refresh()
    } catch {
      setError('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white">
          {mode === 'create' ? 'Add project' : 'Edit project'}
        </h1>
        <Link href="/admin/projects" className="text-sm text-neutral-400 hover:text-white">
          ← Back to projects
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Core fields */}
      <div className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="space-y-1.5">
          <label htmlFor="title" className="text-xs font-medium text-neutral-300">Project Title *</label>
          <input id="title" name="title" value={values.title} onChange={setField} className={inputCls} placeholder="e.g. ZXYEL Flagship Switch" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="youtubeUrl" className="text-xs font-medium text-neutral-300">YouTube URL</label>
          <input
            id="youtubeUrl"
            name="youtubeUrl"
            value={values.youtubeUrl}
            onChange={setField}
            className={`${inputCls} ${ytInvalid ? 'border-red-500/60' : ''}`}
            placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
          />
          <p className="text-xs text-neutral-500">
            The video ID is extracted automatically. Supported: watch, youtu.be, shorts, embed.
            {ytInvalid && <span className="text-red-400"> This does not look like a YouTube URL.</span>}
          </p>
        </div>

        {previewThumb && (
          <div className="flex items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-3">
            { }
            <img src={previewThumb} alt="Thumbnail preview" className="h-16 w-28 rounded-md object-cover" />
            <p className="text-xs text-neutral-400">
              Auto-generated YouTube thumbnail
              {yt && <span className="block text-neutral-500">Video ID: {yt.videoId}</span>}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="categoryId" className="text-xs font-medium text-neutral-300">Category</label>
            <select id="categoryId" name="categoryId" value={values.categoryId} onChange={setField} className={inputCls}>
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="client" className="text-xs font-medium text-neutral-300">Client / Brand</label>
            <input id="client" name="client" value={values.client} onChange={setField} className={inputCls} placeholder="e.g. ZXYEL" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="text-xs font-medium text-neutral-300">Short Description *</label>
          <textarea id="description" name="description" value={values.description} onChange={setField} rows={3} className={inputCls} placeholder="One or two sentences shown on the project page and in meta tags" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="industry" className="text-xs font-medium text-neutral-300">Industry</label>
            <input id="industry" name="industry" value={values.industry} onChange={setField} className={inputCls} placeholder="e.g. Technology" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="googleDriveUrl" className="text-xs font-medium text-neutral-300">
              Google Drive URL <span className="text-neutral-500">(optional)</span>
            </label>
            <input
              id="googleDriveUrl"
              name="googleDriveUrl"
              value={values.googleDriveUrl}
              onChange={setField}
              className={`${inputCls} ${driveInvalid ? 'border-red-500/60' : ''}`}
              placeholder="https://drive.google.com/…"
            />
            <p className="text-xs text-neutral-500">Adds a &quot;View Full Sample&quot; button on the project page.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-300">
            <input type="checkbox" name="published" checked={values.published} onChange={setField} className="h-4 w-4 accent-[#2563EB]" />
            Published <span className="text-xs text-neutral-500">(visible on the public site)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-300">
            <input type="checkbox" name="featured" checked={values.featured} onChange={setField} className="h-4 w-4 accent-[#2563EB]" />
            Featured <span className="text-xs text-neutral-500">(homepage Selected Work)</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm text-neutral-300">
            Sort order
            <input type="number" name="sortOrder" value={values.sortOrder} onChange={setField} className="w-24 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-white focus:border-electric-blue focus:outline-none" />
          </label>
        </div>
      </div>

      {/* Slug */}
      <div className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="space-y-1.5">
          <label htmlFor="slug" className="text-xs font-medium text-neutral-300">URL slug</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">/work/</span>
            <input
              id="slug"
              name="slug"
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true)
                set('slug', e.target.value)
              }}
              className={inputCls}
              placeholder="auto-generated from the title"
            />
          </div>
          <p className="text-xs text-neutral-500">
            Auto-generated from the title; edit only if needed. Duplicates get a numeric suffix automatically.
          </p>
        </div>
      </div>

      {/* Additional details */}
      <details className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
        <summary className="cursor-pointer text-sm font-medium text-neutral-300">
          Additional details <span className="text-neutral-500">(optional — full description, custom thumbnail, tags…)</span>
        </summary>
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="space-y-1.5">
              <label htmlFor="service" className="text-xs font-medium text-neutral-300">Service label</label>
              <input id="service" name="service" value={values.service} onChange={setField} className={inputCls} placeholder="e.g. 3D Product Animation" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="year" className="text-xs font-medium text-neutral-300">Year</label>
              <input id="year" name="year" value={values.year} onChange={setField} className={inputCls} placeholder="2026" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="tags" className="text-xs font-medium text-neutral-300">Tags (comma-separated)</label>
              <input id="tags" name="tags" value={values.tags} onChange={setField} className={inputCls} placeholder="3D Animation, Product" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="thumbnailUrl" className="text-xs font-medium text-neutral-300">Custom thumbnail URL</label>
            <input id="thumbnailUrl" name="thumbnailUrl" value={values.thumbnailUrl} onChange={setField} className={inputCls} placeholder="https://res.cloudinary.com/… (leave empty to use the YouTube thumbnail)" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="legacyVideoUrl" className="text-xs font-medium text-neutral-300">Self-hosted video URL <span className="text-neutral-500">(existing MP4 projects only)</span></label>
            <input id="legacyVideoUrl" name="legacyVideoUrl" value={values.legacyVideoUrl} onChange={setField} className={inputCls} placeholder="https://…mp4 — used when there is no YouTube URL" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="fullDescription" className="text-xs font-medium text-neutral-300">Full description</label>
            <textarea id="fullDescription" name="fullDescription" value={values.fullDescription} onChange={setField} rows={3} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="challenge" className="text-xs font-medium text-neutral-300">Creative challenge</label>
            <textarea id="challenge" name="challenge" value={values.challenge} onChange={setField} rows={2} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="solution" className="text-xs font-medium text-neutral-300">Creative solution</label>
            <textarea id="solution" name="solution" value={values.solution} onChange={setField} rows={2} className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="result" className="text-xs font-medium text-neutral-300">Final result</label>
            <textarea id="result" name="result" value={values.result} onChange={setField} rows={2} className={inputCls} />
          </div>
        </div>
      </details>

      <div className="flex items-center gap-3 pb-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-electric-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-electric-blue/90 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === 'create' ? 'Create project' : 'Save changes'}
        </button>
        <Link href="/admin/projects" className="text-sm text-neutral-400 hover:text-white">
          Cancel
        </Link>
      </div>
    </form>
  )
}

/** Helper used by the edit page to convert an API project into form values. */
export function projectToValues(p: PublicProject): ProjectFormValues {
  return {
    title: p.title,
    slug: p.slug,
    description: p.description,
    categoryId: p.categoryId ?? '',
    client: p.client ?? '',
    industry: p.industry ?? '',
    youtubeUrl: p.youtubeVideoId ? `https://www.youtube.com/watch?v=${p.youtubeVideoId}` : '',
    googleDriveUrl: p.googleDriveUrl ?? '',
    thumbnailUrl: p.thumbnailUrl ?? '',
    legacyVideoUrl: p.legacyVideoUrl ?? '',
    featured: p.featured,
    published: p.published,
    sortOrder: p.sortOrder,
    service: p.service ?? '',
    year: p.year ?? '',
    tags: (p.tags ?? []).join(', '),
    fullDescription: p.fullDescription ?? '',
    challenge: p.challenge ?? '',
    solution: p.solution ?? '',
    result: p.result ?? '',
  }
}
