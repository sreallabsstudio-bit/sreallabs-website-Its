'use client'

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  ExternalLink,
} from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import {
  portfolio,
  getRelatedProjects,
  getProjectBySlug,
  getProjectById,
  getProjectsByCategory,
  type PortfolioProject,
} from '@/data/portfolio'

/* ═══════════════════════════════════════════════════════════════
   PREMIUM EASING
   ═══════════════════════════════════════════════════════════════ */

const ease = [0.22, 1, 0.36, 1] as const

/* ═══════════════════════════════════════════════════════════════
   FILMSTRIP ITEM
   ═══════════════════════════════════════════════════════════════ */

function FilmstripItem({
  project,
  isActive,
  onClick,
}: {
  project: PortfolioProject
  isActive: boolean
  onClick: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (hovered && videoRef.current) {
      videoRef.current.play().catch(() => {})
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [hovered])

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-active={isActive ? 'true' : undefined}
      className={`flex-shrink-0 relative overflow-hidden transition-all duration-500 ease-out cursor-pointer ${
        isActive
          ? 'ring-2 ring-electric-blue/80 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
          : 'ring-1 ring-white/[0.08] hover:ring-white/25'
      }`}
      style={{
        aspectRatio: '16/9',
        borderRadius: '10px',
        width: isActive ? '11.5rem' : '9.5rem',
      }}
      aria-label={project.title}
    >
      {/* Base: thumbnail */}
      <img
        src={project.thumbnail}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-600"
        style={{ opacity: hovered ? 0 : 1 }}
        loading="lazy"
      />
      {/* Hover: video preview */}
      <video
        ref={videoRef}
        src={project.video}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-600"
        style={{ opacity: hovered ? 1 : 0 }}
      />
      {/* Bottom gradient + label */}
      <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 pointer-events-none">
        <p
          className={`font-medium truncate transition-colors duration-300 ${
            isActive
              ? 'text-electric-blue text-[10px] md:text-[11px]'
              : 'text-white/70 text-[9px] md:text-[10px]'
          }`}
        >
          {project.title}
        </p>
        {!isActive && (
          <p className="text-white/30 text-[8px] md:text-[9px] mt-0.5 truncate">
            {project.category}
          </p>
        )}
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CTA BUTTON
   ═══════════════════════════════════════════════════════════════ */

function BookCTA() {
  return (
    <a
      href="https://calendly.com/salomeaicreate/sreallabs-discovery-call"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-electric-blue hover:bg-electric-blue/85 text-white text-xs font-medium px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
    >
      Book Similar Project
      <ExternalLink className="w-3 h-3 opacity-70" />
    </a>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO VIEWER
   ═══════════════════════════════════════════════════════════════ */

export default function ProjectViewer() {
  const {
    selectedProjectId,
    selectedProjectSlug,
    closeProject,
    openProject,
    replaceProject,
  } = useNavigation()

  // Resolve project
  const project = useMemo(() => {
    if (selectedProjectId) return getProjectById(selectedProjectId)
    if (selectedProjectSlug) return getProjectBySlug(selectedProjectSlug)
    return undefined
  }, [selectedProjectId, selectedProjectSlug])

  const isViewerOpen = !!project
  const projectIndex = project
    ? portfolio.findIndex((p) => p.id === project.id)
    : -1

  // ─── Local UI state ───
  const [isMuted, setIsMuted] = useState(true)
  const [animDirection, setAnimDirection] = useState(0)
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const filmstripRef = useRef<HTMLDivElement>(null)
  const viewerScrollRef = useRef<HTMLDivElement>(null)

  // ─── Touch tracking for mobile swipe ───
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isSwiping = useRef(false)

  // ─── Track if this is the first project in this viewer session ───
  const isFirstOpen = useRef(true)

  // ─── Filmstrip: same-category first, then fill from others ───
  const filmstripProjects = useMemo(() => {
    if (!project) return []
    const cat = project.category as 'All' | '3D Product Animation' | 'Beauty' | 'Technology' | 'Luxury' | 'SaaS' | 'AI UGC'
    const sameCategory = getProjectsByCategory(cat).filter(
      (p) => p.id !== project.id
    )
    const others = portfolio.filter(
      (p) =>
        p.id !== project.id &&
        !sameCategory.find((s) => s.id === p.id) &&
        !p.id.startsWith('featured')
    )
    const shuffled = [...others].sort(() => Math.random() - 0.5)
    return [...sameCategory, ...shuffled].slice(0, 10)
  }, [project])

  // ─── Related projects: same category, not duplicated with filmstrip ───
  const relatedProjects = useMemo(() => {
    if (!project) return []
    const cat = project.category as 'All' | '3D Product Animation' | 'Beauty' | 'Technology' | 'Luxury' | 'SaaS' | 'AI UGC'
    const all = getProjectsByCategory(cat).filter((p) => p.id !== project.id)
    const manualRelated = getRelatedProjects(project)
    const combined = [
      ...new Map([...manualRelated, ...all].map((p) => [p.id, p])).values(),
    ]
    const filmstripIds = new Set(filmstripProjects.slice(0, 5).map((p) => p.id))
    return combined.filter((p) => !filmstripIds.has(p.id)).slice(0, 4)
  }, [project, filmstripProjects])

  // ─── Push history + URL when opening the first project ───
  useEffect(() => {
    if (!project) return
    const url = `/work/${project.slug}`
    if (isFirstOpen.current) {
      // First open: push a new history entry
      window.history.pushState(
        { type: 'project', projectId: project.id },
        '',
        url
      )
      isFirstOpen.current = false
    } else {
      // Navigating between projects: replace current entry
      window.history.replaceState(
        { type: 'project', projectId: project.id },
        '',
        url
      )
    }
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset first-open flag when viewer closes
  useEffect(() => {
    if (!isViewerOpen) {
      isFirstOpen.current = true
    }
  }, [isViewerOpen])

  // ─── Navigate to a project (with animation direction) ───
  const navigateToProject = useCallback(
    (targetProject: PortfolioProject, direction: number) => {
      setAnimDirection(direction)
      setIsMuted(true)
      replaceProject(targetProject.id)
    },
    [replaceProject]
  )

  // ─── Initial open (from grid card click) ───
  const handleInitialOpen = useCallback(
    (projectId: string) => {
      setAnimDirection(0)
      setIsMuted(true)
      openProject(projectId)
    },
    [openProject]
  )

  const goPrev = useCallback(() => {
    if (projectIndex > 0) {
      setAnimDirection(-1)
      setIsMuted(true)
      replaceProject(portfolio[projectIndex - 1].id)
    }
  }, [projectIndex, replaceProject])

  const goNext = useCallback(() => {
    if (projectIndex < portfolio.length - 1) {
      setAnimDirection(1)
      setIsMuted(true)
      replaceProject(portfolio[projectIndex + 1].id)
    }
  }, [projectIndex, replaceProject])

  // ─── Close handler: back to page via history ───
  const handleClose = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      // No history to go back to (e.g. direct URL load)
      window.history.replaceState(null, '', '/work')
      closeProject()
    }
  }, [closeProject])

  // ─── Keyboard navigation ───
  useEffect(() => {
    if (!isViewerOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isViewerOpen, handleClose, goPrev, goNext])

  // ─── Popstate: handle back/forward and deep links ───
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state
      if (state?.type === 'project' && state.projectId) {
        // Navigating back/forward to a project
        const proj = getProjectById(state.projectId)
        if (proj) {
          setAnimDirection(0)
          setIsMuted(true)
          // Use setState directly to avoid pushing history again
          useNavigation.setState({
            selectedProjectId: state.projectId,
            selectedProjectSlug: null,
          })
          isFirstOpen.current = false
        }
      } else {
        // Navigating away from the viewer — close it
        closeProject()
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [closeProject])

  // ─── Deep link: resolve /work/slug on page load ───
  useEffect(() => {
    if (typeof window === 'undefined') return
    const path = window.location.pathname
    if (path.startsWith('/work/')) {
      const slug = path.replace('/work/', '')
      const found = getProjectBySlug(decodeURIComponent(slug))
      if (found) {
        window.history.replaceState(
          { type: 'project', projectId: found.id },
          '',
          path
        )
        useNavigation.setState({
          selectedProjectId: found.id,
          selectedProjectSlug: null,
          previousPage: 'work',
        })
        isFirstOpen.current = false // Already has history from replaceState
        document.body.style.overflow = 'hidden'
      }
    }
  }, [])

  // ─── Scroll filmstrip to active item ───
  useEffect(() => {
    if (!filmstripRef.current || !project) return
    const activeEl = filmstripRef.current.querySelector('[data-active="true"]')
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [project])

  // ─── Scroll viewer to top on project change ───
  useEffect(() => {
    if (viewerScrollRef.current) {
      viewerScrollRef.current.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [project?.id])

  // ─── Preload next project video for smooth transitions ───
  useEffect(() => {
    if (projectIndex < 0 || projectIndex >= portfolio.length - 1) return
    const nextVideo = portfolio[projectIndex + 1].video
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.as = 'video'
    link.href = nextVideo
    document.head.appendChild(link)
    return () => {
      try { document.head.removeChild(link) } catch {}
    }
  }, [projectIndex])

  // ─── Touch handlers for mobile swipe ───
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      isSwiping.current = true
    }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -60) goNext()
    else if (dx > 60) goPrev()
  }

  // ─── Project counter ───
  const projectNumber = projectIndex >= 0 ? projectIndex + 1 : 0
  const totalProjects = portfolio.filter(p => !p.id.startsWith('featured')).length

  return (
    <AnimatePresence>
      {isViewerOpen && project && (
        <motion.div
          key="portfolio-viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease }}
          className="fixed inset-0 z-[100] bg-black flex flex-col"
          ref={viewerScrollRef}
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* ═══════════════════════════════════════════════
              TOP BAR: Close + Counter + Mute
              ═══════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3, ease }}
            className="flex-shrink-0 flex items-center justify-between px-5 md:px-8 h-12 z-[110]"
          >
            {/* Left: counter */}
            <div className="flex items-center gap-3">
              <span className="text-white/20 text-[11px] font-mono tabular-nums">
                {String(projectNumber).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}
              </span>
              <div className="w-px h-3 bg-white/10" />
              <span className="text-white/30 text-[10px] uppercase tracking-[0.15em] hidden sm:inline">
                {project.category}
              </span>
            </div>

            {/* Right: mute + close */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all duration-300"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
                aria-label="Close project viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════
              SECTION 1: CINEMATIC VIDEO
              ═══════════════════════════════════════════════ */}
          <AnimatePresence mode="wait" custom={animDirection}>
            <motion.div
              key={project.id}
              custom={animDirection}
              variants={{
                enter: (dir: number) => ({
                  opacity: 0,
                  scale: 0.985,
                  transition: { duration: 0.25, ease },
                }),
                center: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.35, ease },
                },
                exit: {
                  opacity: 0,
                  scale: 0.985,
                  transition: { duration: 0.2, ease },
                },
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex-shrink-0 w-full"
            >
              <div
                className="w-full mx-auto bg-black"
                style={{
                  maxWidth: '1400px',
                  aspectRatio: '16/9',
                  borderRadius: '0',
                  overflow: 'hidden',
                }}
              >
                <video
                  ref={mainVideoRef}
                  key={project.video}
                  src={project.video}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════
              SECTION 2: PROJECT INFORMATION
              ═══════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${project.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, delay: 0.1, ease }}
              className="w-full max-w-5xl mx-auto px-5 md:px-8 pt-7 md:pt-9 pb-5"
            >
              {/* Title + CTA row */}
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-[28px] font-semibold text-white tracking-tight leading-tight">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-2.5 mt-2.5">
                    <span className="text-electric-blue text-[11px] font-medium">
                      {project.category}
                    </span>
                    <span className="text-white/15">·</span>
                    <span className="text-matte-silver/80 text-[11px]">
                      {project.industry}
                    </span>
                    {project.year && (
                      <>
                        <span className="text-white/15">·</span>
                        <span className="text-matte-silver/50 text-[11px]">
                          {project.year}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 hidden md:block">
                  <BookCTA />
                </div>
              </div>

              {/* Description */}
              <p className="text-matte-silver text-[13px] md:text-sm leading-[1.7] mt-5 max-w-3xl">
                {project.description}
              </p>

              {/* Service + Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-[9px] uppercase tracking-[0.12em] text-white/50 font-medium border border-white/[0.08] rounded-full px-3 py-1">
                  {project.service}
                </span>
                {project.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-[0.12em] text-matte-silver/40 border border-white/[0.04] rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="mt-5 md:hidden">
                <BookCTA />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════
              SECTION 3: HORIZONTAL FILMSTRIP
              ═══════════════════════════════════════════════ */}
          <AnimatePresence>
            <motion.div
              key={`filmstrip-${project.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, delay: 0.2, ease }}
              className="w-full flex-shrink-0 py-5"
            >
              <div className="max-w-5xl mx-auto px-5 md:px-8 mb-3.5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-medium">
                  Continue Exploring
                </p>
              </div>

              <div
                ref={filmstripRef}
                className="flex gap-3 overflow-x-auto px-5 md:px-8 pb-2 scrollbar-hide"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {filmstripProjects.map((fp) => (
                  <FilmstripItem
                    key={fp.id}
                    project={fp}
                    isActive={fp.id === project.id}
                    onClick={() => navigateToProject(fp, 1)}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════
              SECTION 4: RELATED PROJECTS
              ═══════════════════════════════════════════════ */}
          {relatedProjects.length > 0 && (
            <AnimatePresence>
              <motion.div
                key={`related-${project.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.3, ease }}
                className="w-full max-w-5xl mx-auto px-5 md:px-8 pt-3 pb-14"
              >
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-medium mb-3.5">
                  More in {project.category}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {relatedProjects.map((rp) => (
                    <button
                      key={rp.id}
                      onClick={() => navigateToProject(rp, 1)}
                      className="relative overflow-hidden group/rel cursor-pointer text-left"
                      style={{ aspectRatio: '16/9', borderRadius: '10px' }}
                      aria-label={rp.title}
                    >
                      <img
                        src={rp.thumbnail}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/rel:scale-[1.04]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/rel:opacity-100 transition-opacity duration-400" />
                      <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2.5 pointer-events-none opacity-0 group-hover/rel:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-[10px] md:text-[11px] font-medium truncate">
                          {rp.title}
                        </p>
                        <p className="text-white/40 text-[8px] md:text-[9px] mt-0.5">
                          {rp.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* ═══════════════════════════════════════════════
              PREV / NEXT NAVIGATION (overlay)
              ═══════════════════════════════════════════════ */}
          {projectIndex > 0 && (
            <button
              onClick={goPrev}
              className="fixed left-3 md:left-5 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-white/25 hover:text-white/70 transition-all duration-300 backdrop-blur-sm"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {projectIndex < portfolio.length - 1 && (
            <button
              onClick={goNext}
              className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-white/25 hover:text-white/70 transition-all duration-300 backdrop-blur-sm"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}