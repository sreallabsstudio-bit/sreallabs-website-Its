'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import {
  portfolio,
  getProjectBySlug,
  getProjectsByCategory,
  type PortfolioProject,
  type PortfolioCategory,
} from '@/data/portfolio'
import AnimatedSection from '@/components/shared/AnimatedSection'
import PortfolioCard from '@/components/shared/PortfolioCard'

/* ═══════════════════════════════════════════════════════════════
   PREMIUM EASING
   ═══════════════════════════════════════════════════════════════ */

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease } },
}

/* ═══════════════════════════════════════════════════════════════
   SECTION LABEL
   ═══════════════════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.25em] text-electric-blue font-semibold mb-5 flex items-center gap-2.5">
      <span className="w-4 h-px bg-electric-blue/60" />
      {children}
    </p>
  )
}

/* ═══════════════════════════════════════════════════════════════
   INFO CHIP
   ═══════════════════════════════════════════════════════════════ */

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[10px] uppercase tracking-[0.12em] text-white/20 font-medium">
        {label}
      </span>
      <span className="text-sm text-white/70 font-light">{value}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DIVIDER
   ═══════════════════════════════════════════════════════════════ */

function Divider() {
  return <div className="w-full h-px bg-white/[0.06]" />
}

/* ═══════════════════════════════════════════════════════════════
   GALLERY LIGHTBOX
   ═══════════════════════════════════════════════════════════════ */

function GalleryLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[]
  initialIndex: number
  onClose: () => void
}) {
  const [activeIdx, setActiveIdx] = useState(initialIndex)
  const [loaded, setLoaded] = useState(false)

  const goPrev = useCallback(
    () => setActiveIdx((i) => (i > 0 ? i - 1 : images.length - 1)),
    [images.length],
  )
  const goNext = useCallback(
    () => setActiveIdx((i) => (i < images.length - 1 ? i + 1 : 0)),
    [images.length],
  )

  useEffect(() => {
    setLoaded(false)
  }, [activeIdx])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, goPrev, goNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300 z-10"
        aria-label="Close gallery"
      >
        <ArrowUpRight className="w-4 h-4 rotate-45" />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 text-[11px] text-white/30 font-medium tracking-wider">
        {activeIdx + 1} / {images.length}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="absolute left-4 md:left-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-all duration-300 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="absolute right-4 md:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-all duration-300 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Image */}
      <motion.div
        key={activeIdx}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.35, ease }}
        className="max-w-[90vw] max-h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[activeIdx]}
          alt=""
          onLoad={() => setLoaded(true)}
          className="max-w-full max-h-[85vh] object-contain rounded-lg transition-opacity duration-500"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </motion.div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(i) }}
              className={`w-12 h-8 rounded overflow-hidden transition-all duration-300 ${
                i === activeIdx
                  ? 'ring-1 ring-electric-blue/60 opacity-100'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROJECT PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function ProjectPage() {
  const { currentProjectSlug, navigate, navigateToProject } = useNavigation()
  const project = currentProjectSlug ? getProjectBySlug(currentProjectSlug) : undefined

  // ─── Prev / Next in the full portfolio array ───
  const projectIndex = project
    ? portfolio.findIndex((p) => p.id === project.id)
    : -1

  const prevProject = projectIndex > 0 ? portfolio[projectIndex - 1] : null
  const nextProject =
    projectIndex >= 0 && projectIndex < portfolio.length - 1
      ? portfolio[projectIndex + 1]
      : null

  // ─── Related projects (same category, exclude current) ───
  const relatedProjects = useMemo(() => {
    if (!project) return []
    const cat = project.buyerCategory as PortfolioCategory
    const same = getProjectsByCategory(cat).filter(
      (p) => p.id !== project.id,
    )
    const manual = project.relatedProjectIds
      .map((id) => portfolio.find((p) => p.id === id))
      .filter((p): p is PortfolioProject => !!p && p.id !== project.id)
    const combined = [
      ...new Map([...manual, ...same].map((p) => [p.id, p])).values(),
    ]
    return combined.slice(0, 8)
  }, [project])

  // ─── Sound toggle ───
  const [isMuted, setIsMuted] = useState(true)
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  // ─── Gallery lightbox state ───
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // ─── Preload next project video ───
  useEffect(() => {
    if (!nextProject) return
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.as = 'video'
    link.href = nextProject.video
    document.head.appendChild(link)
    return () => {
      try { document.head.removeChild(link) } catch {}
    }
  }, [nextProject])

  // ─── Keyboard navigation ───
  useEffect(() => {
    if (lightboxOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevProject) navigateToProject(prevProject.slug)
      if (e.key === 'ArrowRight' && nextProject) navigateToProject(nextProject.slug)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prevProject, nextProject, navigateToProject, lightboxOpen])

  // ─── 404 guard ───
  if (!project) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center bg-obsidian">
        <div className="text-center">
          <p className="text-electric-blue text-sm font-medium">Project not found</p>
          <button
            onClick={() => navigate('work')}
            className="mt-4 text-matte-silver text-sm hover:text-white transition-colors"
          >
            &larr; Back to Work
          </button>
        </div>
      </div>
    )
  }

  const goPrev = () => prevProject && navigateToProject(prevProject.slug)
  const goNext = () => nextProject && navigateToProject(nextProject.slug)

  const hasGallery = project.additionalImages && project.additionalImages.length > 0

  return (
    <div className="bg-obsidian">
      {/* ═══════════════════════════════════════════════════════
          HERO — CINEMATIC VIDEO (full-viewport dominant)
          ═══════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="relative w-full bg-black" style={{ aspectRatio: '21/9' }}>
          <video
            ref={heroVideoRef}
            src={project.video}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Top fade to navbar */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-obsidian/60 to-transparent pointer-events-none" />

          {/* Bottom fade to content */}
          <div className="absolute bottom-0 inset-x-0 h-2/5 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent pointer-events-none" />

          {/* Sound toggle */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5, ease }}
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white/40 hover:text-white/90 hover:bg-black/60 transition-all duration-300"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Title + Breadcrumb overlay at bottom of hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease }}
          className="absolute bottom-0 left-0 right-0 px-6 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-7 md:pb-10 pointer-events-none"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => navigate('work')}
              className="text-white/25 text-[11px] hover:text-white/50 transition-colors pointer-events-auto font-light tracking-wide"
            >
              Work
            </button>
            <span className="text-white/10 text-[10px]">/</span>
            <span className="text-electric-blue/70 text-[11px] font-light tracking-wide">
              {project.category}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl">
            {project.title}
          </h1>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PROJECT INFORMATION BAR
          ═══════════════════════════════════════════════════════ */}
      <AnimatedSection className="py-7 md:py-9 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2.5">
            {project.client && <InfoChip label="Client" value={project.client} />}
            <InfoChip label="Industry" value={project.industry} />
            <InfoChip label="Service" value={project.service} />
            <InfoChip label="Category" value={project.category} />
            {project.year && <InfoChip label="Year" value={project.year} />}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════════════════════
          PROJECT OVERVIEW
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <AnimatedSection>
            <SectionLabel>Overview</SectionLabel>
            <p className="text-matte-silver/90 text-sm md:text-[15px] leading-[1.85] font-light">
              {project.fullDescription || project.description}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════
          CREATIVE CHALLENGE
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <AnimatedSection>
            <SectionLabel>Creative Challenge</SectionLabel>
            <p className="text-matte-silver/90 text-sm md:text-[15px] leading-[1.85] font-light">
              {project.challenge}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════
          CREATIVE SOLUTION
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <AnimatedSection>
            <SectionLabel>Creative Solution</SectionLabel>
            <p className="text-matte-silver/90 text-sm md:text-[15px] leading-[1.85] font-light">
              {project.solution}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════
          FINAL RESULT
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <AnimatedSection>
            <SectionLabel>Final Result</SectionLabel>
            <p className="text-matte-silver/90 text-sm md:text-[15px] leading-[1.85] font-light">
              {project.result}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          GALLERY (optional — only if additionalImages exist)
          ═══════════════════════════════════════════════════════ */}
      {hasGallery && (
        <>
          <Divider />
          <section className="py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6 md:px-8">
              <AnimatedSection>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <SectionLabel>Gallery</SectionLabel>
                    <p className="text-white/30 text-xs font-light -mt-3 ml-[26px]">
                      Additional renders &amp; details
                    </p>
                  </div>
                  <span className="text-white/15 text-[11px] tracking-wider font-light">
                    {project.additionalImages!.length} images
                  </span>
                </div>
              </AnimatedSection>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {project.additionalImages!.map((img, i) => (
                  <AnimatedSection key={i} delay={i * 0.05}>
                    <button
                      onClick={() => {
                        setLightboxIndex(i)
                        setLightboxOpen(true)
                      }}
                      className="relative group overflow-hidden rounded-xl aspect-[4/3] w-full"
                    >
                      <img
                        src={img}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                          <ImageIcon className="w-5 h-5 text-white/80" />
                        </div>
                      </div>
                      {/* Electric blue border glow on hover */}
                      <div
                        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-500"
                        style={{
                          boxShadow: 'none',
                        }}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.boxShadow =
                            'inset 0 0 0 1px rgba(37,99,235,0.3), 0 4px 20px rgba(37,99,235,0.1)'
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                        }}
                      />
                    </button>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAGS
          ═══════════════════════════════════════════════════════ */}
      {project.tags && project.tags.length > 0 && (
        <>
          <Divider />
          <section className="py-10">
            <div className="max-w-5xl mx-auto px-6 md:px-8">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-[0.1em] text-white/20 border border-white/[0.06] rounded-full px-3.5 py-1.5 hover:border-electric-blue/20 hover:text-white/30 transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          RELATED PROJECTS (same category only)
          ═══════════════════════════════════════════════════════ */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-secondary">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <AnimatedSection>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/15 font-medium mb-2">
                    More in {project.category}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    Related Projects
                  </h2>
                </div>
                <button
                  onClick={() => navigate('work')}
                  className="hidden md:inline-flex items-center gap-1.5 text-electric-blue/60 text-xs font-medium hover:text-electric-blue transition-colors duration-300"
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {relatedProjects.map((rp, i) => (
                <AnimatedSection key={rp.id} delay={i * 0.05}>
                  <PortfolioCard
                    project={rp}
                    onClick={() => navigateToProject(rp.slug)}
                    index={i}
                  />
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="mt-8 md:hidden" delay={0.2}>
              <button
                onClick={() => navigate('work')}
                className="inline-flex items-center gap-1.5 text-electric-blue/60 text-xs font-medium hover:text-electric-blue transition-colors"
              >
                View All Projects
                <ArrowRight className="w-3 h-3" />
              </button>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          PREV / NEXT PROJECT NAVIGATION
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prevProject ? (
              <AnimatedSection>
                <button
                  onClick={goPrev}
                  className="group flex items-center gap-4 text-left w-full p-6 rounded-xl border border-white/[0.06] hover:border-electric-blue/20 hover:bg-white/[0.015] transition-all duration-400"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.08] group-hover:border-electric-blue/30 transition-colors duration-300 flex-shrink-0">
                    <ArrowLeft className="w-3.5 h-3.5 text-matte-silver/30 group-hover:text-electric-blue transition-colors duration-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/15 mb-1.5 font-medium">
                      Previous Project
                    </p>
                    <p className="text-white/80 text-sm font-medium truncate group-hover:text-electric-blue transition-colors duration-300">
                      {prevProject.title}
                    </p>
                    <p className="text-white/20 text-[11px] mt-1 truncate">
                      {prevProject.category}
                    </p>
                  </div>
                </button>
              </AnimatedSection>
            ) : (
              <div />
            )}

            {nextProject ? (
              <AnimatedSection delay={0.08}>
                <button
                  onClick={goNext}
                  className="group flex items-center justify-end gap-4 text-right w-full p-6 rounded-xl border border-white/[0.06] hover:border-electric-blue/20 hover:bg-white/[0.015] transition-all duration-400"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/15 mb-1.5 font-medium">
                      Next Project
                    </p>
                    <p className="text-white/80 text-sm font-medium truncate group-hover:text-electric-blue transition-colors duration-300">
                      {nextProject.title}
                    </p>
                    <p className="text-white/20 text-[11px] mt-1 truncate">
                      {nextProject.category}
                    </p>
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center rounded-full border border-white/[0.08] group-hover:border-electric-blue/30 transition-colors duration-300 flex-shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 text-matte-silver/30 group-hover:text-electric-blue transition-colors duration-300" />
                  </div>
                </button>
              </AnimatedSection>
            ) : (
              <div />
            )}
          </div>

          {/* Back to Work */}
          <AnimatedSection className="mt-8" delay={0.15}>
            <button
              onClick={() => navigate('work')}
              className="inline-flex items-center gap-2 text-white/25 text-sm font-light hover:text-white/60 transition-colors duration-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to All Projects
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-surface-secondary relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.04)_0%,transparent_65%)] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="w-10 h-px bg-electric-blue/40 mx-auto mb-8" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Ready to Create Something
              <br className="hidden md:block" /> Extraordinary?
            </h2>
            <p className="text-matte-silver/60 text-sm md:text-base mt-5 leading-relaxed font-light max-w-md mx-auto">
              Let&apos;s create a cinematic experience for your next launch.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <a
                href="https://calendly.com/salomeaicreate/sreallabs-discovery-call"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-electric-blue hover:bg-electric-blue/85 text-white text-sm font-medium px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.25)]"
              >
                Book Discovery Call
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </a>
              <button
                onClick={() => navigate('work')}
                className="border border-white/15 text-white/70 text-sm font-medium px-7 py-3.5 rounded-full hover:bg-white/[0.04] hover:text-white hover:border-white/25 transition-all duration-300"
              >
                View More Projects
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          GALLERY LIGHTBOX (portal-style overlay)
          ═══════════════════════════════════════════════════════ */}
      {lightboxOpen && hasGallery && (
        <GalleryLightbox
          images={project.additionalImages!}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}