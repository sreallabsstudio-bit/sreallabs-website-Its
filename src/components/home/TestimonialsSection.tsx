'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Star } from 'lucide-react'
import AnimatedSection from '@/components/shared/AnimatedSection'
import { testimonials, trustMetrics, type Testimonial } from '@/data/testimonials'

/* ═══════════════════════════════════════════════════════════════
   STARS
   ═══════════════════════════════════════════════════════════════ */

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? 'text-electric-blue fill-electric-blue' : 'text-white/10'}`}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIAL CARD
   ═══════════════════════════════════════════════════════════════ */

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="h-full bg-surface-card rounded-xl border border-white/[0.06] p-7 md:p-8 flex flex-col transition-all duration-300 hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      {/* Stars */}
      <Stars count={t.rating} />

      {/* Quote */}
      <p className="text-matte-silver/80 text-sm md:text-[15px] leading-[1.8] mt-6 flex-1 font-light">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-7 pt-5 border-t border-white/[0.06]">
        <p className="text-white text-sm font-medium">{t.name}</p>
        <p className="text-matte-silver/50 text-xs mt-0.5">
          {t.role}
          {t.company && (
            <>
              <span className="text-white/10 mx-1.5">&middot;</span>
              {t.company}
            </>
          )}
        </p>
        <p className="text-electric-blue/40 text-[10px] uppercase tracking-[0.12em] mt-2 font-medium">
          {t.industry}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE HOOK
   ═══════════════════════════════════════════════════════════════ */

function useCardsPerView() {
  const [cpv, setCpv] = useState(3)

  useEffect(() => {
    const measure = () => {
      if (window.innerWidth >= 1024) setCpv(3)
      else if (window.innerWidth >= 640) setCpv(2)
      else setCpv(1)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return cpv
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS SECTION
   ═══════════════════════════════════════════════════════════════ */

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cardsPerView = useCardsPerView()
  const maxIndex = Math.max(0, testimonials.length - cardsPerView)

  // Clamp index when viewport changes
  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex)
  }, [index, maxIndex])

  // Auto-advance
  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 5000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [paused, maxIndex])

  // Slide offset as a percentage of the track
  const slidePercent = cardsPerView > 0 ? (index * 100) / cardsPerView : 0

  // Total dots = number of discrete positions
  const totalDots = maxIndex + 1

  return (
    <section className="py-14 md:py-20 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
            Trusted by Brands That Value
            <br className="hidden md:block" /> Exceptional Creative
          </h2>
          <p className="text-matte-silver text-sm md:text-base mt-2.5 max-w-xl leading-relaxed">
            See what clients say about working with SREALLABS and the impact
            our creative work has had on their brands.
          </p>
        </AnimatedSection>

        {/* Trust Metrics */}
        <AnimatedSection className="mt-8" delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustMetrics.map((m) => (
              <div
                key={m.label}
                className="text-center py-3.5 px-4 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <p className="text-xl md:text-2xl font-bold text-electric-blue">
                  {m.value}
                </p>
                <p className="text-matte-silver/50 text-[11px] mt-1.5 tracking-wide">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Carousel */}
        <AnimatedSection className="mt-10" delay={0.15}>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative overflow-hidden rounded-xl"
          >
            {/* Track */}
            <div
              className="flex transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateX(-${slidePercent}%)`,
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>

            {/* Edge fade masks */}
            {index > 0 && (
              <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-surface-secondary to-transparent pointer-events-none z-10" />
            )}
            {index < maxIndex && (
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-surface-secondary to-transparent pointer-events-none z-10" />
            )}
          </div>

          {/* Dot Indicators */}
          {totalDots > 1 && (
            <div className="flex justify-center gap-2 mt-7">
              {Array.from({ length: totalDots }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-6 bg-electric-blue'
                      : 'w-1.5 bg-white/15 hover:bg-white/30'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  )
}