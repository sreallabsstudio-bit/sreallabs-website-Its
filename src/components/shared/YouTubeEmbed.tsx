'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { youTubeEmbedUrl } from '@/lib/youtube'

/**
 * Performance-safe YouTube embed (lite pattern):
 * renders the video's poster thumbnail and only mounts the real iframe
 * player when the visitor clicks play. Never loads dozens of YouTube
 * iframes at once on listing pages.
 */
export default function YouTubeEmbed({
  videoId,
  title,
  posterUrl,
  className = '',
}: {
  videoId: string
  title: string
  posterUrl?: string | null
  className?: string
}) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <div className={`relative aspect-video overflow-hidden bg-black ${className}`}>
        <iframe
          src={youTubeEmbedUrl(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className={`group relative aspect-video w-full overflow-hidden bg-black ${className}`}
    >
      {posterUrl ? (
         
        <img
          src={posterUrl}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-elevated" />
      )}
      {/* Subtle dark scrim */}
      <span className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/15" />
      {/* Play button — matches the site's premium round style */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-electric-blue/80 group-hover:border-electric-blue">
          <Play className="h-6 w-6 text-white fill-white translate-x-[1px]" />
        </span>
      </span>
    </button>
  )
}
