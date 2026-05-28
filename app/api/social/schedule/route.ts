// ============================================================
// POST /api/social/schedule
// Saves post to DB with scheduled time, cron picks it up
// GET  /api/social/schedule
// Returns all scheduled posts
// ============================================================
import { NextRequest, NextResponse } from 'next/server'

// In-memory store for demo (replace with Supabase in production)
const SCHEDULED: any[] = [
  {
    id: '1', title: '5 Reasons Businesses Need AI Marketing',
    content: 'AI is transforming how businesses reach customers...',
    type: 'article', platforms: ['facebook', 'linkedin'],
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    status: 'scheduled', hashtags: ['#AI','#Marketing','#DigitalMarketing'],
    imageUrl: null,
  },
  {
    id: '2', title: 'Morning Motivation Post',
    content: '🔥 Every lead deserves a reply. Every client deserves results.',
    type: 'post', platforms: ['facebook', 'instagram', 'linkedin'],
    scheduledAt: new Date(Date.now() + 172800000).toISOString(),
    status: 'scheduled', hashtags: ['#GlobalWebAI','#Marketing'],
    imageUrl: null,
  },
]

export async function GET() {
  return NextResponse.json({ success: true, data: SCHEDULED })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { content, title, hashtags, imageUrl, type, platforms, scheduledAt, autoRepeat, repeatFrequency } = body

    const newPost = {
      id: Date.now().toString(),
      title: title || content.slice(0, 60) + '…',
      content,
      type: type || 'post',
      platforms,
      scheduledAt,
      autoRepeat: autoRepeat || false,
      repeatFrequency: repeatFrequency || null,
      hashtags: hashtags || [],
      imageUrl: imageUrl || null,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    }

    SCHEDULED.push(newPost)

    return NextResponse.json({
      success: true,
      data: newPost,
      message: `Scheduled for ${new Date(scheduledAt).toLocaleString('en-IN')} on ${platforms.join(', ')}`,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const idx = SCHEDULED.findIndex(p => p.id === id)
  if (idx > -1) SCHEDULED.splice(idx, 1)
  return NextResponse.json({ success: true })
}
