/** Shared public shapes (serialized — safe across the server/client boundary). */

export interface PublicCategory {
  id: string
  name: string
  slug: string
  sortOrder: number
}

export interface PublicProject {
  id: string
  legacyId: string | null
  title: string
  slug: string
  description: string
  categoryId: string | null
  categoryName: string | null
  client: string | null
  industry: string | null
  service: string | null
  youtubeVideoId: string | null
  googleDriveUrl: string | null
  /** Resolved display thumbnail: custom override → YouTube thumb → legacy poster. */
  thumbnailUrl: string | null
  /** Pre-YouTube self-hosted MP4 (existing projects). Enables hover preview + <video> playback. */
  legacyVideoUrl: string | null
  featured: boolean
  published: boolean
  sortOrder: number
  year: string | null
  tags: string[]
  fullDescription: string | null
  challenge: string | null
  solution: string | null
  result: string | null
  additionalImages: string[]
  createdAt: string
  updatedAt: string
}
