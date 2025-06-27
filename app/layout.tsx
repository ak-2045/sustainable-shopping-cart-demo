import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sustainable Shopping Cart',
  description: 'HelloPM Product Demo',
  generator: 'Akmal',
  icons: [
    {
      rel: 'icon',
      url: '/leaf-logo.svg', // Place your leaf logo SVG in the public folder as leaf-logo.svg
      type: 'image/svg+xml',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
