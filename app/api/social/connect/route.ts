// app/api/social/connect/route.ts
// Redirects user to LinkedIn or Facebook OAuth

import { NextRequest, NextResponse } from 'next/server';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://globalwebsaas.vercel.app';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform');

  if (platform === 'linkedin') {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINKEDIN_CLIENT_ID!,
      redirect_uri: `${BASE_URL}/api/social/callback/linkedin`,
      scope: 'openid profile email w_member_social w_organization_social r_organization_social',
      state: 'linkedin_connect_' + Date.now(),
    });
    return NextResponse.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`);
  }

  if (platform === 'facebook') {
    const params = new URLSearchParams({
      client_id: FACEBOOK_APP_ID!,
      redirect_uri: `${BASE_URL}/api/social/callback/facebook`,
      scope: 'pages_manage_posts,pages_read_engagement,publish_to_groups,instagram_basic,instagram_content_publish',
      response_type: 'code',
      state: 'facebook_connect_' + Date.now(),
    });
    return NextResponse.redirect(`https://www.facebook.com/v20.0/dialog/oauth?${params}`);
  }

  return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
}
