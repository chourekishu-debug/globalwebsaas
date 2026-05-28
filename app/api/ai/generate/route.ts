import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

function extractText(data: any): string {
  try {
    const choice = data?.choices?.[0];
    if (!choice) return '';
    const content = choice?.message?.content;
    if (content && typeof content === 'string' && content.trim()) return content.trim();
    const reasoning = choice?.message?.reasoning;
    if (reasoning && typeof reasoning === 'string' && reasoning.trim()) return reasoning.trim();
    const delta = choice?.delta?.content;
    if (delta && typeof delta === 'string' && delta.trim()) return delta.trim();
    const text = choice?.text;
    if (text && typeof text === 'string' && text.trim()) return text.trim();
    return '';
  } catch {
    return '';
  }
}

// Platform-specific ad copy templates
function getAdCopyForPlatform(b: string, platform: string) {
  const configs: Record<string, { variations: any[] }> = {
    'Facebook': {
      variations: [
        { headline: `${b} — Trusted by Thousands in Indore`, body: `Looking for the best care in Indore? ${b} has helped thousands of families get the results they deserve. Our expert team is ready for you. Book your free consultation today! 🙌`, cta: 'Book Free Consultation', platform: 'Facebook', score: 91 },
        { headline: `Special Offer: ${b}`, body: `Don't miss out! ${b} is currently offering exclusive deals for new patients/clients. Limited slots available — claim yours before it's gone. Tag a friend who needs this! 👇`, cta: 'Claim Offer Now', platform: 'Facebook', score: 86 },
        { headline: `Why Indore Chooses ${b}`, body: `With years of experience and hundreds of happy clients, ${b} is Indore's most trusted name. See what everyone is talking about — visit us today or DM to know more.`, cta: 'Learn More', platform: 'Facebook', score: 82 },
      ]
    },
    'Instagram': {
      variations: [
        { headline: `${b} ✨`, body: `Transform your experience with ${b}. Trusted by thousands, delivering results you can see. Book your consultation today.`, cta: 'Book Now', platform: 'Instagram', score: 89 },
        { headline: `Why Choose ${b}? 🔥`, body: `At ${b}, we combine expertise with passion. Your success is our mission. Join our growing community of satisfied customers.`, cta: 'DM Us', platform: 'Instagram', score: 84 },
        { headline: `${b} — Excellence Every Day 💯`, body: `Looking for the best? ${b} offers unmatched quality and service. Don't settle for less — experience the difference today.`, cta: 'Visit Profile', platform: 'Instagram', score: 80 },
      ]
    },
    'LinkedIn': {
      variations: [
        { headline: `${b}: Setting New Standards in Indore`, body: `We're proud to announce that ${b} continues to lead the way in delivering exceptional professional services. Our commitment to excellence and client satisfaction remains our top priority.`, cta: 'Connect With Us', platform: 'LinkedIn', score: 88 },
        { headline: `Why Professionals Choose ${b}`, body: `${b} has earned the trust of hundreds of professionals across Indore. Our data-driven approach and personalized solutions deliver measurable results for every client.`, cta: 'Learn More', platform: 'LinkedIn', score: 84 },
        { headline: `${b} — Building Success Together`, body: `At ${b}, we believe in building long-term partnerships. Our expert team brings years of experience to help you achieve your goals efficiently and effectively.`, cta: 'Get In Touch', platform: 'LinkedIn', score: 80 },
      ]
    },
    'WhatsApp': {
      variations: [
        { headline: `Hi! Enquiring about ${b}`, body: `Hello! I came across ${b} and would love to know more. Could you share details about your services, pricing, and availability? Thank you! 🙏`, cta: 'Send Message', platform: 'WhatsApp', score: 90 },
        { headline: `${b} — Quick Info`, body: `Hey! ${b} is now available in Indore. Best quality, great prices. Reply YES to get our full brochure and current offers! 📲`, cta: 'Reply YES', platform: 'WhatsApp', score: 85 },
        { headline: `Exclusive Deal from ${b}`, body: `🎉 Special offer just for you! ${b} is running a limited-time promotion. Contact us now to avail this exclusive deal before it expires!`, cta: 'Contact Now', platform: 'WhatsApp', score: 81 },
      ]
    },
    'YouTube': {
      variations: [
        { headline: `${b} — Watch What Everyone's Talking About`, body: `Discover why thousands in Indore trust ${b}. In this video, we show you exactly what makes us different — real results, real stories, real impact. Subscribe for more!`, cta: 'Subscribe Now', platform: 'YouTube', score: 87 },
        { headline: `HONEST Review: ${b} in Indore`, body: `We let our results speak for themselves. Watch our latest video to see how ${b} is changing lives in Indore — and how we can help you too.`, cta: 'Watch Now', platform: 'YouTube', score: 83 },
        { headline: `${b} — The Complete Guide`, body: `Everything you need to know about ${b} in one video. From services to pricing to real customer testimonials — we've got it all covered. Like and share if this helped!`, cta: 'Watch & Share', platform: 'YouTube', score: 79 },
      ]
    },
    'Twitter': {
      variations: [
        { headline: `${b} is trending in Indore 🔥`, body: `Thousands are choosing ${b} for a reason. Quality service, expert team, proven results. Find out why → link in bio #Indore #${b.replace(/\s+/g, '')}`, cta: 'Check Bio Link', platform: 'Twitter', score: 86 },
        { headline: `Hot take: ${b} is the best in Indore`, body: `Bold claim? Maybe. But our results back it up. ${b} delivers every time. Come see for yourself. #IndoreBusiness #Quality`, cta: 'Learn More', platform: 'Twitter', score: 82 },
        { headline: `⚡ ${b} — Limited slots open`, body: `We only take limited clients to ensure 100% quality. ${b} has a few spots open this week. DM now before they're gone! #Indore`, cta: 'DM Now', platform: 'Twitter', score: 78 },
      ]
    },
  };

  return configs[platform] || configs['Facebook'];
}

