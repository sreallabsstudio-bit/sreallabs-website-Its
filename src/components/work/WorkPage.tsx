'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import {
  portfolio,
  portfolioCategories,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectById,
  type PortfolioCategory,
  type PortfolioProject,
} from '@/data/portfolio'
import { useNavigation } from '@/store/navigation'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SectionHeading from '@/components/shared/SectionHeading'
import PortfolioCard from '@/components/shared/PortfolioCard'

const creativeCollections = [
  {
    title: 'Product Cinema',
    description: 'Our finest 3D product animations',
    category: 'Consumer Electronics' as PortfolioCategory,
    icon: '🎬',
  },
  {
    title: 'Industrial Precision',
    description: 'Enterprise and hardware visualization',
    category: 'Industrial Hardware' as PortfolioCategory,
    icon: '⚙️',
  },
  {
    title: 'Digital Luxury',
    description: 'Premium content for luxury brands',
    category: 'Luxury Products' as PortfolioCategory,
    icon: '💎',
  },
]

/**
 * Featured Lead Card — wider cinematic format for the hero project.
 * Uses the same video-dominant design language as PortfolioCard
 * but with a 21:9 ultra-wide aspect ratio.
 */
function FeaturedLeadCard({ project, onClick }: { project: PortfolioProject; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{ aspectRatio: '21/9' }}
      onMouseEnter={() => {
        setIsHovered(true)
        if (videoRef.current && window.matchMedia('(hover: hover)').matches) {
          videoRef.current.play().catch(() => {})
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      aria-label={`View ${project.title}`}
    >
      {/* Thumbnail base */}
      <img
        src={project.thumbnail}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: isHovered && isLoaded ? 0 : 1 }}
      />
      {/* Hover video */}
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
      {/* Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
      {/* Electric blue glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
        style={{
          boxShadow: isHovered
            ? '0 0 0 1px rgba(37,99,235,0.25), 0 8px 50px rgba(37,99,235,0.12)'
            : 'none',
        }}
      />
      {/* Text — bottom-left */}
      <div className="absolute bottom-0 left-0 p-5 md:p-8 pointer-events-none">
        <span className="text-acid-lime text-[10px] font-medium uppercase tracking-wider">
          Featured
        </span>
        <h3
          className="text-white text-lg md:text-xl lg:text-2xl font-semibold mt-1.5 transition-all duration-500"
          style={{ color: isHovered ? '#ffffff' : 'rgba(255,255,255,0.95)' }}
        >
          {project.title}
        </h3>
        <p
          className="text-[11px] md:text-xs mt-1.5 transition-colors duration-500"
          style={{
            color: isHovered ? '#2563EB' : 'rgba(161,161,170,0.7)',
          }}
        >
          {project.category} · {project.industry}
        </p>
      </div>
      {/* View Project badge — top-right */}
      <div
        className="absolute top-4 right-4 transition-all duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(-4px)',
        }}
      >
        <span className="text-electric-blue text-[10px] md:text-xs font-medium bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/[0.06]">
          View Project
        </span>
      </div>
    </div>
  )
}

export default function WorkPage() {
  const { navigate, navigateToProject } = useNavigation()
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('All')
  const filterRef = useRef<HTMLDivElement>(null)

  const workFeaturedLead = getProjectById('featured-new')
  const featuredProjectsRest = getFeaturedProjects()
    .filter((p) => p.id !== 'featured-new')
    .slice(0, 2)
  const filteredProjects = getProjectsByCategory(activeCategory)

  const scrollToFilters = (cat: PortfolioCategory) => {
    setActiveCategory(cat)
    filterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="pt-[72px]">
      {/* ===== HERO ===== */}
      <section className="py-16 md:py-24 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <p className="text-electric-blue text-xs uppercase tracking-[0.2em] font-medium">Our Portfolio</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mt-4">
              Work
            </h1>
            <p className="text-matte-silver text-base md:text-lg mt-4 max-w-xl leading-relaxed">
              Every project is a story. Here are ours. Explore our complete collection of premium product films, cinematic animations, and visual storytelling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED STORIES ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Featured Stories"
            subtitle="Handpicked projects that showcase our creative range"
          />

          {/* Full-width cinematic lead */}
          {workFeaturedLead && (
            <AnimatedSection className="mt-8">
              <FeaturedLeadCard
                project={workFeaturedLead}
                onClick={() => navigateToProject(workFeaturedLead.slug)}
              />
            </AnimatedSection>
          )}

          {/* Next 2 — standard cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-4 md:mt-5">
            {featuredProjectsRest.map((p, i) => (
              <AnimatedSection key={p.id} delay={0.05 * (i + 1)}>
                <PortfolioCard
                  project={p}
                  onClick={() => navigateToProject(p.slug)}
                  index={i}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BROWSE BY SERVICE ===== */}
      <section ref={filterRef} className="py-14 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Browse by Industry"
            subtitle="Explore our work by the industries and markets we serve"
          />

          {/* Filter Pills */}
          <AnimatedSection className="mt-6" delay={0.1}>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {portfolioCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-electric-blue text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                      : 'bg-surface-card text-matte-silver hover:bg-surface-elevated hover:text-white border border-white/[0.06]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Project Count */}
          <p className="text-matte-silver text-sm mt-4">
            Showing <span className="text-white font-medium">{filteredProjects.length}</span> projects
          </p>

          {/* Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-4">
            {filteredProjects.map((p, i) => (
              <PortfolioCard
                key={p.id}
                project={p}
                onClick={() => navigateToProject(p.slug)}
                index={i}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-matte-silver text-sm">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== CREATIVE COLLECTIONS ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Creative Collections"
            subtitle="Curated groups of our best work by industry"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mt-8">
            {creativeCollections.map((collection, i) => {
              const projects = getProjectsByCategory(collection.category).slice(0, 3)
              return (
                <AnimatedSection key={collection.title} delay={i * 0.1}>
                  <div
                    className="bg-surface-card rounded-xl border border-white/[0.06] hover:border-electric-blue/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all cursor-pointer overflow-hidden"
                    onClick={() => scrollToFilters(collection.category)}
                  >
                    {/* Preview thumbnails */}
                    <div className="grid grid-cols-3 gap-0.5 h-28 overflow-hidden">
                      {projects.map((p) => (
                        <div key={p.id} className="relative">
                          <video
                            src={p.video}
                            muted loop playsInline preload="none"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium text-base">{collection.title}</h3>
                          <p className="text-matte-silver text-xs mt-1">{collection.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-matte-silver group-hover:text-electric-blue transition-colors flex-shrink-0" />
                      </div>
                      <p className="text-electric-blue text-xs font-medium mt-3">
                        {getProjectsByCategory(collection.category).length} projects →
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Have a Project in Mind?
            </h2>
            <p className="text-matte-silver mt-4 text-sm md:text-base leading-relaxed">
              Let&apos;s bring your vision to life with cinematic quality and creative precision. Every project starts with a conversation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <button
                onClick={() => navigate('contact')}
                className="bg-electric-blue text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-electric-blue/90 transition-colors inline-flex items-center gap-2"
              >
                Start a Project <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://calendly.com/salomeaicreate/sreallabs-discovery-call"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/20 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-white/5 transition-colors"
              >
                Book a Call First
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}