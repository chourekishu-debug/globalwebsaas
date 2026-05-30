// app/api/social/callback/facebook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const FB_APP_ID = process.env.FACEBOOK_APP_ID!;
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;
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
    return NextResponse.redirect(`${BASE_URL}/dashboard/settings?error=facebook_denied`);
  }

  try {
    // Exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${BASE_URL}/api/social/callback/facebook&client_secret=${FB_APP_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    const shortToken = tokenData.access_token;

    if (!shortToken) {
      return NextResponse.redirect(`${BASE_URL}/dashboard/settings?error=facebook_token_failed`);
    }

    // Exchange for long-lived token (60 days)
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${shortToken}`
    );
    const longTokenData = await longTokenRes.json();
    const longToken = longTokenData.access_token || shortToken;

    // Get user profile
    const profileRes = await fetch(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${longToken}`);
    const profile = await profileRes.json();

    // Get user's Facebook Pages
    const pagesRes = await fetch(`https://graph.facebook.com/me/accounts?access_token=${longToken}`);
    const pagesData = await pagesRes.json();
    const pages = pagesData?.data || [];

    // Save user connection
    await supabase.from('social_connections').upsert({
      platform: 'facebook',
      access_token: longToken,
      profile_id: profile.id,
      profile_name: profile.name,
      profile_picture: profile.picture?.data?.url,
      pages: JSON.stringify(pages), // array of {id, name, access_token}
      connected: true,
      expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
      updated_at: new Date().toISOString(),
    }, { onConflict: 'platform' });

    return NextResponse.redirect(`${BASE_URL}/dashboard/settings?success=facebook_connected`);
  } catch (err: any) {
    console.error('Facebook callback error:', err);
    return NextResponse.redirect(`${BASE_URL}/dashboard/settings?error=facebook_failed`);
  }
}

