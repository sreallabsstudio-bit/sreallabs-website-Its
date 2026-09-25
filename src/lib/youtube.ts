/**
 * YouTube URL parsing & thumbnail utilities.
 * Shared by admin form (auto-extract) and public rendering.
 */

export interface ParsedYouTube {
  videoId: string
  canonicalUrl: string
}

const ID_RE = /^[A-Za-z0-9_-]{11}$/

/**
 * Extract the 11-character video ID from any common YouTube URL form:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/shorts/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - https://www.youtube.com/live/VIDEO_ID
 *  - https://m.youtube.com/watch?v=VIDEO_ID
 *  - https://www.youtube-nocookie.com/embed/VIDEO_ID
 *  - bare video IDs are also accepted
 * Returns null for anything that is not a valid YouTube video reference.
 */
export function parseYouTubeUrl(input: string | null | undefined): ParsedYouTube | null {
  if (!input) return null
  const raw = input.trim()
  if (!raw) return null

  // Bare ID
  if (ID_RE.test(raw)) {
    return { videoId: raw, canonicalUrl: `https://www.youtube.com/watch?v=${raw}` }
  }

  let url: URL
  try {
    url = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^www\./, '').toLowerCase()
  const isYouTubeHost =
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'music.youtube.com' ||
    host === 'youtu.be' ||
    host === 'youtube-nocookie.com'
  if (!isYouTubeHost) return null

  let id: string | null = null

  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null
  } else {
    const v = url.searchParams.get('v')
    if (v) {
      id = v
    } else {
      // /shorts/, /embed/, /live/, /v/
      const match = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/)
      if (match) id = match[1]
    }
  }

  if (!id || !ID_RE.test(id)) return null
  return { videoId: id, canonicalUrl: `https://www.youtube.com/watch?v=${id}` }
}

/** Standard YouTube thumbnail URL (always exists once a video is published). */
export function youTubeThumbnailUrl(videoId: string, quality: 'hq' | 'maxres' = 'hq'): string {
  return `https://i.ytimg.com/vi/${videoId}/${quality === 'hq' ? 'hqdefault' : 'maxresdefault'}.jpg`
}

/** Minimal validation for Google Drive links (folders or single files). */
export function isValidGoogleDriveUrl(input: string | null | undefined): boolean {
  if (!input) return false
  try {
    const url = new URL(input.trim())
    return (
      (url.hostname === 'drive.google.com' || url.hostname === 'docs.google.com') &&
      url.protocol === 'https:'
    )
  } catch {
    return false
  }
}

/** Build the embeddable player URL with privacy-enhanced mode. */
export function youTubeEmbedUrl(videoId: string, autoplay = true): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
  })
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}
