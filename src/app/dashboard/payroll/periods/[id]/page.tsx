import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Download } from "lucide-react"

export default async function PayrollPeriodDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const period = await db.payrollPeriod.findUnique({
    where: { id: params.id },
    include: {
      employer: true,
      payrollEmployees: {
        include: { employee: true },
        orderBy: { employee: { name: "asc" } },
      },
    },
  })

  if (!period || period.employer.userId !== session.user.id) {
    notFound()
  }

  const monthNames = [
    "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember",
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href="/dashboard/payroll"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Senarai Gaji
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Slip Gaji {monthNames[period.month - 1]} {period.year}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {period.employer.employerName} &middot; {period.payrollEmployees.length} pekerja
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold ${
              period.status === "finalised"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
            }`}
          >
            {period.status === "finalised" ? "Siap" : "Draf"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Jumlah Gaji Kasar</p>
            <p className="text-xl font-bold text-white">
              RM{Number(period.totalGross).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Jumlah Potongan</p>
            <p className="text-xl font-bold text-red-400">
              -RM{Number(period.totalDeductions).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Jumlah Gaji Bersih</p>
            <p className="text-xl font-bold text-emerald-400">
              RM{Number(period.totalNet).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-slate-900">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">
                    Pekerja
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">
                    Gaji Kasar
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">
                    KWSP
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">
                    PERKESO
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">
                    EIS
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">
                    PCB
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">
                    Potongan
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-emerald-400 uppercase">
                    Gaji Bersih
                  </th>
                </tr>
              </thead>
              <tbody>
                {period.payrollEmployees.map((pe) => (
                  <tr
                    key={pe.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{pe.employee.name}</p>
                      <p className="text-xs text-slate-500">{pe.employee.icNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">
                      {Number(pe.grossSalary).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 tabular-nums">
                      {Number(pe.epfEmployee).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 tabular-nums">
                      {Number(pe.socsoEmployee).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 tabular-nums">
                      {Number(pe.eisEmployee).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400 tabular-nums">
                      {Number(pe.pcbAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-red-400 tabular-nums">
                      {Number(pe.totalDeductions).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400 tabular-nums">
                      {Number(pe.netSalary).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900">
                  <td className="px-4 py-3 font-bold text-white">JUMLAH</td>
                  <td className="px-4 py-3 text-right font-bold text-white tabular-nums">
                    {Number(period.totalGross).toFixed(2)}
                  </td>
                  <td colSpan={5} />
                  <td className="px-4 py-3 text-right font-bold text-red-400 tabular-nums">
                    {Number(period.totalDeductions).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-400 tabular-nums">
                    {Number(period.totalNet).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
