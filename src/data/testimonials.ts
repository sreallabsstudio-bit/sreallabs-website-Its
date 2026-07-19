export interface Testimonial {
  name: string;
  role: string;
  company?: string;
  industry: string;
  quote: string;
  rating: number; // 1–5
  photo?: string;
  logo?: string;
}

export const trustMetrics = [
  { value: "50+", label: "Projects Delivered" },
  { value: "3+", label: "Years of Experience" },
  { value: "8", label: "Industries Served" },
  { value: "12+", label: "Countries Served" },
] as const;

export const testimonials: Testimonial[] = [
  {
    name: "Marcus Chen",
    role: "Head of Marketing",
    company: "Shark",
    industry: "Consumer Electronics",
    quote:
      "SREALLABS transformed our product listings. The 3D animations they created for our robot vacuum line increased click-through rates by 40% and immediately elevated our brand perception on Amazon. The cinematic quality made our product feel significantly more premium than competitors using standard photography.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Creative Director",
    company: "ZYXEL",
    industry: "Enterprise Networking",
    quote:
      "We needed a studio that could make networking hardware look as premium as it actually is. SREALLABS delivered product films that our enterprise sales team now uses in every pitch. The attention to material detail is extraordinary — these assets directly contributed to closing three major enterprise deals.",
    rating: 5,
  },
  {
    name: "David Okonkwo",
    role: "Founder & CEO",
    company: "Flash Motors",
    industry: "Automotive & EV",
    quote:
      "Working with SREALLABS was effortless. They understood our vision for the electric scooter launch and delivered a product animation that perfectly captured the energy and innovation of our brand. The launch video became our most shared piece of content ever and directly contributed to a 60% increase in pre-orders.",
    rating: 5,
  },
  {
    name: "Elena Vasquez",
    role: "VP of Brand",
    company: "Biova",
    industry: "Lifestyle & Consumer Goods",
    quote:
      "SREALLABS brought our kitchenware collection to life in a way that traditional photography never could. The 3D animations made our products feel premium and aspirational, directly contributing to a 25% uplift in online conversions. They didn't just create content — they helped us reposition our brand.",
    rating: 5,
  },
  {
    name: "James Thornton",
    role: "Director of Product",
    company: "MUZEN Audio",
    industry: "Consumer Electronics",
    quote:
      "The team at SREALLABS has a rare ability to make technology feel human. Their animation for our Bluetooth speaker line didn't just show the product — it made you feel the sound quality. Average time on our product page increased by 35% after implementing their visuals.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "E-Commerce Lead",
    company: "STARS.MARKET",
    industry: "E-Commerce",
    quote:
      "We needed hundreds of product animations that could stop the scroll. SREALLABS delivered at scale without compromising on quality — their AI-powered workflow meant we got premium content at a fraction of the traditional cost. Product pages with their videos see 2.3x higher conversion rates.",
    rating: 5,
  },
];