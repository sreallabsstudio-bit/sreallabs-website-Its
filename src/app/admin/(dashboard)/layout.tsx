'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  FolderOpen,
  Tags,
  FileText,
  Search,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/content', label: 'Site Content', icon: FileText },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.email && setEmail(d.email))
      .catch(() => {})
  }, [])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-60 flex-shrink-0 flex-col border-r border-neutral-800 bg-neutral-900/60">
        <div className="border-b border-neutral-800 px-5 py-5">
          <p className="text-sm font-semibold tracking-wide text-white">SREALLABS</p>
          <p className="text-xs text-neutral-500">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-electric-blue/15 font-medium text-electric-blue'
                    : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="space-y-1 border-t border-neutral-800 px-3 py-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800/60 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View website
          </a>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-neutral-400 transition-colors hover:bg-neutral-800/60 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Log out
            {email && <span className="ml-auto truncate text-[10px] text-neutral-600">{email}</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  )
}
