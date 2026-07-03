'use client'

import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Calendar, Clock, ExternalLink, Facebook, Linkedin, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { siteConfig } from '@/data/siteConfig'
import AnimatedSection from '@/components/shared/AnimatedSection'
import SectionHeading from '@/components/shared/SectionHeading'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  message: z.string().min(10, 'Please provide more detail (at least 10 characters)'),
})

type ContactForm = z.infer<typeof contactSchema>

const projectTypes = [
  '3D Product Animation',
  'AI Commercials',
  'AI UGC',
  'SaaS Product Video',
  'Other',
]

const socialCards = [
  { name: 'Facebook', icon: Facebook, url: siteConfig.socialLinks.facebook },
  { name: 'LinkedIn', icon: Linkedin, url: siteConfig.socialLinks.linkedin },
  { name: 'Contra', icon: ExternalLink, url: siteConfig.socialLinks.contra },
]

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      projectType: '',
      message: '',
    },
  })

  const onSubmit = async (data: ContactForm) => {
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    console.log('Contact form submitted:', data)
    toast.success("Thank you! We'll be in touch within 24 hours.")
    reset()
  }

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="bg-obsidian py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
          >
            Let&apos;s Talk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-matte-silver mt-3 text-lg md:text-xl"
          >
            Ready to bring your vision to life? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* ===== CONTACT INFO + FORM ===== */}
      <section className="bg-obsidian py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {/* Left: Contact details */}
            <AnimatedSection>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Get in Touch</h2>
                  <p className="text-matte-silver text-sm mt-1">
                    Have a project in mind? Reach out and we&apos;ll get back to you quickly.
                  </p>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Email</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-matte-silver text-sm hover:text-electric-blue transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                {/* Calendly */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Schedule a Call</p>
                    <a
                      href={siteConfig.calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-electric-blue text-sm hover:underline"
                    >
                      Book on Calendly →
                    </a>
                  </div>
                </div>

                {/* Response time */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-electric-blue/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Response Time</p>
                    <p className="text-matte-silver text-sm">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Contact Form */}
            <AnimatedSection delay={0.1}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-white text-sm">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register('name')}
                    className="bg-surface-card border-white/[0.06] text-white placeholder:text-matte-silver/50 h-11 focus-visible:border-electric-blue focus-visible:ring-electric-blue/20"
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-white text-sm">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    {...register('email')}
                    className="bg-surface-card border-white/[0.06] text-white placeholder:text-matte-silver/50 h-11 focus-visible:border-electric-blue focus-visible:ring-electric-blue/20"
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs">{errors.email.message}</p>
                  )}
                </div>

                {/* Company (optional) */}
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-white text-sm">
                    Company <span className="text-matte-silver/50">(optional)</span>
                  </Label>
                  <Input
                    id="company"
                    placeholder="Your company"
                    {...register('company')}
                    className="bg-surface-card border-white/[0.06] text-white placeholder:text-matte-silver/50 h-11 focus-visible:border-electric-blue focus-visible:ring-electric-blue/20"
                  />
                </div>

                {/* Project Type */}
                <div className="space-y-1.5">
                  <Label htmlFor="projectType" className="text-white text-sm">
                    Project Type <span className="text-destructive">*</span>
                  </Label>
                  <Select onValueChange={(val) => setValue('projectType', val, { shouldValidate: true })}>
                    <SelectTrigger
                      className="w-full bg-surface-card border-white/[0.06] text-white h-11 focus:ring-electric-blue/20 data-[placeholder]:text-matte-silver/50"
                    >
                      <SelectValue placeholder="Select a project type" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface-elevated border-white/[0.06]">
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white focus:bg-electric-blue/10 focus:text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.projectType && (
                    <p className="text-destructive text-xs">{errors.projectType.message}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-white text-sm">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project..."
                    rows={5}
                    {...register('message')}
                    className="bg-surface-card border-white/[0.06] text-white placeholder:text-matte-silver/50 min-h-[120px] focus-visible:border-electric-blue focus-visible:ring-electric-blue/20"
                  />
                  {errors.message && (
                    <p className="text-destructive text-xs">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-electric-blue text-white py-3 rounded-full font-medium hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== CALENDLY SECTION ===== */}
      <section className="bg-surface-secondary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-white">
              Schedule a Discovery Call
            </h2>
            <p className="text-matte-silver mt-2 text-base">
              Book a free 30-minute call to discuss your project.
            </p>
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 bg-electric-blue text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-electric-blue/90 transition-colors"
            >
              Book Discovery Call
            </a>
            <p className="text-matte-silver/60 text-sm mt-4">
              Free consultation · No commitment · 30 minutes
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SOCIAL LINKS ===== */}
      <section className="bg-obsidian py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Connect With Us" className="text-center" />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {socialCards.map((card, i) => (
              <AnimatedSection key={card.name} delay={0.1 + i * 0.1}>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-surface-card rounded-xl p-6 border border-white/[0.06] text-center hover:border-electric-blue/30 transition-all group"
                >
                  <card.icon className="w-6 h-6 text-matte-silver mx-auto group-hover:text-electric-blue transition-colors" />
                  <p className="text-white font-medium mt-3">{card.name}</p>
                  <p className="text-matte-silver text-sm mt-0.5">Follow</p>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="bg-surface-secondary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-matte-silver text-sm">
            Prefer email?{' '}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-electric-blue hover:underline inline-flex items-center gap-1"
            >
              {siteConfig.email} <ArrowRight className="w-3 h-3" />
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}