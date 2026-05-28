export interface GenerateOptions {
  type: string
  product: string
  platform: string
  tone?: string
  objective?: string
  audience?: string
  cta?: string
}

export async function generateAIContent(opts: GenerateOptions) {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  })
  if (!res.ok) throw new Error('AI generation failed')
  const { data } = await res.json()
  return data
}
