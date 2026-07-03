'use client'

import { useNavigation } from '@/store/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HomePage from '@/components/home/HomePage'
import WorkPage from '@/components/work/WorkPage'
import ServicesPage from '@/components/services/ServicesPage'
import AboutPage from '@/components/about/AboutPage'
import ContactPage from '@/components/contact/ContactPage'
import ProjectViewer from '@/components/shared/ProjectViewer'
import { AnimatePresence, motion } from 'framer-motion'

export default function Page() {
  const { currentPage } = useNavigation()

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />,
    work: <WorkPage />,
    services: <ServicesPage />,
    about: <AboutPage />,
    contact: <ContactPage />,
    project: <WorkPage />,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
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
      <ProjectViewer />
    </div>
  )
}