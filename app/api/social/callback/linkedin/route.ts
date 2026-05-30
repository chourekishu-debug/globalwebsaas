// app/api/social/callback/linkedin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://globalwebsaas.vercel.app';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/settings?error=linkedin_denied`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/api/social/callback/linkedin`,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in; // seconds

    if (!accessToken) {
      return NextResponse.redirect(`${BASE_URL}/dashboard/settings?error=linkedin_token_failed`);
    }

    // Get LinkedIn profile
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();

    // Get LinkedIn organization pages (company pages)
    let orgId = null;
    try {
      const orgRes = await fetch('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'LinkedIn-Version': '202401',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      const orgData = await orgRes.json();
      const firstOrg = orgData?.elements?.[0]?.organizationalTarget;
      if (firstOrg) orgId = firstOrg.split(':').pop();
    } catch {}

    // Save to Supabase social_connections table
    await supabase.from('social_connections').upsert({
      platform: 'linkedin',
      access_token: accessToken,
      profile_id: profile.sub || profile.id,
      profile_name: profile.name,
      profile_picture: profile.picture,
      org_id: orgId,
      expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
      connected: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'platform' });

    return NextResponse.redirect(`${BASE_URL}/dashboard/settings?success=linkedin_connected`);
  } catch (err: any) {
    console.error('LinkedIn callback error:', err);
    return NextResponse.redirect(`${BASE_URL}/dashboard/settings?error=linkedin_failed`);
  }
}
