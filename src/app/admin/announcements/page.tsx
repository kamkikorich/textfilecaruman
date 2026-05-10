import { redirect } from "next/navigation"
import { requireSuperAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit2, Trash2, Eye, Megaphone, ArrowLeft } from "lucide-react"
import { DeleteAnnouncementButton } from "./delete-button"

export default async function AnnouncementsPage() {
  let session
  try {
    session = await requireSuperAdmin()
  } catch {
    redirect("/login")
  }

  const announcements = await db.announcement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      creator: {
        select: { name: true, email: true },
      },
      _count: {
        select: { dismissals: true },
      },
    },
  })

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">Announcements</h1>
              <p className="text-sm text-slate-400">Manage system announcements</p>
            </div>
          </div>
          <Link href="/admin/announcements/create">
            <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 shadow-lg shadow-purple-500/25">
              <Plus className="w-4 h-4" /> New Announcement
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {announcements.length === 0 ? (
          <div className="text-center py-20">
            <Megaphone className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Announcements Yet</h2>
            <p className="text-slate-400 mb-6">Create your first announcement to communicate with users.</p>
            <Link href="/admin/announcements/create">
              <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600">
                <Plus className="w-4 h-4" /> Create Announcement
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6 card-hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-white">{announcement.title}</h3>
                      <Badge
                        variant="outline"
                        className={
                          announcement.type === "info"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : announcement.type === "warning"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : announcement.type === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }
                      >
                        {announcement.type}
                      </Badge>
                      {announcement.isActive ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>By {announcement.creator?.name || announcement.creator?.email}</span>
                      <span>•</span>
                      <span>Created {new Date(announcement.createdAt).toLocaleDateString("ms-MY")}</span>
                      <span>•</span>
                      <span>{announcement._count.dismissals} dismissals</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/admin/announcements/${announcement.id}/edit`}>
                      <Button variant="ghost" size="sm" className="gap-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                        <Edit2 className="w-4 h-4" /> Edit
                      </Button>
                    </Link>
                    <DeleteAnnouncementButton id={announcement.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
