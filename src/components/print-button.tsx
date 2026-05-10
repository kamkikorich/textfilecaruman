"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton({ label = "Cetak" }: { label?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white focus-ring"
      onClick={() => window.print()}
    >
      <Printer className="w-4 h-4" />
      {label}
    </Button>
  )
}
