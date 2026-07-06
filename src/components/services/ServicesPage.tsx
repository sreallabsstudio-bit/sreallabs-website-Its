'use client'

import { motion } from 'framer-motion'
import { Film, Sparkles, Users, Monitor, Check, ArrowRight, Play } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { portfolio, getFeaturedProjects, getProjectById } from '@/data/portfolio'
import { useNavigation } from '@/store/navigation'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SectionHeading from '@/components/shared/SectionHeading'
import PortfolioCard from '@/components/shared/PortfolioCard'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const services = [
  {
    icon: Film,
    title: '3D Product Animation',
    description: 'Cinematic product reveals and demonstrations using photorealistic 3D rendering, dramatic lighting, and dynamic camera work that showcase every detail of your product.',
    longDescription: 'Our 3D product animation service creates stunning visual content that brings products to life. Using industry-leading rendering technology, we produce photorealistic animations that highlight material quality, design details, and product features in ways traditional photography simply cannot achieve. Every animation is crafted with cinematic camera work, premium lighting setups, and meticulous attention to detail.',
    features: ['Photorealistic Rendering', 'Dynamic Camera Work', 'Material Accuracy', 'Amazon & E-commerce Ready', 'Fast Turnaround', 'Multiple Format Delivery'],
    serviceProjectId: '3d-5',
  },
  {
    icon: Sparkles,
    title: 'AI Commercials',
    description: 'AI-generated commercial content that looks and feels authentic. Perfect for brands looking to scale their advertising creative across multiple platforms and markets.',
    longDescription: 'Our AI commercial service leverages cutting-edge generative AI to produce broadcast-quality commercial content at a fraction of traditional production costs. We create human-presented content, lifestyle integrations, and brand films that feel genuine and relatable. Each commercial is optimized for the platforms where your audience spends time, from social media feeds to Connected TV.',
    features: ['AI-Generated Visuals', 'Brand Consistency', 'Rapid Production', 'Multi-Platform Optimization', 'Scalable Content', 'Founder & Testimonial Style'],
    serviceProjectId: 'beauty-2',
  },
  {
    icon: Users,
    title: 'AI UGC',
    description: 'Scalable creator-style content powered by artificial intelligence. Get authentic-feeling UGC without the logistics, costs, and unpredictability of real creator partnerships.',
    longDescription: 'AI UGC is revolutionizing how brands approach social media marketing. Our service generates creator-style product demonstrations, unboxing videos, and lifestyle content that feels authentic and relatable. Each piece of content is designed to perform on social platforms, with natural presentation styles and genuine-feeling engagement patterns that resonate with modern audiences.',
    features: ['Creator-Style Content', 'Infinite Variations', 'Cost Effective', 'Rapid Turnaround', 'Platform Native', 'A/B Test Ready'],
    serviceProjectId: 'ugc-3',
  },
  {
    icon: Monitor,
    title: 'SaaS Product Videos',
    description: 'Compelling visual stories for software products and platforms, turning complex features into engaging narratives that drive sign-ups and reduce churn.',
    longDescription: 'SaaS products present unique storytelling challenges — abstract features, invisible value, and technical complexity. Our SaaS video service transforms these challenges into compelling visual narratives. We create product demos, founder stories, workflow visualizations, and brand films that make software products tangible, understandable, and desirable for their target audiences.',
    features: ['Feature Demos', 'UI Animations', 'Explainer Videos', 'Founder Stories', 'Workflow Visualizations', 'Conversion Optimized'],
    serviceProjectId: 'saas-2',
  },
]

const processSteps = [
  {
    num: '01',
    title: 'Discovery',
    description: 'We learn about your brand, goals, and vision through a free consultation call. We study your market, competitors, and audience to build a strong creative foundation.',
  },
  {
    num: '02',
    title: 'Strategy',
    description: 'We develop a creative strategy and production plan tailored to your objectives. This includes storyboards, visual direction, and a detailed timeline.',
  },
  {
    num: '03',
    title: 'Production',
    description: 'Our team crafts your content using cutting-edge 3D rendering and AI technology. Every frame is polished to cinematic standards with premium lighting and materials.',
  },
  {
    num: '04',
    title: 'Delivery',
    description: 'You receive polished, platform-optimized assets ready to deploy. We provide multiple formats and revisions to ensure everything meets your standards.',
  },
]

const serviceFaqs = [
  {
    q: "What's included in a 3D product animation?",
    a: "A standard 3D product animation includes concept development, 3D modeling, texturing, lighting, animation, rendering, and post-production. You receive a final video optimized for your target platforms — Amazon, social media, website, or advertising networks. Each project includes one round of revisions.",
  },
  {
    q: 'How do AI commercials work?',
    a: "We use advanced AI video generation technology combined with professional post-production to create commercial-quality content. The process involves creative direction, AI generation, human curation and refinement, color grading, sound design, and final optimization. The result is content that feels authentic and premium.",
  },
  {
    q: 'What platforms do you optimize for?',
    a: "We optimize content for all major platforms including Amazon product pages, Instagram, TikTok, YouTube, LinkedIn, Facebook, Connected TV, and websites. Each platform has specific requirements for aspect ratio, duration, and visual style — we handle all of that for you.",
  },
  {
    q: 'Can I request revisions?',
    a: "Absolutely. Every project includes at least one round of revisions to ensure the final product meets your expectations. We believe in collaborative creative processes and work closely with you throughout production to minimize the need for major revisions.",
  },
  {
    q: 'Do you offer package deals?',
    a: "Yes, we offer flexible packages for clients who need multiple pieces of content. Whether it's a series of product videos, a content bundle for a product launch, or an ongoing content partnership, we can create a custom package that delivers maximum value for your investment.",
  },
]

