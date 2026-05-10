"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="gap-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 focus-ring"
    >
      <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Log Keluar</span>
    </Button>
  )
}
