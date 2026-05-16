import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, Settings, Save } from "lucide-react"

export default async function SalaryConfigPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const employer = await db.employer.findFirst({
    where: { userId: session.user.id },
    include: {
      employees: {
        where: { isActive: true },
        include: { salaryConfig: true },
        orderBy: { name: "asc" },
      },
    },
  })

  if (!employer) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Tiada Majikan</h2>
          <p className="text-slate-400 mb-4">Daftar majikan dahulu.</p>
          <Link href="/dashboard/employers/new" className="text-blue-400 underline">Daftar Majikan</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href="/dashboard/payroll"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Pengurusan Gaji
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Konfigurasi KWSP Pekerja</h1>
            <p className="text-sm text-slate-400 mt-1">
              Tetapkan kadar KWSP custom untuk setiap pekerja
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-slate-900">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Pekerja</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">IC</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">Gaji</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-blue-400 uppercase">KWSP Pekerja (%)</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-blue-400 uppercase">KWSP Majikan (%)</th>
                </tr>
              </thead>
              <tbody>
                {employer.employees.map(emp => (
                  <tr key={emp.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{emp.name}</p>
                      <p className="text-xs text-slate-500">
                        {emp.enteredAfter55 ? "Masuk 55+" : emp.category}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{emp.icNumber}</td>
                    <td className="px-4 py-3 text-right text-white tabular-nums">
                      RM{Number(emp.salary).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {emp.enteredAfter55 ? (
                        <span className="text-slate-600 text-xs">Tiada</span>
                      ) : emp.salaryConfig?.epfEmployeeRate ? (
                        <span className="text-blue-400 font-bold">
                          {(Number(emp.salaryConfig.epfEmployeeRate) * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">Default 11%</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {emp.enteredAfter55 ? (
                        <span className="text-emerald-400 font-bold">4.0%</span>
                      ) : emp.salaryConfig?.epfEmployerRate ? (
                        <span className="text-blue-400 font-bold">
                          {(Number(emp.salaryConfig.epfEmployerRate) * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">Default 12/13%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">
          <h3 className="font-bold text-blue-400 mb-2">Nota</h3>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Kadar default KWSP pekerja: 11%</li>
            <li>• Kadar default KWSP majikan: 12% (gaji ≤ RM5,000) atau 13% (gaji > RM5,000)</li>
            <li>• Pekerja yang masuk selepas umur 55 tahun: hanya majikan 4%, pekerja 0%</li>
            <li>• Untuk tukar kadar, sila hubungi admin atau guna API endpoint</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