export default function ServicesPage() {
  const { navigate, openProject } = useNavigation()
  const featuredProjects = getFeaturedProjects().slice(0, 6)

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
            <p className="text-electric-blue text-xs uppercase tracking-[0.2em] font-medium">What We Do</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mt-4">
              Services
            </h1>
            <p className="text-matte-silver text-base md:text-lg mt-4 max-w-xl leading-relaxed">
              End-to-end creative services designed to elevate your brand and drive measurable results across every platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== INTRODUCTION ===== */}
      <section className="py-12 md:py-16 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <AnimatedSection>
              <p className="text-matte-silver text-base md:text-lg leading-relaxed">
                At SREALLABS, we don&apos;t just create videos — we engineer visual experiences that convert. Our approach combines the artistry of traditional filmmaking with the precision of modern technology, delivering content that performs as beautifully as it looks.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <p className="text-matte-silver text-base md:text-lg leading-relaxed mt-2">
                Whether you need a cinematic product reveal that stops scrollers in their tracks, an AI-powered commercial that scales across markets, or a SaaS explainer that turns complex features into compelling stories — we have the expertise, tools, and creative vision to deliver.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== SERVICES DETAIL ===== */}
      <section className="bg-surface-secondary">
        {services.map((service, i) => {
          const sampleProject = service.serviceProjectId ? getProjectById(service.serviceProjectId) : undefined
          const isReversed = i % 2 === 1

          return (
            <div key={service.title} className={i > 0 ? 'border-t border-white/[0.04]' : ''}>
              <div className="py-12 md:py-16">
                <div className={`max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center ${isReversed ? 'md:direction-rtl' : ''}`}>
                  {/* Text Content */}
                  <AnimatedSection className={isReversed ? 'md:order-2' : ''}>
                    <div className={`flex items-center gap-3 mb-4 ${isReversed ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-fit rounded-lg bg-electric-blue/10 p-2.5">
                        <service.icon className="w-5 h-5 text-electric-blue" />
                      </div>
                      <span className="text-electric-blue text-xs uppercase tracking-[0.15em] font-medium">
                        Service {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-semibold text-white">
                      {service.title}
                    </h2>
                    <p className="text-matte-silver text-sm leading-relaxed mt-4">
                      {service.longDescription}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-acid-lime mt-0.5 flex-shrink-0" />
                          <span className="text-matte-silver text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => navigate('contact')}
                      className="mt-5 inline-flex items-center gap-2 text-electric-blue text-sm font-medium hover:gap-3 transition-all"
                    >
                      Discuss This Service <ArrowRight className="w-4 h-4" />
                    </button>
                  </AnimatedSection>

                  {/* Video Preview */}
                  <AnimatedSection delay={0.15} className={isReversed ? 'md:order-1' : ''}>
                    {sampleProject ? (
                      <div
                        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
                        onClick={() => openProject(sampleProject.id)}
                      >
                        <video
                          src={sampleProject.video}
                          muted loop playsInline preload="metadata"
                          className="w-full h-full object-cover"
                          onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                          onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-xs font-medium">{sampleProject.title}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video rounded-xl bg-surface-card border border-white/[0.06] flex items-center justify-center">
                        <service.icon className="w-12 h-12 text-electric-blue/30" />
                      </div>
                    )}
                  </AnimatedSection>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* ===== FEATURED WORK ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Our Latest Work"
            subtitle="Recent projects across all service categories"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-8">
            {featuredProjects.map((p) => (
              <AnimatedSection key={p.id}>
                <PortfolioCard project={p} onClick={() => openProject(p.id)} />
              </AnimatedSection>
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

      {/* ===== PROCESS ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Our Process"
            subtitle="A proven approach that delivers results every time"
          />

          <div className="mt-8">
            {/* Desktop Timeline */}
            <div className="hidden md:grid grid-cols-4 gap-4 md:gap-6">
              {processSteps.map((step, i) => (
                <AnimatedSection key={step.num} delay={i * 0.1}>
                  <div className="relative">
                    {i < processSteps.length - 1 && (
                      <div className="absolute top-6 left-[calc(100%)] w-[calc(100%-3rem)] h-px bg-white/10 hidden lg:block" style={{ left: '60%', width: '80%' }} />
                    )}
                    <span className="text-electric-blue font-mono text-2xl font-bold">{step.num}</span>
                    <h3 className="text-white font-medium mt-3 text-base">{step.title}</h3>
                    <p className="text-matte-silver text-sm mt-2 leading-relaxed">{step.description}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden space-y-8">
              {processSteps.map((step, i) => (
                <AnimatedSection key={step.num} delay={i * 0.1}>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-electric-blue font-mono text-lg font-bold">{step.num}</span>
                      {i < processSteps.length - 1 && (
                        <div className="w-px h-full bg-white/10 mt-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="text-white font-medium text-base">{step.title}</h3>
                      <p className="text-matte-silver text-sm mt-2 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading title="Service FAQ" />

          <AnimatedSection className="mt-8" delay={0.15}>
            <Accordion type="single" collapsible className="w-full">
              {serviceFaqs.map((faq, i) => (
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
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="text-matte-silver mt-4 text-sm md:text-base leading-relaxed">
              Let&apos;s discuss your project and find the perfect creative solution. Every great project starts with a conversation.
            </p>
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
                onClick={() => navigate('contact')}
                className="border border-white/20 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-white/5 transition-colors inline-flex items-center gap-2"
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}