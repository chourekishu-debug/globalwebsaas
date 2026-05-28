import { NextRequest, NextResponse } from 'next/server'

// ── Demo fallback generator — creates relevant content for ANY business ──────
// This runs when AI API is unavailable. Uses the actual product name.
function buildDemo(type: string, product: string, platform: string, tone: string, cta: string): any {
  const p = product || 'Your Business'
  const shortP = p.slice(0, 40)

  const demos: Record<string, any> = {
    adcopy: [
      {
        headline: `${shortP} — The Smart Choice`,
        description: `Looking for the best in ${shortP}? We deliver quality, reliability and results. Join thousands of satisfied customers who made the switch. Limited time offer available now.`,
        cta: cta || 'Learn More',
        score: 91,
      },
      {
        headline: `Why Smart People Choose ${shortP}`,
        description: `Don't settle for less. ${shortP} gives you everything you need — quality, value, and results you can count on. Trusted by customers across India.`,
        cta: cta || 'Get Started',
        score: 88,
      },
      {
        headline: `${shortP} — Results That Speak`,
        description: `Experience the difference with ${shortP}. Our customers see real results within weeks. 100% satisfaction guaranteed. Start your journey today.`,
        cta: cta || cta || 'Book Now',
        score: 85,
      },
    ],

    headline: [
      { headline: `${shortP} — The Smart Choice for You`, type: 'benefit', score: 94 },
      { headline: `Why Thousands Trust ${shortP}`, type: 'authority', score: 91 },
      { headline: `Discover What ${shortP} Can Do for You`, type: 'curiosity', score: 88 },
      { headline: `${shortP} — Results Guaranteed`, type: 'proof', score: 85 },
      { headline: `Limited Time: Get Started with ${shortP} Today`, type: 'urgency', score: 82 },
    ],

    post: {
      caption: `🚀 Excited to share something special!\n\n${p} is here to make a difference. Whether you're looking for quality, value, or results — we've got you covered.\n\n✅ Trusted by thousands\n✅ Results you can see\n✅ 100% commitment to excellence\n\nReady to experience the difference? Drop a comment or DM us! 👇`,
      hook: `🚀 Something exciting is here!`,
      cta: cta || 'DM us now',
      hashtags: [`#${shortP.replace(/\s+/g,'').slice(0,20)}`, '#Business', '#Quality', '#Results', '#India', '#Growth'],
      charCount: 320,
    },

    article: {
      title: `Everything You Need to Know About ${p}`,
      intro: `In today's competitive world, finding the right solution matters more than ever. ${p} has been designed with one goal in mind — delivering real value to real people. Here's why it stands out.`,
      sections: [
        {
          heading: `What Makes ${shortP} Different`,
          content: `Unlike other options in the market, ${p} focuses on what truly matters to customers — quality, consistency, and genuine results. Every aspect has been carefully considered to ensure the best possible experience.`,
        },
        {
          heading: `Real Results from Real Customers`,
          content: `Customers across India have been choosing ${p} and seeing measurable differences in their outcomes. From small businesses to large enterprises, the impact has been consistent and verifiable.`,
        },
        {
          heading: `How to Get Started with ${shortP}`,
          content: `Getting started is simple. Reach out to our team, explain your needs, and we'll guide you through the entire process. Our onboarding is smooth, fast, and designed to get you results quickly.`,
        },
      ],
      conclusion: `${p} represents a genuine opportunity to achieve better outcomes. Whether you're just starting out or looking to improve, now is the right time to make the move.`,
      hashtags: [`#${shortP.replace(/\s+/g,'').slice(0,20)}`, '#Business', '#India', '#Growth', '#Results'],
      wordCount: 580,
      readTime: '3 min',
    },

    reel: {
      hook: `Did you know most people are missing out on ${shortP}? 🤯`,
      voiceover: `Here's the truth — ${p} is changing the game for thousands of people across India. While everyone else is struggling with old solutions, smart people are already making the switch. The results speak for themselves. Don't be the last one to find out.`,
      onScreenText: [
        `Most people don't know about this... 👀`,
        `${shortP} is changing everything 🚀`,
        `Here's why thousands are switching ✅`,
        `Don't miss out — act now! 🔥`,
      ],
      cta: cta || 'Link in bio — Find out more',
      duration: '45s',
      hashtags: [`#${shortP.replace(/\s+/g,'').slice(0,20)}`, '#Trending', '#MustWatch', '#India'],
      musicMood: 'upbeat trending',
    },

    hashtags: {
      hashtags: [
        `#${shortP.replace(/\s+/g,'').slice(0,20)}`,
        '#Business',
        '#India',
        '#Growth',
        '#Marketing',
        '#Success',
        '#Entrepreneur',
        '#Startup',
        '#Quality',
        '#Results',
        '#Innovation',
        '#SmallBusiness',
        '#IndiaDigital',
        '#MakeInIndia',
        '#BusinessGrowth',
        '#CustomerFirst',
        '#Excellence',
        '#TrustWorthiness',
        '#BestInClass',
        '#YourBrand',
      ],
      strategy: `Mix of brand-specific, industry, and broad reach hashtags for ${platform} to maximise visibility and engagement.`,
    },

    caption: [
      {
        caption: `Proud to introduce ${p} to the world! 🌟\n\nWe've built something truly special — focused on delivering real value, real results, and real satisfaction. Our customers are at the heart of everything we do.\n\nExplore what we offer and join our growing community today. ${cta || 'Link in bio'} ✨`,
        tone: 'professional',
      },
      {
        caption: `Okay so we need to talk about ${p} 👀\n\nBecause honestly? It's been a game-changer for so many people and we're just getting started 🚀\n\nDrop a ❤️ if you want to know more or DM us right now!`,
        tone: 'casual',
      },
    ],

    audience: [
      {
        segment: `Primary Target — Core ${shortP} Customers`,
        interests: ['Quality Products', 'Value for Money', 'Trusted Brands', platform === 'linkedin' ? 'Business Growth' : 'Lifestyle'],
        age: '25-45',
        gender: 'All',
        size: 'Large (2-5M)',
        cpl: '₹150-300',
        locations: 'Mumbai, Delhi, Bangalore, Hyderabad, Pune, Chennai',
      },
      {
        segment: `Secondary Target — Aspirational ${shortP} Buyers`,
        interests: ['Self-Improvement', 'Research-Oriented', 'Reviews & Comparisons', 'Best Value'],
        age: '22-38',
        gender: 'All',
        size: 'Medium (1-2M)',
        cpl: '₹200-400',
        locations: 'Tier 1 & Tier 2 cities',
      },
      {
        segment: `Retargeting — Warm ${shortP} Audience`,
        interests: ['Previously Engaged', 'Comparison Shopping', 'Deal Seekers'],
        age: '28-50',
        gender: 'All',
        size: 'Small (200K-500K)',
        cpl: '₹80-180',
        locations: 'Pan India — urban areas',
      },
    ],
  }

  return demos[type] || demos.adcopy
}

