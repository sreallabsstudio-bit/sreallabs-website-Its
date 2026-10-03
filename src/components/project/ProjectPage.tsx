'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { useNavigation } from '@/store/navigation'
import { useProjectsStore, selectBySlug } from '@/store/projects'
import YouTubeEmbed from '@/components/shared/YouTubeEmbed'
import AnimatedSection from '@/components/shared/AnimatedSection'
import PortfolioCard from '@/components/shared/PortfolioCard'

const ease = [0.22, 1, 0.36, 1] as const

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
        {label}
      </p>
      <p className="mt-1 text-sm text-white/70">
        {value}
      </p>
    </div>
  )
}

function GalleryLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[]
  initialIndex: number
  onClose: () => void
}) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  const previous = () => {
    setActiveIndex((index) =>
      index === 0 ? images.length - 1 : index - 1
    )
  }

  const next = () => {
    setActiveIndex((index) =>
      index === images.length - 1 ? 0 : index + 1
    )
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
        aria-label="Close gallery"
      >
        <X className="w-4 h-4" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(event) => {
              event.stopPropagation()
              previous()
            }}
            className="absolute left-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation()
              next()
            }}
            className="absolute right-5 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <img
        src={images[activeIndex]}
        alt=""
        className="max-w-[88vw] max-h-[82vh] object-contain rounded-xl"
        onClick={(event) => event.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}

