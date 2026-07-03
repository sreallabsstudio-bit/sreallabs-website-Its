'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigation } from '@/store/navigation'
import { portfolio, getRelatedProjects, type PortfolioProject } from '@/data/portfolio'

export default function ProjectViewer() {
  const { selectedProjectId, closeProject, openProject } = useNavigation()

  const project = selectedProjectId
    ? portfolio.find((p) => p.id === selectedProjectId)
    : undefined

  const projectIndex = selectedProjectId
    ? portfolio.findIndex((p) => p.id === selectedProjectId)
    : -1

  const relatedProjects = project ? getRelatedProjects(project) : []

  const goPrev = useCallback(() => {
    if (projectIndex > 0) {
      openProject(portfolio[projectIndex - 1].id)
    }
  }, [projectIndex, openProject])

  const goNext = useCallback(() => {
    if (projectIndex < portfolio.length - 1) {
      openProject(portfolio[projectIndex + 1].id)
    }
  }, [projectIndex, openProject])

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProject()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [closeProject, goPrev, goNext])

  return (
    <AnimatePresence>
      {selectedProjectId && project && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={closeProject}
            className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            aria-label="Close project viewer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev/Next Buttons */}
          {projectIndex > 0 && (
            <button
              onClick={goPrev}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white bg-white/5 rounded-full p-2 hover:bg-white/10 transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {projectIndex < portfolio.length - 1 && (
            <button
              onClick={goNext}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white bg-white/5 rounded-full p-2 hover:bg-white/10 transition-colors"
              aria-label="Next project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Video Section */}
          <div className="flex-1 max-h-[70vh] flex items-center justify-center bg-black">
            <video
              key={project.video}
              src={project.video}
              autoPlay
              muted
              loop
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </div>

          {/* Project Details */}
          <div className="max-h-[30vh] overflow-y-auto p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                {project.title}
              </h2>
              <p className="text-electric-blue text-sm mt-1">
                {project.category} · {project.industry}
              </p>
              <p className="text-matte-silver text-sm mt-3">
                {project.fullDescription}
              </p>

              {/* Challenge / Solution / Result */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-electric-blue font-medium mb-2">
                    Challenge
                  </p>
                  <p className="text-matte-silver text-sm leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-electric-blue font-medium mb-2">
                    Solution
                  </p>
                  <p className="text-matte-silver text-sm leading-relaxed">
                    {project.solution}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-electric-blue font-medium mb-2">
                    Result
                  </p>
                  <p className="text-matte-silver text-sm leading-relaxed">
                    {project.result}
                  </p>
                </div>
              </div>

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-wider text-matte-silver mb-3">
                    Related Projects
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {relatedProjects.map((rp: PortfolioProject) => (
                      <button
                        key={rp.id}
                        onClick={() => openProject(rp.id)}
                        className="flex-shrink-0 w-32 h-20 rounded-md overflow-hidden group/related hover:ring-2 hover:ring-electric-blue/50 transition-all"
                      >
                        <video
                          src={rp.video}
                          poster={rp.thumbnail}
                          muted
                          loop
                          playsInline
                          preload="none"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}