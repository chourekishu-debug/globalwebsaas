import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      summary: { totalSpend: 1840000, totalLeads: 2847, avgRoas: 6.24, avgCpl: 246, totalImpressions: 14700000 },
      byPlatform: [
        { platform:'meta',     spend:842000, leads:1243, roas:5.8, cpl:278 },
        { platform:'google',   spend:694000, leads:1089, roas:7.2, cpl:219 },
        { platform:'linkedin', spend:213000, leads:312,  roas:4.1, cpl:471 },
        { platform:'gmb',      spend:91000,  leads:203,  roas:6.0, cpl:204 },
      ],
      pipeline: [
        { stage:'cold',      count:28, value:3360000 },
        { stage:'warm',      count:14, value:2520000 },
        { stage:'hot',       count:9,  value:1980000 },
        { stage:'converted', count:5,  value:1200000 },
        { stage:'lost',      count:3,  value:0 },
      ],
      posts: { published: 47, scheduled: 12 },
      weeklyLeads: [182,201,178,245,267,289,312],
      weeklySpend: [42000,38000,51000,47000,58000,62000,71000],
    }
  })
}
