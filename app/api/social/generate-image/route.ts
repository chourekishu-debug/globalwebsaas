// ============================================================
// POST /api/social/generate-image
// Generates an AI image for a social media post
// Free by default using Pollinations.ai
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { generateImage, buildImagePrompt, uploadImageToStorage } from '@/lib/image-generator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, style = 'photorealistic', platform = 'instagram', uploadToStorage = false } = body

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 })
    }

    const prompt = buildImagePrompt(topic, style)
    const result = await generateImage({ topic, prompt, style, platform })

    // Upload to Supabase Storage if requested (needed for LinkedIn real posting)
    let finalUrl = result.url
    if (uploadToStorage && !result.url.startsWith('data:')) {
      finalUrl = await uploadImageToStorage(result.url, topic.slice(0, 30).replace(/\s+/g, '-'))
      result.url = finalUrl
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        source: result.source,
        width: result.width,
        height: result.height,
        free: result.free,
        prompt,
        platform,
      }
    })
  } catch (error: any) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
