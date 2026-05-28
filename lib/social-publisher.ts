// ============================================================
// GLOBAL WEB AI — Social Media Auto-Publisher
// Handles Facebook, LinkedIn, Instagram auto-posting
// With image upload, article posting, scheduling
// GlobalWebSaaS | contact@globalwebsaas.org
// ============================================================

export interface PublishPayload {
  content: string        // Main text/caption
  title?: string         // For articles
  hashtags?: string[]    // Will be appended to content
  imageUrl?: string      // Public URL of image to attach
  imageBase64?: string   // Base64 image (for uploads)
  type: 'post' | 'article' | 'reel' | 'carousel' | 'story'
  platforms: string[]    // ['facebook', 'linkedin', 'instagram']
}

export interface PublishResult {
  platform: string
  success: boolean
  postId?: string
  postUrl?: string
  error?: string
  demo?: boolean
}

// ── Helpers ──────────────────────────────────────────────────
function buildCaption(payload: PublishPayload): string {
  const tags = payload.hashtags?.map(h => h.startsWith('#') ? h : `#${h}`).join(' ') || ''
  return `${payload.content}\n\n${tags}`.trim()
}

function isDemo(token?: string): boolean {
  return !token || token.includes('your') || token.length < 20
}

// ============================================================
// FACEBOOK AUTO-POST
// Supports: text posts, articles, reels, image posts
// API: graph.facebook.com/v19.0/{page-id}/
// ============================================================
export async function publishToFacebook(payload: PublishPayload): Promise<PublishResult> {
  const token   = process.env.META_ACCESS_TOKEN
  const pageId  = process.env.META_PAGE_ID || process.env.META_AD_ACCOUNT_ID?.replace('act_', '')

  // Demo mode if no real credentials
  if (isDemo(token) || !pageId) {
    await new Promise(r => setTimeout(r, 1200))
    return {
      platform: 'facebook',
      success: true,
      postId: `demo_fb_${Date.now()}`,
      postUrl: 'https://facebook.com/demo-post',
      demo: true,
    }
  }

  const caption = buildCaption(payload)

  try {
    // ── Article / Long-form post ──────────────────────────────
    if (payload.type === 'article' && payload.title) {
      const res = await fetch(
        `https://graph.facebook.com/v19.0/${pageId}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `${payload.title}\n\n${caption}`,
            access_token: token,
          }),
        }
      )
      const data = await res.json()
      if (data.error) throw new Error(data.error.message)
      return {
        platform: 'facebook',
        success: true,
        postId: data.id,
        postUrl: `https://facebook.com/${data.id}`,
      }
    }

    // ── Image post ────────────────────────────────────────────
    if (payload.imageUrl || payload.imageBase64) {
      let photoRes: any

      if (payload.imageUrl) {
        // Post with image URL
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${pageId}/photos`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: payload.imageUrl,
              caption,
              access_token: token,
              published: true,
            }),
          }
        )
        photoRes = await res.json()
      } else if (payload.imageBase64) {
        // Upload base64 image
        const formData = new URLSearchParams()
        formData.append('source', payload.imageBase64)
        formData.append('caption', caption)
        formData.append('access_token', token!)
        const res = await fetch(
          `https://graph.facebook.com/v19.0/${pageId}/photos`,
          { method: 'POST', body: formData }
        )
        photoRes = await res.json()
      }

      if (photoRes?.error) throw new Error(photoRes.error.message)
      return {
        platform: 'facebook',
        success: true,
        postId: photoRes.id,
        postUrl: `https://facebook.com/${pageId}/photos`,
      }
    }

    // ── Plain text post ───────────────────────────────────────
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: caption,
          access_token: token,
        }),
      }
    )
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return {
      platform: 'facebook',
      success: true,
      postId: data.id,
      postUrl: `https://facebook.com/${data.id}`,
    }

  } catch (error: any) {
    return { platform: 'facebook', success: false, error: error.message }
  }
}

