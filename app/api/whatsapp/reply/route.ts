import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { phone, message } = await req.json()
  if (!process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_TOKEN.includes('your')) {
    await new Promise(r => setTimeout(r, 800))
    return NextResponse.json({ success: true, demo: true, messageId: 'demo_' + Date.now() })
  }
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type':'application/json' },
      body: JSON.stringify({ messaging_product:'whatsapp', to:phone, type:'text', text:{ body:message } })
    })
    const data = await res.json()
    return NextResponse.json({ success:true, data })
  } catch(e: any) {
    return NextResponse.json({ error:e.message }, { status:500 })
  }
}
