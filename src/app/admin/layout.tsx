import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Admin | SREALLABS' },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-neutral-950 text-neutral-100">{children}</div>
}
