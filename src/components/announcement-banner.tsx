"use client"

import { useState, useEffect } from "react"
import { X, Info, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface Announcement {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "error"
  isDismissable: boolean
  publishedAt: string | null
  expiresAt: string | null
}

const typeStyles = {
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: Info,
    buttonBg: "bg-blue-500/20 hover:bg-blue-500/30",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    icon: AlertTriangle,
    buttonBg: "bg-amber-500/20 hover:bg-amber-500/30",
  },
  success: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    icon: CheckCircle2,
    buttonBg: "bg-emerald-500/20 hover:bg-emerald-500/30",
  },
  error: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    text: "text-rose-400",
    icon: AlertCircle,
    buttonBg: "bg-rose-500/20 hover:bg-rose-500/30",
  },
}

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    try {
      const res = await fetch("/api/announcements")
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDismiss(id: string) {
    try {
      const res = await fetch("/api/announcements/dismiss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementId: id }),
      })

      if (res.ok) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id))
      }
    } catch (error) {
      console.error("Error dismissing announcement:", error)
    }
  }

  if (loading || announcements.length === 0) {
    return null
  }

  return (
    <div className="space-y-3 mb-6">
      {announcements.map((announcement) => {
        const style = typeStyles[announcement.type]
        const Icon = style.icon

        return (
          <div
            key={announcement.id}
            className={cn(
              "rounded-xl border p-4",
              style.bg,
              style.border
            )}
          >
            <div className="flex items-start gap-3">
              <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", style.text)} />
              <div className="flex-1 min-w-0">
                <h4 className={cn("font-semibold text-sm mb-1", style.text)}>
                  {announcement.title}
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {announcement.content}
                </p>
              </div>
              {announcement.isDismissable && (
                <button
                  onClick={() => handleDismiss(announcement.id)}
                  className={cn(
                    "p-1 rounded-lg transition-colors shrink-0",
                    style.buttonBg
                  )}
                  aria-label="Dismiss announcement"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
