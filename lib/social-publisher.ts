export interface PublishPayload {
  content: string
  title?: string
  hashtags?: string[]
  imageUrl?: string
  type: 'post' | 'article' | 'reel' | 'carousel' | 'story'
  platforms: string[]
}

export interface PublishResult {
  platform: string
  success: boolean
  postId?: string
  postUrl?: string
  error?: string
  demo?: boolean
}

function buildCaption(payload: PublishPayload): string {
  const tags = (payload.hashtags || []).map(h => h.startsWith('#') ? h : `#${h}`).join(' ')
  return `${payload.content}\n\n${tags}`.trim()
}

function isDemo(token?: string): boolean {
  return !token || token.includes('your') || token.length < 20
}

export async function publishToFacebook(payload: PublishPayload): Promise<PublishResult> {
  const token = process.env.META_ACCESS_TOKEN
  const pageId = process.env.META_PAGE_ID

  if (isDemo(token) || !pageId) {
    await new Promise(r => setTimeout(r, 1200))
    return { platform: 'facebook', success: true, postId: `demo_fb_${Date.now()}`, postUrl: 'https://facebook.com/demo-post', demo: true }
  }

  const caption = buildCaption(payload)

  try {
    let endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`
    let bodyData: Record<string, string> = { message: caption, access_token: token! }

    if ((payload.imageUrl) && payload.type !== 'article') {
      endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`
      bodyData = { url: payload.imageUrl, caption, access_token: token!, published: 'true' }
    }

    if (payload.type === 'article' && payload.title) {
      bodyData.message = `${payload.title}\n\n${caption}`
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return { platform: 'facebook', success: true, postId: data.id, postUrl: `https://facebook.com/${data.id}` }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return { platform: 'facebook', success: false, error: msg }
  }
}

export async function publishToLinkedIn(payload: PublishPayload): Promise<PublishResult> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  const personId = process.env.LINKEDIN_PERSON_ID
  const orgId = process.env.LINKEDIN_ORG_ID

  if (isDemo(token)) {
    await new Promise(r => setTimeout(r, 1000))
    return { platform: 'linkedin', success: true, postId: `demo_li_${Date.now()}`, postUrl: 'https://linkedin.com/feed/update/demo', demo: true }
  }

  const author = orgId ? `urn:li:organization:${orgId}` : `urn:li:person:${personId}`
  const caption = buildCaption(payload)
  const text = payload.type === 'article' && payload.title ? `${payload.title}\n\n${caption}` : caption

  try {
    const body = {
      author,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
    }
    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (data.status >= 400) throw new Error(data.message || 'LinkedIn post failed')
    return { platform: 'linkedin', success: true, postId: data.id, postUrl: `https://www.linkedin.com/feed/update/${data.id}` }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return { platform: 'linkedin', success: false, error: msg }
  }
}

export async function publishToInstagram(payload: PublishPayload): Promise<PublishResult> {
  const token = process.env.META_ACCESS_TOKEN
  const igUserId = process.env.INSTAGRAM_USER_ID

  if (isDemo(token) || !igUserId) {
    await new Promise(r => setTimeout(r, 900))
    return { platform: 'instagram', success: true, postId: `demo_ig_${Date.now()}`, postUrl: 'https://instagram.com/p/demo', demo: true }
  }

  const caption = buildCaption(payload)
  const mediaUrl = payload.imageUrl || 'https://via.placeholder.com/1080x1080/6C47FF/FFFFFF?text=Global+Web+AI'

  try {
    const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: mediaUrl, caption, access_token: token }),
    })
    const container = await containerRes.json()
    if (container.error) throw new Error(container.error.message)

    const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: container.id, access_token: token }),
    })
    const published = await publishRes.json()
    if (published.error) throw new Error(published.error.message)
    return { platform: 'instagram', success: true, postId: published.id, postUrl: `https://instagram.com/p/${published.id}` }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return { platform: 'instagram', success: false, error: msg }
  }
}

export async function publishToAllPlatforms(payload: PublishPayload): Promise<PublishResult[]> {
  const results: PublishResult[] = []
  const tasks: Promise<PublishResult>[] = []

  for (const platform of payload.platforms) {
    switch (platform.toLowerCase()) {
      case 'facebook': tasks.push(publishToFacebook(payload)); break
      case 'linkedin': tasks.push(publishToLinkedIn(payload)); break
      case 'instagram': tasks.push(publishToInstagram(payload)); break
      default: results.push({ platform, success: false, error: 'Platform not supported yet' })
    }
  }

  const settled = await Promise.allSettled(tasks)
  for (const result of settled) {
    if (result.status === 'fulfilled') results.push(result.value)
    else results.push({ platform: 'unknown', success: false, error: String(result.reason) })
  }

  return results
}