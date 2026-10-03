'use client'

import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Box,
  Camera,
  Film,
  Layers,
  Monitor,
  PenTool,
} from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { useNavigation } from '@/store/navigation'
import { useProjectsStore } from '@/store/projects'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SectionHeading from '@/components/shared/SectionHeading'
import PortfolioCard from '@/components/shared/PortfolioCard'

const services = [
  {
    icon: Film,
    title: '3D Animation',
    description: 'Cinematic motion that brings products, concepts, and ideas to life.',
  },
  {
    icon: Camera,
    title: '3D Visualization',
    description: 'Photorealistic visuals with detailed materials, lighting, and composition.',
  },
  {
    icon: Box,
    title: 'CGI & Product Rendering',
    description: 'High-quality CGI for products, concepts, launches, and campaigns.',
  },
  {
    icon: Layers,
    title: '3D Motion Design',
    description: 'Dynamic 3D graphics for brands, presentations, and visual experiences.',
  },
  {
    icon: Monitor,
    title: 'Industrial Visualization',
    description: 'Clear and detailed visuals for machines, systems, and technical products.',
  },
  {
    icon: PenTool,
    title: '3D Creative Work',
    description: 'Characters, environments, concepts, and other custom 3D experiences.',
  },
]

const processSteps = [
  {
    num: '01',
    title: 'Discover',
    description: 'Understand the idea, product, and visual goal.',
  },
  {
    num: '02',
    title: 'Create',
    description: 'Model, design, animate, light, and refine the work.',
  },
  {
    num: '03',
    title: 'Deliver',
    description: 'Polished 3D visuals ready for your next use.',
  },
]

const faqs = [
  {
    question: 'What can you create in 3D?',
    answer:
      'We create product animation, visualization, CGI, motion design, industrial visuals, characters, environments, and other custom 3D work.',
  },
  {
    question: 'Can you work from existing 3D files?',
    answer:
      'Yes. Existing models, CAD files, references, sketches, or product images can be used as a starting point.',
  },
  {
    question: 'Can I request revisions?',
    answer:
      'Yes. Revisions are part of the creative process and are discussed based on the project scope.',
  },
  {
    question: 'How do I start a project?',
    answer:
      'Send us your idea, references, or project brief. We will review it and discuss the right 3D approach.',
  },
]

export default function ServicesPage() {
  const { navigate, navigateToProject } = useNavigation()

  const projects = useProjectsStore((state) => state.projects)
  const fetchProjects = useProjectsStore((state) => state.fetchProjects)

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const selectedWork = useMemo(() => {
    const featured = projects.filter((project) => project.featured)

    if (featured.length > 0) {
      return featured.slice(0, 6)
    }

    return projects.slice(0, 6)
  }, [projects])

  return (
    <div className="pt-[72px] bg-obsidian">
      {/* HERO */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-electric-blue">
              What We Do
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              3D, made to move.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-matte-silver md:text-lg">
              Animation, visualization, CGI, and motion design for products,
              brands, concepts, and ideas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-surface-secondary py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <SectionHeading
              title="Capabilities"
              subtitle="A focused 3D practice built around strong visual craft."
            />
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon

              return (
                <AnimatedSection
                  key={service.title}
                  delay={index * 0.06}
                >
                  <div className="group h-full rounded-2xl border border-white/[0.06] bg-surface-card p-6 transition-all duration-300 hover:border-electric-blue/30">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-electric-blue/10">
                      <Icon className="h-5 w-5 text-electric-blue" />
                    </div>

                    <h2 className="mt-6 text-xl font-medium text-white">
                      {service.title}
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-matte-silver">
                      {service.description}
                    </p>

                    <button
                      onClick={() => navigate('contact')}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-electric-blue transition-all hover:gap-3"
                    >
                      Start a Project
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <SectionHeading
              title="Selected Work"
              subtitle="A few recent 3D projects from the studio."
            />
          </AnimatedSection>

          {selectedWork.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {selectedWork.map((project, index) => (
                <AnimatedSection
                  key={project.id}
                  delay={index * 0.05}
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

      {/* PROCESS */}
      <section className="bg-surface-secondary py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection>
            <SectionHeading
              title="How We Work"
              subtitle="Simple process. Strong visuals."
            />
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <AnimatedSection
                key={step.num}
                delay={index * 0.08}
              >
                <div className="border-t border-white/[0.08] pt-5">
                  <span className="font-mono text-sm font-bold text-electric-blue">
                    {step.num}
                  </span>

                  <h3 className="mt-3 text-lg font-medium text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-matte-silver">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <AnimatedSection>
            <SectionHeading title="FAQ" />
          </AnimatedSection>

          <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-medium text-white">
                  <span>{faq.question}</span>
                  <span className="text-electric-blue transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-3 max-w-2xl pr-8 text-sm leading-relaxed text-matte-silver">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-surface-secondary py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <AnimatedSection>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-electric-blue">
              Start a Project
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Have an idea?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-matte-silver md:text-base">
              Let&apos;s turn it into something worth seeing.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mt-7">
            <a
              href={siteConfig.calendlyUrl}
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