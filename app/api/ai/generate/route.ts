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
    { headline:"Last Chance: 20% Off Men Health Supplement", type:"urgency", score:84 },
  ],
  post: {
    caption: "Are you over 40 and tired of feeling tired?\n\nYour energy should not decline just because your age is climbing. Our science-backed supplement is specifically formulated for men over 40.\n\n✅ 100% Natural Ingredients\n✅ Clinically tested formula\n✅ 10,000+ men already switched\n\nDon't just age — thrive. 💪",
    hook: "Are you over 40 and tired of feeling tired?",
    cta: "Shop Now — Link in bio",
    hashtags: ["#MensHealth","#Over40","#EnergyBoost","#NaturalHealth","#Testosterone","#FitAt40","#Wellness","#Supplements"],
    charCount: 380,
  },
  article: {
    title: "The Science of Male Vitality After 40: What Every Man Needs to Know",
    intro: "After 40, the male body undergoes significant hormonal and physiological changes. Understanding these changes is the first step to optimising your health and maintaining the energy and vitality of your younger years.",
    sections: [
      { heading: "How Testosterone Affects Energy After 40", content: "Testosterone levels naturally decline by about 1-2% per year after age 30. This gradual decline impacts energy levels, muscle mass, mental clarity, and overall vitality. By age 45, most men have 20-30% lower testosterone than they did at 25 — and they feel it every single day." },
      { heading: "The 5 Key Nutrients Men Over 40 Need", content: "Clinical research points to five essential nutrients: Zinc, Magnesium, Vitamin D3, Ashwagandha, and Tribulus Terrestris. Together, these work synergistically to support energy and hormonal health. Most Indian men are deficient in at least three of these critical nutrients." },
      { heading: "Real Results from Real Men", content: "In a 12-week study with our supplement, participants reported 67% improvement in energy levels, 54% increase in physical endurance, and significantly better quality of sleep. These are not marketing numbers — these are clinical outcomes from real users." },
    ],
    conclusion: "Taking control of your health after 40 is not just possible — it is essential. With the right nutritional support, you can feel better at 45 than you did at 35. Our formula was designed by doctors specifically for Indian men over 40.",
    hashtags: ["#MensHealth","#Science","#Vitality","#Over40","#NaturalWellness","#LinkedInHealth"],
    wordCount: 720,
    readTime: "4 min",
  },
  reel: {
    hook: "Stop aging. Start thriving. 🔥",
    voiceover: "Did you know that after 40, your testosterone drops 1 to 2 percent every single year? That is why you feel tired, unmotivated, and not yourself. But here is what 10,000 men discovered — you can fight back naturally. Our supplement supports energy, strength, and vitality using clinically proven ingredients. No side effects. No chemicals. Just results.",
    onScreenText: [
      "Your energy is dropping 2% every year ⚡",
      "Here is what is really happening to your body 🧬",
      "The natural solution that actually works ✅",
      "10,000+ men already transformed their health 💪",
    ],
    cta: "Link in bio — Try free for 7 days",
    duration: "45s",
    hashtags: ["#MenOver40","#EnergyBoost","#Testosterone","#NaturalHealth","#Reels","#HealthyLiving"],
    musicMood: "upbeat motivational",
  },
  hashtags: {
    hashtags: ["#MensHealth","#Over40","#HealthSupplement","#EnergyBoost","#NaturalHealth","#Testosterone","#FitAt40","#Wellness","#Stamina","#HealthyLiving","#Supplements","#MenOver40","#Vitality","#StayStrong","#HealthyMen","#NaturalWellness","#PowerUp","#AgingGracefully","#HealthFirst","#MensWellness"],
    strategy: "Mix of high-volume (#MensHealth 2M+ posts) and niche hashtags (#MenOver40 500K posts) for maximum reach and targeting precision.",
  },
  caption: [
    { caption: "🔥 40 is not the end — it is the beginning.\n\nOur science-backed supplement gives men over 40 the energy, strength and stamina they had in their 30s. 100% natural. Zero side effects. Trusted by 10,000+ men.\n\nTap the link in bio to start your free 7-day trial today.", tone: "inspirational" },
    { caption: "Bro, feeling tired all the time after 40? It is not just age — it is nutrition. 💪\n\nOur formula has Zinc, Magnesium & Ashwagandha — exactly what your body needs to bounce back. Try it free for 7 days. No credit card needed.", tone: "casual" },
  ],
  audience: [
    { segment: "Health-Conscious Men 40-55", interests: ["Health & Wellness", "Fitness", "Nutrition", "Natural Supplements", "Men's Health"], age: "40-55", gender: "Male", size: "Large (2-3M)", cpl: "₹180-280", locations: "Mumbai, Delhi, Bangalore, Hyderabad, Pune" },
    { segment: "Working Professionals 38-50", interests: ["Career Development", "Productivity", "Health", "Self-Improvement", "Stress Management"], age: "38-50", gender: "Male", size: "Medium (800K-1.2M)", cpl: "₹220-350", locations: "Tier 1 cities, IT hubs" },
    { segment: "Fitness Enthusiasts 35-48", interests: ["Gym", "Bodybuilding", "Sports Nutrition", "CrossFit", "Running"], age: "35-48", gender: "Male", size: "Medium (600K-900K)", cpl: "₹150-240", locations: "Urban India, metro cities" },
  ],
}