function getDemoContent(tool: string, business: string, platform: string = 'Facebook'): object {
  const b = business || 'Your Business';
  const p = platform || 'Facebook';

  if (tool === 'ad-copy') {
    return getAdCopyForPlatform(b, p);
  }

  const demos: Record<string, object> = {
    'headlines': {
      headlines: [
        { text: `${b}: Where Quality Meets Excellence`, type: 'Benefit-led', score: 91 },
        { text: `Why Thousands Trust ${b} Every Day`, type: 'Social proof', score: 88 },
        { text: `Transform Your Life with ${b}`, type: 'Transformation', score: 85 },
        { text: `${b} — The #1 Choice in Indore`, type: 'Authority', score: 83 },
        { text: `Limited Time: Experience ${b} Today`, type: 'Urgency', score: 80 }
      ]
    },
    'social-post': {
      hook: p === 'LinkedIn' ? `Proud to share something exciting about ${b} 🚀` : `🚀 Big news from ${b}!`,
      body: p === 'LinkedIn'
        ? `At ${b}, we've been working hard to deliver exceptional value to our clients in Indore. Our commitment to quality and customer satisfaction continues to drive everything we do.\n\nHere's what sets us apart:\n✅ Expert team with years of experience\n✅ Personalized solutions for every client\n✅ Proven results and measurable outcomes`
        : `We're passionate about serving you better every day. At ${b}, we believe in delivering exceptional quality and service.\n\nHere's what sets us apart:\n✅ Expert team with years of experience\n✅ Personalized solutions for every client\n✅ Proven results you can trust`,
      cta: p === 'LinkedIn' ? `Interested in learning more? Connect with us or visit our page.` : `📲 DM us or visit our profile to learn more about ${b}!`,
      hashtags: `#${b.replace(/\s+/g, '')} #Indore #Excellence #Quality #${p}Marketing`,
      platform: p
    },
    'article': {
      title: `Why ${b} is Changing the Game in Indore`,
      intro: `In today's competitive landscape, ${b} has emerged as a leading force, setting new standards for quality and customer satisfaction.`,
      sections: [
        { heading: 'The Story Behind the Success', content: `${b} was founded with a simple mission: to deliver exceptional value to every customer. Over the years, this commitment has translated into a loyal customer base and a reputation built on trust.` },
        { heading: 'What Makes Us Different', content: `Unlike others in the industry, ${b} focuses on personalized service and measurable outcomes. Every client receives dedicated attention and customized solutions tailored to their unique needs.` },
        { heading: 'Our Commitment to You', content: `At ${b}, we believe that your success is our success. That's why we continually invest in the best practices, technology, and talent to serve you better every day.` }
      ],
      conclusion: `Whether you're a first-time customer or a long-time partner, ${b} is here to exceed your expectations. Reach out today and discover the difference excellence makes.`,
      wordCount: 312
    },
    'reel-script': {
      hook: `Stop scrolling! Here's something you NEED to know about ${b}... 👀`,
      voiceover: [
        { time: '0-3s', text: `Did you know ${b} is transforming lives right here in Indore?` },
        { time: '3-8s', text: `Most people don't realize the difference quality service can make.` },
        { time: '8-15s', text: `At ${b}, we've helped hundreds of clients achieve their goals — and we can help you too.` },
        { time: '15-20s', text: `Our expert team is ready to give you the personalized attention you deserve.` },
        { time: '20-27s', text: `Don't wait — your best experience with ${b} is just one call away.` },
        { time: '27-30s', text: `Click the link in bio or DM us NOW!` }
      ],
      slides: ['Brand intro shot', 'Team/facility footage', 'Happy customer testimonial', 'Service highlight', 'CTA with contact'],
      music: 'Upbeat, motivational background track'
    },
    'hashtags': {
      primary: [`#${b.replace(/\s+/g, '')}`, '#Indore', '#IndoreBusiness', '#MadhyaPradesh'],
      niche: ['#SmallBusiness', '#LocalBusiness', '#IndoreLocal', '#MadeInIndia', '#IndianBusiness'],
      trending: [`#${p}Marketing`, '#Trending2026', '#ViralContent', '#BusinessGrowth', '#DigitalMarketing'],
      engagement: ['#Follow', '#Like', '#Share', '#Comment', '#SaveThis'],
      strategy: `Use 3-5 primary tags + 5-8 niche tags per post. Rotate trending tags weekly. Always include location tags for local ${p} reach.`
    },
    'captions': {
      instagram: {
        caption: `✨ Excellence is not a destination — it's a journey. And at ${b}, we walk that journey with you every step of the way.\n\n💬 Drop a comment below: What does excellence mean to you?\n\n📲 DM us for more info | Link in bio\n.\n.\n#${b.replace(/\s+/g, '')} #Indore #Excellence`,
        length: 'Medium (recommended for engagement)'
      },
      facebook: {
        caption: `We at ${b} are proud to serve our wonderful community in Indore! 🙌\n\nEvery day, we strive to deliver the best experience possible. Your trust means everything to us, and we promise to always go above and beyond.\n\n👉 Visit us today or send us a message — we'd love to hear from you!\n\n#${b.replace(/\s+/g, '')} #Indore #LocalBusiness`,
        length: 'Long (Facebook favors detailed posts)'
      }
    },
    'audience-ai': {
      segments: [
        { name: 'Local Professionals (25-40)', size: '45,000 in Indore', income: '₹50K–₹1.5L/month', interests: ['Career growth', 'Quality services', 'Convenience', 'Premium brands'], platforms: [p, 'Instagram'], bestTime: '7–9 PM weekdays', cpl: '₹85–120', message: `${b} — Designed for Professionals Like You` },
        { name: 'Business Owners & Entrepreneurs', size: '12,000 in Indore', income: '₹1L+/month', interests: ['ROI', 'Business solutions', 'Networking', 'Efficiency'], platforms: ['LinkedIn', p], bestTime: '8–10 AM & 6–8 PM', cpl: '₹150–220', message: `Scale Smarter with ${b}` },
        { name: 'Families & Homemakers (30-50)', size: '68,000 in Indore', income: '₹30K–₹80K/month', interests: ['Family wellbeing', 'Value for money', 'Trusted brands', 'Convenience'], platforms: [p, 'WhatsApp'], bestTime: '10 AM–12 PM & 7–9 PM', cpl: '₹55–90', message: `${b} — Trusted by Families Across Indore` }
      ]
    }
  };

  return demos[tool] || { message: `Demo content for ${tool} — ${b}` };
}

