export const siteConfig = {
  name: "SREALLABS",
  tagline: "Reality, Rendered.",
  founder: "Salome",
  email: "sreallabs.studio@gmail.com",
  calendlyUrl: "https://calendly.com/salomeaicreate/sreallabs-discovery-call",
  socialLinks: {
    facebook: "https://facebook.com/itsRealSalome",
    linkedin: "https://www.linkedin.com/in/itsrealsalome/",
    contra: "https://contra.com/sreallabs",
  },
  assets: {
    logo: "https://res.cloudinary.com/dekgwo8bc/image/upload/v1782339490/A_minimalist__futuristic_3D_vector-style_202606242316-removebg-preview_a6izyn.png",
    founderPhoto: "https://res.cloudinary.com/dekgwo8bc/image/upload/v1782342831/5875302054916460019_vtlydb.jpg",
    heroShowreel: "https://res.cloudinary.com/dekgwo8bc/video/upload/v1782343311/3D_PRODUCT_ANIMATION_VIDEO_CGI_auvo1x.mp4",
    favicon: "https://res.cloudinary.com/dekgwo8bc/image/upload/v1782346170/A_minimalist_geometric_corporate_icon_202606250108_gcyorw.jpg",
  },
  colors: {
    obsidian: "#0A0A0A",
    secondary: "#121212",
    card: "#181818",
    elevated: "#1E1E1E",
    electricBlue: "#2563EB",
    matteSilver: "#A1A1AA",
    acidLime: "#84CC16",
  },
  nav: [
    { label: "Home", href: "home" },
    { label: "Work", href: "work" },
    { label: "Services", href: "services" },
    { label: "About", href: "about" },
    { label: "Contact", href: "contact" },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];