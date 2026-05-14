"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DeleteAnnouncementButtonProps {
  id: string
}

export function DeleteAnnouncementButton({ id }: DeleteAnnouncementButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    setLoading(true)

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert("Failed to delete announcement")
      }
    } catch (error) {
      console.error("Error deleting announcement:", error)
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      Delete
    </Button>
  )
}
