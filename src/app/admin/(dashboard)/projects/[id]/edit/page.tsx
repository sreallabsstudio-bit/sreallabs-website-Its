'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import ProjectForm, { projectToValues } from '@/components/admin/ProjectForm'
import type { PublicProject } from '@/lib/types'

export default function AdminEditProjectPage() {
  const params = useParams<{ id: string }>()
  const [project, setProject] = useState<PublicProject | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/projects', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        const found: PublicProject | undefined = (d.projects ?? []).find(
          (p: PublicProject) => p.id === params.id,
        )
        if (!found) {
          setError('Project not found')
          return
        }
        setProject(found)
      })
      .catch(() => setError('Could not load the project'))
  }, [params.id])

  if (error) return <p className="text-sm text-red-400">{error}</p>
  if (!project) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading project…
      </div>
    )
  }

  return <ProjectForm mode="edit" projectId={project.id} initial={projectToValues(project)} />
}
