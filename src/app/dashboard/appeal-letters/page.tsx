import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, FileText, ArrowLeft, ExternalLink } from "lucide-react"
import { format } from "date-fns"

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: "Draf", color: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  requested: { label: "Dimohon", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  paid: { label: "Dibayar", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  generated: { label: "Selesai", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  rejected: { label: "Ditolak", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
}

const typeLabels: Record<string, { label: string }> = {
  faedah: { label: "Faedah Lewat Bayar SOCSO & EIS" },
  kompaun: { label: "Kompaun" },
}

export default async function AppealLettersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const letters = await db.appealLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-12">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
          <h1 className="font-bold text-lg text-white">Surat Rayuan PERKESO</h1>
          <div className="ml-auto">
            <Link href="/dashboard/appeal-letters/new">
              <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 shadow-lg shadow-purple-500/25">
                <Plus className="w-4 h-4" /> Mohon Surat Baru
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Info Card */}
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/10 via-slate-900 to-slate-900 p-6 mb-8">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-lg text-white mb-1">Perkhidmatan Pembuatan Surat Rayuan</h2>
              <p className="text-sm text-slate-400">
                Kami membantu majikan membuat surat rayuan rasmi kepada PERKESO bagi faedah lewat bayar atau kompaun.
              </p>
              <p className="text-sm text-purple-400 font-semibold mt-2">
                Caj: RM10 per surat
              </p>
            </div>
          </div>
        </div>

        {/* Letters List */}
        {letters.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Tiada Surat Rayuan Lagi</h3>
            <p className="text-sm text-slate-500 mb-6">
              Mulakan permohonan surat rayuan pertama anda.
            </p>
            <Link href="/dashboard/appeal-letters/new">
              <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-600">
                <Plus className="w-4 h-4" /> Mohon Surat Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {letters.map((letter) => {
              const status = statusLabels[letter.status] || statusLabels.draft
              const type = typeLabels[letter.letterType] || { label: letter.letterType }

              return (
                <div
                  key={letter.id}
                  className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6 card-hover"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white">{type.label}</h3>
                        <Badge variant="outline" className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-1">
                        {letter.companyName} — {letter.employerCode}
                      </p>
                      <p className="text-sm text-slate-500">
                        Jumlah: RM{Number(letter.penaltyAmount).toFixed(2)} | Tempoh: {letter.penaltyPeriod}
                      </p>
                      <p className="text-xs text-slate-600 mt-2">
                        {format(new Date(letter.createdAt), "dd MMM yyyy, hh:mm a")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={`/dashboard/appeal-letters/${letter.id}/preview`}>
                        <Button variant="ghost" size="sm" className="gap-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
                          <ExternalLink className="w-4 h-4" /> Lihat
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
