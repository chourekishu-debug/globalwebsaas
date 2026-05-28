import { NextRequest, NextResponse } from 'next/server'

const DEMO: Record<string, any> = {
  adcopy: [
    { headline:"Built for Men Over 40 — Feel the Difference", description:"Your body changes after 40. Our science-backed supplement supports energy, strength & vitality — naturally. Trusted by 10,000+ men across India.", cta:"Shop Now", score:94 },
    { headline:"Why Men Over 40 Are Switching to This", description:"Clinically tested formula with Zinc, Magnesium & Ashwagandha. 67% reported more energy within 2 weeks. 100% natural, zero side effects.", cta:"Try Free", score:91 },
    { headline:"Stop Aging. Start Thriving.", description:"Designed specifically for men 40+. Supports testosterone, stamina & mental clarity. Join 10,000+ men who refused to let age slow them down.", cta:"Learn More", score:88 },
  ],
  headline: [
    { headline:"Built for Men Over 40 — Feel the Difference", type:"benefit", score:94 },
    { headline:"Why Are Thousands of Men Over 40 Switching?", type:"curiosity", score:91 },
    { headline:"Stop Feeling Tired — Natural Energy for Men 40+", type:"problem-solution", score:89 },
    { headline:"Science-Backed Supplement for Men Over 40", type:"authority", score:86 },
    { headline:"Last Chance: 20% Off Men's Health Supplement", type:"urgency", score:84 },
  ],
  post: { caption:"Are you over 40 and tired of feeling tired?\n\nYour energy should not decline just because your age is climbing. Our science-backed supplement is specifically formulated for men over 40.\n\n✅ 100% Natural Ingredients\n✅ Clinically tested formula\n✅ 10,000+ men already switched\n\nDon't just age — thrive. 💪", hook:"Are you over 40 and tired of feeling tired?", cta:"Shop Now", hashtags:["#MensHealth","#Over40","#EnergyBoost","#NaturalHealth"], charCount:380 },
  article: { title:"The Science of Male Vitality After 40", intro:"After 40, the male body undergoes significant hormonal and physiological changes. Understanding these changes is the first step to optimising your health.", sections:[{heading:"How Testosterone Affects Energy After 40",content:"Testosterone levels naturally decline by about 1-2% per year after age 30. This impacts energy levels, muscle mass, mental clarity, and overall vitality."},{heading:"The 5 Key Nutrients Men Over 40 Need",content:"Clinical research points to five essential nutrients: Zinc, Magnesium, Vitamin D3, Ashwagandha, and Tribulus Terrestris."},{heading:"Real Results from Real Men",content:"In a 12-week study, participants reported 67% improvement in energy levels and 54% increase in physical endurance."}], conclusion:"Taking control of your health after 40 is essential. With the right nutritional support, you can feel better at 45 than you did at 35.", hashtags:["#MensHealth","#Science","#Vitality","#Over40"], wordCount:720, readTime:"4 min" },
  reel: { hook:"Stop aging. Start thriving. 🔥", voiceover:"Did you know that after 40, your testosterone drops 1-2% every single year? Our supplement supports energy, strength, and vitality using clinically proven ingredients.", onScreenText:["Your energy is dropping 2% every year ⚡","Here is what is really happening to your body","The natural solution that actually works ✅","10,000+ men already transformed their health 💪"], cta:"Link in bio — Try free for 7 days", duration:"45s", hashtags:["#MenOver40","#EnergyBoost","#Testosterone","#NaturalHealth","#Reels"], musicMood:"upbeat motivational" },
  hashtags: { hashtags:["#MensHealth","#Over40","#HealthSupplement","#EnergyBoost","#NaturalHealth","#Testosterone","#FitAt40","#Wellness","#Stamina","#HealthyLiving","#Supplements","#MenOver40","#Vitality","#StayStrong","#HealthyMen","#NaturalWellness","#PowerUp","#AgingGracefully","#HealthFirst","#MensWellness"], strategy:"Mix of high-volume and niche hashtags for maximum reach and targeting precision." },
  caption: [
    { caption:"🔥 40 is not the end — it is the beginning.\n\nOur science-backed supplement gives men over 40 the energy, strength and stamina they had in their 30s. 100% natural. Zero side effects. Trusted by 10,000+ men.\n\nTap the link in bio to start your free 7-day trial today.", tone:"inspirational" },
    { caption:"Bro, feeling tired all the time after 40? It is not just age — it is nutrition. 💪\n\nOur formula has Zinc, Magnesium & Ashwagandha — exactly what your body needs to bounce back. Try it free for 7 days.", tone:"casual" },
  ],
  audience: [
    { segment:"Health-Conscious Men 40-55", interests:["Health & Wellness","Fitness","Nutrition","Natural Supplements"], age:"40-55", gender:"Male", size:"Large (2-3M)", cpl:"₹180-280", locations:"Mumbai, Delhi, Bangalore, Hyderabad, Pune" },
    { segment:"Working Professionals 38-50", interests:["Career Development","Productivity","Health","Self-Improvement"], age:"38-50", gender:"Male", size:"Medium (800K-1.2M)", cpl:"₹220-350", locations:"Tier 1 cities, IT hubs" },
    { segment:"Fitness Enthusiasts 35-48", interests:["Gym","Bodybuilding","Sports Nutrition","Running"], age:"35-48", gender:"Male", size:"Medium (600K-900K)", cpl:"₹150-240", locations:"Urban India, metro cities" },
  ],
}