function buildPrompt(tool: string, business: string, platform: string, tone: string): string {
  const toneStr = tone || 'professional';
  const platformStr = platform || 'Facebook';

  const prompts: Record<string, string> = {
    'ad-copy': `You are an expert Indian digital marketing copywriter. Create 3 ad copy variations specifically for ${platformStr} for: "${business}"
Tone: ${toneStr}. All 3 variations must be labeled platform: "${platformStr}".
Return ONLY valid JSON (no markdown, no explanation):
{"variations":[{"headline":"...","body":"...","cta":"...","platform":"${platformStr}","score":85},{"headline":"...","body":"...","cta":"...","platform":"${platformStr}","score":82},{"headline":"...","body":"...","cta":"...","platform":"${platformStr}","score":79}]}`,

    'headlines': `You are a conversion copywriter. Create 5 powerful headlines for: "${business}"
Tone: ${toneStr}
Return ONLY valid JSON (no markdown):
{"headlines":[{"text":"headline here","type":"Benefit-led","score":90},{"text":"headline here","type":"Social proof","score":87},{"text":"headline here","type":"Transformation","score":84},{"text":"headline here","type":"Authority","score":81},{"text":"headline here","type":"Urgency","score":78}]}`,

    'social-post': `You are a social media expert. Write a viral ${platformStr} post for: "${business}"
Tone: ${toneStr}
Return ONLY valid JSON (no markdown):
{"hook":"opening line","body":"main post content with emojis and line breaks","cta":"call to action","hashtags":"#tag1 #tag2 #tag3","platform":"${platformStr}"}`,

    'article': `You are a content marketer. Write a 300+ word article for: "${business}"
Tone: ${toneStr}
Return ONLY valid JSON (no markdown):
{"title":"...","intro":"...","sections":[{"heading":"...","content":"..."},{"heading":"...","content":"..."},{"heading":"...","content":"..."}],"conclusion":"...","wordCount":320}`,

    'reel-script': `You are a viral video scriptwriter. Create a 30-second Reel script for: "${business}"
Tone: ${toneStr}
Return ONLY valid JSON (no markdown):
{"hook":"attention grabber","voiceover":[{"time":"0-3s","text":"..."},{"time":"3-8s","text":"..."},{"time":"8-15s","text":"..."},{"time":"15-20s","text":"..."},{"time":"20-27s","text":"..."},{"time":"27-30s","text":"..."}],"slides":["slide1","slide2","slide3","slide4","slide5"],"music":"music suggestion"}`,

    'hashtags': `You are a hashtag strategist. Generate hashtags for: "${business}" on ${platformStr}
Return ONLY valid JSON (no markdown):
{"primary":["#tag1","#tag2","#tag3","#tag4"],"niche":["#tag1","#tag2","#tag3","#tag4","#tag5"],"trending":["#tag1","#tag2","#tag3","#tag4","#tag5"],"engagement":["#tag1","#tag2","#tag3","#tag4"],"strategy":"brief strategy note"}`,

    'captions': `You are a caption writer. Write Instagram and Facebook captions for: "${business}"
Tone: ${toneStr}
Return ONLY valid JSON (no markdown):
{"instagram":{"caption":"full instagram caption with emojis and hashtags","length":"Medium"},"facebook":{"caption":"full facebook caption","length":"Long"}}`,

    'audience-ai': `You are a digital marketing strategist in India. Define target audiences for: "${business}" in Indore
Return ONLY valid JSON (no markdown):
{"segments":[{"name":"segment name (age range)","size":"estimated size","income":"income range","interests":["interest1","interest2","interest3","interest4"],"platforms":["platform1","platform2"],"bestTime":"best posting time","cpl":"cost per lead in INR","message":"ad message for this segment"},{"name":"segment name","size":"...","income":"...","interests":["..."],"platforms":["..."],"bestTime":"...","cpl":"...","message":"..."},{"name":"segment name","size":"...","income":"...","interests":["..."],"platforms":["..."],"bestTime":"...","cpl":"...","message":"..."}]}`
  };

  return prompts[tool] || `Generate ${tool} content for: "${business}". Return as JSON.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool, business, platform, tone } = body;

    if (!tool || !business) {
      return NextResponse.json({ error: 'tool and business are required' }, { status: 400 });
    }

    const prompt = buildPrompt(tool, business, platform, tone);

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ result: getDemoContent(tool, business, platform), demo: true });
    }

    const models = [
      'mistralai/mistral-7b-instruct:free',
      'meta-llama/llama-3.2-3b-instruct:free',
      'google/gemma-3-1b-it:free',
    ];

    let lastError = '';

    for (const model of models) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://globalwebsaas.vercel.app',
            'X-Title': 'GlobalWebSaaS AI Generator'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are a marketing AI assistant. Always respond with valid JSON only. No markdown code blocks, no explanation, no preamble. Just raw JSON.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1500,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          lastError = `${model}: ${response.status}`;
          continue;
        }

        const data = await response.json();
        let rawText = extractText(data);
        if (!rawText) { lastError = `${model}: empty response`; continue; }

        rawText = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
        const jsonStart = rawText.search(/[{[]/);
        if (jsonStart > 0) rawText = rawText.slice(jsonStart);
        const jsonEnd = Math.max(rawText.lastIndexOf('}'), rawText.lastIndexOf(']'));
        if (jsonEnd !== -1) rawText = rawText.slice(0, jsonEnd + 1);

        try {
          const parsed = JSON.parse(rawText);
          return NextResponse.json({ result: parsed, model, demo: false });
        } catch {
          lastError = `${model}: JSON parse failed`;
          continue;
        }
      } catch (err: any) {
        lastError = `${model}: ${err.message}`;
        continue;
      }
    }

    return NextResponse.json({ result: getDemoContent(tool, business, platform), demo: true, error: lastError });

  } catch (err: any) {
    return NextResponse.json(
      { result: getDemoContent('ad-copy', 'Your Business', 'Facebook'), demo: true, error: err.message },
      { status: 200 }
    );
  }
}
