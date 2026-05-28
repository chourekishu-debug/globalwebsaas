import { NextRequest, NextResponse } from 'next/server'
import { generateImage, buildImagePrompt, uploadImageToStorage } from '@/lib/image-generator'
import { publishToAllPlatforms } from '@/lib/social-publisher'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

const DEMO_CONTENT: Record<string, any> = {
  post: {
    caption: `AI is changing the way businesses market themselves.\n\nInstead of spending thousands per month on a marketing team, smart businesses now use AI to:\n\n✅ Generate ad copy in seconds\n✅ Auto-post content daily\n✅ Reply to every WhatsApp lead instantly\n✅ Launch campaigns across 5 platforms at once\n\nThe result? 6x ROAS and 65% lower cost per lead.`,
    hashtags: ['#AIMarketing','#DigitalMarketing','#MarketingAutomation','#GlobalWebAI','#BusinessGrowth','#SmallBusiness','#MetaAds','#GoogleAds','#IndiaDigital','#StartupIndia'],
    charCount: 420,
  },
  article: {
    title: 'Why AI is the Future of Digital Marketing for Indian Businesses',
    intro: 'The marketing landscape in India is changing faster than ever. Businesses that adapt to AI-powered marketing automation are seeing results that were impossible just 2 years ago.',
    sections: [
      { heading: 'The Cost Problem', content: 'Running effective digital marketing used to require a team — copywriters, designers, ad specialists. For most businesses, that means thousands per month before a single ad is launched.' },
      { heading: 'What AI Changes', content: 'AI tools can now write compelling ad copy, articles, captions and scripts in seconds. Combined with platform APIs, these tools can launch campaigns and schedule posts automatically.' },
      { heading: 'Real Results', content: 'Businesses using AI marketing automation report 6x ROAS on Meta Ads, 65% reduction in cost per lead, and near-zero response time on WhatsApp leads.' },
    ],
    conclusion: 'The question is no longer whether AI will transform marketing — it already has. The question is whether your business will be among the first to benefit.',
    hashtags: ['#AIMarketing','#DigitalMarketing','#IndiaDigital','#MarketingStrategy','#BusinessGrowth'],
    wordCount: 680,
    readTime: '3 min',
  },
}

async function generateContent(topic: string, type: string, platforms: string[], tone: string): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.includes('your')) {
    return DEMO_CONTENT[type] || DEMO_CONTENT.post
  }

  const prompts: Record<string, string> = {
    post: `Write an engaging social media post about: "${topic}". Tone: ${tone}. For ${platforms.join(' and ')}. Return ONLY JSON: {"caption":"...","hashtags":["#tag",...],"charCount":400}. No markdown.`,
    article: `Write a professional 600-word article about: "${topic}". Tone: ${tone}. For LinkedIn and Facebook. Return ONLY JSON: {"title":"...","intro":"...","sections":[{"heading":"...","content":"..."}],"conclusion":"...","hashtags":["#tag",...],"wordCount":600,"readTime":"3 min"}. No markdown.`,
    reel: `Write a viral reel script about: "${topic}". Return ONLY JSON: {"hook":"...","voiceover":"...","onScreenText":["...","...","...","..."],"cta":"...","duration":"45s","hashtags":["#tag",...],"caption":"..."}. No markdown.`,
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompts[type] || prompts.post }]
    })
    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
    return JSON.parse(raw.replace(/```json\n?|```\n?/g, '').trim())
  } catch {
    return DEMO_CONTENT[type] || DEMO_CONTENT.post
  }
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
  const log = (msg: string) => { logs.push(`[${new Date().toLocaleTimeString()}] ${msg}`) }

  try {
    const body = await req.json()
    const topic = body.topic || ''
    const type = body.type || 'post'
    const platforms = body.platforms || ['facebook', 'linkedin']
    const tone = body.tone || 'professional'
    const style = body.style || 'photorealistic'
    const generateImageAuto = body.generateImageAuto !== false

    if (!topic.trim()) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 })
    }

    log(`Step 1/3: Generating ${type} content with AI...`)
    const contentData = await generateContent(topic, type, platforms, tone)
    const { text, title, hashtags } = extractPostContent(contentData, type)
    log(`Content generated: "${(title || text).slice(0, 60)}..."`)

    let imageUrl = ''
    let imageSource = ''

    if (generateImageAuto) {
      log('Step 2/3: Generating AI image...')
      try {
        const imagePrompt = buildImagePrompt(topic, style)
        const primaryPlatform = platforms.includes('instagram') ? 'instagram' : platforms[0] || 'facebook'
        const imageResult = await generateImage({ topic, prompt: imagePrompt, style, platform: primaryPlatform })
        imageUrl = imageResult.url
        imageSource = imageResult.source
        log(`Image generated via ${imageSource}`)

        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        if (imageUrl && !imageUrl.startsWith('data:') && supabaseKey && !supabaseKey.includes('your')) {
          const storedUrl = await uploadImageToStorage(imageUrl, topic.slice(0, 30).replace(/\s+/g, '-'))
          if (storedUrl !== imageUrl) {
            imageUrl = storedUrl
            log('Image uploaded to storage')
          }
        }
      } catch (e) {
        log(`Image generation failed — posting without image`)
      }
    }

    log(`Step 3/3: Publishing to ${platforms.join(', ')}...`)
    const results = await publishToAllPlatforms({ content: text, title, hashtags, imageUrl, type: type as any, platforms })

    for (const r of results) {
      if (r.success) {
        log(`✓ ${r.platform.toUpperCase()}: Published${r.demo ? ' (demo)' : ''}`)
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
          ? 'Auto-posted in demo mode — add API keys in Settings to go live'
          : `Successfully posted to ${results.filter(r => r.success).map(r => r.platform).join(', ')}`,
      }
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    log(`Fatal error: ${msg}`)
    return NextResponse.json({ error: msg, logs }, { status: 500 })
  }
}