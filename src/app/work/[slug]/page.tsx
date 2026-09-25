import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectPage from '@/components/project/ProjectPage'
import ProjectRouteBridge from '@/components/project/ProjectRouteBridge'
import { getPublicProjectBySlug } from '@/lib/portfolio-server'
import { getSeoSettings } from '@/lib/site-content-server'
import { siteUrl } from '@/config/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [project, seo] = await Promise.all([getPublicProjectBySlug(slug), getSeoSettings()])

  if (!project) {
    return { title: 'Project not found | SREALLABS', robots: { index: false } }
  }

  const title = `${project.title} | SREALLABS Portfolio`
  const description = project.description
  const ogImage = project.thumbnailUrl ?? seo.ogImageUrl ?? undefined
  const canonical = `${siteUrl}/work/${project.slug}`

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: ogImage ? [ogImage] : undefined,
      type: 'video.other',
      siteName: 'SREALLABS',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function WorkProjectPageRoute({ params }: Props) {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)
  if (!project) notFound()

  return (
    <div className="min-h-screen flex flex-col bg-obsidian">
      <Navbar />
      <main className="flex-1" role="main">
        <ProjectPage slugOverride={project.slug} />
      </main>
      <Footer />
      <ProjectRouteBridge slug={project.slug} />
    </div>
  )
}
