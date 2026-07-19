'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Play,
  Eye,
  Lightbulb,
  Palette,
  Film,
  Layers,
  Monitor,
  Sparkles,
  Users,
  CheckCircle2,
  Cpu,
  CircuitBoard,
  Gem,
  Car,
  Code2,
  ShoppingBag,
} from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { getFeaturedProjects, getProjectBySlug } from '@/data/portfolio'
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

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const premiumServices = [
  {
    icon: Film,
    title: '3D Product Animation',
    description:
      'Create launch-ready product films that increase perceived value and capture attention.',
    features: ['Photorealistic Rendering', 'Cinematic Camera Work', 'Material Accuracy', 'Platform Optimized'],
  },
  {
    icon: Eye,
    title: 'Cinematic Product Films',
    description:
      'Transform product features into compelling visual stories that resonate with your target audience and drive engagement.',
    features: ['Dramatic Lighting', 'Brand Storytelling', 'Multi-Scene Narratives', 'Campaign Ready'],
  },
  {
    icon: CircuitBoard,
    title: 'Industrial Visualization',
    description:
      'Make complex industrial and enterprise products visually accessible with technical accuracy and cinematic quality.',
    features: ['Exploded Views', 'Technical Accuracy', 'Enterprise Grade', 'Sales Enablement'],
  },
  {
    icon: Gem,
    title: 'Luxury Product Visualization',
    description:
      'Elevate luxury and premium brands with visual content that matches the quality and craftsmanship of your products.',
    features: ['Premium Aesthetics', 'Brand Alignment', 'Editorial Quality', 'High-End Finish'],
  },
]

const aiServices = [
  {
    icon: Sparkles,
    title: 'AI Commercials',
    description:
      'Produce campaign-ready advertising content faster without sacrificing quality.',
    features: ['AI-Generated Visuals', 'Brand Consistency', 'Rapid Production', 'Multi-Platform'],
  },
  {
    icon: Users,
    title: 'AI UGC',
    description:
      'Generate authentic creator-style advertising content at scale.',
    features: ['Creator-Style Content', 'Infinite Variations', 'Cost Effective', 'Platform Native'],
  },
  {
    icon: Monitor,
    title: 'AI Product Videos',
    description:
      'Turn complex software and digital products into engaging visual stories that improve product understanding and conversion.',
    features: ['Feature Demos', 'UI Animations', 'Explainer Videos', 'Conversion Optimized'],
  },
]

const processSteps = [
  {
    num: '01',
    title: 'Discover',
    description: 'Understand the product, audience, and brand positioning. We study your market, competitors, and goals to build a strong creative foundation that aligns with your business objectives.',
    icon: Lightbulb,
  },
  {
    num: '02',
    title: 'Design',
    description: 'Develop the visual direction, storyboard, and creative strategy. Every decision — from camera angles to lighting mood — is intentional and designed to increase perceived product value.',
    icon: Palette,
  },
  {
    num: '03',
    title: 'Create',
    description: 'Build cinematic animation and visual content using industry-leading 3D rendering and AI technology. Every frame is polished to premium standards with meticulous attention to detail.',
    icon: Layers,
  },
  {
    num: '04',
    title: 'Deliver',
    description: 'Launch-ready marketing assets optimized for every platform. From Amazon listings to social campaigns to investor presentations — content that performs where it matters most.',
    icon: CheckCircle2,
  },
]

const industries = [
  {
    icon: Cpu,
    title: 'Consumer Electronics',
    description: 'From smart home devices to wearables — we create product visuals that communicate quality, innovation, and desirability for tech brands competing in crowded markets.',
  },
  {
    icon: CircuitBoard,
    title: 'Industrial Equipment',
    description: 'Make complex machinery and enterprise hardware visually compelling. We bridge the gap between engineering precision and marketing appeal for B2B and industrial brands.',
  },
  {
    icon: Gem,
    title: 'Luxury Brands',
    description: 'Visual content that reflects the craftsmanship, heritage, and exclusivity of luxury products. Every frame is designed to match the premium positioning your brand deserves.',
  },
  {
    icon: Car,
    title: 'Automotive & EV',
    description: 'Showcase automotive design, engineering, and innovation through cinematic product films that capture the essence of modern mobility and electric vehicle technology.',
  },
  {
    icon: Code2,
    title: 'SaaS & Technology',
    description: 'Turn abstract software features into tangible visual stories. We help SaaS companies improve product understanding, reduce churn, and increase sign-ups through compelling video content.',
  },
  {
    icon: ShoppingBag,
    title: 'Lifestyle Products',
    description: 'From beauty and wellness to home goods and fitness — create aspirational product content that connects emotionally with consumers and drives purchase decisions.',
  },
]

