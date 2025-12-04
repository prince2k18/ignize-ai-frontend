import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IGNIZE AI - India\'s #1 UPSC AI Mentor',
  description: 'AI-powered UPSC preparation platform with 95%+ accuracy on Prelims and expert Mains guidance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="text-white antialiased">{children}</body>
    </html>
  )
}
