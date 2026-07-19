'use client'

import { motion } from 'framer-motion'
import { Heart, Zap, Globe, ArrowRight, Award, Shield, Lightbulb, Facebook, Linkedin, ExternalLink } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { useNavigation } from '@/store/navigation'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SectionHeading from '@/components/shared/SectionHeading'

const philosophy = [
  {
    icon: Lightbulb,
    title: 'Craft Over Convention',
    description: "We don't follow templates. Every project is handcrafted to tell your brand's unique story with cinematic precision. This philosophy of intentional creative direction — where every camera angle, lighting choice, and material treatment serves a strategic purpose — is what separates content that looks premium from content that makes your product feel premium.",
  },
  {
    icon: Zap,
    title: 'Technology as a Canvas',
    description: "AI and 3D technology aren't just tools — they're our creative medium. We combine traditional cinematic craftsmanship with cutting-edge AI and rendering technology to create what's never been seen before. The technology serves the creative vision, not the other way around.",
  },
  {
    icon: Award,
    title: 'Results That Matter',
    description: "Beautiful content is just the beginning. Everything we create is designed to drive measurable business outcomes — from increased perceived product value and higher click-through rates to improved conversion rates and stronger brand equity. We measure success by your success.",
  },
]

const timeline = [
  {
    phase: 'The Vision',
    year: '2024',
    title: 'Where It All Began',
    description: "SREALLABS was founded with a singular mission: to help brands increase perceived product value through cinematic visual storytelling. Salome saw that the most impactful brand content was locked behind prohibitive production costs, and the solution was clear — combine world-class creative talent with cutting-edge AI and 3D technology to make premium content accessible.",
  },
  {
    phase: 'The Growth',
    year: '2025',
    title: 'Building Momentum',
    description: "From early experiments with AI video generation to serving clients across 8 industries and 12+ countries, SREALLABS rapidly evolved. The studio developed proprietary workflows that blend AI efficiency with cinematic quality, delivering 50+ projects and earning the trust of brands from innovative startups to established global enterprises.",
  },
  {
    phase: 'The Future',
    year: '2026+',
    title: 'Pushing Boundaries',
    description: "Today, SREALLABS continues to push the boundaries of creative technology. With an expanding team, refined processes, and an unwavering commitment to quality, the studio is positioned to define the future of AI-powered creative production.",
  },
]

const coreValues = [
  {
    icon: Award,
    title: 'Quality',
    description: 'Every frame, every pixel, every second — perfection is non-negotiable. We treat each project as if it were our own brand on the line.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We stay ahead of the curve, continuously exploring new technologies and techniques to deliver content that pushes creative boundaries.',
  },
  {
    icon: Heart,
    title: 'Partnership',
    description: "Your success is our success. We build lasting relationships with our clients, becoming an extension of their team rather than just a vendor.",
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Transparent communication, honest timelines, and reliable delivery. We do what we say we will do, every single time.',
  },
]

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Clients' },
  { value: '8', label: 'Industries Served' },
  { value: '100%', label: 'Client Satisfaction' },
]

