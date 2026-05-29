import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export async function POST(req: NextRequest) {
  try {
    const { to, message, type = 'text' } = await req.json();

    if (!to || !message) {
      return NextResponse.json({ error: 'to and message are required' }, { status: 400 });
    }

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return NextResponse.json({ error: 'WhatsApp not configured' }, { status: 500 });
    }

    // Format phone number — remove spaces, ensure country code
    const phone = to.replace(/\s+/g, '').replace(/^\+/, '');

    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phone,
      type: 'text',
      text: {
        preview_url: false,
        body: message
      }
    };

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API error:', data);
      return NextResponse.json({ 
        error: data?.error?.message || 'Failed to send message',
        details: data 
      }, { status: response.status });
    }

    return NextResponse.json({ 
      success: true, 
      messageId: data?.messages?.[0]?.id,
      to: phone
    });

  } catch (err: any) {
    console.error('WhatsApp send error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