// ── OpenRouter API call ───────────────────────────────────────
async function callOpenRouter(prompt: string, apiKey: string): Promise<string> {
  const models = [
    'openrouter/free',
    'deepseek/deepseek-chat:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemma-3-27b-it:free',
    'qwen/qwen3-8b:free',
  ]

  let lastError = ''
  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://globalwebsaas.vercel.app',
          'X-Title': 'Global Web AI',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert marketing copywriter. Always respond with valid JSON only. No markdown, no explanation, just the JSON.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      })

      const data = await res.json()
      if (data.error) { lastError = data.error.message || JSON.stringify(data.error); continue }
      const text = data.choices?.[0]?.message?.content || ''
      if (text && text.length > 10) return text
    } catch (e: any) {
      lastError = e.message
      continue
    }
  }
  throw new Error(`OpenRouter failed: ${lastError}`)
}

export async function POST(req: NextRequest) {
  try {
    const body       = await req.json()
    const type       = String(body.type     || 'adcopy')
    const product    = String(body.product  || '')
    const platform   = String(body.platform || 'meta')
    const tone       = String(body.tone     || 'professional')
    const cta        = String(body.cta      || 'Learn More')

    const openRouterKey = process.env.OPENROUTER_API_KEY || ''
    const anthropicKey  = process.env.ANTHROPIC_API_KEY  || ''
    const hasOpenRouter = openRouterKey.length > 20 && !openRouterKey.includes('your_key')
    const hasAnthropic  = anthropicKey.length  > 20 && !anthropicKey.includes('your_key')

    // No key — return smart demo based on actual product name
    if (!hasOpenRouter && !hasAnthropic) {
      return NextResponse.json({
        success: true,
        data: buildDemo(type, product, platform, tone, cta),
        demo: true,
      })
    }

    const prompts: Record<string, string> = {
      adcopy:   `Generate 3 high-converting ${platform} ad copies for: "${product}". Tone: ${tone}. CTA: "${cta}". Return ONLY a JSON array: [{"headline":"...","description":"...","cta":"...","score":85}]`,
      headline: `Write 5 powerful marketing headlines for: "${product}". Return ONLY a JSON array: [{"headline":"...","type":"benefit","score":90}]`,
      post:     `Write an engaging ${platform} post for: "${product}". Tone: ${tone}. Include emojis. Return ONLY JSON: {"caption":"...","hook":"...","cta":"...","hashtags":["#tag"],"charCount":300}`,
      article:  `Write a 600-word article about: "${product}". Return ONLY JSON: {"title":"...","intro":"...","sections":[{"heading":"...","content":"..."},{"heading":"...","content":"..."},{"heading":"...","content":"..."}],"conclusion":"...","hashtags":["#tag"],"wordCount":600,"readTime":"3 min"}`,
      reel:     `Write a 45-second viral reel script for: "${product}". Return ONLY JSON: {"hook":"...","voiceover":"...","onScreenText":["...","...","...","..."],"cta":"...","duration":"45s","hashtags":["#tag"],"musicMood":"upbeat"}`,
      hashtags: `Generate 20 powerful hashtags for "${product}" on ${platform}. Return ONLY JSON: {"hashtags":["#tag1","#tag2"],"strategy":"brief explanation"}`,
      caption:  `Write 2 social media captions for "${product}" on ${platform}. Tone: ${tone}. Include emojis. Return ONLY JSON array: [{"caption":"...","tone":"professional"},{"caption":"...","tone":"casual"}]`,
      audience: `Suggest 3 target audience segments for "${product}" on ${platform}. Return ONLY JSON array: [{"segment":"...","interests":["...","..."],"age":"...","gender":"...","size":"Large (2-3M)","cpl":"₹150-250","locations":"..."}]`,
    }

    const prompt = prompts[type] || prompts.adcopy
    let rawText = ''

    try {
      if (hasAnthropic) {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
          body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] }),
        })
        const d = await res.json()
        rawText = d.content?.[0]?.text || ''
      }
      if (!rawText && hasOpenRouter) {
        rawText = await callOpenRouter(prompt, openRouterKey)
      }
    } catch (e: any) {
      console.error('AI failed:', e.message)
    }

    // If AI call failed — return smart demo with actual product name
    if (!rawText) {
      return NextResponse.json({
        success: true,
        data: buildDemo(type, product, platform, tone, cta),
        demo: true,
      })
    }

    // Clean and parse JSON
    const clean = rawText.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim()
    const start = clean.indexOf('[') !== -1 && (clean.indexOf('{') === -1 || clean.indexOf('[') < clean.indexOf('{'))
      ? clean.indexOf('[') : clean.indexOf('{')
    const end = clean.lastIndexOf(']') !== -1 && clean.lastIndexOf(']') > clean.lastIndexOf('}')
      ? clean.lastIndexOf(']') + 1 : clean.lastIndexOf('}') + 1

    if (start === -1 || end === 0) {
      return NextResponse.json({ success: true, data: buildDemo(type, product, platform, tone, cta), demo: true })
    }

    const data = JSON.parse(clean.slice(start, end))
    return NextResponse.json({ success: true, data, demo: false })

  } catch {
    return NextResponse.json({ success: true, data: buildDemo('adcopy', '', 'meta', 'professional', 'Learn More'), demo: true })
  }
}
