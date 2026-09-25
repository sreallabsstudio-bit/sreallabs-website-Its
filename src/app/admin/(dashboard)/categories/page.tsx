'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, Check, X, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  sortOrder: number
  active: boolean
  projectCount: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/categories', { cache: 'no-store' })
      const data = await res.json()
      setCategories(data.categories ?? [])
    } catch {
      setError('Could not load categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const add = async () => {
    if (!newName.trim()) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          sortOrder: categories.length,
          active: true,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setError(data.error || 'Could not add category')
      else setNewName('')
      await load()
    } finally {
      setBusy(false)
    }
  }

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusy(true)
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await load()
    } finally {
      setBusy(false)
    }
  }

  const remove = async (c: Category) => {
    if (
      !confirm(
        `Delete category "${c.name}"?${c.projectCount ? ` ${c.projectCount} project(s) will keep existing without a category.` : ''}`,
      )
    )
      return
    setBusy(true)
    try {
      await fetch(`/api/admin/categories/${c.id}`, { method: 'DELETE' })
      await load()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-white">Categories</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Categories power the filter chips on the public Work page.
      </p>

      {/* Add */}
      <div className="mt-6 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="New category name (e.g. Medical)"
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-electric-blue focus:outline-none"
        />
        <button
          onClick={add}
          disabled={busy || !newName.trim()}
          className="flex items-center gap-2 rounded-lg bg-electric-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-electric-blue/90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3"
            >
              {editingId === c.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-white focus:border-electric-blue focus:outline-none"
                  />
                  <button
                    onClick={async () => {
                      if (editName.trim()) await patch(c.id, { name: editName.trim() })
                      setEditingId(null)
                    }}
                    className="rounded-md p-2 text-green-400 hover:bg-green-500/10"
                    title="Save"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {c.name}
                      {!c.active && <span className="ml-2 text-xs text-neutral-500">(hidden)</span>}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {c.projectCount} project{c.projectCount === 1 ? '' : 's'}
                    </p>
                  </div>
                  <button
                    onClick={() => patch(c.id, { active: !c.active })}
                    disabled={busy}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      c.active
                        ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    {c.active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(c.id)
                      setEditName(c.name)
                    }}
                    className="rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    title="Rename"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(c)}
                    disabled={busy}
                    className="rounded-md p-2 text-neutral-400 hover:bg-red-500/15 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