// ── OpenRouter API call ───────────────────────────────────────
async function callOpenRouter(prompt: string, apiKey: string): Promise<string> {
  // Try multiple free models
  // Updated May 2026 — use openrouter/free router which auto-selects best available free model
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
              content: 'You are an expert marketing copywriter. Always respond with valid JSON only. No markdown, no explanation, just the JSON object or array.'
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      })

      const data = await res.json()

      if (data.error) {
        lastError = data.error.message || JSON.stringify(data.error)
        continue
      }

      const text = data.choices?.[0]?.message?.content || ''
      if (text && text.length > 10) return text

    } catch (e: any) {
      lastError = e.message
      continue
    }
  }
  throw new Error(`All OpenRouter models failed: ${lastError}`)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const type     = String(body.type     || 'adcopy')
    const product  = String(body.product  || '')
    const platform = String(body.platform || 'meta')
    const tone     = String(body.tone     || 'professional')
    const cta      = String(body.cta      || 'Learn More')

    // Get API key - check env first, then fallback
    const openRouterKey = process.env.OPENROUTER_API_KEY || ''
    const anthropicKey  = process.env.ANTHROPIC_API_KEY  || ''

    const hasOpenRouter = openRouterKey.length > 20 && !openRouterKey.includes('your_key')
    const hasAnthropic  = anthropicKey.length  > 20 && !anthropicKey.includes('your_key')

    if (!hasOpenRouter && !hasAnthropic) {
      return NextResponse.json({ success: true, data: DEMO[type] || DEMO.adcopy, demo: true })
    }

    const prompts: Record<string, string> = {
      adcopy:   `Generate 3 high-converting ${platform} ad copies for: "${product}". Tone: ${tone}. CTA: ${cta}. Return ONLY a JSON array: [{"headline":"...","description":"...","cta":"...","score":85}]`,
      headline: `Write 5 powerful marketing headlines for: "${product}". Return ONLY a JSON array: [{"headline":"...","type":"benefit","score":90}]`,
      post:     `Write an engaging ${platform} social media post for: "${product}". Tone: ${tone}. Include emojis. Return ONLY JSON: {"caption":"...","hook":"...","cta":"...","hashtags":["#tag1","#tag2"],"charCount":300}`,
      article:  `Write a 700-word article about: "${product}". Return ONLY JSON: {"title":"...","intro":"...","sections":[{"heading":"...","content":"..."},{"heading":"...","content":"..."},{"heading":"...","content":"..."}],"conclusion":"...","hashtags":["#tag"],"wordCount":600,"readTime":"3 min"}`,
      reel:     `Write a 45-second viral reel script for: "${product}". Return ONLY JSON: {"hook":"...","voiceover":"...","onScreenText":["...","...","...","..."],"cta":"...","duration":"45s","hashtags":["#tag"],"musicMood":"upbeat"}`,
      hashtags: `Generate 20 powerful hashtags for "${product}" on ${platform}. Return ONLY JSON: {"hashtags":["#tag1","#tag2"],"strategy":"brief explanation"}`,
      caption:  `Write 2 social media captions for "${product}" on ${platform}. Tone: ${tone}. Include emojis. Return ONLY JSON array: [{"caption":"...","tone":"professional"},{"caption":"...","tone":"casual"}]`,
      audience: `Suggest 3 target audience segments for "${product}" on ${platform}. Return ONLY JSON array: [{"segment":"...","interests":["...","..."],"age":"...","gender":"...","size":"Large (2-3M)","cpl":"₹150-250","locations":"..."}]`,
    }

    const prompt = prompts[type] || prompts.adcopy
    let rawText = ''
    let usedDemo = false

    try {
      if (hasAnthropic) {
        // Try Anthropic
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
      console.error('AI call failed:', e.message)
      usedDemo = true
    }

    if (!rawText) {
      usedDemo = true
    }

    if (usedDemo || !rawText) {
      return NextResponse.json({ success: true, data: DEMO[type] || DEMO.adcopy, demo: true })
    }

    // Parse JSON response
    const clean = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/[\x00-\x1F\x7F]/g, ' ')
      .trim()

    // Find JSON in response
    const jsonStart = clean.indexOf('[') !== -1 ? clean.indexOf('[') : clean.indexOf('{')
    const jsonEnd   = clean.lastIndexOf(']') !== -1 ? clean.lastIndexOf(']') + 1 : clean.lastIndexOf('}') + 1

    if (jsonStart === -1 || jsonEnd === 0) {
      return NextResponse.json({ success: true, data: DEMO[type] || DEMO.adcopy, demo: true })
    }

    const jsonStr = clean.slice(jsonStart, jsonEnd)
    const data = JSON.parse(jsonStr)

    return NextResponse.json({ success: true, data, demo: false })

  } catch (e: any) {   return NextResponse.json({ success: true, data: DEMO['adcopy'], demo: true })
  }
}