// ============================================================
// LINKEDIN AUTO-POST
// Supports: text posts, articles, image posts
// API: api.linkedin.com/v2/ugcPosts
// ============================================================
export async function publishToLinkedIn(payload: PublishPayload): Promise<PublishResult> {
  const token  = process.env.LINKEDIN_ACCESS_TOKEN
  const personId = process.env.LINKEDIN_PERSON_ID   // urn:li:person:XXXXX
  const orgId    = process.env.LINKEDIN_ORG_ID       // urn:li:organization:XXXXX (company page)

  if (isDemo(token)) {
    await new Promise(r => setTimeout(r, 1000))
    return {
      platform: 'linkedin',
      success: true,
      postId: `demo_li_${Date.now()}`,
      postUrl: 'https://linkedin.com/feed/update/demo',
      demo: true,
    }
  }

  const author = orgId ? `urn:li:organization:${orgId}` : `urn:li:person:${personId}`
  const caption = buildCaption(payload)

  try {
    // ── Article post ─────────────────────────────────────────
    if (payload.type === 'article' && payload.title) {
      const body = {
        author,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: `${payload.title}\n\n${caption}` },
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
      const postId = data.id || data['id']
      return {
        platform: 'linkedin',
        success: true,
        postId,
        postUrl: `https://www.linkedin.com/feed/update/${postId}`,
      }
    }

    // ── Image post ────────────────────────────────────────────
    if (payload.imageUrl) {
      // Step 1: Register image upload
      const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: author,
            serviceRelationships: [{
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent',
            }],
          },
        }),
      })
      const registerData = await registerRes.json()
      const uploadUrl = registerData?.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl
      const assetUrn  = registerData?.value?.asset

      if (uploadUrl && assetUrn) {
        // Step 2: Upload image from URL
        const imgRes = await fetch(payload.imageUrl)
        const imgBuffer = await imgRes.arrayBuffer()
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'image/jpeg' },
          body: imgBuffer,
        })

        // Step 3: Create post with image
        const postBody = {
          author,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text: caption },
              shareMediaCategory: 'IMAGE',
              media: [{
                status: 'READY',
                description: { text: payload.title || caption.slice(0, 200) },
                media: assetUrn,
                title: { text: payload.title || 'Global Web AI' },
              }],
            },
          },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
        }
        const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
          body: JSON.stringify(postBody),
        })
        const postData = await postRes.json()
        if (postData.status >= 400) throw new Error(postData.message)
        return {
          platform: 'linkedin',
          success: true,
          postId: postData.id,
          postUrl: `https://www.linkedin.com/feed/update/${postData.id}`,
        }
      }
    }

    // ── Plain text post ───────────────────────────────────────
    const body = {
      author,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: caption },
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
    return {
      platform: 'linkedin',
      success: true,
      postId: data.id,
      postUrl: `https://www.linkedin.com/feed/update/${data.id}`,
    }

  } catch (error: any) {
    return { platform: 'linkedin', success: false, error: error.message }
  }
}

// ============================================================
// INSTAGRAM AUTO-POST
// Requires: Facebook Page connected to Instagram Business account
// API: graph.facebook.com/v19.0/{ig-user-id}/
// ============================================================
export async function publishToInstagram(payload: PublishPayload): Promise<PublishResult> {
  const token   = process.env.META_ACCESS_TOKEN
  const igUserId = process.env.INSTAGRAM_USER_ID

  if (isDemo(token) || !igUserId) {
    await new Promise(r => setTimeout(r, 900))
    return {
      platform: 'instagram',
      success: true,
      postId: `demo_ig_${Date.now()}`,
      postUrl: 'https://instagram.com/p/demo',
      demo: true,
    }
  }

  const caption = buildCaption(payload)

  try {
    // Instagram requires an image URL for every post
    const mediaUrl = payload.imageUrl || 'https://via.placeholder.com/1080x1080/6C47FF/FFFFFF?text=Global+Web+AI'

    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: mediaUrl,
          caption,
          access_token: token,
        }),
      }
    )
    const container = await containerRes.json()
    if (container.error) throw new Error(container.error.message)

    // Step 2: Publish media container
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: container.id,
          access_token: token,
        }),
      }
    )
    const published = await publishRes.json()
    if (published.error) throw new Error(published.error.message)

    return {
      platform: 'instagram',
      success: true,
      postId: published.id,
      postUrl: `https://instagram.com/p/${published.id}`,
    }

  } catch (error: any) {
    return { platform: 'instagram', success: false, error: error.message }
  }
}

// ============================================================
// MASTER PUBLISHER — publishes to all selected platforms
// ============================================================
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
    else results.push({ platform: 'unknown', success: false, error: result.reason?.message })
  }

  return results
}
