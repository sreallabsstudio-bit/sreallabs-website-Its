'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { useNavigation, type PageKey } from '@/store/navigation'

export default function Navbar() {
  const { currentPage, navigate } = useNavigation()
  // Treat project pages as "work" for nav highlighting
  const effectivePage = currentPage === 'project' ? 'work' : currentPage
  const [scrollY, setScrollY] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Track scroll position for header transformation
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial value
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleNav = useCallback((page: PageKey) => {
    navigate(page)
    setMobileOpen(false)
  }, [navigate])

  // ─── Scroll-based header transformation ───
  // Smoothly compress padding and increase opacity as user scrolls
  const isScrolled = scrollY > 20
  const scrollProgress = Math.min(scrollY / 120, 1) // 0→1 over 120px

  // Dynamic values interpolated by scroll
  const paddingTop = 20 - scrollProgress * 8          // 20px → 12px
  const paddingBottom = 20 - scrollProgress * 8       // 20px → 12px
  const bgOpacity = 0.4 + scrollProgress * 0.5        // 0.4 → 0.9
  const shadowOpacity = scrollProgress * 0.3          // 0 → 0.3
  const borderOpacity = scrollProgress * 0.06         // 0 → 0.06

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-500"
        style={{
          paddingTop: `${paddingTop}px`,
          paddingBottom: `${paddingBottom}px`,
          background: `rgba(10, 10, 10, ${bgOpacity})`,
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          boxShadow: isScrolled
            ? `0 4px 30px rgba(0, 0, 0, ${shadowOpacity})`
            : 'none',
        }}
      >
        <nav
          className="max-w-7xl mx-auto px-6 flex items-center justify-between"
          style={{ height: '32px' }}
        >
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex-shrink-0 w-[72px] hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src={siteConfig.assets.logo}
              alt="SREALLABS"
              className="w-full h-auto object-contain"
            />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {siteConfig.nav.map((item) => {
              const isActive = effectivePage === item.href
              return (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href as PageKey)}
                  className="relative flex flex-col items-center gap-0.5"
                >
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-electric-blue' : 'text-matte-silver hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-1 w-1 h-1 rounded-full bg-electric-blue"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-electric-blue text-white text-sm font-medium px-5 py-1.5 rounded-full hover:bg-electric-blue/90 transition-colors duration-300"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-obsidian/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-7">
              {siteConfig.nav.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  onClick={() => handleNav(item.href as PageKey)}
                  className={`text-2xl font-medium transition-colors duration-300 ${
                    currentPage === item.href
                      || (item.href === 'work' && currentPage === 'project')
                        ? 'text-electric-blue'
                        : 'text-matte-silver hover:text-white'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-electric-blue text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-electric-blue/90 transition-colors"
              >
                Book a Call
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}