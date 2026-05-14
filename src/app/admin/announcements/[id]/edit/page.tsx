"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Megaphone, Loader2 } from "lucide-react"

interface Announcement {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "error"
  isDismissable: boolean
  isActive: boolean
  publishedAt: string | null
  expiresAt: string | null
}

export default function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info" as "info" | "warning" | "success" | "error",
    isDismissable: true,
    isActive: true,
    publishedAt: "",
    expiresAt: "",
  })

  useEffect(() => {
    fetchAnnouncement()
  }, [])

  async function fetchAnnouncement() {
    try {
      const res = await fetch(`/api/admin/announcements/${params.id}`)
      if (res.ok) {
        const data: Announcement = await res.json()
        setFormData({
          title: data.title,
          content: data.content,
          type: data.type,
          isDismissable: data.isDismissable,
          isActive: data.isActive,
          publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : "",
          expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString().slice(0, 16) : "",
        })
      } else {
        alert("Failed to load announcement")
        router.push("/admin/announcements")
      }
    } catch (error) {
      console.error("Error fetching announcement:", error)
      alert("An error occurred")
      router.push("/admin/announcements")
    } finally {
      setFetching(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/announcements/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push("/admin/announcements")
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to update announcement")
      }
    } catch (error) {
      console.error("Error updating announcement:", error)
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/announcements" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">Edit Announcement</h1>
              <p className="text-sm text-slate-400">Update system announcement</p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Title <span className="text-rose-400">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-white/[0.04] border-white/[0.08] text-white"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-slate-300">
              Content <span className="text-rose-400">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              required
              className="bg-white/[0.04] border-white/[0.08] text-white resize-none"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label className="text-slate-300">Type</Label>
            <div className="grid grid-cols-4 gap-3">
              {(["info", "warning", "success", "error"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    formData.type === type
                      ? type === "info"
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                        : type === "warning"
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                        : type === "success"
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.05]"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4 rounded-xl border border-white/[0.08] bg-slate-900/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isActive" className="text-slate-300 font-medium">
                  Active
                </Label>
                <p className="text-xs text-slate-500">Show this announcement to users</p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isDismissable" className="text-slate-300 font-medium">
                  Dismissible
                </Label>
                <p className="text-xs text-slate-500">Allow users to dismiss this announcement</p>
              </div>
              <Switch
                id="isDismissable"
                checked={formData.isDismissable}
                onCheckedChange={(checked) => setFormData({ ...formData, isDismissable: checked })}
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4 rounded-xl border border-white/[0.08] bg-slate-900/50 p-6">
            <h3 className="font-semibold text-white">Schedule</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="publishedAt" className="text-slate-300 text-sm">
                  Publish At
                </Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="bg-white/[0.04] border-white/[0.08] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt" className="text-slate-300 text-sm">
                  Expires At
                </Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="bg-white/[0.04] border-white/[0.08] text-white"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Link href="/admin/announcements">
              <Button variant="outline" type="button" className="border-white/[0.08] text-slate-300 hover:bg-white/[0.05]">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 shadow-lg shadow-purple-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Announcement"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
