'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { PortfolioProject } from '@/data/portfolio'

interface Props {
  project: PortfolioProject
  onClick?: () => void
  index?: number
}

export default function PortfolioCard({ project, onClick, index = 0 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (videoRef.current && window.matchMedia('(hover: hover)').matches) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [])

  const handleClick = () => {
    onClick?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.03,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      <div
        className="relative aspect-video overflow-hidden rounded-2xl cursor-pointer group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleClick()
        }}
        aria-label={`View ${project.title}`}
      >
        {/* Thumbnail — always visible as base layer */}
        <img
          src={project.thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: isHovered && isLoaded ? 0 : 1 }}
        />

        {/* Hover video — overlays thumbnail */}
        <video
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: isHovered && isLoaded ? 1 : 0 }}
        />

        {/* Bottom gradient overlay — text readable over video */}
        <div
          className="absolute bottom-0 inset-x-0 h-3/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none transition-opacity duration-500"
          style={{ opacity: isHovered ? 1 : 0.85 }}
        />

        {/* Electric blue glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
          style={{
            boxShadow: isHovered
              ? '0 0 0 1px rgba(37,99,235,0.3), 0 8px 40px rgba(37,99,235,0.15), 0 0 80px rgba(37,99,235,0.08)'
              : 'none',
          }}
        />

        {/* Subtle card elevation on hover */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
          style={{
            transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          }}
        />

        {/* Text — bottom-left, compact, inside the video */}
        <div className="absolute bottom-0 left-0 p-3.5 md:p-4 pointer-events-none">
          <h3
            className="text-white font-medium text-[11px] md:text-xs tracking-wide transition-all duration-500"
            style={{
              color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.9)',
            }}
          >
            {project.title}
          </h3>
          <p
            className="text-[9px] md:text-[10px] mt-0.5 tracking-wide uppercase transition-colors duration-500"
            style={{
              color: isHovered ? '#2563EB' : 'rgba(161,161,170,0.8)',
            }}
          >
            {project.category}
          </p>
        </div>

        {/* Play indicator — top-right, appears on hover */}
        <div
          className="absolute top-3 right-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.8)',
          }}
        >
          <svg
            className="w-3 h-3 text-white ml-0.5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}