/**
 * SREALLABS — Centralized SEO & Analytics Configuration
 *
 * Paste your IDs below. All analytics/tracking scripts will
 * activate automatically across the entire website.
 */

export const siteUrl = 'https://www.sreallabs.com'

// ─── Analytics & Verification ───────────────────────────────────
// Paste your IDs here — leave empty string "" to disable.

export const analytics = {
  /** Google Analytics 4 Measurement ID  e.g. "G-XXXXXXXXXX" */
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? '',

  /** Google Search Console verification meta-tag content */
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? '',

  /** Microsoft Clarity Project ID */
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID ?? '',

  /** Google Tag Manager Container ID  e.g. "GTM-XXXXXXX" */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? '',
} as const

// ─── Open Graph / Social ────────────────────────────────────────

export const ogImage =
  'https://res.cloudinary.com/dekgwo8bc/image/upload/v1783125805/SREALLABS_fg0qjm.png'

export const logoUrl =
  'https://res.cloudinary.com/dekgwo8bc/image/upload/v1782339490/A_minimalist__futuristic_3D_vector-style_202606242316-removebg-preview_a6izyn.png'

export const faviconUrl =
  'https://res.cloudinary.com/dekgwo8bc/image/upload/v1782346170/A_minimalist_geometric_corporate_icon_202606250108_gcyorw.jpg'

// ─── Social Profiles (for Organization schema) ──────────────────

export const socialProfiles = {
  facebook: 'https://facebook.com/itsRealSalome',
  linkedin: 'https://www.linkedin.com/in/itsrealsalome/',
  contra: 'https://contra.com/sreallabs',
} as const

// ─── Per-Page SEO Metadata ─────────────────────────────────────

export interface PageSeo {
  title: string
  description: string
  path: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
}

export const pageSeoMap: Record<string, PageSeo> = {
  home: {
    title: 'SREALLABS | Premium Product Visualization & Cinematic 3D Animation Studio',
    description:
      'SREALLABS creates cinematic product films, 3D animation and AI-powered visual storytelling that help ambitious brands increase perceived value, capture attention and drive results.',
    path: '/',
    ogTitle: 'SREALLABS | We Make Products Feel Premium.',
    ogDescription:
      'Premium cinematic product visualization, 3D animation and visual storytelling for brands that want to increase perceived product value.',
  },
  work: {
    title: 'Selected Work | SREALLABS — Premium Product Films & Visual Storytelling',
    description:
      'Explore premium product films, cinematic 3D animations, and visual storytelling created by SREALLABS for brands across consumer electronics, luxury, automotive, SaaS and more.',
    path: '/work',
  },
  services: {
    title: 'Services | SREALLABS — Premium Creative Services for Product Brands',
    description:
      'Discover premium 3D product animation, cinematic product films, AI commercials, AI UGC and visual storytelling services by SREALLABS.',
    path: '/services',
  },
  about: {
    title: 'About | SREALLABS — Premium Creative Studio',
    description:
      'Meet Salome, founder of SREALLABS. Discover how our philosophy of craft, technology and results drives premium visual storytelling for ambitious brands.',
    path: '/about',
  },
  contact: {
    title: 'Contact | SREALLABS — Start Your Premium Visual Project',
    description:
      'Start your next premium visual project with SREALLABS. Book a discovery call or contact us today.',
    path: '/contact',
  },
}

/** Generate project-page SEO dynamically from portfolio data */
export function getProjectSeo(project: {
  title: string
  description: string
  category: string
  industry: string
  slug: string
  thumbnail: string
  video: string
  year: string
}): PageSeo {
  return {
    title: `${project.title} | SREALLABS Portfolio`,
    description: project.description,
    path: `/work/${project.slug}`,
    ogImage: project.thumbnail,
    ogType: 'video.other',
  }
}

// ─── Structured Data Builders ──────────────────────────────────

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SREALLABS',
    url: siteUrl,
    logo: logoUrl,
    image: ogImage,
    description:
      'Premium Creative Studio specializing in cinematic product visualization, 3D animation, AI-powered commercials, and visual storytelling that helps brands increase perceived product value.',
    email: 'sreallabs.studio@gmail.com',
    founder: {
      '@type': 'Person',
      name: 'Salome',
      url: `${siteUrl}/about`,
      jobTitle: 'Founder & Creative Director',
    },
    sameAs: [socialProfiles.facebook, socialProfiles.linkedin, socialProfiles.contra],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'sreallabs.studio@gmail.com',
      availableLanguage: ['English'],
    },
  }
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SREALLABS',
    url: siteUrl,
    description:
      'Premium product visualization, cinematic 3D animation and AI-powered visual storytelling studio.',
    publisher: {
      '@type': 'Organization',
      name: 'SREALLABS',
      logo: logoUrl,
    },
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildVideoObjectSchema(project: {
  title: string
  description: string
  video: string
  thumbnail: string
  year: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: project.title,
    description: project.description,
    contentUrl: project.video,
    thumbnailUrl: project.thumbnail,
    uploadDate: `${project.year}-01-01`,
    publisher: {
      '@type': 'Organization',
      name: 'SREALLABS',
      logo: { '@type': 'ImageObject', url: logoUrl },
    },
  }
}

export function buildImageObjectSchema(project: {
  title: string
  thumbnail: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: project.title,
    contentUrl: project.thumbnail,
    creator: {
      '@type': 'Organization',
      name: 'SREALLABS',
    },
  }
}

export function buildWebPageSchema(project: {
  title: string
  description: string
  slug: string
  thumbnail: string
  year: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: project.title,
    description: project.description,
    url: `${siteUrl}/work/${project.slug}`,
    image: project.thumbnail,
    datePublished: `${project.year}-01-01`,
    dateModified: `${project.year}-01-01`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'SREALLABS',
      url: siteUrl,
    },
  }
}