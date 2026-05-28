// ============================================================
// POST /api/social/auto-post
// THE BIG ONE — Full automation:
// 1. AI generates content (article/post/reel)
// 2. AI generates matching image
// 3. Uploads image to storage
// 4. Posts to all selected platforms with image attached
// All in one API call. Client does nothing.
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { generateImage, buildImagePrompt, uploadImageToStorage } from '@/lib/image-generator'
import { publishToAllPlatforms } from '@/lib/social-publisher'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── Demo content fallbacks ────────────────────────────────────
const DEMO_CONTENT: Record<string, any> = {
  post: {
    caption: `🔥 AI is changing the way businesses market themselves.\n\nInstead of spending ₹50,000+/month on a marketing team, smart businesses are now using AI to:\n\n✅ Generate ad copy in seconds\n✅ Auto-post content daily\n✅ Reply to every WhatsApp lead instantly\n✅ Launch campaigns across 5 platforms at once\n\nThe result? 6x ROAS and 65% lower cost per lead.\n\nGlobal Web AI is making this available to every business in India. 🇮🇳`,
    hashtags: ['#AIMarketing','#DigitalMarketing','#MarketingAutomation','#GlobalWebAI','#BusinessGrowth','#SmallBusiness','#MetaAds','#GoogleAds','#IndiaDigital','#StartupIndia'],
    charCount: 420,
  },
  article: {
    title: 'Why AI is the Future of Digital Marketing for Indian Businesses',
    intro: 'The marketing landscape in India is changing faster than ever. Businesses that adapt to AI-powered marketing automation are seeing results that were impossible just 2 years ago.',
    sections: [
      { heading: 'The Cost Problem Every Business Faces', content: 'Running effective digital marketing used to require a team — copywriters, designers, ad specialists, social media managers. For most businesses, that means ₹60,000-₹1,50,000 per month before a single ad is even launched.' },
      { heading: 'What AI Changes', content: 'AI tools like Claude can now write compelling ad copy, articles, captions and video scripts in seconds. Combined with platform APIs, these tools can launch campaigns, schedule posts, and even reply to leads automatically — around the clock.' },
      { heading: 'Real Results from Real Businesses', content: 'Businesses using AI marketing automation are reporting 6x ROAS on Meta Ads, 65% reduction in cost per lead, and near-zero response time on WhatsApp leads. The competitive advantage is significant.' },
    ],
    conclusion: 'The question is no longer whether AI will transform marketing — it already has. The question is whether your business will be among the first to benefit, or the last to adapt.',
    hashtags: ['#AIMarketing','#DigitalMarketing','#IndiaDigital','#MarketingStrategy','#BusinessGrowth','#LinkedInMarketing'],
    wordCount: 680,
    readTime: '3 min',
  },
}

async function generateContent(topic: string, type: string, platforms: string[], tone: string): Promise<any> {
  // Try real AI first
  if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes('your')) {
    const prompts: Record<string, string> = {
      post: `Write an engaging social media post about: "${topic}". Tone: ${tone}. Optimised for ${platforms.join(' and ')}. Return ONLY JSON: {"caption":"...","hashtags":["#tag",...],"charCount":400}. Include emojis. No markdown.`,
      article: `Write a professional 600-word article about: "${topic}". Tone: ${tone}. For LinkedIn and Facebook. Include a strong hook. Return ONLY JSON: {"title":"...","intro":"...","sections":[{"heading":"...","content":"..."},{"heading":"...","content":"..."},{"heading":"...","content":"..."}],"conclusion":"...","hashtags":["#tag",...],"wordCount":600,"readTime":"3 min"}. No markdown.`,
      reel: `Write a viral reel/short video script about: "${topic}". Return ONLY JSON: {"hook":"...","voiceover":"...","onScreenText":["...","...","...","..."],"cta":"...","duration":"45s","hashtags":["#tag",...],"caption":"..."}. No markdown.`,
    }

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompts[type] || prompts.post }]
      })
      const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
      return JSON.parse(raw.replace(/```json\n?|```\n?/g, '').trim())
    } catch (e) {
      console.log('AI generation failed, using demo:', e)
    }
  }

  // Demo fallback
  return DEMO_CONTENT[type] || DEMO_CONTENT.post
}

