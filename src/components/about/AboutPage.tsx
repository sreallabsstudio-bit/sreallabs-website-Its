'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Box, Eye, Sparkles } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { useNavigation } from '@/store/navigation'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SectionHeading from '@/components/shared/SectionHeading'

const approach = [
  {
    icon: Box,
    title: 'Craft',
    description:
      'We care about the details that make 3D work feel believable, polished, and intentional.',
  },
  {
    icon: Eye,
    title: 'Clarity',
    description:
      'Every visual has a purpose. We make complex ideas easier to understand and remember.',
  },
  {
    icon: Sparkles,
    title: 'Visual Impact',
    description:
      'We create work designed to hold attention and give ideas a stronger visual presence.',
  },
]

export default function AboutPage() {
  const { navigate } = useNavigation()

  return (
    <div className="bg-obsidian pt-[72px]">
      {/* HERO */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-electric-blue">
              About SREALLABS
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl">
              Built around 3D.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-matte-silver md:text-lg">
              A 3D studio creating animation, visualization, and visual
              experiences for products, brands, and ideas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MEET SALOME */}
      <section className="bg-surface-secondary py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
          <AnimatedSection>
            <div className="relative">
              <img
                src={siteConfig.assets.founderPhoto}
                alt="Salome, Founder and Creative Director of SREALLABS"
                className="aspect-[3/4] w-full rounded-2xl object-cover"
              />

              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-electric-blue/20" />
            </div>
          </AnimatedSection>

          <div>
            <AnimatedSection>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-electric-blue">
                Meet Salome
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Founder & Creative Director
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-matte-silver md:text-base">
                I&apos;m Salome, founder of SREALLABS. I build 3D visuals that
                help ideas become clear, memorable, and worth watching.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-matte-silver md:text-base">
                SREALLABS brings together 3D animation, visualization, motion,
                and creative direction to create visual work with character,
                detail, and purpose.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <SectionHeading
              title="Our Approach"
              subtitle="Simple principles behind the work."
            />
          </AnimatedSection>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {approach.map((item, index) => {
              const Icon = item.icon

              return (
                <AnimatedSection
                  key={item.title}
                  delay={index * 0.08}
                >
                  <div className="h-full rounded-2xl border border-white/[0.06] bg-surface-card p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-electric-blue/10">
                      <Icon className="h-5 w-5 text-electric-blue" />
                    </div>

                    <h3 className="mt-6 text-xl font-medium text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-matte-silver">
                      {item.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* WHAT WE CREATE */}
      <section className="bg-surface-secondary py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-electric-blue">
              What We Create
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              From idea to finished 3D visual.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-matte-silver md:text-base">
              Product films, CGI, 3D visualization, motion design,
              industrial visuals, characters, environments, and custom 3D
              experiences.
            </p>

            <button
              onClick={() => navigate('services')}
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-electric-blue transition-all hover:gap-3"
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-obsidian py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08)_0%,transparent_70%)]" />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <AnimatedSection>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-electric-blue">
              Start a Project
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Have an idea worth visualizing?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-matte-silver md:text-base">
              Let&apos;s turn it into something worth seeing.
            </p>

            <button
              onClick={() => navigate('contact')}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-electric-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-electric-blue/90"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4" />
            </button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}