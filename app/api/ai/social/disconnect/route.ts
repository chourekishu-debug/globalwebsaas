// app/api/social/disconnect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { platform } = await req.json();
  await supabase.from('social_connections').update({ connected: false }).eq('platform', platform);
  return NextResponse.json({ success: true });
}