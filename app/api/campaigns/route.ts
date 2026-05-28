import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // Returns demo data when no Supabase configured
  const demo = [
    { id:'1', name:'GlobalWebSaaS — Agency Acquisition Meta', platform:'meta', status:'active', budget:8000, spent:5420, leads:198, cpl:27.4, ctr:4.2, roas:5.8, impressions:247000 },
    { id:'2', name:'GlobalWebSaaS — Google Search Brand', platform:'google', status:'active', budget:12000, spent:8940, leads:412, cpl:21.7, ctr:5.9, roas:7.2, impressions:134000 },
    { id:'3', name:'GlobalWebSaaS — LinkedIn B2B Agencies', platform:'linkedin', status:'active', budget:6000, spent:4100, leads:87, cpl:47.1, ctr:2.8, roas:4.1, impressions:62000 },
    { id:'4', name:'GlobalWebSaaS — Instagram Reel Demo', platform:'meta', status:'active', budget:5000, spent:2800, leads:134, cpl:20.9, ctr:5.1, roas:6.4, impressions:318000 },
    { id:'5', name:'GlobalWebSaaS — Google Retargeting', platform:'google', status:'paused', budget:4000, spent:2200, leads:76, cpl:28.9, ctr:3.6, roas:5.0, impressions:89000 },
  ]
  return NextResponse.json({ success: true, data: demo })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ success: true, data: { id: Date.now().toString(), ...body, status:'draft', spent:0, leads:0 } })
}