export default function AboutPage() {
  const { navigate } = useNavigation()

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
            <p className="text-electric-blue text-xs uppercase tracking-[0.2em] font-medium">Our Story</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mt-4">
              About SREALLABS
            </h1>
            <p className="text-matte-silver text-base md:text-lg mt-4 max-w-xl leading-relaxed">
              A premium creative studio that helps brands increase perceived product value through cinematic visual storytelling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== MEET SALOME ===== */}
      <section className="py-12 md:py-16 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
            <AnimatedSection className="order-1">
              <div className="relative">
                <img
                  src={siteConfig.assets.founderPhoto}
                  alt="Salome — Founder & Creative Director"
                  className="w-full aspect-[3/4] object-cover rounded-xl"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-electric-blue/20" />
                <div className="absolute -inset-px rounded-xl shadow-[0_0_40px_rgba(37,99,235,0.1)] pointer-events-none" />
              </div>
            </AnimatedSection>

            <div className="order-2 flex flex-col gap-4">
              <SectionHeading
                title="Meet Salome"
                subtitle="Founder & Creative Director"
              />

              <AnimatedSection delay={0.2}>
                <p className="text-matte-silver text-sm md:text-base leading-relaxed">
                  Salome founded SREALLABS with a singular vision: to bridge the gap between cutting-edge technology and world-class creative storytelling. She combines creative direction, 3D visualization, motion design, and AI-powered production to help brands create premium marketing assets that drive real business outcomes — from increased perceived value to higher conversion rates.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <p className="text-matte-silver text-sm md:text-base leading-relaxed">
                  Under her leadership, SREALLABS has delivered 50+ projects across 8 industries and 12+ countries, serving clients from innovative startups to established global brands. Her philosophy is simple: focus on craft over convention, technology as a creative canvas, and results that matter. Every project carries Salome's personal standard of excellence — cinematic quality, strategic thinking, and a deep understanding of what makes audiences stop scrolling and start engaging.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <div className="flex items-center gap-3 mt-2">
                  {siteConfig.socialLinks.facebook && (
                    <a
                      href={siteConfig.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-matte-silver hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {siteConfig.socialLinks.linkedin && (
                    <a
                      href={siteConfig.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-matte-silver hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {siteConfig.socialLinks.contra && (
                    <a
                      href={siteConfig.socialLinks.contra}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-matte-silver hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Contra"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOUNDER STORY ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeading title="The Story Behind SREALLABS" />

            <AnimatedSection delay={0.1}>
              <p className="text-matte-silver text-sm md:text-base leading-relaxed mt-8">
                The story of SREALLABS begins with a simple observation: the most impactful brand content in the world was locked behind prohibitive production costs. Salome saw brands with incredible products struggling to compete visually because premium video content was simply out of reach. The gap wasn't in the quality of the products — it was in the quality of the visual storytelling.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-matte-silver text-sm md:text-base leading-relaxed mt-4">
                The solution wasn&apos;t to lower quality — it was to reimagine the production process entirely. By combining the artistry of traditional 3D animation and cinematic filmmaking with the efficiency of AI-powered tools, SREALLABS created a new category of creative production: visual content that makes products feel premium, accessible at scale, without ever compromising on quality.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p className="text-matte-silver text-sm md:text-base leading-relaxed mt-4">
                Today, SREALLABS serves clients across Consumer Electronics, Industrial Hardware, Luxury, Automotive, SaaS, and Lifestyle — delivering content that performs on every platform from Amazon to TikTok to Connected TV. The mission remains the same: help brands increase perceived product value through cinematic visual storytelling.
              </p>
            </AnimatedSection>

            {/* Quote */}
            <AnimatedSection delay={0.4} className="mt-8">
              <blockquote className="border-l-2 border-electric-blue pl-6 py-2">
                <p className="text-white text-lg md:text-xl font-medium italic leading-relaxed">
                  &ldquo;I believe every brand deserves content that looks like a million dollars — even if their budget doesn&apos;t say so.&rdquo;
                </p>
                <cite className="text-electric-blue text-sm mt-3 block not-italic">— Salome, Founder</cite>
              </blockquote>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Our Philosophy" subtitle="The principles that guide every project" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
            {philosophy.map((pillar, i) => (
              <AnimatedSection key={pillar.title} delay={i * 0.1}>
                <div className="bg-surface-card rounded-xl p-5 md:p-6 border border-white/[0.06] h-full">
                  <div className="w-fit rounded-lg bg-electric-blue/10 p-2.5">
                    <pillar.icon className="w-5 h-5 text-electric-blue" />
                  </div>
                  <h3 className="text-white font-medium mt-4 text-base">{pillar.title}</h3>
                  <p className="text-matte-silver text-sm mt-2 leading-relaxed">{pillar.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STORY TIMELINE ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="The SREALLABS Journey" />

          <div className="mt-8 max-w-3xl mx-auto">
            {/* Desktop Timeline */}
            <div className="hidden md:block relative">
              <div className="absolute left-[18px] top-2 bottom-2 w-px bg-white/10" />
              <div className="space-y-10">
                {timeline.map((item, i) => (
                  <AnimatedSection key={item.phase} delay={i * 0.1}>
                    <div className="flex gap-6 relative">
                      <div className="w-9 h-9 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center flex-shrink-0 z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-electric-blue" />
                      </div>
                      <div className="pb-2">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-electric-blue text-xs font-mono font-bold">{item.year}</span>
                          <span className="text-matte-silver/40 text-xs">—</span>
                          <span className="text-white text-xs uppercase tracking-wider font-medium">{item.phase}</span>
                        </div>
                        <h3 className="text-white font-medium text-lg">{item.title}</h3>
                        <p className="text-matte-silver text-sm leading-relaxed mt-2">{item.description}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden space-y-8">
              {timeline.map((item, i) => (
                <AnimatedSection key={item.phase} delay={i * 0.1}>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-electric-blue" />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className="w-px flex-1 bg-white/10 mt-2" />
                      )}
                    </div>
                    <div className="pb-4">
                      <span className="text-electric-blue text-xs font-mono font-bold">{item.year}</span>
                      <h3 className="text-white font-medium text-base mt-1">{item.title}</h3>
                      <p className="text-matte-silver text-sm leading-relaxed mt-2">{item.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Core Values" subtitle="What we stand for" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mt-8">
            {coreValues.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <div className="bg-surface-card rounded-xl p-5 md:p-6 border border-white/[0.06] h-full flex gap-4">
                  <div className="w-fit rounded-lg bg-electric-blue/10 p-2.5 flex-shrink-0">
                    <v.icon className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-base">{v.title}</h3>
                    <p className="text-matte-silver text-sm mt-2 leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Trusted by Innovative Brands" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-electric-blue">{stat.value}</p>
                  <p className="text-matte-silver text-sm mt-2">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Ready to Make Your Product Feel Premium?
            </h2>
            <p className="text-matte-silver mt-4 text-sm md:text-base leading-relaxed">
              Let&apos;s discuss your project and show you how cinematic visual storytelling can transform your brand&apos;s perceived value.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <button
                onClick={() => navigate('contact')}
                className="bg-electric-blue text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-electric-blue/90 transition-colors inline-flex items-center gap-2"
              >
                Get in Touch <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/20 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-white/5 transition-colors"
              >
                Book a Call
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}