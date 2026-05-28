// ============================================================
// GLOBAL WEB AI — AI Image Generator
// Uses multiple free/low-cost image APIs with fallbacks:
//
// Option 1: Pollinations.ai (100% FREE, no key needed)
//   → Generates images via URL — instant, no signup
//   → Quality: Good for social media
//
// Option 2: Stability AI (Free tier — 25 images/day)
//   → High quality, professional images
//   → Get free key: platform.stability.ai
//
// Option 3: Unsplash API (Free — stock photos)
//   → Real photos, always relevant
//   → Get free key: unsplash.com/developers
//
// Option 4: Placeholder with brand colors (always works)
//   → Branded image with text overlay
// ============================================================

export interface ImageGenOptions {
  prompt: string        // What to generate
  style?: string        // 'photorealistic' | 'digital-art' | 'minimalist' | 'corporate'
  platform?: string     // 'instagram' | 'facebook' | 'linkedin' — affects dimensions
  brandColor?: string   // Hex color for branded fallback
  topic?: string        // Post topic for smart prompt building
}

export interface ImageGenResult {
  url: string           // Public URL of generated image
  source: string        // Which service generated it
  width: number
  height: number
  free: boolean
  prompt?: string
}

// ── Platform dimensions ───────────────────────────────────────
const DIMENSIONS: Record<string, { w: number; h: number }> = {
  instagram: { w: 1080, h: 1080 },  // Square
  facebook:  { w: 1200, h: 630  },  // Landscape
  linkedin:  { w: 1200, h: 627  },  // Landscape
  default:   { w: 1080, h: 1080 },
}

// ── Smart prompt builder ──────────────────────────────────────
export function buildImagePrompt(topic: string, style = 'photorealistic'): string {
  const styleGuides: Record<string, string> = {
    photorealistic: 'professional photography, high quality, sharp, well-lit, commercial photography style',
    'digital-art':  'digital illustration, modern, vibrant colors, professional graphic design',
    minimalist:     'clean minimalist design, white background, simple, elegant, professional',
    corporate:      'professional business photography, office setting, corporate style, clean',
    social:         'eye-catching social media graphic, bold colors, engaging, modern design',
  }

  const styleGuide = styleGuides[style] || styleGuides.photorealistic

  // Build a specific prompt from the topic
  const prompt = `${topic}, ${styleGuide}, no text overlay, no watermark, suitable for social media marketing, high resolution`
  return prompt
}

