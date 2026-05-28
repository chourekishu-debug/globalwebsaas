import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.OPENROUTER_API_KEY || ''

  const result: any = {
    keyPresent: key.length > 0,
    keyLength: key.length,
    keyPrefix: key.slice(0, 20),
    timestamp: new Date().toISOString(),
  }

  if (key.length > 0) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://globalwebsaas.vercel.app',
          'X-Title': 'Global Web AI Test',
        },
        body: JSON.stringify({
          model: 'openrouter/free',
          messages: [{ role: 'user', content: 'Reply with: {"test":"ok"}' }],
          max_tokens: 20,
        }),
      })

      const data = await res.json()
      result.httpStatus = res.status
      result.openRouterResponse = data
      result.content = data.choices?.[0]?.message?.content || null
      result.error = data.error || null
    } catch (e: any) {
      result.fetchError = e.message
    }
  }

  return NextResponse.json(result)
}
