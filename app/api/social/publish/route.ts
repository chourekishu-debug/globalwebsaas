// app/api/social/publish/route.ts
// Posts content to LinkedIn and/or Facebook automatically

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── POST TO LINKEDIN ──────────────────────────────────────────
async function postToLinkedIn(accessToken: string, profileId: string, orgId: string | null, content: string, imageUrl?: string) {
  const author = orgId ? `urn:li:organization:${orgId}` : `urn:li:person:${profileId}`;

  const body: any = {
    author,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: content },
        shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
      }
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
  };

  if (imageUrl) {
    // Upload image to LinkedIn first
    const registerRes = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202401',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: author,
          serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
        }
      }),
    });
    const registerData = await registerRes.json();
    const uploadUrl = registerData?.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl;
    const asset = registerData?.value?.asset;

    if (uploadUrl && asset) {
      // Fetch image and upload
      const imgRes = await fetch(imageUrl);
      const imgBuffer = await imgRes.arrayBuffer();
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'image/jpeg' },
        body: imgBuffer,
      });

      body.specificContent['com.linkedin.ugc.ShareContent'].media = [{
        status: 'READY',
        description: { text: content.slice(0, 200) },
        media: asset,
        title: { text: content.split('\n')[0].slice(0, 100) },
      }];
    }
  }

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': '202401',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return { success: res.ok, data, platform: 'linkedin' };
}

// ─── POST TO FACEBOOK PAGE ─────────────────────────────────────
async function postToFacebook(pages: any[], content: string, imageUrl?: string) {
  if (!pages || pages.length === 0) return { success: false, error: 'No Facebook pages found', platform: 'facebook' };

  const page = pages[0]; // Post to first page
  const pageToken = page.access_token;
  const pageId = page.id;

  let endpoint = `https://graph.facebook.com/v20.0/${pageId}/feed`;
  let body: any = { message: content, access_token: pageToken };

  if (imageUrl) {
    endpoint = `https://graph.facebook.com/v20.0/${pageId}/photos`;
    body = { caption: content, url: imageUrl, access_token: pageToken };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return { success: res.ok, data, platform: 'facebook', pageName: page.name };
}

// ─── MAIN HANDLER ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { content, imageUrl, platforms } = await req.json();

    if (!content) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

    // Get saved connections from Supabase
    const { data: connections } = await supabase
      .from('social_connections')
      .select('*')
      .eq('connected', true);

    const results: any[] = [];

    for (const platform of (platforms || ['linkedin', 'facebook'])) {
      const conn = connections?.find(c => c.platform === platform);
      if (!conn) {
        results.push({ platform, success: false, error: 'Not connected' });
        continue;
      }

      if (platform === 'linkedin') {
        const result = await postToLinkedIn(conn.access_token, conn.profile_id, conn.org_id, content, imageUrl);
        results.push(result);
      }

      if (platform === 'facebook') {
        const pages = conn.pages ? JSON.parse(conn.pages) : [];
        const result = await postToFacebook(pages, content, imageUrl);
        results.push(result);
      }
    }

    // Log to Supabase
    await supabase.from('social_posts').insert({
      content: content.slice(0, 500),
      image_url: imageUrl,
      platforms: platforms,
      results: JSON.stringify(results),
      posted_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}