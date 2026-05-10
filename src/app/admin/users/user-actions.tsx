"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserActionsProps {
  userId: string
  currentStatus: string
  userName: string | null
}

export function UserActions({ userId, currentStatus, userName }: UserActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpdateStatus(status: "active" | "inactive" | "trial") {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        throw new Error("Gagal mengemaskini status")
      }

      toast({
        title: "Berjaya",
        description: `Status langganan ${userName || "pengguna"} ditukar kepada ${status}.`,
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Ralat",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
          <span className="sr-only">Buka menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-900 border-white/[0.08] text-slate-300">
        <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/[0.06]" />
        
        {currentStatus !== "active" && (
          <DropdownMenuItem 
            onClick={() => handleUpdateStatus("active")}
            className="hover:bg-emerald-500/10 hover:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Aktifkan (Active)
          </DropdownMenuItem>
        )}
        
        {currentStatus !== "trial" && (
          <DropdownMenuItem 
            onClick={() => handleUpdateStatus("trial")}
            className="hover:bg-amber-500/10 hover:text-amber-400 focus:bg-amber-500/10 focus:text-amber-400 cursor-pointer"
          >
            <Clock className="mr-2 h-4 w-4" />
            Set Percubaan (Trial)
          </DropdownMenuItem>
        )}

        {currentStatus !== "inactive" && (
          <DropdownMenuItem 
            onClick={() => handleUpdateStatus("inactive")}
            className="hover:bg-rose-500/10 hover:text-rose-400 focus:bg-rose-500/10 focus:text-rose-400 cursor-pointer"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Nyahaktif (Deactivate)
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