const faqs = [
  {
    q: 'How much does a project cost?',
    a: 'Pricing depends on the project scope, complexity, and number of deliverables. A single 3D product animation typically starts from a set base rate, while AI-powered content packages offer greater scale at a lower per-unit cost. Every project begins with a free discovery call where we discuss your goals and provide a personalized quote tailored to your budget and objectives.',
  },
  {
    q: 'How long does production take?',
    a: 'Project timelines vary based on complexity and deliverable count. A standard 3D product animation is typically delivered within 1-2 weeks, while AI-powered content can be turned around in as little as 3-5 days. More complex projects involving multiple products, scenes, or advanced visual effects may take 2-4 weeks. We provide a detailed timeline during our discovery call and keep you updated at every stage.',
  },
  {
    q: 'Can you work with existing CAD files?',
    a: 'Yes, we regularly work with CAD files, 3D models, technical drawings, and product prototypes. If you have existing 3D assets, we can optimize and refine them for cinematic rendering. If not, our modeling team can create photorealistic 3D models from reference photos, specifications, or physical products. We accommodate virtually any starting point.',
  },
  {
    q: 'Do you create marketing-ready videos?',
    a: 'Every video we deliver is marketing-ready. We optimize for your target platforms — whether that is Amazon product listings, Instagram Reels, TikTok, LinkedIn, YouTube pre-rolls, Connected TV, or your website. Each deliverable comes in the correct aspect ratio, duration, and format for its intended platform, ready to deploy immediately.',
  },
  {
    q: 'Can you create AI UGC campaigns?',
    a: 'Absolutely. Our AI UGC service generates authentic creator-style content at scale — perfect for brands that need a high volume of social media content without the logistics, costs, and unpredictability of real creator partnerships. We produce content that looks and feels genuine, optimized for performance on social platforms.',
  },
  {
    q: 'What industries do you specialize in?',
    a: 'We work across six primary industries: Consumer Electronics, Industrial Hardware, Luxury Products, Automotive & EV, SaaS & Technology, and Lifestyle & Consumer Goods. Our experience spans over 50 projects in these categories, giving us deep domain knowledge that translates into more effective creative work for our clients.',
  },
  {
    q: 'What makes SREALLABS different?',
    a: 'We focus exclusively on making products feel premium through cinematic visual storytelling. Unlike studios that offer generic video production, every project we create is designed to increase perceived product value and drive measurable business outcomes. We combine the artistry of traditional 3D animation with the efficiency of AI-powered tools — delivering Hollywood-grade content at a fraction of traditional production costs.',
  },
]

const stagger = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  }),
}

