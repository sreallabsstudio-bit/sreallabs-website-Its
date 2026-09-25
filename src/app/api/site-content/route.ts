import { NextResponse } from 'next/server'
import { getSiteContentBundle } from '@/lib/site-content-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const bundle = await getSiteContentBundle()
  return NextResponse.json(bundle, { headers: { 'Cache-Control': 'no-store' } })
}
