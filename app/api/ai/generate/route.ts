import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const DEMO_RESPONSES: Record<string, any> = {
  adcopy: [
    { headline:"Built for Men Over 40 — Feel the Difference", description:"Your body changes after 40. Our science-backed supplement supports energy, strength & vitality — naturally. Trusted by 10,000+ men.", cta:"Shop Now", score:94 },
    { headline:"Why Men Over 40 Are Switching to This", description:"Clinically tested formula with Zinc, Magnesium & Ashwagandha. 67% reported more energy within 2 weeks. 100% natural, zero side effects.", cta:"Try Free", score:91 },
    { headline:"Stop Aging. Start Thriving. 💪", description:"Designed specifically for men 40+. Supports testosterone, stamina & mental clarity. Join 10,000+ men who refused to let age slow them down.", cta:"Learn More", score:88 },
  ],
  hashtags: { hashtags:["#MensHealth","#Over40","#HealthSupplement","#EnergyBoost","#NaturalHealth","#Testosterone","#FitAt40","#Wellness","#Stamina","#HealthyLiving","#Supplements","#MenOver40","#Vitality","#StayStrong","#HealthyMen","#NaturalWellness","#PowerUp","#AgingGracefully","#HealthFirst","#MensWellness"], strategy:"Mix of high-volume and niche hashtags for maximum reach" },
  headline: [
    { headline:"Built for Men Over 40 — Feel the Difference", type:"benefit", score:94 },
    { headline:"Why Are Thousands of Men Over 40 Switching?", type:"curiosity", score:91 },
    { headline:"Stop Feeling Tired — Natural Energy for Men 40+", type:"problem-solution", score:89 },
    { headline:"Science-Backed Supplement for Men Over 40", type:"authority", score:86 },
    { headline:"Last Chance: 20% Off Men's Health Supplement", type:"urgency", score:84 },
  ],
  post: { caption:"🔥 Are you over 40 and tired of feeling tired?\n\nYour energy shouldn't decline just because your age is climbing. Our science-backed supplement is specifically formulated for men over 40 — supporting testosterone, stamina & vitality naturally.\n\n✅ 100% Natural Ingredients\n✅ Clinically tested formula\n✅ 10,000+ men already switched\n\nDon't just age — thrive. 💪", hook:"Are you over 40 and tired of feeling tired?", cta:"Shop Now → Link in bio", hashtags:["#MensHealth","#Over40","#EnergyBoost","#NaturalHealth"], charCount:412 },
  article: { title:"The Science of Male Vitality After 40: What Every Man Needs to Know", intro:"After 40, the male body undergoes significant hormonal and physiological changes. Understanding these changes is the first step to optimising your health and maintaining the energy and vitality of your younger years.", sections:[{heading:"How Testosterone Affects Energy",content:"Testosterone levels naturally decline by about 1-2% per year after age 30. This gradual decline impacts energy levels, muscle mass, mental clarity, and overall vitality."},{heading:"The 5 Key Nutrients Men Over 40 Need",content:"Clinical research points to five essential nutrients: Zinc, Magnesium, Vitamin D3, Ashwagandha, and Tribulus Terrestris. Together, these work synergistically to support energy and hormonal health."},{heading:"Real Results from Real Men",content:"In a 12-week study, participants reported 67% improvement in energy levels, 54% increase in physical endurance, and significantly better quality of sleep."}], conclusion:"Taking control of your health after 40 is not just possible — it's essential. With the right nutritional support, you can feel better at 45 than you did at 35.", hashtags:["#MensHealth","#Science","#Vitality","#Over40"], wordCount:720, readTime:"4 min" },
  reel: { hook:"Stop aging. Start thriving. 🔥", voiceover:"Did you know that after 40, your testosterone drops 1-2% every single year? That's why you feel tired, unmotivated, and not yourself. But here's what 10,000+ men discovered — you can fight back naturally. Our supplement supports energy, strength, and vitality using clinically proven ingredients.", onScreenText:["Your energy is dropping 2% every year ⚡","Here's what's really happening to your body","The natural solution that actually works","10,000+ men already transformed their health 💪"], cta:"Link in bio — Try free for 7 days", duration:"45s", hashtags:["#MenOver40","#EnergyBoost","#Testosterone","#NaturalHealth","#Reels"], musicMood:"upbeat motivational" },
  audience: [
    { segment:"Health-Conscious Men 40-55", interests:["Health & Wellness","Fitness","Nutrition","Natural Supplements"], age:"40-55", gender:"Male", size:"Large (2-3M)", cpl:"₹180-280", locations:"Mumbai, Delhi, Bangalore, Hyderabad" },
    { segment:"Working Professionals 38-50", interests:["Career Development","Productivity","Health","Self-Improvement"], age:"38-50", gender:"Male", size:"Medium (800K-1.2M)", cpl:"₹220-350", locations:"Tier 1 cities" },
    { segment:"Fitness Enthusiasts 35-48", interests:["Gym","Bodybuilding","Sports","Nutrition"], age:"35-48", gender:"Male", size:"Medium (600K-900K)", cpl:"₹150-240", locations:"Urban India" },
  ],
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, product, platform, tone, objective, audience, cta } = body

    // If no Anthropic key, return demo response
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('your_key')) {
      const demo = DEMO_RESPONSES[type] || DEMO_RESPONSES.adcopy
      await new Promise(r => setTimeout(r, 1500)) // Simulate API delay
      return NextResponse.json({ success: true, data: demo, demo: true })
    }

    const prompts: Record<string, string> = {
      adcopy: `Expert copywriter. Generate 3 high-converting ${platform} ad copies for: "${product}". Tone: ${tone||'professional'}. Objective: ${objective||'leads'}. Return ONLY JSON array: [{"headline":"...","description":"...","cta":"...","score":85}]`,
      hashtags: `Social media strategist. Generate 20 powerful hashtags for "${product}" on ${platform}. Return ONLY JSON: {"hashtags":["#tag",...],"strategy":"..."}`,
      headline: `Copywriter. Write 5 powerful headlines for "${product}". Return ONLY JSON array: [{"headline":"...","type":"benefit|curiosity|urgency|authority|problem-solution","score":90}]`,
      post: `Social media expert. Write an engaging ${platform} post for "${product}". Tone: ${tone||'casual'}. Return ONLY JSON: {"caption":"...","hook":"...","cta":"...","hashtags":[],"charCount":200}`,
      article: `Content writer. Write a 700-word article about "${product}" for LinkedIn/Facebook. Return ONLY JSON: {"title":"...","intro":"...","sections":[{"heading":"...","content":"..."}],"conclusion":"...","hashtags":[],"wordCount":700,"readTime":"4 min"}`,
      reel: `Video scriptwriter. Write a 30-60s reel script for "${product}". Return ONLY JSON: {"hook":"...","voiceover":"...","onScreenText":["...","...","...","..."],"cta":"...","duration":"45s","hashtags":[],"musicMood":"upbeat"}`,
      audience: `Digital marketer. Suggest 3 target audience segments for "${product}" on ${platform}. Return ONLY JSON array: [{"segment":"...","interests":[],"age":"...","gender":"...","size":"...","cpl":"₹...","locations":"..."}]`,
      caption: `Social media writer. Write 2 captions for "${product}" on ${platform}. Tone: ${tone||'professional'}. Return ONLY JSON array: [{"caption":"...","tone":"..."}]`,
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: (prompts[type] || prompts.adcopy) + '. No markdown backticks.' }]
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const clean = raw.replace(/```json\n?|```\n?/g, '').trim()
    const data = JSON.parse(clean)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('AI error:', error)
    // Fallback to demo on any error
    return NextResponse.json({ success: true, data: DEMO_RESPONSES[req.body as any?.type] || DEMO_RESPONSES.adcopy, demo: true })
  }
}
