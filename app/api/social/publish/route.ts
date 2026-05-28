// ============================================================
// POST /api/social/publish
// Immediately publishes content to selected platforms
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { publishToAllPlatforms, type PublishPayload } from '@/lib/social-publisher'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { content, title, hashtags, imageUrl, type, platforms } = body

    if (!content || !platforms?.length) {
      return NextResponse.json({ error: 'content and platforms are required' }, { status: 400 })
    }

    const payload: PublishPayload = { content, title, hashtags, imageUrl, type: type || 'post', platforms }
    const results = await publishToAllPlatforms(payload)

    const allSuccess = results.every(r => r.success)
    const anySuccess = results.some(r => r.success)
    const anyDemo    = results.some(r => r.demo)

    return NextResponse.json({
      success: anySuccess,
      demo: anyDemo,
      results,
      summary: {
        published: results.filter(r => r.success).map(r => r.platform),
        failed:    results.filter(r => !r.success).map(r => r.platform),
        message:   anyDemo
          ? 'Published in demo mode — add real API keys in Settings to go live'
          : allSuccess
          ? `Successfully published to ${results.map(r=>r.platform).join(', ')}`
          : `Published to ${results.filter(r=>r.success).map(r=>r.platform).join(', ')}. Failed: ${results.filter(r=>!r.success).map(r=>r.platform).join(', ')}`,
      }
    })
  } catch (error: any) {
    console.error('Publish error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
