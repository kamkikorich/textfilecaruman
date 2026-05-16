"use client"

import { useState, useEffect, useCallback } from "react"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Printer, Save, X, Edit3, Check, Loader2 } from "lucide-react"

interface PayslipData {
  id: string
  employeeId: string
  employeeName: string
  employeeIC: string
  employerName: string
  employerCode: string
  month: number
  year: number
  workingDays: number
  basicSalary: number
  allowanceAmount: number
  overtimeHours: number
  overtimePay: number
  commissionAmount: number
  bonusAmount: number
  epfEmployee: number
  epfEmployer: number
  epfEmployeeRateUsed: number
  epfEmployerRateUsed: number
  socsoEmployee: number
  socsoEmployer: number
  eisEmployee: number
  eisEmployer: number
  pcbAmount: number
  loanDeduction: number
  attendanceDeduction: number
  otherDeductions: number
  totalDeductions: number
  grossSalary: number
  netSalary: number
  payItems: { id: string; name: string; type: string; amount: number; epfTaxable: boolean }[]
}

export default function PayslipEditPage({ params }: { params: { payslipId: string } }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [payslip, setPayslip] = useState<PayslipData | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const monthNames = [
    "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember",
  ]

  useEffect(() => {
    loadPayslip()
  }, [])

  async function loadPayslip() {
    try {
      const res = await fetch(`/api/payroll/payslips/${params.payslipId}`)
      if (!res.ok) {
        notFound()
      }
      const data = await res.json()
      setPayslip(data)
    } catch {
      setError("Gagal memuatkan slip gaji")
    } finally {
      setLoading(false)
    }
  }

  const updateField = useCallback((field: string, value: number | string) => {
    setPayslip(prev => {
      if (!prev) return prev
      return { ...prev, [field]: value }
    })
  }, [])

  const updatePayItem = useCallback((index: number, field: string, value: number | string) => {
    setPayslip(prev => {
      if (!prev) return prev
      const items = [...prev.payItems]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, payItems: items }
    })
  }, [])

  const addPayItem = useCallback(() => {
    setPayslip(prev => {
      if (!prev) return prev
      return {
        ...prev,
        payItems: [...prev.payItems, { id: `new-${Date.now()}`, name: "", type: "ALLOWANCE", amount: 0, epfTaxable: true }],
      }
    })
  }, [])

  const removePayItem = useCallback((index: number) => {
    setPayslip(prev => {
      if (!prev) return prev
      const items = prev.payItems.filter((_, i) => i !== index)
      return { ...prev, payItems: items }
    })
  }, [])

  const recalculate = useCallback(() => {
    if (!payslip) return
    const totalAllowances = payslip.payItems
      .filter(i => i.type === "ALLOWANCE")
      .reduce((s, i) => s + (Number(i.amount) || 0), 0)
    const totalDeductions = payslip.payItems
      .filter(i => i.type === "DEDUCTION")
      .reduce((s, i) => s + (Number(i.amount) || 0), 0)

    const grossSalary = Number(payslip.basicSalary) + Number(payslip.allowanceAmount) +
      Number(payslip.overtimePay) + Number(payslip.commissionAmount) +
      Number(payslip.bonusAmount) + totalAllowances

    const statDeductions = Number(payslip.epfEmployee) + Number(payslip.socsoEmployee) +
      Number(payslip.eisEmployee) + Number(payslip.pcbAmount) +
      Number(payslip.loanDeduction) + Number(payslip.attendanceDeduction) +
      Number(payslip.otherDeductions) + totalDeductions

    setPayslip(prev => {
      if (!prev) return prev
      return {
        ...prev,
        grossSalary: Math.round(grossSalary * 100) / 100,
        totalDeductions: Math.round(statDeductions * 100) / 100,
        netSalary: Math.round((grossSalary - statDeductions) * 100) / 100,
      }
    })
  }, [payslip])

  async function handleSave() {
    if (!payslip) return
    setSaving(true)
    setError("")

    try {
      const res = await fetch(`/api/payroll/payslips/${params.payslipId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payslip),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Gagal menyimpan")
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch {
      setError("Ralat sambungan")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!payslip) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-red-400 font-bold">Slip gaji tidak dijumpai</p>
            <Link href="/dashboard/payroll" className="text-blue-400 underline text-sm mt-2 inline-block">Kembali</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
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
          .print-field { border: none !important; background: transparent !important; padding: 0 !important; }
          .print-row { border-bottom: 1px solid #eee !important; }
          .print-label { color: #666 !important; }
          .print-value { color: #000 !important; }
          .print-total { border-top: 2px solid #333 !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* Print Header */}
      <div className="print-only max-w-3xl mx-auto">
        <div className="print-header text-center" style={{ borderBottom: "2px solid #333", paddingBottom: 12, marginBottom: 16 }}>
          <h1 className="text-2xl font-bold">{payslip.employerName}</h1>
          <p className="text-sm text-gray-600">SLIP GAJI PEKERJA</p>
          <p className="text-xs text-gray-500">{monthNames[payslip.month - 1]} {payslip.year}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="no-print">
          <Link
            href={`/dashboard/payroll/periods/${payslip.id.split("-")[0] || ""}`}
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <h1 className="text-2xl font-bold">Edit Slip Gaji</h1>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {monthNames[payslip.month - 1]} {payslip.year} &middot; Edit semua nilai sebelum cetak
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold hover:from-blue-400 hover:to-indigo-500 transition-all"
              >
                <Printer className="w-4 h-4" /> Cetak
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 mb-6 flex items-center gap-3">
              <X className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-6 flex items-center gap-3">
              <Check className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 text-sm">Slip gaji berjaya disimpan!</p>
            </div>
          )}
        </div>

        {/* Editable Payslip */}
        <div className="print-container rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
          {/* Employee Info */}
          <div className="px-6 py-5 border-b border-white/[0.08] bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nama Pekerja</p>
                <input
                  value={payslip.employeeName}
                  onChange={e => updateField("employeeName", e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-white border-b border-transparent focus:border-blue-500 outline-none print-field"
                />
                <input
                  value={payslip.employeeIC}
                  onChange={e => updateField("employeeIC", e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-400 border-b border-transparent focus:border-blue-500 outline-none mt-1 print-field"
                />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Majikan</p>
                <input
                  value={payslip.employerName}
                  onChange={e => updateField("employerName", e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-white border-b border-transparent focus:border-blue-500 outline-none text-right print-field"
                />
                <input
                  value={payslip.employerCode}
                  onChange={e => updateField("employerCode", e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-400 border-b border-transparent focus:border-blue-500 outline-none text-right mt-1 print-field"
                />
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="px-6 py-4 border-b border-white/[0.08]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pendapatan</h3>
            <div className="space-y-2">
              <EditableRow label="Gaji Asas" value={payslip.basicSalary} onChange={v => { updateField("basicSalary", v); recalculate() }} />
              <EditableRow label="Elaun Tetap" value={payslip.allowanceAmount} onChange={v => { updateField("allowanceAmount", v); recalculate() }} />
              <EditableRow label="Lembur" value={payslip.overtimePay} onChange={v => { updateField("overtimePay", v); recalculate() }} />
              <EditableRow label="Komisen" value={payslip.commissionAmount} onChange={v => { updateField("commissionAmount", v); recalculate() }} />
              <EditableRow label="Bonus" value={payslip.bonusAmount} onChange={v => { updateField("bonusAmount", v); recalculate() }} />

              {/* Custom Allowances */}
              {payslip.payItems.filter(i => i.type === "ALLOWANCE").map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 py-2 print-row">
                  <input
                    value={item.name}
                    onChange={e => updatePayItem(payslip.payItems.indexOf(item), "name", e.target.value)}
                    className="flex-1 bg-transparent text-sm text-slate-400 border-b border-transparent focus:border-blue-500 outline-none min-w-0 print-field"
                    placeholder="Nama elaun..."
                  />
                  <input
                    type="number"
                    value={item.amount || ""}
                    onChange={e => { updatePayItem(payslip.payItems.indexOf(item), "amount", Number(e.target.value)); recalculate() }}
                    className="w-24 bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-white text-right tabular-nums print-field"
                    placeholder="0.00"
                    step="0.01"
                  />
                  <button
                    onClick={() => { removePayItem(payslip.payItems.indexOf(item)); recalculate() }}
                    className="no-print text-slate-600 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <button
                onClick={addPayItem}
                className="no-print w-full py-2 rounded-lg border border-dashed border-white/10 text-xs text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
              >
                + Tambah Elaun
              </button>

              <div className="flex items-center justify-between py-3 border-t border-white/[0.08] mt-2 print-total">
                <span className="text-sm font-bold text-slate-300">JUMLAH PENDAPATAN</span>
                <span className="text-lg font-bold text-white tabular-nums print-value">
                  RM{payslip.grossSalary.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="px-6 py-4 border-b border-white/[0.08]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Potongan</h3>
            <div className="space-y-2">
              <EditableRow label="KWSP (Pekerja)" value={payslip.epfEmployee} onChange={v => { updateField("epfEmployee", v); recalculate() }} negative />
              <EditableRow label="PERKESO (Pekerja)" value={payslip.socsoEmployee} onChange={v => { updateField("socsoEmployee", v); recalculate() }} negative />
              <EditableRow label="EIS (Pekerja)" value={payslip.eisEmployee} onChange={v => { updateField("eisEmployee", v); recalculate() }} negative />
              <EditableRow label="PCB (Cukai)" value={payslip.pcbAmount} onChange={v => { updateField("pcbAmount", v); recalculate() }} negative />
              <EditableRow label="Pinjaman" value={payslip.loanDeduction} onChange={v => { updateField("loanDeduction", v); recalculate() }} negative />
              <EditableRow label="Potongan Absen" value={payslip.attendanceDeduction} onChange={v => { updateField("attendanceDeduction", v); recalculate() }} negative />
              <EditableRow label="Potongan Lain" value={payslip.otherDeductions} onChange={v => { updateField("otherDeductions", v); recalculate() }} negative />

              {/* Custom Deductions */}
              {payslip.payItems.filter(i => i.type === "DEDUCTION").map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 py-2 print-row">
                  <input
                    value={item.name}
                    onChange={e => updatePayItem(payslip.payItems.indexOf(item), "name", e.target.value)}
                    className="flex-1 bg-transparent text-sm text-slate-400 border-b border-transparent focus:border-blue-500 outline-none min-w-0 print-field"
                    placeholder="Nama potongan..."
                  />
                  <input
                    type="number"
                    value={item.amount || ""}
                    onChange={e => { updatePayItem(payslip.payItems.indexOf(item), "amount", Number(e.target.value)); recalculate() }}
                    className="w-24 bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-white text-right tabular-nums print-field"
                    placeholder="0.00"
                    step="0.01"
                  />
                  <button
                    onClick={() => { removePayItem(payslip.payItems.indexOf(item)); recalculate() }}
                    className="no-print text-slate-600 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  setPayslip(prev => {
                    if (!prev) return prev
                    return {
                      ...prev,
                      payItems: [...prev.payItems, { id: `new-${Date.now()}`, name: "", type: "DEDUCTION", amount: 0, epfTaxable: false }],
                    }
                  })
                }}
                className="no-print w-full py-2 rounded-lg border border-dashed border-white/10 text-xs text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
              >
                + Tambah Potongan
              </button>

              <div className="flex items-center justify-between py-3 border-t border-white/[0.08] mt-2">
                <span className="text-sm font-bold text-slate-300">JUMLAH POTONGAN</span>
                <span className="text-lg font-bold text-red-400 tabular-nums print-value">
                  -RM{payslip.totalDeductions.toFixed(2)}
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
              <EditableRow label="KWSP (Majikan)" value={payslip.epfEmployer} onChange={v => updateField("epfEmployer", v)} />
              <EditableRow label="PERKESO (Majikan)" value={payslip.socsoEmployer} onChange={v => updateField("socsoEmployer", v)} />
              <EditableRow label="EIS (Majikan)" value={payslip.eisEmployer} onChange={v => updateField("eisEmployer", v)} />
            </div>
          </div>

          {/* Net Salary */}
          <div className="px-6 py-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-t border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Gaji Bersih (Yang Perlu Dibayar)</p>
                <input
                  value={payslip.workingDays}
                  onChange={e => updateField("workingDays", Number(e.target.value))}
                  className="bg-transparent text-xs text-slate-500 border-b border-transparent focus:border-blue-500 outline-none mt-0.5 print-field"
                  placeholder="Hari bekerja"
                />
              </div>
              <input
                type="number"
                value={payslip.netSalary || ""}
                onChange={e => updateField("netSalary", Number(e.target.value))}
                className="text-3xl font-bold text-emerald-400 tabular-nums bg-transparent border-b border-transparent focus:border-emerald-500 outline-none text-right print-field"
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          {/* Footer */}
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
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

function EditableRow({
  label,
  value,
  onChange,
  negative,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  negative?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2 print-row">
      <span className="print-label text-sm text-slate-400">{label}</span>
      <input
        type="number"
        value={value || ""}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-28 bg-slate-800 border border-white/10 rounded-lg px-2 py-1 text-sm text-right tabular-nums outline-none focus:border-blue-500 print-field ${
          negative ? "text-red-400" : "text-white"
        }`}
        placeholder="0.00"
        step="0.01"
      />
    </div>
  )
}
