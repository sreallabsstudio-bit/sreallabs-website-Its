'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
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
    category: '3D Product Animation' as PortfolioCategory,
    icon: '🎬',
  },
  {
    title: 'AI Stories',
    description: 'AI-powered commercials and UGC',
    category: 'AI UGC' as PortfolioCategory,
    icon: '✨',
  },
  {
    title: 'Digital Luxury',
    description: 'Premium content for luxury brands',
    category: 'Luxury' as PortfolioCategory,
    icon: '💎',
  },
]

function MiniPortfolioCard({ project, onClick }: { project: PortfolioProject; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  return (
    <div
      className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group"
      onMouseEnter={() => { if (videoRef.current && window.matchMedia('(hover: hover)').matches) videoRef.current.play().catch(() => {}) }}
      onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 } }}
      onClick={onClick}
    >
      <video ref={videoRef} src={project.video} muted loop playsInline preload="none" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-3 md:p-4 pointer-events-none">
        <h3 className="text-white font-medium text-xs md:text-sm">{project.title}</h3>
        <p className="text-matte-silver text-[10px] md:text-xs mt-0.5">{project.category}</p>
      </div>
    </div>
  )
}

export default function WorkPage() {
  const { navigate, openProject } = useNavigation()
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('All')
  const filterRef = useRef<HTMLDivElement>(null)

  const workFeaturedLead = getProjectById('featured-new')
  const featuredProjectsRest = getFeaturedProjects().slice(0, 2)
  const filteredProjects = getProjectsByCategory(activeCategory)

  const scrollToFilters = (cat: PortfolioCategory) => {
    setActiveCategory(cat)
    filterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="pt-16">
      {/* ===== HERO ===== */}
      <section className="py-20 md:py-28 bg-obsidian">
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
              Every project is a story. Here are ours. Explore our complete collection of cinematic 3D animations, AI commercials, and creative projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED STORIES ===== */}
      <section className="py-16 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Featured Stories"
            subtitle="Handpicked projects that showcase our creative range"
          />

          {/* First project - full width */}
          {workFeaturedLead && (
            <AnimatedSection className="mt-10">
              <div
                className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-xl cursor-pointer group"
                onClick={() => openProject(workFeaturedLead.id)}
              >
                <video
                  src={workFeaturedLead.video}
                  muted loop playsInline preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover"
                  onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                  onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10 pointer-events-none">
                  <span className="text-acid-lime text-xs font-medium uppercase tracking-wider">Featured</span>
                  <h3 className="text-white text-xl md:text-2xl font-semibold mt-2">{workFeaturedLead.title}</h3>
                  <p className="text-matte-silver text-sm mt-1">{workFeaturedLead.category} · {workFeaturedLead.industry}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-electric-blue text-xs font-medium bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">View Project</span>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Next 2 - side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            {featuredProjectsRest.map((p) => (
              <AnimatedSection key={p.id}>
                <div
                  className="relative aspect-video overflow-hidden rounded-xl cursor-pointer group"
                  onClick={() => openProject(p.id)}
                >
                  <video
                    src={p.video}
                    muted loop playsInline preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                    onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-5 pointer-events-none">
                    <h3 className="text-white text-sm md:text-base font-medium">{p.title}</h3>
                    <p className="text-matte-silver text-[10px] md:text-xs mt-0.5">{p.category} · {p.industry}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BROWSE BY SERVICE ===== */}
      <section ref={filterRef} className="py-16 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Browse by Service"
            subtitle="Filter our work by category to find exactly what you need"
          />

          {/* Filter Pills */}
          <AnimatedSection className="mt-8" delay={0.1}>
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
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
          <p className="text-matte-silver text-sm mt-6">
            Showing <span className="text-white font-medium">{filteredProjects.length}</span> projects
          </p>

          {/* Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                >
                  <PortfolioCard
                    project={p}
                    onClick={() => openProject(p.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-matte-silver text-sm">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== CREATIVE COLLECTIONS ===== */}
      <section className="py-16 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Creative Collections"
            subtitle="Curated groups of our best work by theme"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-10">
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
      <section className="py-16 md:py-20 bg-surface-secondary relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Have a Project in Mind?
            </h2>
            <p className="text-matte-silver mt-4 text-sm md:text-base leading-relaxed">
              Let&apos;s bring your vision to life with cinematic quality and creative precision. Every project starts with a conversation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
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