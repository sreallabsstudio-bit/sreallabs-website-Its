'use client'
import AnimatedSection from './AnimatedSection'

interface Props {
  title: string
  subtitle?: string
  className?: string
}

export default function SectionHeading({ title, subtitle, className = '' }: Props) {
  return (
    <AnimatedSection delay={0.1} className={className}>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-matte-silver text-sm md:text-base mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </AnimatedSection>
  )
}