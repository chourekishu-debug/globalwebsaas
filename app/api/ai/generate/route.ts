import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const DEMO_RESPONSES: Record<string, any> = {
  adcopy: [
    { headline:"Built for Men Over 40 — Feel the Difference", description:"Your body changes after 40. Our science-backed supplement supports energy, strength & vitality — naturally. Trusted by 10,000+ men.", cta:"Shop Now", score:94 },
    { headline:"Why Men Over 40 Are Switching to This", description:"Clinically tested formula with Zinc, Magnesium & Ashwagandha. 67% reported more energy within 2 weeks. 100% natural, zero side effects.", cta:"Try Free", score:91 },
    { headline:"Stop Aging. Start Thriving.", description:"Designed specifically for men 40+. Supports testosterone, stamina & mental clarity. Join 10,000+ men who refused to let age slow them down.", cta:"Learn More", score:88 },
  ],
  hashtags: { hashtags:["#MensHealth","#Over40","#HealthSupplement","#EnergyBoost","#NaturalHealth","#Testosterone","#FitAt40","#Wellness","#Stamina","#HealthyLiving","#Supplements","#MenOver40","#Vitality","#StayStrong","#HealthyMen","#NaturalWellness","#PowerUp","#AgingGracefully","#HealthFirst","#MensWellness"], strategy:"Mix of high-volume and niche hashtags for maximum reach" },
  headline: [
    { headline:"Built for Men Over 40 — Feel the Difference", type:"benefit", score:94 },
    { headline:"Why Are Thousands of Men Over 40 Switching?", type:"curiosity", score:91 },
    { headline:"Stop Feeling Tired — Natural Energy for Men 40+", type:"problem-solution", score:89 },
    { headline:"Science-Backed Supplement for Men Over 40", type:"authority", score:86 },
    { headline:"Last Chance: 20% Off Men's Health Supplement", type:"urgency", score:84 },
  ],
  post: { caption:"Are you over 40 and tired of feeling tired?\n\nYour energy should not decline just because your age is climbing. Our science-backed supplement is specifically formulated for men over 40.\n\n✅ 100% Natural Ingredients\n✅ Clinically tested formula\n✅ 10,000+ men already switched\n\nDon't just age — thrive.", hook:"Are you over 40 and tired of feeling tired?", cta:"Shop Now", hashtags:["#MensHealth","#Over40","#EnergyBoost","#NaturalHealth"], charCount:380 },
  article: { title:"The Science of Male Vitality After 40", intro:"After 40, the male body undergoes significant hormonal changes. Understanding these changes is the first step to optimising your health.", sections:[{heading:"How Testosterone Affects Energy",content:"Testosterone levels naturally decline by about 1-2% per year after age 30. This impacts energy levels, muscle mass, and mental clarity."},{heading:"The 5 Key Nutrients Men Over 40 Need",content:"Clinical research points to five essential nutrients: Zinc, Magnesium, Vitamin D3, Ashwagandha, and Tribulus Terrestris."},{heading:"Real Results",content:"In a 12-week study, participants reported 67% improvement in energy levels and 54% increase in physical endurance."}], conclusion:"Taking control of your health after 40 is essential. With the right nutritional support, you can feel better at 45 than you did at 35.", hashtags:["#MensHealth","#Science","#Vitality","#Over40"], wordCount:720, readTime:"4 min" },
  reel: { hook:"Stop aging. Start thriving.", voiceover:"Did you know that after 40, your testosterone drops 1-2% every single year? Our supplement supports energy, strength, and vitality using clinically proven ingredients.", onScreenText:["Your energy is dropping 2% every year","Here is what is really happening to your body","The natural solution that actually works","10,000+ men already transformed their health"], cta:"Link in bio — Try free for 7 days", duration:"45s", hashtags:["#MenOver40","#EnergyBoost","#Testosterone","#NaturalHealth","#Reels"], musicMood:"upbeat motivational" },
  audience: [
    { segment:"Health-Conscious Men 40-55", interests:["Health","Fitness","Nutrition","Supplements"], age:"40-55", gender:"Male", size:"Large (2-3M)", cpl:"₹180-280", locations:"Mumbai, Delhi, Bangalore" },
    { segment:"Working Professionals 38-50", interests:["Career","Productivity","Health","Self-Improvement"], age:"38-50", gender:"Male", size:"Medium (800K-1.2M)", cpl:"₹220-350", locations:"Tier 1 cities" },
    { segment:"Fitness Enthusiasts 35-48", interests:["Gym","Bodybuilding","Sports","Nutrition"], age:"35-48", gender:"Male", size:"Medium (600K-900K)", cpl:"₹150-240", locations:"Urban India" },
  ],
  caption: [
    { caption:"Are you over 40 and still feeling unstoppable? Our formula is built for men like you.", tone:"professional" },
    { caption:"Bro, 40 is the new 25 — IF you have the right support. Try our supplement and feel the difference in 2 weeks!", tone:"casual" },
  ],
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const type = body.type || 'adcopy'
    const product = body.product || ''
    const platform = body.platform || 'meta'
    const tone = body.tone || 'professional'
    const objective = body.objective || 'leads'
    const cta = body.cta || 'Learn More'

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey.includes('your_key')) {
      const demo = DEMO_RESPONSES[type] || DEMO_RESPONSES.adcopy
      return NextResponse.json({ success: true, data: demo, demo: true })
    }

    const client = new Anthropic({ apiKey })

    const prompts: Record<string, string> = {
      adcopy: `Expert copywriter. Generate 3 high-converting ${platform} ad copies for: "${product}". Tone: ${tone}. Objective: ${objective}. Return ONLY JSON array: [{"headline":"...","description":"...","cta":"...","score":85}]. No markdown.`,
      hashtags: `Social media strategist. Generate 20 powerful hashtags for "${product}" on ${platform}. Return ONLY JSON: {"hashtags":["#tag",...],"strategy":"..."}. No markdown.`,
      headline: `Copywriter. Write 5 powerful headlines for "${product}". Return ONLY JSON array: [{"headline":"...","type":"benefit","score":90}]. No markdown.`,
      post: `Social media expert. Write an engaging ${platform} post for "${product}". Tone: ${tone}. Return ONLY JSON: {"caption":"...","hook":"...","cta":"...","hashtags":[],"charCount":200}. No markdown.`,
      article: `Content writer. Write a 700-word article about "${product}" for LinkedIn and Facebook. Return ONLY JSON: {"title":"...","intro":"...","sections":[{"heading":"...","content":"..."}],"conclusion":"...","hashtags":[],"wordCount":700,"readTime":"4 min"}. No markdown.`,
      reel: `Video scriptwriter. Write a 30-60s reel script for "${product}". Return ONLY JSON: {"hook":"...","voiceover":"...","onScreenText":["...","...","...","..."],"cta":"...","duration":"45s","hashtags":[],"musicMood":"upbeat"}. No markdown.`,
      audience: `Digital marketer. Suggest 3 target audience segments for "${product}" on ${platform}. Return ONLY JSON array: [{"segment":"...","interests":[],"age":"...","gender":"...","size":"...","cpl":"...","locations":"..."}]. No markdown.`,
      caption: `Social media writer. Write 2 captions for "${product}" on ${platform}. Tone: ${tone}. Return ONLY JSON array: [{"caption":"...","tone":"..."}]. No markdown.`,
    }

    const promptText = prompts[type] || prompts.adcopy

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: promptText }]
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : '{}'
    const clean = raw.replace(/```json\n?|```\n?/g, '').trim()
    const data = JSON.parse(clean)
    return NextResponse.json({ success: true, data })

  } catch (error) {
    const demo = DEMO_RESPONSES['adcopy']
    return NextResponse.json({ success: true, data: demo, demo: true })
  }
}