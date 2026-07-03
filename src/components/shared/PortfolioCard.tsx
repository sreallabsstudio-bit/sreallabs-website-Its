'use client'

import { useRef } from 'react'
import type { PortfolioProject } from '@/data/portfolio'

interface Props {
  project: PortfolioProject
  onClick?: () => void
}

export default function PortfolioCard({ project, onClick }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    if (videoRef.current && window.matchMedia('(hover: hover)').matches) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleClick = () => {
    onClick?.()
  }

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
    >
      <video
        ref={videoRef}
        src={project.video}
        poster={project.thumbnail}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover transition-shadow duration-500 md:group-hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]"
      />

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Hover overlay deepening */}
      <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/20 transition-colors duration-500 pointer-events-none" />

      {/* Text overlay - bottom-left, compact */}
      <div className="absolute bottom-0 left-0 p-3 md:p-4 pointer-events-none">
        <h3 className="text-white font-medium text-xs md:text-sm transition-colors md:group-hover:text-white">
          {project.title}
        </h3>
        <p className="text-matte-silver text-[10px] md:text-xs mt-0.5">
          {project.category}
        </p>
        <p className="text-electric-blue text-[10px] md:text-xs font-medium opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 mt-1">
          View Project
        </p>
      </div>
    </div>
  )
}