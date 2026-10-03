'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import {
  useProjectsStore,
  selectByCategory,
} from '@/store/projects'
import AnimatedSection from '@/components/shared/AnimatedSection'
import PortfolioCard from '@/components/shared/PortfolioCard'

export default function WorkPage() {
  const { navigate, navigateToProject } = useNavigation()

  const projects = useProjectsStore((s) => s.projects)
  const categories = useProjectsStore((s) => s.categories)
  const status = useProjectsStore((s) => s.status)
  const fetchProjects = useProjectsStore((s) => s.fetchProjects)

  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const filteredProjects = selectByCategory(projects, activeCategory)
  const loading = status === 'idle' || status === 'loading'

  return (
    <main className="bg-obsidian">

      {/* HERO */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-electric-blue text-xs uppercase tracking-[0.2em] font-medium">
              SREALLABS
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mt-4">
              Work
            </h1>

            <p className="text-matte-silver text-base md:text-lg mt-5 max-w-2xl leading-relaxed">
              A collection of 3D animation, visualization, CGI, motion,
              and cinematic visual work.
            </p>
          </motion.div>

        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="pb-20 md:pb-28 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">

          {/* CATEGORY FILTER */}
          <AnimatedSection>
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
              {['All', ...categories.map((category) => category.name)].map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      activeCategory === category
                        ? 'bg-electric-blue text-white'
                        : 'bg-surface-card text-matte-silver border border-white/[0.06] hover:text-white hover:bg-surface-elevated'
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </AnimatedSection>

          {/* PROJECT COUNT */}
          <div className="flex items-center justify-between mt-8">
            <p className="text-matte-silver text-sm">
              {loading ? (
                'Loading work...'
              ) : (
                <>
                  <span className="text-white font-medium">
                    {filteredProjects.length}
                  </span>{' '}
                  {filteredProjects.length === 1 ? 'project' : 'projects'}
                </>
              )}
            </p>
          </div>

          {/* PROJECT GRID */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="aspect-[16/10] rounded-2xl bg-surface-card animate-pulse"
                />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {filteredProjects.map((project, index) => (
                <AnimatedSection
                  key={project.id}
                  delay={Math.min(index * 0.04, 0.2)}
                >
                  <PortfolioCard
                    project={project}
                    onClick={() => navigateToProject(project.slug)}
                    index={index}
                  />
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-matte-silver text-sm">
                No projects found in this category.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-surface-secondary">
        <div className="max-w-3xl mx-auto px-6 text-center">

          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Have a 3D project in mind?
            </h2>

            <p className="text-matte-silver mt-4 max-w-xl mx-auto leading-relaxed">
              Tell us what you are creating and let&apos;s explore what we
              can build together.
            </p>

            <button
              onClick={() => navigate('contact')}
              className="mt-7 inline-flex items-center gap-2 bg-electric-blue text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-electric-blue/90 transition-colors"
            >
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </button>
          </AnimatedSection>

        </div>
      </section>

    </main>
  )
}