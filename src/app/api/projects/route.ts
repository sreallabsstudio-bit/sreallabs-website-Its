import { NextResponse } from 'next/server'
import { getPublicProjects, getActiveCategories } from '@/lib/portfolio-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [projects, categories] = await Promise.all([getPublicProjects(), getActiveCategories()])
  return NextResponse.json(
    { projects, categories },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
