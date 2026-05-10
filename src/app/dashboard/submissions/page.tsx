import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileText, Plus, ArrowLeft, Calendar, Clock, AlertTriangle, Download, Printer } from "lucide-react"
import { getContributionDeadline, calculateLatePenalty } from "@/lib/deadline-calculator"

export default async function SubmissionsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const employer = await db.employer.findFirst({
    where: { userId: session.user.id, isActive: true },
  })

  const submissions = employer ? await db.submission.findMany({
    where: { employerId: employer.id },
    orderBy: [{ contributionYear: "desc" }, { contributionMonth: "desc" }],
    include: {
      contributions: {
        include: { employee: true },
      },
    },
  }) : []

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-white/[0.08]" />
            <h1 className="font-bold text-lg text-white">Sejarah Caruman</h1>
          </div>
          <Link href="/dashboard/submissions/new">
            <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">
              <Plus className="w-4 h-4" />
              Caruman Baharu
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!employer && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-400">
              Tiada majikan didaftarkan.{" "}
              <Link href="/dashboard/employers" className="text-blue-400 hover:text-blue-300 font-semibold">
                Daftar majikan dahulu
              </Link>
            </p>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Tiada Rekod Caruman
            </h3>
            <p className="text-slate-500 mb-6">
              Jana caruman pertama anda untuk bulan ini.
            </p>
            <Link href="/dashboard/submissions/new">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">
                Jana Caruman Baharu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => {
              const isLate = sub.deadlineDate && new Date() > sub.deadlineDate && sub.status !== "paid"
              return (
                <Link key={sub.id} href={`/dashboard/submissions/${sub.id}`}>
                  <div className={`rounded-2xl border p-6 card-hover ${
                    isLate ? "border-rose-500/20 bg-rose-500/[0.02]" : "border-white/[0.08] bg-slate-900/80"
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                          <Calendar className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-white">
                            Caruman {String(sub.contributionMonth).padStart(2, "0")}/{sub.contributionYear}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Deadline:{" "}
                              {sub.deadlineDate
                                ? new Date(sub.deadlineDate).toLocaleDateString("ms-MY")
                                : "-"}
                            </span>
                            {isLate && (
                              <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Lewat
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-4 mt-2 text-sm text-slate-400">
                            <span>{sub.totalEmployees} pekerja</span>
                            <span>·</span>
                            <span>Gaji: RM{Number(sub.totalSalary).toFixed(2)}</span>
                            <span>·</span>
                            <span>Jumlah: RM{Number(sub.grandTotal).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={
                          sub.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : sub.status === "draft" || sub.status === "submitted"
                            ? "bg-white/5 text-slate-400 border-white/10"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }>
                          {sub.status === "paid" ? "Dibayar" : (sub.status === "draft" || sub.status === "submitted") ? "Belum Dibayar" : "Lewat"}
                        </Badge>
                        {sub.textFileContent && (
                          <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 focus-ring">
                            <FileText className="w-4 h-4" />
                            Lihat
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}