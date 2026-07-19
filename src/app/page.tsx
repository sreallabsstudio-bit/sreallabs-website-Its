'use client'

import { useEffect, useMemo } from 'react'
import { useNavigation, getPageFromPath } from '@/store/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HomePage from '@/components/home/HomePage'
import WorkPage from '@/components/work/WorkPage'
import ServicesPage from '@/components/services/ServicesPage'
import AboutPage from '@/components/about/AboutPage'
import ContactPage from '@/components/contact/ContactPage'
import ProjectPage from '@/components/project/ProjectPage'
import StructuredData from '@/components/seo/StructuredData'
import AnalyticsScripts from '@/components/seo/AnalyticsScripts'
import { useDocumentHead } from '@/hooks/useDocumentHead'
import { AnimatePresence, motion } from 'framer-motion'

export default function Page() {
  const { currentPage, initFromUrl } = useNavigation()

  // Dynamic <title>, <meta>, OG, canonical, Twitter — updates on every navigation
  useDocumentHead()

  // ─── Initialize from URL on first mount (deep links, refresh) ───
  useEffect(() => {
    initFromUrl()
  }, [initFromUrl])

  // ─── Browser Back / Forward via popstate ───
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state
      const current = useNavigation.getState()

      if (state?.page === 'project' && state?.slug) {
        useNavigation.setState({
          currentPage: 'project',
          previousPage: current.currentPage,
          currentProjectSlug: state.slug,
        })
        window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }

      if (state?.page) {
        useNavigation.setState({
          currentPage: state.page,
          previousPage: current.currentPage,
          currentProjectSlug: null,
        })
        window.scrollTo({ top: 0, behavior: 'instant' })
        return
      }

      const pathname = window.location.pathname
      if (pathname.startsWith('/work/')) {
        const slug = pathname.replace('/work/', '').replace(/\/$/, '')
        if (slug) {
          useNavigation.setState({
            currentPage: 'project',
            previousPage: current.currentPage,
            currentProjectSlug: slug,
          })
          window.scrollTo({ top: 0, behavior: 'instant' })
          return
        }
      }

      const page = getPageFromPath(pathname)
      useNavigation.setState({
        currentPage: page,
        previousPage: current.currentPage,
        currentProjectSlug: null,
      })
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Memoize page elements so they are not re-created on every render.
  // Only the active page mounts — AnimatePresence handles unmounting.
  const pages = useMemo<Record<string, React.ReactNode>>(
    () => ({
      home: <HomePage />,
      work: <WorkPage />,
      services: <ServicesPage />,
      about: <AboutPage />,
      contact: <ContactPage />,
      project: <ProjectPage />,
    }),
    [],
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1" role="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {pages[currentPage]}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />

      {/* SEO — non-visual */}
      <StructuredData />
      <AnalyticsScripts />
    </div>
  )
}