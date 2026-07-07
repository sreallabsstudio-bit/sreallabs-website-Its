'use client'

import { motion } from 'framer-motion'
import { Film, Sparkles, Target, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { getFeaturedProjects } from '@/data/portfolio'
import { useNavigation } from '@/store/navigation'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SectionHeading from '@/components/shared/SectionHeading'
import PortfolioCard from '@/components/shared/PortfolioCard'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const faqs = [
  {
    q: 'What types of videos does SREALLABS produce?',
    a: 'We specialize in cinematic 3D product animations, AI-generated commercials, AI UGC content, and SaaS product videos. Each project is tailored to your brand\'s unique story and conversion goals.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Project timelines vary based on complexity. A standard 3D product animation takes 1-2 weeks, while more complex AI commercials may take 2-3 weeks. We always provide a detailed timeline during our discovery call.',
  },
  {
    q: 'What is the process for starting a project?',
    a: 'It starts with a free discovery call where we understand your brand, goals, and vision. From there, we develop a creative brief, move into production, and deliver polished final assets optimized for your platforms.',
  },
  {
    q: 'Do you work with international clients?',
    a: 'Absolutely. We work with brands globally and have experience creating content for diverse markets. Our process is fully remote-friendly with clear communication at every stage.',
  },
  {
    q: 'What makes SREALLABS different from other studios?',
    a: 'We combine cinematic quality with AI-powered efficiency. Our unique blend of traditional 3D craftsmanship and cutting-edge AI technology allows us to deliver premium content faster and more cost-effectively than traditional studios.',
  },
  {
    q: 'How much does a project cost?',
    a: 'Pricing depends on the project scope, complexity, and deliverables. We offer competitive rates and flexible packages. Book a free discovery call to discuss your project and get a personalized quote.',
  },
]

const whyCards = [
  {
    icon: Film,
    title: 'Cinematic Quality',
    description:
      'Every frame is meticulously crafted with photorealistic rendering, dramatic lighting, and premium production value that rivals Hollywood-grade visuals.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description:
      'Leveraging cutting-edge AI technology to create authentic commercials and UGC content at scale, without sacrificing quality or creative control.',
  },
  {
    icon: Target,
    title: 'Conversion Focused',
    description:
      'Every project is designed with your business goals in mind — from increasing click-through rates to boosting conversions and building brand equity.',
  },
]

const services = [
  {
    title: '3D Product Animation',
    description:
      'Cinematic product reveals and demonstrations that captivate and convert.',
  },
  {
    title: 'AI Commercials',
    description:
      'AI-generated commercial content that looks and feels authentic.',
  },
  {
    title: 'AI UGC',
    description:
      'Scalable creator-style content powered by artificial intelligence.',
  },
  {
    title: 'SaaS Product Videos',
    description:
      'Compelling visual stories for software products and platforms.',
  },
]

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Clients' },
  { value: '8', label: 'Industries Served' },
  { value: '100%', label: 'Client Satisfaction' },
]

const stagger = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

export default function HomePage() {
  const { navigate, navigateToProject } = useNavigation()

  const featuredProjects = getFeaturedProjects().slice(0, 4)

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Video */}
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
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full min-h-screen max-w-7xl mx-auto px-6">
          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight max-w-3xl"
          >
            Reality, Rendered.
          </motion.h1>

          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-matte-silver text-base md:text-lg mt-4 max-w-xl leading-relaxed"
          >
            We craft cinematic 3D product animations, AI commercials, and creative
            stories that make brands unforgettable.
          </motion.p>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-wrap gap-4 mt-6"
          >
            <button
              onClick={() => navigate('work')}
              className="bg-electric-blue text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-electric-blue/90 transition-colors"
            >
              View Our Work
            </button>
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-white/5 transition-colors"
            >
              Book a Discovery Call
            </a>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED WORK ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Selected Work"
            subtitle="A curated selection of cinematic 3D product animations and AI-powered visual stories created for ambitious brands, startups and technology companies."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
            {featuredProjects.map((p, i) => (
              <PortfolioCard
                key={p.id}
                project={p}
                onClick={() => navigateToProject(p.slug)}
                index={i}
              />
            ))}
          </div>

          <AnimatedSection className="mt-6">
            <button
              onClick={() => navigate('work')}
              className="inline-flex items-center gap-2 text-electric-blue text-sm font-medium hover:gap-3 transition-all"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CLIENT TESTIMONIALS ===== */}
      <TestimonialsSection />

      {/* ===== WHY SREALLABS ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Why SREALLABS" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
            {whyCards.map((card, i) => (
              <AnimatedSection key={card.title} delay={i * 0.1}>
                <div className="bg-surface-card rounded-xl p-5 md:p-6 border border-white/[0.06] h-full">
                  <div className="w-fit rounded-lg bg-electric-blue/10 p-3">
                    <card.icon className="w-5 h-5 text-electric-blue" />
                  </div>
                  <h3 className="text-white font-medium mt-4 text-base">
                    {card.title}
                  </h3>
                  <p className="text-matte-silver text-sm mt-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="What We Do"
            subtitle="End-to-end creative services"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08}>
                <div className="bg-surface-card rounded-xl p-5 border border-white/[0.06] hover:border-electric-blue/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all h-full">
                  <h3 className="text-white font-medium text-base">{s.title}</h3>
                  <p className="text-matte-silver text-sm mt-2 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-6">
            <button
              onClick={() => navigate('services')}
              className="inline-flex items-center gap-2 text-electric-blue text-sm font-medium hover:gap-3 transition-all"
            >
              Explore Services <ArrowRight className="w-4 h-4" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== MEET SALOME ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
            {/* Photo - on top for mobile */}
            <AnimatedSection className="order-1 md:order-1">
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

            {/* Text */}
            <div className="order-2 md:order-2 flex flex-col gap-4">
              <SectionHeading
                title="Meet Salome"
                subtitle="Founder & Creative Director"
              />

              <AnimatedSection delay={0.2}>
                <p className="text-matte-silver text-sm md:text-base leading-relaxed">
                  At the helm of SREALLABS is Salome — a creative visionary with an
                  unrelenting passion for blending technology with artistry. With a
                  background in 3D design, motion graphics, and AI-driven content,
                  Salome has built SREALLABS to be the studio where innovation meets
                  storytelling.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <p className="text-matte-silver text-sm md:text-base leading-relaxed">
                  Every project that leaves SREALLABS carries Salome&apos;s personal
                  standard of excellence — cinematic quality, strategic thinking, and a
                  deep understanding of what makes audiences stop scrolling and start
                  engaging.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <button
                  onClick={() => navigate('contact')}
                  className="inline-flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-electric-blue/90 transition-colors w-fit"
                >
                  Get in Touch
                </button>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST & SOCIAL PROOF ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Trusted by Innovative Brands" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-electric-blue">
                    {stat.value}
                  </p>
                  <p className="text-matte-silver text-sm mt-2">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading title="Frequently Asked Questions" />

          <AnimatedSection className="mt-8" delay={0.15}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-white/[0.06]"
                >
                  <AccordionTrigger className="text-white text-sm md:text-base hover:no-underline hover:text-white/80 py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-matte-silver text-sm leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready When You Are
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <p className="text-matte-silver mt-4 text-sm md:text-base leading-relaxed">
              Let&apos;s bring your brand&apos;s vision to life with cinematic visuals that
              captivate, convert, and leave a lasting impression.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-electric-blue text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-electric-blue/90 transition-colors"
              >
                Book a Discovery Call
              </a>
              <button
                onClick={() => navigate('work')}
                className="border border-white/20 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-white/5 transition-colors"
              >
                Explore Our Work
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}