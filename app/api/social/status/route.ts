// ============================================================
// GET /api/social/status
// Returns connection status of all social platforms
// ============================================================
import { NextResponse } from 'next/server'

export async function GET() {
  const status = {
    facebook: {
      connected: !!(process.env.META_ACCESS_TOKEN && !process.env.META_ACCESS_TOKEN.includes('your')),
      pageId: process.env.META_PAGE_ID || null,
      features: ['text-post', 'image-post', 'article', 'link-post'],
      setupUrl: 'https://developers.facebook.com/apps',
      docs: 'Add META_ACCESS_TOKEN and META_PAGE_ID in Settings',
    },
    linkedin: {
      connected: !!(process.env.LINKEDIN_ACCESS_TOKEN && !process.env.LINKEDIN_ACCESS_TOKEN.includes('your')),
      personId: process.env.LINKEDIN_PERSON_ID || null,
      orgId: process.env.LINKEDIN_ORG_ID || null,
      features: ['text-post', 'image-post', 'article'],
      setupUrl: 'https://linkedin.com/developers',
      docs: 'Add LINKEDIN_ACCESS_TOKEN in Settings',
    },
    instagram: {
      connected: !!(process.env.INSTAGRAM_USER_ID && process.env.META_ACCESS_TOKEN && !process.env.META_ACCESS_TOKEN.includes('your')),
      userId: process.env.INSTAGRAM_USER_ID || null,
      features: ['image-post', 'reel', 'story', 'carousel'],
      setupUrl: 'https://business.facebook.com',
      docs: 'Add INSTAGRAM_USER_ID in Settings (requires Business account)',
    },
  }

  return NextResponse.json({ success: true, data: status })
}
