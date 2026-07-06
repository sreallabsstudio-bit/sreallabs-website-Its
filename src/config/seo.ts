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
    title: 'SREALLABS | Cinematic 3D Product Animation & AI Commercial Studio',
    description:
      'SREALLABS creates cinematic 3D product animation, AI commercials, AI UGC videos and SaaS product films that help ambitious brands launch, grow and convert.',
    path: '/',
    ogTitle: 'SREALLABS | Reality, Rendered.',
    ogDescription:
      'Premium cinematic 3D product animation, AI commercials and visual storytelling for brands that want to stand out.',
  },
  work: {
    title: 'Our Work | SREALLABS',
    description:
      'Explore cinematic 3D product animation, AI commercials, AI UGC campaigns and SaaS videos created by SREALLABS.',
    path: '/work',
  },
  services: {
    title: 'Services | SREALLABS',
    description:
      'Discover premium 3D product animation, AI video production, SaaS storytelling and creative technology services by SREALLABS.',
    path: '/services',
  },
  about: {
    title: 'About Salome | SREALLABS',
    description:
      'Meet Salome, founder of SREALLABS, and discover the story behind Reality, Rendered.',
    path: '/about',
  },
  contact: {
    title: 'Contact | SREALLABS',
    description:
      'Start your next project with SREALLABS. Book a discovery call or contact us today.',
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
      'Premium Creative Technology Studio specializing in cinematic 3D product animation, AI commercials, AI UGC, and SaaS product videos.',
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
      'Cinematic 3D product animation, AI commercials and creative storytelling studio.',
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