/* ═══════════════════════════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const { navigate, navigateToProject } = useNavigation()

  const flagshipProject = useMemo(
    () => getProjectBySlug('shark-ai-ultra-robot-vacuum') || getFeaturedProjects()[0],
    [],
  )

  const featuredProjects = useMemo(() => getFeaturedProjects().slice(0, 4), [])

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
            We Make Products Feel Premium.
          </motion.h1>

          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-matte-silver text-base md:text-lg mt-4 max-w-xl leading-relaxed"
          >
            We create cinematic product films, 3D animation and AI-powered visual
            storytelling that help ambitious brands launch better products, increase
            perceived value and capture attention.
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
              View Selected Work
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

      {/* ===== HERO CASE STUDY ===== */}
      {flagshipProject && (
        <section className="py-14 md:py-20 bg-obsidian">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedSection>
              <p className="text-electric-blue text-xs uppercase tracking-[0.2em] font-medium">
                Featured Case Study
              </p>
            </AnimatedSection>

            {/* Video */}
            <AnimatedSection className="mt-6" delay={0.1}>
              <div
                className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => navigateToProject(flagshipProject.slug)}
              >
                <video
                  src={flagshipProject.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                  onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                  onMouseLeave={(e) => {
                    const v = e.target as HTMLVideoElement
                    v.pause()
                    v.currentTime = 0
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20">
                    <Play className="w-6 h-6 md:w-7 md:h-7 text-white ml-1" />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Case Study Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-10 md:mt-12">
              <div>
                <AnimatedSection delay={0.15}>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                    {flagshipProject.client || flagshipProject.title}
                  </h3>
                  <p className="text-matte-silver/60 text-sm mt-1">
                    {flagshipProject.industry} &middot; {flagshipProject.service}
                  </p>
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                  <p className="text-matte-silver text-sm leading-relaxed mt-5">
                    {flagshipProject.challenge}
                  </p>
                </AnimatedSection>
              </div>

              <div className="flex flex-col gap-5">
                <AnimatedSection delay={0.25}>
                  <div>
                    <p className="text-electric-blue text-[10px] uppercase tracking-[0.2em] font-medium mb-2">
                      Approach
                    </p>
                    <p className="text-matte-silver text-sm leading-relaxed">
                      {flagshipProject.solution}
                    </p>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.3}>
                  <div>
                    <p className="text-electric-blue text-[10px] uppercase tracking-[0.2em] font-medium mb-2">
                      Result
                    </p>
                    <p className="text-matte-silver text-sm leading-relaxed">
                      {flagshipProject.result}
                    </p>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.35}>
                  <button
                    onClick={() => navigateToProject(flagshipProject.slug)}
                    className="inline-flex items-center gap-2 text-electric-blue text-sm font-medium hover:gap-3 transition-all w-fit"
                  >
                    View Full Case Study <ArrowRight className="w-4 h-4" />
                  </button>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== SELECTED WORK ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Selected Work"
            subtitle="A curated collection of premium product films, cinematic animations and visual storytelling created for ambitious brands."
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

      {/* ===== WHY PREMIUM VISUAL STORYTELLING MATTERS ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Why Premium Visual Storytelling Matters"
            subtitle="The difference between selling a product and making people want it"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8">
            {/* Before */}
            <AnimatedSection delay={0.1}>
              <div className="bg-surface-card rounded-xl p-6 md:p-8 border border-white/[0.06] h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-fit rounded-lg bg-white/5 p-2.5">
                    <Eye className="w-5 h-5 text-matte-silver/40" />
                  </div>
                  <span className="text-matte-silver/40 text-xs uppercase tracking-[0.15em] font-medium">
                    Traditional Approach
                  </span>
                </div>
                <h3 className="text-white font-medium text-base">
                  Standard Product Photography
                </h3>
                <p className="text-matte-silver/60 text-sm mt-3 leading-relaxed">
                  Static product shots on white backgrounds. Functional but forgettable. They show what
                  a product looks like but fail to communicate the quality, craftsmanship, and emotional
                  appeal that drives purchasing decisions. In competitive markets, this approach blends in
                  rather than stands out, leaving potential customers uninspired and reducing perceived value.
                </p>
                <ul className="mt-4 space-y-2">
                  {['Flat, static imagery', 'No emotional connection', 'Blends with competitors', 'Limited storytelling'].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-1 h-1 rounded-full bg-matte-silver/30 mt-2 flex-shrink-0" />
                      <span className="text-matte-silver/50 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* After */}
            <AnimatedSection delay={0.2}>
              <div className="bg-surface-card rounded-xl p-6 md:p-8 border border-electric-blue/20 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-fit rounded-lg bg-electric-blue/10 p-2.5">
                      <Film className="w-5 h-5 text-electric-blue" />
                    </div>
                    <span className="text-electric-blue text-xs uppercase tracking-[0.15em] font-medium">
                      SREALLABS Approach
                    </span>
                  </div>
                  <h3 className="text-white font-medium text-base">
                    Cinematic Product Visualization
                  </h3>
                  <p className="text-matte-silver text-sm mt-3 leading-relaxed">
                    Dynamic, film-quality content that showcases every detail, material, and feature of your
                    product through dramatic camera work, photorealistic rendering, and purposeful lighting.
                    This approach transforms how customers perceive your product — increasing perceived value,
                    building brand equity, and creating content that stops scrollers and drives action across
                    every platform.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {['Cinematic quality and motion', 'Emotional brand connection', 'Stands out in any feed', 'Compelling product narrative'].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-electric-blue mt-0.5 flex-shrink-0" />
                        <span className="text-matte-silver text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== PREMIUM SERVICES ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Premium Creative Services"
            subtitle="Cinematic visual content designed to increase perceived product value"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
            {premiumServices.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08}>
                <div className="bg-surface-card rounded-xl p-5 md:p-6 border border-white/[0.06] hover:border-electric-blue/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-fit rounded-lg bg-electric-blue/10 p-2.5">
                      <s.icon className="w-5 h-5 text-electric-blue" />
                    </div>
                    <h3 className="text-white font-medium text-base">{s.title}</h3>
                  </div>
                  <p className="text-matte-silver text-sm leading-relaxed">
                    {s.description}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-electric-blue/70 mt-0.5 flex-shrink-0" />
                        <span className="text-matte-silver/70 text-xs">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AI CREATIVE SERVICES ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-electric-blue text-xs uppercase tracking-[0.2em] font-medium">
              Scale Without Compromise
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-white mt-2">
              AI Creative Services
            </h2>
            <p className="text-matte-silver text-sm md:text-base mt-2 max-w-xl leading-relaxed">
              Scale your content production without compromising creative quality.
              AI-powered services for brands that need more content, faster.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
            {aiServices.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="bg-surface-card rounded-xl p-5 md:p-6 border border-white/[0.06] hover:border-electric-blue/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all h-full">
                  <div className="w-fit rounded-lg bg-electric-blue/10 p-2.5 mb-4">
                    <s.icon className="w-5 h-5 text-electric-blue" />
                  </div>
                  <h3 className="text-white font-medium text-base">{s.title}</h3>
                  <p className="text-matte-silver text-sm mt-2 leading-relaxed">
                    {s.description}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-electric-blue/70 mt-0.5 flex-shrink-0" />
                        <span className="text-matte-silver/70 text-xs">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="mt-6">
            <button
              onClick={() => navigate('services')}
              className="inline-flex items-center gap-2 text-electric-blue text-sm font-medium hover:gap-3 transition-all"
            >
              Explore All Services <ArrowRight className="w-4 h-4" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="How We Bring Products to Life"
            subtitle="A proven creative workflow that delivers premium results, every time"
          />

          <div className="mt-8">
            {/* Desktop Timeline */}
            <div className="hidden md:grid grid-cols-4 gap-4 md:gap-6">
              {processSteps.map((step, i) => (
                <AnimatedSection key={step.num} delay={i * 0.1}>
                  <div className="relative">
                    {i < processSteps.length - 1 && (
                      <div
                        className="absolute top-7 left-[calc(100%)] w-[calc(100%-3rem)] h-px bg-white/10 hidden lg:block"
                        style={{ left: '60%', width: '80%' }}
                      />
                    )}
                    <span className="text-electric-blue font-mono text-2xl font-bold">
                      {step.num}
                    </span>
                    <div className="w-fit rounded-lg bg-electric-blue/10 p-2 mt-3">
                      <step.icon className="w-4 h-4 text-electric-blue" />
                    </div>
                    <h3 className="text-white font-medium mt-3 text-base">{step.title}</h3>
                    <p className="text-matte-silver text-sm mt-2 leading-relaxed">
                      {step.description}
                    </p>
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
                      <span className="text-electric-blue font-mono text-lg font-bold">
                        {step.num}
                      </span>
                      {i < processSteps.length - 1 && (
                        <div className="w-px h-full bg-white/10 mt-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="text-white font-medium text-base">{step.title}</h3>
                      <p className="text-matte-silver text-sm mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES ===== */}
      <section className="py-14 md:py-20 bg-obsidian">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            title="Industries We Serve"
            subtitle="Deep domain expertise that translates into more effective creative work"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mt-8">
            {industries.map((ind, i) => (
              <AnimatedSection key={ind.title} delay={i * 0.08}>
                <div className="bg-surface-card rounded-xl p-5 md:p-6 border border-white/[0.06] hover:border-electric-blue/30 hover:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all h-full">
                  <div className="w-fit rounded-lg bg-electric-blue/10 p-2.5">
                    <ind.icon className="w-5 h-5 text-electric-blue" />
                  </div>
                  <h3 className="text-white font-medium mt-4 text-base">{ind.title}</h3>
                  <p className="text-matte-silver text-sm mt-2 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT / MEET SALOME ===== */}
      <section className="py-14 md:py-20 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-center">
            {/* Photo */}
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
                  SREALLABS was founded on a simple belief: every brand deserves content
                  that looks like a million dollars — even if their budget doesn&apos;t say so.
                  Salome combines creative direction, 3D visualization, motion design, and
                  AI-powered production to help brands create premium marketing assets that
                  drive real business outcomes.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <p className="text-matte-silver text-sm md:text-base leading-relaxed">
                  Rather than focusing on the tools or software, SREALLABS is guided by a
                  philosophy of craft over convention. Every project is handcrafted to tell
                  your brand&apos;s unique story with cinematic precision and creative integrity.
                  The result is visual content that doesn&apos;t just look premium — it makes your
                  product feel premium, increasing perceived value and capturing attention in
                  markets where standing out is everything.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.4}>
                <button
                  onClick={() => navigate('about')}
                  className="inline-flex items-center gap-2 text-electric-blue text-sm font-medium hover:gap-3 transition-all w-fit"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </AnimatedSection>
            </div>
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
              Ready to Make Your Product Feel Premium?
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <p className="text-matte-silver mt-4 text-sm md:text-base leading-relaxed">
              Whether you&apos;re launching a new product, preparing for investors or
              creating your next marketing campaign, SREALLABS can help transform your
              vision into cinematic visuals.
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
                View Selected Work
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}