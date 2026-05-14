import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Calculator, ChevronRight, FileText, Plus, Settings, CreditCard, DollarSign } from "lucide-react"

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
      payItemTemplates: { where: { isActive: true } },
    },
  })

  if (!employer) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Tiada Majikan</h2>
          <p className="text-slate-400 mb-4">Daftar majikan dahulu sebelum guna modul gaji.</p>
          <Link href="/dashboard/employers/new" className="text-blue-400 underline">Daftar Majikan</Link>
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

  const activeEmployees = await db.employee.findMany({
    where: { employerId: employer.id, isActive: true },
    include: {
      salaryConfig: true,
      loans: { where: { status: "ACTIVE" } },
    },
  })

  const employeesWithLoans = activeEmployees.filter(e => e.loans.length > 0)
  const employeesWithConfig = activeEmployees.filter(e => e.salaryConfig)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Pinjaman Aktif</p>
            <p className="text-lg font-bold text-white">{employeesWithLoans.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Custom KWSP</p>
            <p className="text-lg font-bold text-white">{employeesWithConfig.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Pay Items</p>
            <p className="text-lg font-bold text-white">{employer.payItemTemplates.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Slip Bulanan</p>
            <p className="text-lg font-bold text-white">{employer.payrollPeriods.length}</p>
          </div>
        </div>

        {/* Generate Payroll Card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-slate-900 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">Jana Slip Gaji Bulanan</h3>
              <p className="text-xs text-slate-400">
                Kira automatik: KWSP, PERKESO (jadual), EIS (jadual), PCB, Pinjaman, Absen
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
            className="flex flex-wrap items-end gap-3"
          >
            <div>
              <label className="block text-xs text-slate-400 mb-1">Bulan</label>
              <select name="month" defaultValue={currentMonth} className="h-10 rounded-xl bg-slate-800 border border-white/10 px-3 text-white text-sm">
                {monthNames.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tahun</label>
              <select name="year" defaultValue={currentYear} className="h-10 rounded-xl bg-slate-800 border border-white/10 px-3 text-white text-sm">
                {[currentYear - 1, currentYear, currentYear + 1].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Hari Bekerja</label>
              <input type="number" name="workingDays" defaultValue={26} className="h-10 w-20 rounded-xl bg-slate-800 border border-white/10 px-3 text-white text-sm" />
            </div>
            <button type="submit" className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:from-emerald-400 hover:to-teal-500 transition-all">
              Jana Gaji
            </button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/dashboard/payroll/pay-items" className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.08] bg-slate-900/80 hover:bg-slate-800/80 transition-colors group">
            <Settings className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm font-bold text-white group-hover:text-blue-300">Pay Items</p>
              <p className="text-[10px] text-slate-500">Elaun & potongan custom</p>
            </div>
          </Link>
          <Link href="/dashboard/payroll/loans" className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.08] bg-slate-900/80 hover:bg-slate-800/80 transition-colors group">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-sm font-bold text-white group-hover:text-amber-300">Pinjaman</p>
              <p className="text-[10px] text-slate-500">Urus pinjaman pekerja</p>
            </div>
          </Link>
        </div>

        {/* Period History */}
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Sejarah Slip Gaji</h3>
        {employer.payrollPeriods.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Tiada rekod gaji. Jana slip pertama anda.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {employer.payrollPeriods.map(p => (
              <Link key={p.id} href={`/dashboard/payroll/periods/${p.id}`} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-slate-900/80 hover:bg-slate-800/80 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400">
                    {p.month}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-emerald-300">{monthNames[p.month - 1]} {p.year}</p>
                    <p className="text-xs text-slate-400">
                      {p.payrollEmployees.length} pekerja &middot;{" "}
                      <span className="text-emerald-400">RM{Number(p.totalNet).toFixed(2)} bersih</span>
                      {p.status === "draft" && <span className="text-yellow-400 ml-1">(draf)</span>}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