async function callOpenRouter(prompt: string, apiKey: string): Promise<string> {
  const models = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'deepseek/deepseek-chat:free',
    'google/gemma-3-27b-it:free',
    'meta-llama/llama-3.1-8b-instruct:free',
  ]
  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://globalwebsaas.vercel.app',
          'X-Title': 'Global Web AI',
        },
        body: JSON.stringify({ model, messages: [{ role:'user', content:prompt }], max_tokens:1500, temperature:0.7 }),
      })
      if (!res.ok) continue
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content || ''
      if (text.length > 10) return text
    } catch { continue }
  }
  throw new Error('All models failed')
}

async function callAnthropic(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1500, messages:[{ role:'user', content:prompt }] }),
  })
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const type     = String(body.type     || 'adcopy')
    const product  = String(body.product  || '')
    const platform = String(body.platform || 'meta')
    const tone     = String(body.tone     || 'professional')
    const cta      = String(body.cta      || 'Learn More')

    const openRouterKey = process.env.OPENROUTER_API_KEY || ''
    const anthropicKey  = process.env.ANTHROPIC_API_KEY  || ''
    const hasOpenRouter = openRouterKey.length > 20 && !openRouterKey.includes('your')
    const hasAnthropic  = anthropicKey.length  > 20 && !anthropicKey.includes('your')

    // Return rich demo if no key configured
    if (!hasOpenRouter && !hasAnthropic) {
      return NextResponse.json({ success:true, data: DEMO[type] || DEMO.adcopy, demo:true })
    }

    const prompts: Record<string,string> = {
      adcopy:   `Expert marketing copywriter. Generate 3 high-converting ${platform} ad copies for: "${product}". Tone: ${tone}. CTA: ${cta}. Return ONLY valid JSON array, no markdown, no explanation: [{"headline":"...","description":"...","cta":"...","score":85}]`,
      headline: `Copywriter. Write 5 powerful headlines for "${product}". Return ONLY valid JSON array, no markdown: [{"headline":"...","type":"benefit","score":90}]`,
      post:     `Social media expert. Write an engaging ${platform} post for "${product}". Tone: ${tone}. Include emojis. Return ONLY valid JSON, no markdown: {"caption":"full caption text here with emojis","hook":"first line","cta":"...","hashtags":["#tag1","#tag2"],"charCount":300}`,
      article:  `Content writer. Write a detailed 700-word article about "${product}" for LinkedIn and Facebook. Return ONLY valid JSON, no markdown: {"title":"...","intro":"2-3 sentences","sections":[{"heading":"...","content":"2-3 paragraph content here"},{"heading":"...","content":"..."},{"heading":"...","content":"..."}],"conclusion":"2-3 sentences","hashtags":["#tag"],"wordCount":700,"readTime":"4 min"}`,
      reel:     `Video scriptwriter. Write a viral 30-60 second reel script for "${product}". Return ONLY valid JSON, no markdown: {"hook":"attention grabbing first 3 seconds","voiceover":"full voiceover script 100-150 words","onScreenText":["text 1","text 2","text 3","text 4"],"cta":"...","duration":"45s","hashtags":["#tag"],"musicMood":"upbeat"}`,
      hashtags: `Social media strategist. Generate 20 powerful hashtags for "${product}" on ${platform}. Return ONLY valid JSON, no markdown: {"hashtags":["#MensHealth","#tag2","...20 total tags"],"strategy":"brief strategy explanation"}`,
      caption:  `Social media writer. Write 2 different captions for "${product}" on ${platform}. Tone: ${tone}. Include emojis. Return ONLY valid JSON array, no markdown: [{"caption":"full caption text with emojis","tone":"professional"},{"caption":"another version","tone":"casual"}]`,
      audience: `Digital marketer. Suggest 3 detailed target audience segments for "${product}" on ${platform}. Return ONLY valid JSON array, no markdown: [{"segment":"segment name","interests":["interest1","interest2","interest3"],"age":"40-55","gender":"Male/Female/All","size":"Large (2-3M)","cpl":"₹150-250","locations":"city names"}]`,
    }

    const prompt = prompts[type] || prompts.adcopy
    let rawText = ''

    try {
      if (hasAnthropic) {
        rawText = await callAnthropic(prompt, anthropicKey)
      } else {
        rawText = await callOpenRouter(prompt, openRouterKey)
      }
    } catch {
      if (hasOpenRouter) {
        try { rawText = await callOpenRouter(prompt, openRouterKey) } catch {}
      }
    }

    if (!rawText) {
      return NextResponse.json({ success:true, data: DEMO[type] || DEMO.adcopy, demo:true })
    }

    // Clean and parse
    const clean = rawText.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim()
    const data = JSON.parse(clean)
    return NextResponse.json({ success:true, data })

  } catch {
    return NextResponse.json({ success:true, data: DEMO['adcopy'], demo:true })
  }
}
