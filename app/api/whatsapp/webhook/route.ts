import { NextRequest, NextResponse } from 'next/server';

const VERIFY_TOKEN = 'globalwebsaas_webhook_2026';

// GET — Webhook verification by Meta
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// POST — Receive incoming messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Meta sends a test notification on webhook setup
    if (body?.object !== 'whatsapp_business_account') {
      return NextResponse.json({ status: 'ignored' });
    }

    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Handle incoming messages
    const messages = value?.messages;
    if (messages && messages.length > 0) {
      for (const message of messages) {
        const from = message.from; // sender's phone number
        const msgType = message.type;
        const timestamp = message.timestamp;

        let text = '';
        if (msgType === 'text') {
          text = message.text?.body || '';
        } else if (msgType === 'image') {
          text = '[Image received]';
        } else if (msgType === 'document') {
          text = '[Document received]';
        } else if (msgType === 'audio') {
          text = '[Audio received]';
        } else {
          text = `[${msgType} received]`;
        }

        console.log(`📨 Message from ${from}: ${text}`);

        // TODO: Store in Supabase for real-time display
        // await supabase.from('whatsapp_messages').insert({
        //   from_number: from,
        //   message: text,
        //   type: msgType,
        //   timestamp: new Date(parseInt(timestamp) * 1000).toISOString(),
        //   direction: 'inbound'
        // });
      }
    }

    // Handle message status updates (sent, delivered, read)
    const statuses = value?.statuses;
    if (statuses && statuses.length > 0) {
      for (const status of statuses) {
        console.log(`📊 Message ${status.id} status: ${status.status}`);
      }
    }

    // Always return 200 to Meta
    return NextResponse.json({ status: 'ok' });

  } catch (err: any) {
    console.error('Webhook error:', err);
    // Still return 200 so Meta doesn't retry
    return NextResponse.json({ status: 'error', message: err.message });
  }
}
