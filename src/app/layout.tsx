import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

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
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
