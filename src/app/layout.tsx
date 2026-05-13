import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

// Use system fonts to avoid build-time network dependency on Google Fonts
// Inter is available on most systems, with fallbacks for cross-platform compatibility
const inter = {
  className: "font-sans",
  style: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
}

export const metadata: Metadata = {
  title: "TextFileSKBBK SaaS - Sistem Pengurusan Caruman PERKESO",
  description:
    "Sistem pengurusan caruman SKBBK untuk majikan - generate fail 278-aksara, track submissions, kenyataan bulanan",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ms">
      <body className={inter.className} style={inter.style}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}