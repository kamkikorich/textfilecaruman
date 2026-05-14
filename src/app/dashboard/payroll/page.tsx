import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Calculator, ChevronRight, FileText, Plus, Trash2 } from "lucide-react"

export default async function PayrollPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const employer = await db.employer.findFirst({
    where: { userId: session.user.id },
    include: {
      payrollPeriods: {
        orderBy: [{ year: "desc" }, { month: "desc" }],
        include: { payrollEmployees: true },
      },
      employees: { where: { isActive: true }, select: { id: true } },
    },
  })

  if (!employer) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Tiada Majikan</h2>
          <p className="text-slate-400 mb-4">Daftar majikan dahulu sebelum guna modul gaji.</p>
          <Link href="/dashboard/employers/new" className="text-blue-400 underline">
            Daftar Majikan
          </Link>
        </div>
      </div>
    )
  }

  const monthNames = [
    "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember",
  ]

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Pengurusan Gaji</h1>
            <p className="text-sm text-slate-400 mt-1">
              {employer.employerName} &middot; {employer.employees.length} pekerja aktif
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Jana Slip Gaji Bulanan</h3>
              <p className="text-xs text-slate-400">
                Kira gaji bersih termasuk KWSP, PERKESO, EIS, dan PCB secara automatik
              </p>
            </div>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server"
              const month = formData.get("month") as string
              const year = formData.get("year") as string
              redirect(`/dashboard/payroll/run?month=${month}&year=${year}`)
            }}
            className="flex items-end gap-3"
          >
            <div>
              <label className="block text-xs text-slate-400 mb-1">Bulan</label>
              <select
                name="month"
                defaultValue={currentMonth}
                className="h-10 rounded-xl bg-slate-800 border border-white/10 px-3 text-white text-sm"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tahun</label>
              <select
                name="year"
                defaultValue={currentYear}
                className="h-10 rounded-xl bg-slate-800 border border-white/10 px-3 text-white text-sm"
              >
                {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-400 hover:to-indigo-500 transition-all"
            >
              Jana Gaji
            </button>
          </form>
        </div>

        {employer.payrollPeriods.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-400 mb-2">Tiada rekod gaji</h3>
            <p className="text-sm text-slate-500">
              Jana slip gaji pertama anda untuk melihat rekod di sini
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {employer.payrollPeriods.map((period) => (
              <Link
                key={period.id}
                href={`/dashboard/payroll/periods/${period.id}`}
                className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.08] bg-slate-900/80 hover:bg-slate-800/80 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-400">
                    {period.month}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {monthNames[period.month - 1]} {period.year}
                    </p>
                    <p className="text-xs text-slate-400">
                      {period.payrollEmployees.length} pekerja &middot;{" "}
                      <span className="text-emerald-400">
                        RM{Number(period.totalNet).toFixed(2)} bersih
                      </span>
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
