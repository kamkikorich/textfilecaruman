import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Printer, Edit, Save, X, Download, FileText } from "lucide-react"

export default async function PayslipDetailPage({ params }: { params: { payslipId: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const payslip = await db.payrollEmployee.findUnique({
    where: { id: params.payslipId },
    include: {
      employee: true,
      period: { include: { employer: true } },
      payItems: { orderBy: { name: "asc" } },
    },
  })

  if (!payslip || payslip.period.employer.userId !== session.user.id) {
    notFound()
  }

  const monthNames = [
    "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember",
  ]

  const period = payslip.period
  const employee = payslip.employee

  const customAllowances = payslip.payItems.filter(p => p.type === "ALLOWANCE" && Number(p.amount) > 0)
  const customDeductions = payslip.payItems.filter(p => p.type === "DEDUCTION" && Number(p.amount) > 0)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-container {
            background: white !important;
            color: black !important;
            border: none !important;
            box-shadow: none !important;
          }
          .print-header {
            border-bottom: 2px solid #333 !important;
            padding-bottom: 12px !important;
            margin-bottom: 16px !important;
          }
          .print-row {
            border-bottom: 1px solid #eee !important;
          }
          .print-label { color: #666 !important; }
          .print-value { color: #000 !important; }
          .print-total { border-top: 2px solid #333 !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* Print Header (visible only when printing) */}
      <div className="print-only max-w-3xl mx-auto">
        <div className="print-header text-center">
          <h1 className="text-2xl font-bold">{period.employer.employerName}</h1>
          <p className="text-sm text-gray-600">SLIP GAJI PEKERJA</p>
          <p className="text-xs text-gray-500">{monthNames[period.month - 1]} {period.year}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Navigation (hidden when printing) */}
        <div className="no-print">
          <Link
            href={`/dashboard/payroll/periods/${period.id}`}
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Slip Bulanan
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Slip Gaji Individu</h1>
              <p className="text-sm text-slate-400 mt-1">
                {monthNames[period.month - 1]} {period.year}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-400 hover:to-indigo-500 transition-all"
              >
                <Printer className="w-4 h-4" /> Cetak Slip
              </button>
            </div>
          </div>
        </div>

        {/* Printable Payslip Container */}
        <div className="print-container rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
          {/* Employee Info Header */}
          <div className="px-6 py-5 border-b border-white/[0.08] bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nama Pekerja</p>
                <p className="text-lg font-bold text-white">{employee.name}</p>
                <p className="text-sm text-slate-400">{employee.icNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Majikan</p>
                <p className="text-lg font-bold text-white">{period.employer.employerName}</p>
                <p className="text-sm text-slate-400">{period.employer.employerCode}</p>
              </div>
            </div>
          </div>

          {/* Earnings Section */}
          <div className="px-6 py-4 border-b border-white/[0.08]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pendapatan</h3>
            <div className="space-y-2">
              {/* Basic Salary */}
              <div className="print-row flex items-center justify-between py-2">
                <span className="print-label text-sm text-slate-400">Gaji Asas</span>
                <span className="print-value text-sm font-bold text-white tabular-nums">
                  RM{Number(payslip.basicSalary).toFixed(2)}
                </span>
              </div>

              {/* Allowance */}
              {Number(payslip.allowanceAmount) > 0 && (
                <div className="print-row flex items-center justify-between py-2">
                  <span className="print-label text-sm text-slate-400">Elaun Tetap</span>
                  <span className="print-value text-sm font-bold text-white tabular-nums">
                    RM{Number(payslip.allowanceAmount).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Overtime */}
              {Number(payslip.overtimeHours) > 0 && (
                <div className="print-row flex items-center justify-between py-2">
                  <span className="print-label text-sm text-slate-400">
                    Lembur ({Number(payslip.overtimeHours).toFixed(1)} jam)
                  </span>
                  <span className="print-value text-sm font-bold text-white tabular-nums">
                    RM{Number(payslip.overtimePay).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Commission */}
              {Number(payslip.commissionAmount) > 0 && (
                <div className="print-row flex items-center justify-between py-2">
                  <span className="print-label text-sm text-slate-400">Komisen</span>
                  <span className="print-value text-sm font-bold text-white tabular-nums">
                    RM{Number(payslip.commissionAmount).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Bonus */}
              {Number(payslip.bonusAmount) > 0 && (
                <div className="print-row flex items-center justify-between py-2">
                  <span className="print-label text-sm text-slate-400">Bonus</span>
                  <span className="print-value text-sm font-bold text-white tabular-nums">
                    RM{Number(payslip.bonusAmount).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Custom Allowances */}
              {customAllowances.map(item => (
                <div key={item.id} className="print-row flex items-center justify-between py-2">
                  <span className="print-label text-sm text-slate-400">{item.name}</span>
                  <span className="print-value text-sm font-bold text-white tabular-nums">
                    RM{Number(item.amount).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* Gross Total */}
              <div className="print-total flex items-center justify-between py-3 border-t border-white/[0.08] mt-2">
                <span className="text-sm font-bold text-slate-300">JUMLAH PENDAPATAN</span>
                <span className="text-lg font-bold text-white tabular-nums">
                  RM{Number(payslip.grossSalary).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions Section */}
          <div className="px-6 py-4 border-b border-white/[0.08]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Potongan</h3>
            <div className="space-y-2">
              {/* EPF Employee */}
              <div className="print-row flex items-center justify-between py-2">
                <span className="print-label text-sm text-slate-400">KWSP (Pekerja)</span>
                <span className="print-value text-sm font-bold text-red-400 tabular-nums">
                  -RM{Number(payslip.epfEmployee).toFixed(2)}
                </span>
              </div>

              {/* SOCSO Employee */}
              <div className="print-row flex items-center justify-between py-2">
                <span className="print-label text-sm text-slate-400">PERKESO (Pekerja)</span>
                <span className="print-value text-sm font-bold text-red-400 tabular-nums">
                  -RM{Number(payslip.socsoEmployee).toFixed(2)}
                </span>
              </div>

              {/* EIS Employee */}
              <div className="print-row flex items-center justify-between py-2">
                <span className="print-label text-sm text-slate-400">EIS (Pekerja)</span>
                <span className="print-value text-sm font-bold text-red-400 tabular-nums">
                  -RM{Number(payslip.eisEmployee).toFixed(2)}
                </span>
              </div>

              {/* PCB */}
              <div className="print-row flex items-center justify-between py-2">
                <span className="print-label text-sm text-slate-400">PCB (Cukai)</span>
                <span className="print-value text-sm font-bold text-red-400 tabular-nums">
                  -RM{Number(payslip.pcbAmount).toFixed(2)}
                </span>
              </div>

              {/* Loan Deduction */}
              {Number(payslip.loanDeduction) > 0 && (
                <div className="print-row flex items-center justify-between py-2">
                  <span className="print-label text-sm text-slate-400">Pinjaman</span>
                  <span className="print-value text-sm font-bold text-red-400 tabular-nums">
                    -RM{Number(payslip.loanDeduction).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Attendance Deduction */}
              {Number(payslip.attendanceDeduction) > 0 && (
                <div className="print-row flex items-center justify-between py-2">
                  <span className="print-label text-sm text-slate-400">Potongan Absen</span>
                  <span className="print-value text-sm font-bold text-red-400 tabular-nums">
                    -RM{Number(payslip.attendanceDeduction).toFixed(2)}
                  </span>
                </div>
              )}

              {/* Custom Deductions */}
              {customDeductions.map(item => (
                <div key={item.id} className="print-row flex items-center justify-between py-2">
                  <span className="print-label text-sm text-slate-400">{item.name}</span>
                  <span className="print-value text-sm font-bold text-red-400 tabular-nums">
                    -RM{Number(item.amount).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* Total Deductions */}
              <div className="flex items-center justify-between py-3 border-t border-white/[0.08] mt-2">
                <span className="text-sm font-bold text-slate-300">JUMLAH POTONGAN</span>
                <span className="text-lg font-bold text-red-400 tabular-nums">
                  -RM{Number(payslip.totalDeductions).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Employer Contributions */}
          <div className="px-6 py-4 border-b border-white/[0.08]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Majikan (Majikan Bayar)
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-400">KWSP (Majikan)</span>
                <span className="text-sm font-bold text-blue-400 tabular-nums">
                  RM{Number(payslip.epfEmployer).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-400">PERKESO (Majikan)</span>
                <span className="text-sm font-bold text-blue-400 tabular-nums">
                  RM{Number(payslip.socsoEmployer).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-400">EIS (Majikan)</span>
                <span className="text-sm font-bold text-blue-400 tabular-nums">
                  RM{Number(payslip.eisEmployer).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Net Salary - Highlighted */}
          <div className="px-6 py-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-t border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Gaji Bersih (Yang Perlu Dibayar)</p>
                <p className="text-xs text-slate-500 mt-0.5">Hari bekerja: {payslip.workingDays} hari</p>
              </div>
              <p className="text-3xl font-bold text-emerald-400 tabular-nums">
                RM{Number(payslip.netSalary).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Footer for print */}
          <div className="px-6 py-4 border-t border-white/[0.08] text-center">
            <p className="text-xs text-slate-500">
              Slip gaji ini dijana secara automatik oleh sistem CarumanPERKESO
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Tarikh cetak: {new Date().toLocaleDateString("ms-MY", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print mt-6 flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-400 hover:to-indigo-500 transition-all"
          >
            <Printer className="w-5 h-5" /> Cetak Slip Gaji
          </button>
          <Link
            href={`/dashboard/payroll/periods/${period.id}`}
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Senarai Penuh
          </Link>
        </div>

        {/* Custom Deductions Detail */}
        {payslip.payItems.length > 0 && (
          <div className="no-print mt-6 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Butiran Elaun & Potongan Custom
            </h3>
            <div className="space-y-2">
              {payslip.payItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.type === "ALLOWANCE"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {item.type === "ALLOWANCE" ? "ELAUN" : "POTONGAN"}
                    </span>
                    <span className="text-sm text-white">{item.name}</span>
                  </div>
                  <span className={`text-sm font-bold tabular-nums ${
                    item.type === "ALLOWANCE" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {item.type === "ALLOWANCE" ? "+" : "-"}RM{Number(item.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
