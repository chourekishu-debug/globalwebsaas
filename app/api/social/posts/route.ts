import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const demo = [
    { id:'1', title:'5 Reasons Men Over 40 Need This Supplement', type:'article', platforms:['facebook','linkedin'], status:'scheduled', scheduled_at: new Date(Date.now()+86400000).toISOString(), reach:0, likes:0, shares:0, hashtags:['#MensHealth','#Over40','#Wellness'] },
    { id:'2', title:'Built for Men Over 40 — Feel the Difference', type:'post', platforms:['facebook','instagram'], status:'published', published_at: new Date(Date.now()-86400000).toISOString(), reach:3847, likes:124, shares:38, hashtags:['#Stamina','#Energy','#NaturalHealth'] },
    { id:'3', title:'Morning Routine Reel — Energy Boost Tips', type:'reel', platforms:['instagram','facebook'], status:'scheduled', scheduled_at: new Date(Date.now()+172800000).toISOString(), reach:0, likes:0, shares:0, hashtags:['#MorningRoutine','#EnergyBoost'] },
    { id:'4', title:'Why 1000+ Men Trust Our Formula', type:'carousel', platforms:['instagram'], status:'draft', scheduled_at:null, reach:0, likes:0, shares:0, hashtags:['#Testimonial','#ProvenResults'] },
    { id:'5', title:'LinkedIn: The Science of Male Vitality', type:'article', platforms:['linkedin'], status:'published', published_at: new Date(Date.now()-172800000).toISOString(), reach:2100, likes:87, shares:23, hashtags:['#MensHealth','#Science'] },
  ]
  return NextResponse.json({ success: true, data: demo })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json({ success: true, data: { id: Date.now().toString(), ...body, created_at: new Date().toISOString() } })
}
