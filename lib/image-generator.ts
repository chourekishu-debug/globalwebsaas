export interface ImageGenOptions {
  prompt: string
  style?: string
  platform?: string
  brandColor?: string
  topic?: string
}

export interface ImageGenResult {
  url: string
  source: string
  width: number
  height: number
  free: boolean
  prompt?: string
}

const DIMENSIONS: Record<string, { w: number; h: number }> = {
  instagram: { w: 1080, h: 1080 },
  facebook:  { w: 1200, h: 630  },
  linkedin:  { w: 1200, h: 627  },
  default:   { w: 1080, h: 1080 },
}

export function buildImagePrompt(topic: string, style = 'photorealistic'): string {
  const styleGuides: Record<string, string> = {
    photorealistic: 'professional photography, high quality, sharp, well-lit, commercial photography style',
    'digital-art':  'digital illustration, modern, vibrant colors, professional graphic design',
    minimalist:     'clean minimalist design, white background, simple, elegant, professional',
    corporate:      'professional business photography, office setting, corporate style, clean',
    social:         'eye-catching social media graphic, bold colors, engaging, modern design',
  }
  const styleGuide = styleGuides[style] || styleGuides.photorealistic
  return `${topic}, ${styleGuide}, no text overlay, no watermark, suitable for social media marketing, high resolution`
}

export async function generateWithPollinations(options: ImageGenOptions): Promise<ImageGenResult> {
  const platform = options.platform || 'instagram'
  const dims = DIMENSIONS[platform] || DIMENSIONS.default
  const prompt = options.prompt || buildImagePrompt(options.topic || 'business marketing')
  const seed = Math.floor(Math.random() * 999999)
  const encodedPrompt = encodeURIComponent(prompt)
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dims.w}&height=${dims.h}&seed=${seed}&nologo=true&enhance=true`
  return { url, source: 'pollinations', width: dims.w, height: dims.h, free: true, prompt }
}

export async function generateWithUnsplash(options: ImageGenOptions): Promise<ImageGenResult> {
  const platform = options.platform || 'instagram'
  const dims = DIMENSIONS[platform] || DIMENSIONS.default
  const topic = options.topic || 'business marketing'
  const searchQuery = topic.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(w => w.length > 3).slice(0, 3).join(' ') || 'business marketing'
  const url = `https://source.unsplash.com/${dims.w}x${dims.h}/?${encodeURIComponent(searchQuery)}`
  return { url, source: 'unsplash-source', width: dims.w, height: dims.h, free: true }
}

export function generateBrandedPlaceholder(options: ImageGenOptions): ImageGenResult {
  const platform = options.platform || 'instagram'
  const dims = DIMENSIONS[platform] || DIMENSIONS.default
  const color = (options.brandColor || '6C47FF').replace('#', '')
  const text = encodeURIComponent((options.topic || 'Global Web AI').slice(0, 40))
  const url = `https://via.placeholder.com/${dims.w}x${dims.h}/${color}/FFFFFF?text=${text}`
  return { url, source: 'placeholder', width: dims.w, height: dims.h, free: true }
}

export async function generateImage(options: ImageGenOptions): Promise<ImageGenResult> {
  try {
    return await generateWithPollinations(options)
  } catch {
    try {
      return await generateWithUnsplash(options)
    } catch {
      return generateBrandedPlaceholder(options)
    }
  }
}

export async function uploadImageToStorage(imageUrl: string, filename: string): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT') || !serviceKey) return imageUrl
  try {
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) return imageUrl
    const buffer = await imgRes.arrayBuffer()
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
    const ext = contentType.includes('png') ? 'png' : 'jpg'
    const path = `ai-generated/${Date.now()}-${filename}.${ext}`
    const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/social-images/${path}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${serviceKey}`, 'Content-Type': contentType, 'x-upsert': 'true' },
      body: buffer,
    })
    if (uploadRes.ok) return `${supabaseUrl}/storage/v1/object/public/social-images/${path}`
  } catch {
    // Return original URL if upload fails
  }
  return imageUrl
}