'use client'

import { Facebook, Linkedin, Globe, Mail } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { useNavigation, type PageKey } from '@/store/navigation'

export default function Footer() {
  const { navigate } = useNavigation()

  const handleNav = (href: PageKey) => {
    navigate(href)
  }

  return (
    <footer className="bg-obsidian border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Left Column - Brand */}
          <div className="flex flex-col gap-4">
            <img
              src={siteConfig.assets.logo}
              alt="SREALLABS"
              className="w-14 h-auto object-contain"
            />
            <p className="text-white font-medium text-sm">{siteConfig.tagline}</p>
            <p className="text-matte-silver text-sm leading-relaxed">
              Premium creative technology studio crafting cinematic visuals that make brands unforgettable.
            </p>
          </div>

          {/* Middle Column - Navigation */}
          <div className="flex flex-col gap-3">
            <p className="text-white text-sm font-medium mb-1">Navigation</p>
            {siteConfig.nav.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href as PageKey)}
                className="text-matte-silver text-sm hover:text-white transition-colors text-left"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Column - Social */}
          <div className="flex flex-col gap-3">
            <p className="text-white text-sm font-medium mb-1">Connect</p>
            <div className="flex items-center gap-3">
              {siteConfig.socialLinks.facebook && (
                <a
                  href={siteConfig.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-matte-silver hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {siteConfig.socialLinks.linkedin && (
                <a
                  href={siteConfig.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-matte-silver hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {siteConfig.socialLinks.contra && (
                <a
                  href={siteConfig.socialLinks.contra}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-matte-silver hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Contra"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-matte-silver text-sm hover:text-white transition-colors inline-flex items-center gap-2 mt-1"
            >
              <Mail className="w-3.5 h-3.5" />
              {siteConfig.email}
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-matte-silver/60 text-xs">
            &copy; 2024 SREALLABS. All rights reserved.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-matte-silver/60 text-xs hover:text-matte-silver transition-colors"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>
    </footer>
  )
}