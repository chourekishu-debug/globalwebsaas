export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount/10000000).toFixed(1)}Cr`
  if (amount >= 100000)   return `₹${(amount/100000).toFixed(1)}L`
  if (amount >= 1000)     return `₹${(amount/1000).toFixed(0)}K`
  return `₹${amount.toLocaleString()}`
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`
  if (n >= 1000)    return `${(n/1000).toFixed(0)}K`
  return n.toString()
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
}

export const PLATFORM_COLORS: Record<string, string> = {
  meta:'#1877F2', google:'#4285F4', linkedin:'#0A66C2',
  instagram:'#E1306C', whatsapp:'#25D366', gmb:'#00D4AA',
}

export const PLATFORM_NAMES: Record<string, string> = {
  meta:'Meta Ads', google:'Google Ads', linkedin:'LinkedIn',
  instagram:'Instagram', whatsapp:'WhatsApp', gmb:'Google Business',
}