export default function ProjectPage({
  slugOverride,
}: {
  slugOverride?: string
}) {
  const {
    currentProjectSlug,
    navigate,
    navigateToProject,
  } = useNavigation()

  const projects = useProjectsStore((state) => state.projects)
  const status = useProjectsStore((state) => state.status)
  const fetchProjects = useProjectsStore((state) => state.fetchProjects)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const slug = slugOverride ?? currentProjectSlug
  const project = selectBySlug(projects, slug)

  const loading =
    status === 'idle' || status === 'loading'

  const projectIndex = project
    ? projects.findIndex((item) => item.id === project.id)
    : -1

  const previousProject =
    projectIndex > 0
      ? projects[projectIndex - 1]
      : null

  const nextProject =
    projectIndex >= 0 &&
    projectIndex < projects.length - 1
      ? projects[projectIndex + 1]
      : null

  const relatedProjects = useMemo(() => {
    if (!project) return []

    const sameCategory = project.categoryId
      ? projects.filter(
          (item) =>
            item.id !== project.id &&
            item.categoryId === project.categoryId
        )
      : []

    const otherProjects = projects.filter(
      (item) =>
        item.id !== project.id &&
        !sameCategory.includes(item)
    )

    return [...sameCategory, ...otherProjects].slice(0, 8)
  }, [project, projects])

  if (!project) {
    return (
      <main className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <p className="text-electric-blue text-sm">
            {loading ? 'Loading project...' : 'Project not found'}
          </p>

          {!loading && (
            <button
              onClick={() => navigate('work')}
              className="mt-4 text-white/50 hover:text-white transition"
            >
              ← Back to Work
            </button>
          )}
        </div>
      </main>
    )
  }

  const gallery =
    project.additionalImages &&
    project.additionalImages.length > 0
      ? project.additionalImages
      : []

  return (
    <main className="bg-obsidian">

      {/* HERO */}
      <section className="pt-20 md:pt-24">
        <div className="max-w-6xl mx-auto px-6">

          <AnimatedSection>
            <button
              onClick={() => navigate('work')}
              className="inline-flex items-center gap-2 text-white/35 text-sm hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Work
            </button>
          </AnimatedSection>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mt-8"
          >
            <p className="text-electric-blue text-[10px] uppercase tracking-[0.2em] font-medium">
              {project.categoryName || project.service || '3D Project'}
            </p>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mt-3 max-w-5xl">
              {project.title}
            </h1>
          </motion.div>

        </div>
      </section>

      {/* VIDEO */}
      <section className="pt-10 md:pt-14">
        <div className="max-w-6xl mx-auto px-6">

          <AnimatedSection>
            <div className="relative overflow-hidden rounded-2xl bg-black">
              {project.youtubeVideoId ? (
                <YouTubeEmbed
                  videoId={project.youtubeVideoId}
                  title={project.title}
                  posterUrl={project.thumbnailUrl}
                  className="w-full"
                />
              ) : project.legacyVideoUrl ? (
                <video
                  src={project.legacyVideoUrl}
                  controls
                  playsInline
                  className="w-full aspect-video object-cover"
                />
              ) : project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="aspect-video bg-surface-card flex items-center justify-center">
                  <p className="text-white/30 text-sm">
                    Project preview unavailable
                  </p>
                </div>
              )}
            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* PROJECT INFO */}
      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6">

          <AnimatedSection>
            <div className="border-y border-white/[0.06] py-7">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-7">

                {project.client && (
                  <InfoItem
                    label="Client"
                    value={project.client}
                  />
                )}

                {project.industry && (
                  <InfoItem
                    label="Industry"
                    value={project.industry}
                  />
                )}

                {(project.categoryName || project.service) && (
                  <InfoItem
                    label="Category"
                    value={
                      project.categoryName ||
                      project.service ||
                      ''
                    }
                  />
                )}

                {project.year && (
                  <InfoItem
                    label="Year"
                    value={project.year}
                  />
                )}

              </div>

              {project.googleDriveUrl && (
                <div className="mt-7">
                  <a
                    href={project.googleDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-electric-blue/30 text-electric-blue px-5 py-2.5 rounded-full text-sm hover:bg-electric-blue/10 transition"
                  >
                    View Full Sample
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* OVERVIEW */}
      {(project.fullDescription || project.description) && (
        <section className="pb-16 md:pb-24">
          <div className="max-w-3xl mx-auto px-6">

            <AnimatedSection>
              <p className="text-electric-blue text-[10px] uppercase tracking-[0.2em] font-medium mb-4">
                Overview
              </p>

              <p className="text-white/65 text-sm md:text-base leading-8">
                {project.fullDescription ||
                  project.description}
              </p>
            </AnimatedSection>

          </div>
        </section>
      )}

      {/* GALLERY */}
      {gallery.length > 0 && (
        <section className="py-16 md:py-24 border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6">

            <AnimatedSection>
              <p className="text-electric-blue text-[10px] uppercase tracking-[0.2em] font-medium mb-3">
                Gallery
              </p>

              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                More from the project
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              {gallery.map((image, index) => (
                <AnimatedSection
                  key={index}
                  delay={Math.min(index * 0.05, 0.2)}
                >
                  <button
                    onClick={() => {
                      setLightboxIndex(index)
                      setLightboxOpen(true)
                    }}
                    className="group overflow-hidden rounded-xl aspect-[4/3] w-full"
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </button>
                </AnimatedSection>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* RELATED PROJECTS */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-secondary">
          <div className="max-w-7xl mx-auto px-6">

            <AnimatedSection>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-white/25 text-[10px] uppercase tracking-[0.2em]">
                    More Work
                  </p>

                  <h2 className="text-2xl md:text-3xl font-semibold text-white mt-2">
                    Related Projects
                  </h2>
                </div>

                <button
                  onClick={() => navigate('work')}
                  className="hidden md:inline-flex items-center gap-2 text-electric-blue text-xs hover:text-white transition"
                >
                  View All
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProjects.map((item, index) => (
                <AnimatedSection
                  key={item.id}
                  delay={Math.min(index * 0.05, 0.2)}
                >
                  <PortfolioCard
                    project={item}
                    onClick={() =>
                      navigateToProject(item.slug)
                    }
                    index={index}
                  />
                </AnimatedSection>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* PREVIOUS / NEXT */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">

          <div className="grid md:grid-cols-2 gap-4">

            {previousProject ? (
              <button
                onClick={() =>
                  navigateToProject(
                    previousProject.slug
                  )
                }
                className="group text-left p-6 rounded-xl border border-white/[0.06] hover:border-electric-blue/25 transition"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                  Previous Project
                </p>

                <p className="text-white/80 text-sm mt-2 group-hover:text-electric-blue transition">
                  {previousProject.title}
                </p>
              </button>
            ) : (
              <div />
            )}

            {nextProject ? (
              <button
                onClick={() =>
                  navigateToProject(nextProject.slug)
                }
                className="group text-right p-6 rounded-xl border border-white/[0.06] hover:border-electric-blue/25 transition"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                  Next Project
                </p>

                <p className="text-white/80 text-sm mt-2 group-hover:text-electric-blue transition">
                  {nextProject.title}
                </p>
              </button>
            ) : (
              <div />
            )}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6 text-center">

          <AnimatedSection>
            <p className="text-electric-blue text-[10px] uppercase tracking-[0.2em] font-medium">
              Start a Project
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
              Have a 3D project in mind?
            </h2>

            <p className="text-white/50 text-sm md:text-base mt-4">
              Tell us what you are creating and let&apos;s
              bring it to life.
            </p>

            <button
              onClick={() => navigate('contact')}
              className="mt-7 inline-flex items-center gap-2 bg-electric-blue text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-electric-blue/90 transition"
            >
              Start a Project
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </AnimatedSection>

        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxOpen && gallery.length > 0 && (
        <GalleryLightbox
          images={gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

    </main>
  )
}