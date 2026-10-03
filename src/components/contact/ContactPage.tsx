'use client'

import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Calendar, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { siteConfig } from '@/data/siteConfig'
import { useSiteContentStore, contentValue } from '@/store/site-content'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  message: z.string().min(10, 'Please provide more detail'),
})

type ContactForm = z.infer<typeof contactSchema>

const projectTypes = [
  '3D Animation',
  '3D Visualization',
  'Product Rendering & CGI',
  'Industrial Visualization',
  '3D Motion Design',
  'Other 3D Project',
]

export default function ContactPage() {
  const content = useSiteContentStore((s) => s.content)
  const fetchSiteContent = useSiteContentStore((s) => s.fetchSiteContent)

  useEffect(() => {
    fetchSiteContent()
  }, [fetchSiteContent])

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

  const email =
    contentValue(content, 'contact.email') || siteConfig.email

  const calendly =
    contentValue(content, 'contact.calendlyUrl') ||
    siteConfig.calendlyUrl

  const onSubmit = async (data: ContactForm) => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    console.log('Contact form submitted:', data)

    toast.success("Thank you. We'll be in touch soon.")
    reset()
  }

  return (
    <main className="bg-obsidian">

      {/* HERO */}
      <section className="bg-obsidian py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-electric-blue text-sm font-medium uppercase tracking-[0.2em]">
              Contact SREALLABS
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mt-4 max-w-4xl">
              Let&apos;s create something worth seeing.
            </h1>

            <p className="text-matte-silver text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              Have a 3D project in mind? Tell us what you are building,
              and let&apos;s talk about how we can bring it to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT + FORM */}
      <section className="bg-obsidian pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">

            {/* CONTACT INFO */}
            <AnimatedSection>
              <div className="space-y-8">

                <div>
                  <p className="text-white text-xl font-semibold">
                    Start a project
                  </p>

                  <p className="text-matte-silver text-sm mt-2 leading-relaxed max-w-md">
                    Share your idea, product, concept, or visual challenge.
                    We&apos;ll review the details and get back to you.
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-electric-blue/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-electric-blue" />
                  </div>

                  <div>
                    <p className="text-white text-sm font-medium">
                      Email
                    </p>

                    <a
                      href={`mailto:${email}`}
                      className="text-matte-silver text-sm mt-1 inline-block hover:text-electric-blue transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-electric-blue/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-electric-blue" />
                  </div>

                  <div>
                    <p className="text-white text-sm font-medium">
                      Book a Call
                    </p>

                    <a
                      href={calendly}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-electric-blue text-sm mt-1 inline-block hover:underline"
                    >
                      Schedule a conversation →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-electric-blue/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-electric-blue" />
                  </div>

                  <div>
                    <p className="text-white text-sm font-medium">
                      Response Time
                    </p>

                    <p className="text-matte-silver text-sm mt-1">
                      We typically reply within 24 hours.
                    </p>
                  </div>
                </div>

              </div>
            </AnimatedSection>

            {/* FORM */}
            <AnimatedSection delay={0.1}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-surface-card border border-white/[0.06] rounded-2xl p-6 md:p-8 space-y-5"
              >

                {/* NAME */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-white text-sm"
                  >
                    Name
                  </Label>

                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register('name')}
                    className="bg-obsidian border-white/[0.08] text-white placeholder:text-matte-silver/50 h-12"
                  />

                  {errors.name && (
                    <p className="text-destructive text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-white text-sm"
                  >
                    Email
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    {...register('email')}
                    className="bg-obsidian border-white/[0.08] text-white placeholder:text-matte-silver/50 h-12"
                  />

                  {errors.email && (
                    <p className="text-destructive text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* COMPANY */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="company"
                    className="text-white text-sm"
                  >
                    Company
                    <span className="text-matte-silver/50 ml-1">
                      (optional)
                    </span>
                  </Label>

                  <Input
                    id="company"
                    placeholder="Company name"
                    {...register('company')}
                    className="bg-obsidian border-white/[0.08] text-white placeholder:text-matte-silver/50 h-12"
                  />
                </div>

                {/* PROJECT TYPE */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="projectType"
                    className="text-white text-sm"
                  >
                    Project Type
                  </Label>

                  <Select
                    onValueChange={(value) =>
                      setValue('projectType', value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger
                      className="w-full bg-obsidian border-white/[0.08] text-white h-12"
                    >
                      <SelectValue placeholder="Select a project type" />
                    </SelectTrigger>

                    <SelectContent className="bg-surface-elevated border-white/[0.08]">
                      {projectTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-white"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.projectType && (
                    <p className="text-destructive text-xs">
                      {errors.projectType.message}
                    </p>
                  )}
                </div>

                {/* MESSAGE */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="message"
                    className="text-white text-sm"
                  >
                    Tell us about your project
                  </Label>

                  <Textarea
                    id="message"
                    placeholder="What are you looking to create?"
                    rows={6}
                    {...register('message')}
                    className="bg-obsidian border-white/[0.08] text-white placeholder:text-matte-silver/50 min-h-[150px]"
                  />

                  {errors.message && (
                    <p className="text-destructive text-xs">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-electric-blue text-white py-3.5 rounded-full font-medium hover:bg-electric-blue/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Project Inquiry'}
                </button>

              </form>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-surface-secondary py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Prefer a conversation?
          </h2>

          <p className="text-matte-silver mt-3 max-w-xl mx-auto">
            Book a call and let&apos;s talk through your project directly.
          </p>

          <a
            href={calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center bg-electric-blue text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-electric-blue/90 transition-colors"
          >
            Book a Call
          </a>

        </div>
      </section>

    </main>
  )
}