// ── Option 1: Pollinations.ai (COMPLETELY FREE, no key) ──────
// Works immediately — just a URL call
export async function generateWithPollinations(options: ImageGenOptions): Promise<ImageGenResult> {
  const { platform = 'instagram', topic = '', style = 'photorealistic' } = options
  const dims = DIMENSIONS[platform] || DIMENSIONS.default
  const prompt = options.prompt || buildImagePrompt(topic, style)

  // Pollinations generates via URL — encode prompt and call directly
  const encodedPrompt = encodeURIComponent(prompt)
  const seed = Math.floor(Math.random() * 999999)
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dims.w}&height=${dims.h}&seed=${seed}&nologo=true&enhance=true`

  // Verify it generates (Pollinations always returns an image)
  return {
    url,
    source: 'pollinations',
    width: dims.w,
    height: dims.h,
    free: true,
    prompt,
  }
}

// ── Option 2: Stability AI (25 free images/day) ──────────────
export async function generateWithStability(options: ImageGenOptions): Promise<ImageGenResult> {
  const apiKey = process.env.STABILITY_API_KEY
  if (!apiKey || apiKey.includes('your')) throw new Error('No Stability API key')

  const { platform = 'instagram', topic = '', style = 'photorealistic' } = options
  const dims = DIMENSIONS[platform] || DIMENSIONS.default
  const prompt = options.prompt || buildImagePrompt(topic, style)

  const res = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      text_prompts: [
        { text: prompt, weight: 1 },
        { text: 'blurry, low quality, watermark, text, logo, bad quality', weight: -1 },
      ],
      cfg_scale: 7,
      height: Math.min(dims.h, 1024),
      width: Math.min(dims.w, 1024),
      samples: 1,
      steps: 30,
    }),
  })

  if (!res.ok) throw new Error(`Stability AI error: ${res.statusText}`)
  const data = await res.json()
  const b64 = data.artifacts?.[0]?.base64
  if (!b64) throw new Error('No image returned from Stability AI')

  // Return as data URL — will need to be uploaded to storage for real posts
  return {
    url: `data:image/png;base64,${b64}`,
    source: 'stability-ai',
    width: Math.min(dims.w, 1024),
    height: Math.min(dims.h, 1024),
    free: false,
    prompt,
  }
}

// ── Option 3: Unsplash (free stock photos) ───────────────────
export async function generateWithUnsplash(options: ImageGenOptions): Promise<ImageGenResult> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  const { platform = 'instagram', topic = '' } = options
  const dims = DIMENSIONS[platform] || DIMENSIONS.default

  // Extract key search terms from topic
  const searchQuery = topic
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(w => w.length > 3)
    .slice(0, 3)
    .join(' ') || 'business marketing'

  if (accessKey && !accessKey.includes('your')) {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&content_filter=high`,
      { headers: { 'Authorization': `Client-ID ${accessKey}` } }
    )
    if (res.ok) {
      const data = await res.json()
      const url = `${data.urls.raw}&w=${dims.w}&h=${dims.h}&fit=crop&auto=format&q=80`
      return { url, source: 'unsplash', width: dims.w, height: dims.h, free: true }
    }
  }

  // Fallback: Unsplash source (no key needed, random relevant photo)
  const url = `https://source.unsplash.com/${dims.w}x${dims.h}/?${encodeURIComponent(searchQuery)}`
  return { url, source: 'unsplash-source', width: dims.w, height: dims.h, free: true }
}

// ── Option 4: Branded placeholder (always works) ─────────────
export function generateBrandedPlaceholder(options: ImageGenOptions): ImageGenResult {
  const { platform = 'instagram', topic = '', brandColor = '6C47FF' } = options
  const dims = DIMENSIONS[platform] || DIMENSIONS.default
  const color = brandColor.replace('#', '')
  const text = encodeURIComponent(topic.slice(0, 40) || 'Global Web AI')
  const url = `https://via.placeholder.com/${dims.w}x${dims.h}/${color}/FFFFFF?text=${text}`
  return { url, source: 'placeholder', width: dims.w, height: dims.h, free: true }
}

// ── Master generator — tries each option in order ────────────
export async function generateImage(options: ImageGenOptions): Promise<ImageGenResult> {
  // Try Stability AI first if key is configured
  if (process.env.STABILITY_API_KEY && !process.env.STABILITY_API_KEY.includes('your')) {
    try {
      return await generateWithStability(options)
    } catch (e) {
      console.log('Stability AI failed, trying next:', e)
    }
  }

  // Pollinations is always free and always works — use as primary free option
  try {
    return await generateWithPollinations(options)
  } catch (e) {
    console.log('Pollinations failed, trying Unsplash:', e)
  }

  // Try Unsplash
  try {
    return await generateWithUnsplash(options)
  } catch (e) {
    console.log('Unsplash failed, using placeholder:', e)
  }

  // Final fallback — always works
  return generateBrandedPlaceholder(options)
}

// ── Upload image URL to Supabase Storage ─────────────────────
// Needed for LinkedIn (requires direct upload, not external URL)
export async function uploadImageToStorage(imageUrl: string, filename: string): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT') || !serviceKey) {
    return imageUrl // Return original URL if no Supabase
  }

  try {
    // Fetch image from URL
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) return imageUrl

    const buffer = await imgRes.arrayBuffer()
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
    const ext = contentType.includes('png') ? 'png' : 'jpg'
    const path = `ai-generated/${Date.now()}-${filename}.${ext}`

    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/social-images/${path}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': contentType,
          'x-upsert': 'true',
        },
        body: buffer,
      }
    )

    if (uploadRes.ok) {
      return `${supabaseUrl}/storage/v1/object/public/social-images/${path}`
    }
  } catch (e) {
    console.log('Storage upload failed, using original URL:', e)
  }

  return imageUrl
}
