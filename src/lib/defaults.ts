/**
 * Default site content & SEO — the values currently live on the website.
 * Used as (a) fallbacks when the database is unreachable/unconfigured and
 * (b) the initial seed so the admin starts from the real content.
 * The admin can override any of these from /admin/content and /admin/seo.
 */

export const DEFAULT_SITE_CONTENT: Record<string, string> = {
  'home.hero.heading': 'We Make Products Feel Premium.',
  'home.hero.description':
    'Cinematic 3D product animation and visualization for ambitious brands.',
  'home.hero.cta': 'View Selected Work',
  'about.heading': 'Our Story',
  'about.description':
    'SREALLABS is a premium 3D product animation and visualization studio. We combine the artistry of traditional 3D animation with the efficiency of AI-powered tools — delivering Hollywood-grade content at a fraction of traditional production costs.',
  'contact.email': 'sreallabs.studio@gmail.com',
  'contact.calendlyUrl': 'https://calendly.com/salomeaicreate/sreallabs-discovery-call',
  'social.facebook': 'https://facebook.com/itsRealSalome',
  'social.linkedin': 'https://www.linkedin.com/in/itsrealsalome/',
  'social.contra': 'https://contra.com/sreallabs',
}

export const SITE_CONTENT_LABELS: Record<string, string> = {
  'home.hero.heading': 'Homepage hero heading',
  'home.hero.description': 'Homepage hero description',
  'home.hero.cta': 'Homepage CTA label',
  'about.heading': 'About heading',
  'about.description': 'About description',
  'contact.email': 'Contact email',
  'contact.calendlyUrl': 'Calendly URL',
  'social.facebook': 'Facebook URL',
  'social.linkedin': 'LinkedIn URL',
  'social.contra': 'Contra URL',
}

export const DEFAULT_SEO = {
  siteTitle: 'SREALLABS | Premium Product Visualization & Cinematic 3D Animation Studio',
  metaDescription:
    'SREALLABS is a premium 3D product animation and visualization studio. We make products feel premium through cinematic 3D product animation, photorealistic rendering and visual storytelling for ambitious brands.',
  ogImageUrl: 'https://res.cloudinary.com/dekgwo8bc/image/upload/v1783125805/SREALLABS_fg0qjm.png',
}
