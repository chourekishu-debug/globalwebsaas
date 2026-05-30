// app/api/social/connections/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: connections } = await supabase
    .from('social_connections')
    .select('platform, profile_name, profile_picture, connected, expires_at, org_id, pages')
    .eq('connected', true);
  return NextResponse.json({ connections: connections || [] });
}