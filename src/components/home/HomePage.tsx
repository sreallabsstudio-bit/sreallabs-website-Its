'use client'

import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, Film, Layers, Monitor } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { useNavigation } from '@/store/navigation'
import { useProjectsStore } from '@/store/projects'
import { useSiteContentStore, contentValue } from '@/store/site-content'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SectionHeading from '@/components/shared/SectionHeading'
import PortfolioCard from '@/components/shared/PortfolioCard'

const capabilities = [
  {
    icon: Film,
    title: '3D Animation',
    description: 'Cinematic motion designed to make ideas come alive.',
  },
  {
    icon: Eye,
    title: '3D Visualization',
    description: 'Photorealistic visuals with detail, depth, and atmosphere.',
  },
  {
    icon: Layers,
    title: 'CGI & Visual Design',
    description: 'High-end digital visuals for products, brands, and concepts.',
  },
  {
    icon: Monitor,
    title: 'Motion Design',
    description: 'Clear, engaging motion for modern visual experiences.',
  },
]

export default function HomePage() {
  const { navigate, navigateToProject } = useNavigation()

  const projects = useProjectsStore((s) => s.projects)
  const fetchProjects = useProjectsStore((s) => s.fetchProjects)

  const content = useSiteContentStore((s) => s.content)
  const fetchSiteContent = useSiteContentStore((s) => s.fetchSiteContent)

  useEffect(() => {
    fetchProjects()
    fetchSiteContent()
  }, [fetchProjects, fetchSiteContent])

  const selectedWork = useMemo(() => {
    const featured = projects.filter((project) => project.featured)

    if (featured.length > 0) {
      return featured.slice(0, 6)
    }

    return projects.slice(0, 6)
  }, [projects])

  return (
    <div className="bg-obsidian">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <video
            src={siteConfig.assets.heroShowreel}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-screen max-w-7xl mx-auto items-center px-6">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-electric-blue text-xs uppercase tracking-[0.25em] font-medium"
            >
              SREALLABS
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              {contentValue(content, 'home.hero.heading')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-matte-silver md:text-lg"
            >
              {contentValue(content, 'home.hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-7"
            >
              <button
                onClick={() => navigate('work')}
                className="inline-flex items-center gap-2 rounded-full bg-electric-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-electric-blue/90"
              >
                {contentValue(content, 'home.hero.cta')}
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <SectionHeading
              title="Selected Work"
              subtitle="A selection of 3D animation, visualization, and visual storytelling."
            />
          </AnimatedSection>

          {selectedWork.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {selectedWork.map((project, index) => (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  onClick={() => navigateToProject(project.slug)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-white/[0.06] bg-surface-card p-10 text-center">
              <p className="text-sm text-matte-silver">
                Projects will appear here once they are published.
              </p>
            </div>
          )}

          <AnimatedSection className="mt-8">
            <button
              onClick={() => navigate('work')}
              className="inline-flex items-center gap-2 text-sm font-medium text-electric-blue transition-all hover:gap-3"
            >
              View All Work
              <ArrowRight className="h-4 w-4" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="bg-surface-secondary py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <SectionHeading
              title="Capabilities"
              subtitle="3D work built around strong visuals, motion, and detail."
            />
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, index) => {
              const Icon = item.icon

              return (
                <AnimatedSection key={item.title} delay={index * 0.08}>
                  <div className="h-full rounded-2xl border border-white/[0.06] bg-surface-card p-6 transition-all duration-300 hover:border-electric-blue/30">
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-electric-blue/10">
                      <Icon className="h-5 w-5 text-electric-blue" />
                    </div>

                    <h3 className="text-base font-medium text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-matte-silver">
                      {item.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>

          <AnimatedSection className="mt-8">
            <button
              onClick={() => navigate('services')}
              className="inline-flex items-center gap-2 text-sm font-medium text-electric-blue transition-all hover:gap-3"
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
          <AnimatedSection>
            <div className="relative">
              <img
                src={siteConfig.assets.founderPhoto}
                alt="Salome, founder of SREALLABS"
                className="aspect-[3/4] w-full rounded-2xl object-cover"
              />

              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-electric-blue/20" />
            </div>
          </AnimatedSection>

          <div>
            <AnimatedSection>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-electric-blue">
                About SREALLABS
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Built around 3D.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-matte-silver md:text-base">
                SREALLABS is a 3D studio creating animation, visualization,
                and visual experiences for products, brands, and ideas.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-matte-silver md:text-base">
                Founded by Salome, the studio brings together creative
                direction, visual design, motion, and 3D craft to create work
                that feels clear, cinematic, and memorable.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.15} className="mt-7">
              <button
                onClick={() => navigate('about')}
                className="inline-flex items-center gap-2 text-sm font-medium text-electric-blue transition-all hover:gap-3"
              >
                Meet Salome
                <ArrowRight className="h-4 w-4" />
              </button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-surface-secondary py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <AnimatedSection>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-electric-blue">
              Start a Project
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Have something worth visualizing?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-matte-silver md:text-base">
              Let&apos;s turn your idea into a strong 3D visual experience.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mt-7">
            <a
              href={
                contentValue(content, 'contact.calendlyUrl') ||
                siteConfig.calendlyUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-electric-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-electric-blue/90"
            >
              Book a Call
              <ArrowRight className="h-4 w-4" />
            </a>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}