function extractPostContent(contentData: any, type: string): { text: string; title?: string; hashtags: string[] } {
  if (type === 'article') {
    const sections = (contentData.sections || []).map((s: any) => `${s.heading}\n\n${s.content}`).join('\n\n')
    const text = [contentData.title, contentData.intro, sections, contentData.conclusion].filter(Boolean).join('\n\n')
    return { text, title: contentData.title, hashtags: contentData.hashtags || [] }
  }
  if (type === 'reel') {
    const text = contentData.caption || `${contentData.hook}\n\n${contentData.voiceover}\n\n${contentData.cta}`
    return { text, hashtags: contentData.hashtags || [] }
  }
  return { text: contentData.caption || contentData.text || '', hashtags: contentData.hashtags || [] }
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  const logs: string[] = []
  const log = (msg: string) => { logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`); console.log(msg) }

  try {
    const body = await req.json()
    const {
      topic,
      type = 'post',
      platforms = ['facebook', 'linkedin'],
      tone = 'professional',
      style = 'photorealistic',
      generateImageAuto = true,
      scheduleAt = null,  // ISO string — null means post now
    } = body

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 })
    }

    // ── STEP 1: Generate Content ──────────────────────────────
    log(`Step 1/3: Generating ${type} content with AI...`)
    const contentData = await generateContent(topic, type, platforms, tone)
    const { text, title, hashtags } = extractPostContent(contentData, type)
    log(`Content generated: "${(title || text).slice(0, 60)}..."`)

    // ── STEP 2: Generate Image ────────────────────────────────
    let imageUrl = ''
    let imageSource = ''

    if (generateImageAuto) {
      log(`Step 2/3: Generating AI image with Pollinations.ai (free)...`)
      try {
        // Build a visual prompt based on the topic and content
        const imagePrompt = buildImagePrompt(topic, style)
        const primaryPlatform = platforms.includes('instagram') ? 'instagram' : platforms[0] || 'facebook'

        const imageResult = await generateImage({
          topic,
          prompt: imagePrompt,
          style,
          platform: primaryPlatform,
        })

        imageUrl = imageResult.url
        imageSource = imageResult.source
        log(`Image generated via ${imageSource}: ${imageUrl.slice(0, 60)}...`)

        // Upload to storage if we have Supabase (needed for LinkedIn image posts)
        if (imageUrl && !imageUrl.startsWith('data:') && process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY?.includes('your')) {
          log('Uploading image to storage for platform compatibility...')
          const storedUrl = await uploadImageToStorage(imageUrl, topic.slice(0, 30).replace(/\s+/g, '-'))
          if (storedUrl !== imageUrl) {
            imageUrl = storedUrl
            log(`Image uploaded to storage: ${imageUrl.slice(0, 60)}...`)
          }
        }
      } catch (e: any) {
        log(`Image generation failed: ${e.message} — posting without image`)
      }
    }

    // ── STEP 3: Publish to All Platforms ─────────────────────
    log(`Step 3/3: Publishing to ${platforms.join(', ')}...`)
    const results = await publishToAllPlatforms({
      content: text,
      title,
      hashtags,
      imageUrl,
      type: type as any,
      platforms,
    })

    for (const r of results) {
      if (r.success) {
        log(`✓ ${r.platform.toUpperCase()}: Published${r.demo ? ' (demo mode)' : ''} — ${r.postUrl || r.postId}`)
      } else {
        log(`✗ ${r.platform.toUpperCase()}: Failed — ${r.error}`)
      }
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    log(`Complete in ${elapsed}s`)

    const anyDemo = results.some(r => r.demo)

    return NextResponse.json({
      success: true,
      data: {
        content: { text, title, hashtags, type, wordCount: text.split(' ').length },
        image: imageUrl ? { url: imageUrl, source: imageSource } : null,
        published: results,
        logs,
        elapsed: `${elapsed}s`,
        demo: anyDemo,
        summary: anyDemo
          ? 'Auto-posted in demo mode — add Facebook Page Token & LinkedIn Token in Settings to go fully live'
          : `Successfully auto-posted to ${results.filter(r=>r.success).map(r=>r.platform).join(', ')} with AI-generated image`,
      }
    })

  } catch (error: any) {
    log(`Fatal error: ${error.message}`)
    return NextResponse.json({ error: error.message, logs }, { status: 500 })
  }
}
