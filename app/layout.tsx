import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Global Web AI — Marketing Automation',
  description: 'AI-powered digital marketing: Meta, Google, LinkedIn, WhatsApp — one dashboard.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Global Web AI' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#6c47ff' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
