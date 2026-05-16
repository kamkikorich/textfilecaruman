"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle, Plus, Trash2, Calculator, Save, Eye, AlertTriangle } from "lucide-react"

interface Employee {
  id: string
  icNumber: string
  name: string
  salary: number
  basicSalary?: number
  allowanceAmount: number
  category: string
  workerType: string
  enteredAfter55: boolean
  eisNoContribution57: boolean
  pcbMaritalStatus: string
  pcbChildrenCount: number
  dateOfBirth?: string
  salaryConfig?: { epfEmployeeRate?: number; epfEmployerRate?: number } | null
  loans?: { monthlyDeduction: number; balance: number }[]
}

interface OvertimeEntry {
  id: string
  employeeId: string
  date: string
  hours: number
  rate: number
  amount: number
  description?: string
}

interface PayItemTemplate {
  id: string
  name: string
  type: "ALLOWANCE" | "DEDUCTION"
  epfTaxable: boolean
}

interface EmployeePayrollInput {
  employeeId: string
  overtimeHours: number
  overtimeRate: number
  overtimeAmount: number
  absentDays: number
  lateHours: number
  bonusAmount: number
  commissionAmount: number
  customPayItems: Record<string, number>
  attendanceDeduction: number
}

interface PayrollPreview {
  employeeId: string
  employeeName: string
  icNumber: string
  grossSalary: number
  epfEmployee: number
  epfEmployer: number
  socsoEmployee: number
  socsoEmployer: number
  eisEmployee: number
  eisEmployer: number
  pcbAmount: number
  loanDeduction: number
  attendanceDeduction: number
  totalDeductions: number
  netSalary: number
}

export function RunPayrollContent() {
  const router = useRouter()
  const params = useSearchParams()
  const month = Number(params.get("month")) || new Date().getMonth() + 1
  const year = Number(params.get("year")) || new Date().getFullYear()
  const workingDays = Number(params.get("workingDays")) || 26

  const [step, setStep] = useState<"loading" | "input" | "preview" | "success">("loading")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [employerId, setEmployerId] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [overtimeEntries, setOvertimeEntries] = useState<OvertimeEntry[]>([])
  const [payItemTemplates, setPayItemTemplates] = useState<PayItemTemplate[]>([])
  const [employeeInputs, setEmployeeInputs] = useState<EmployeePayrollInput[]>([])
  const [preview, setPreview] = useState<PayrollPreview[]>([])
  const [totalGross, setTotalGross] = useState(0)
  const [totalDeductions, setTotalDeductions] = useState(0)
  const [totalNet, setTotalNet] = useState(0)

  const monthNames = [
    "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember",
  ]

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/employers")
      const employers = await res.json()
      if (!Array.isArray(employers) || employers.length === 0) {
        setError("Tiada majikan. Daftar majikan dahulu.")
        setLoading(false)
        return
      }

      const empId = employers[0].id
      setEmployerId(empId)

      const [employeesRes, overtimeRes, payItemsRes] = await Promise.all([
        fetch(`/api/employees?employerId=${empId}`),
        fetch(`/api/payroll/overtime?employerId=${empId}`),
        fetch(`/api/payroll/pay-items?employerId=${empId}`),
      ])

      const employeesData = await employeesRes.json()
      const overtimeData = await overtimeRes.json()
      const payItemsData = await payItemsRes.json()

      setEmployees(Array.isArray(employeesData) ? employeesData : [])
      setOvertimeEntries(Array.isArray(overtimeData) ? overtimeData : [])
      setPayItemTemplates(Array.isArray(payItemsData) ? payItemsData : [])

      const inputs: EmployeePayrollInput[] = (Array.isArray(employeesData) ? employeesData : []).map(emp => ({
        employeeId: emp.id,
        overtimeHours: 0,
        overtimeRate: 0,
        overtimeAmount: 0,
        absentDays: 0,
        lateHours: 0,
        bonusAmount: 0,
        commissionAmount: 0,
        customPayItems: {},
        attendanceDeduction: 0,
      }))

      setEmployeeInputs(inputs)
      setStep("input")
    } catch {
      setError("Ralat sambungan. Sila cuba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const updateEmployeeInput = useCallback((employeeId: string, field: string, value: number) => {
    setEmployeeInputs(prev => prev.map(input => {
      if (input.employeeId !== employeeId) return input

      const updated = { ...input, [field]: value }

      if (field === "overtimeHours" || field === "overtimeRate") {
        updated.overtimeAmount = Math.round((updated.overtimeHours * updated.overtimeRate) * 100) / 100
      }

      if (field === "absentDays" || field === "lateHours") {
        const emp = employees.find(e => e.id === employeeId)
        if (emp) {
          const basicSalary = emp.basicSalary ? Number(emp.basicSalary) : Number(emp.salary)
          const dailyRate = basicSalary / workingDays
          const absentAmount = (updated.absentDays || 0) * dailyRate
          const hourlyRate = dailyRate / 8
          const lateAmount = (updated.lateHours || 0) * hourlyRate
          updated.attendanceDeduction = Math.round((absentAmount + lateAmount) * 100) / 100
        }
      }

      return updated
    }))
  }, [employees, workingDays])

  const updateCustomPayItem = useCallback((employeeId: string, templateId: string, value: number) => {
    setEmployeeInputs(prev => prev.map(input => {
      if (input.employeeId !== employeeId) return input
      return {
        ...input,
        customPayItems: { ...input.customPayItems, [templateId]: value },
      }
    }))
  }, [])

  const addOvertimeEntry = useCallback((employeeId: string) => {
    const newEntry: OvertimeEntry = {
      id: `temp-${Date.now()}-${employeeId}`,
      employeeId,
      date: new Date(year, month - 1, 15).toISOString().split("T")[0],
      hours: 0,
      rate: 0,
      amount: 0,
      description: "",
    }
    setOvertimeEntries(prev => [...prev, newEntry])
  }, [year, month])

  const updateOvertimeEntry = useCallback((id: string, field: string, value: string | number) => {
    setOvertimeEntries(prev => prev.map(entry => {
      if (entry.id !== id) return entry
      const updated = { ...entry, [field]: value }
      if (field === "hours" || field === "rate") {
        updated.amount = Math.round(Number(updated.hours) * Number(updated.rate) * 100) / 100
      }
      return updated
    }))
  }, [])

  const removeOvertimeEntry = useCallback((id: string) => {
    setOvertimeEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  const getEmployeeOvertime = useCallback((employeeId: string) => {
    return overtimeEntries
      .filter(e => e.employeeId === employeeId && e.amount > 0)
      .reduce((sum, e) => sum + e.amount, 0)
  }, [overtimeEntries])

  const getEmployeeOvertimeHours = useCallback((employeeId: string) => {
    return overtimeEntries
      .filter(e => e.employeeId === employeeId && e.amount > 0)
      .reduce((sum, e) => sum + Number(e.hours), 0)
  }, [overtimeEntries])

  async function handleCalculate() {
    setStep("preview")
    setError("")

    try {
      const attendanceMap: Record<string, { absentDays: number; lateHours: number }> = {}
      const customPayItemsMap: Record<string, Record<string, number>> = {}

      employeeInputs.forEach(input => {
        if (input.absentDays > 0 || input.lateHours > 0) {
          attendanceMap[input.employeeId] = {
            absentDays: input.absentDays,
            lateHours: input.lateHours,
          }
        }
        customPayItemsMap[input.employeeId] = input.customPayItems
      })

      const res = await fetch("/api/payroll/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId,
          month,
          year,
          workingDays,
          attendanceMap,
          customPayItems: customPayItemsMap,
          preview: true,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal mengira gaji")
        setStep("input")
      } else {
        setPreview(data.employees || [])
        setTotalGross(data.totalGross || 0)
        setTotalDeductions(data.totalDeductions || 0)
        setTotalNet(data.totalNet || 0)
      }
    } catch {
      setError("Ralat sambungan. Sila cuba lagi.")
      setStep("input")
    }
  }

  async function handleSave() {
    setSaving(true)
    setError("")

    try {
      const attendanceMap: Record<string, { absentDays: number; lateHours: number }> = {}
      const customPayItemsMap: Record<string, Record<string, number>> = {}

      employeeInputs.forEach(input => {
        if (input.absentDays > 0 || input.lateHours > 0) {
          attendanceMap[input.employeeId] = {
            absentDays: input.absentDays,
            lateHours: input.lateHours,
          }
        }
        customPayItemsMap[input.employeeId] = input.customPayItems
      })

      const res = await fetch("/api/payroll/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId,
          month,
          year,
          workingDays,
          attendanceMap,
          customPayItems: customPayItemsMap,
          preview: false,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan gaji")
      } else {
        setStep("success")
      }
    } catch {
      setError("Ralat sambungan. Sila cuba lagi.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold">Memuatkan data...</p>
          <p className="text-sm text-slate-400 mt-1">
            {monthNames[month - 1]} {year}
          </p>
        </div>
      </div>
    )
  }

  if (error && step === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/dashboard/payroll"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-red-400 font-bold mb-2">Gagal</p>
            <p className="text-slate-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => router.push("/dashboard/payroll")}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/dashboard/payroll"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 mb-6 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-emerald-400 mb-1">
              Slip Gaji Berjaya Disimpan
            </h2>
            <p className="text-slate-400 text-sm">
              {monthNames[month - 1]} {year} &middot; {preview.length} pekerja
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">Gaji Kasar</p>
              <p className="text-lg font-bold text-white">RM{totalGross.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">Potongan</p>
              <p className="text-lg font-bold text-red-400">-RM{totalDeductions.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">Gaji Bersih</p>
              <p className="text-lg font-bold text-emerald-400">RM{totalNet.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/payroll"
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold text-center hover:from-blue-400 hover:to-indigo-500 transition-all"
            >
              Senarai Gaji
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          href="/dashboard/payroll"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Senarai Gaji
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Jana Slip Gaji</h1>
            <p className="text-sm text-slate-400 mt-1">
              {monthNames[month - 1]} {year} &middot; {employees.length} pekerja &middot; {workingDays} hari bekerja
            </p>
          </div>
          <div className="flex gap-2">
            {step === "input" && (
              <button
                onClick={handleCalculate}
                className="flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:from-emerald-400 hover:to-teal-500 transition-all"
              >
                <Calculator className="w-4 h-4" /> Kira
              </button>
            )}
            {step === "preview" && (
              <>
                <button
                  onClick={() => setStep("input")}
                  className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Kembali
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-bold text-sm">{error}</p>
              {step === "preview" && (
                <button
                  onClick={() => setStep("input")}
                  className="text-red-300 text-xs underline mt-1"
                >
                  Kembali ke borang input
                </button>
              )}
            </div>
          </div>
        )}

        {step === "input" && (
          <div className="space-y-4">
            {employees.map(emp => {
              const input = employeeInputs.find(i => i.employeeId === emp.id)
              if (!input) return null

              const empOvertime = overtimeEntries.filter(e => e.employeeId === emp.id)
              const basicSalary = emp.basicSalary ? Number(emp.basicSalary) : Number(emp.salary)
              const dailyRate = basicSalary / workingDays

              return (
                <div key={emp.id} className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/[0.08] bg-slate-900 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.icNumber} &middot; RM{basicSalary.toFixed(2)}/bulan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Anggaran Bersih</p>
                      <p className="text-lg font-bold text-emerald-400">
                        RM{(basicSalary - (basicSalary * 0.11) - 15 - 5 - 20).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Overtime */}
                    <div className="col-span-2 md:col-span-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Overtime (Lembur)</label>
                        <button
                          onClick={() => addOvertimeEntry(emp.id)}
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                        >
                          <Plus className="w-3 h-3" /> Tambah OT
                        </button>
                      </div>
                      <div className="space-y-2">
                        {empOvertime.map(ot => (
                          <div key={ot.id} className="flex items-center gap-2">
                            <input
                              type="date"
                              value={ot.date}
                              onChange={e => updateOvertimeEntry(ot.id, "date", e.target.value)}
                              className="flex-1 h-8 rounded-lg bg-slate-800 border border-white/10 px-2 text-white text-xs"
                            />
                            <input
                              type="number"
                              placeholder="Jam"
                              value={ot.hours || ""}
                              onChange={e => updateOvertimeEntry(ot.id, "hours", Number(e.target.value))}
                              className="w-20 h-8 rounded-lg bg-slate-800 border border-white/10 px-2 text-white text-xs"
                            />
                            <input
                              type="number"
                              placeholder="Kadar"
                              value={ot.rate || ""}
                              onChange={e => updateOvertimeEntry(ot.id, "rate", Number(e.target.value))}
                              className="w-24 h-8 rounded-lg bg-slate-800 border border-white/10 px-2 text-white text-xs"
                            />
                            <span className="text-xs text-slate-400 w-16 text-right">
                              RM{ot.amount.toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeOvertimeEntry(ot.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {empOvertime.length === 0 && (
                          <p className="text-xs text-slate-600">Tiada rekod overtime</p>
                        )}
                        {empOvertime.length > 0 && (
                          <p className="text-xs text-blue-400">
                            Jumlah OT: RM{empOvertime.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                            ({empOvertime.reduce((s, e) => s + Number(e.hours), 0).toFixed(1)} jam)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Attendance */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Hari Absen</label>
                      <input
                        type="number"
                        value={input.absentDays || ""}
                        onChange={e => updateEmployeeInput(emp.id, "absentDays", Number(e.target.value))}
                        className="w-full h-8 rounded-lg bg-slate-800 border border-white/10 px-2 text-white text-xs"
                        placeholder="0"
                        min="0"
                        max={workingDays}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Jam Lewat</label>
                      <input
                        type="number"
                        value={input.lateHours || ""}
                        onChange={e => updateEmployeeInput(emp.id, "lateHours", Number(e.target.value))}
                        className="w-full h-8 rounded-lg bg-slate-800 border border-white/10 px-2 text-white text-xs"
                        placeholder="0"
                        min="0"
                        max="24"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Bonus (RM)</label>
                      <input
                        type="number"
                        value={input.bonusAmount || ""}
                        onChange={e => updateEmployeeInput(emp.id, "bonusAmount", Number(e.target.value))}
                        className="w-full h-8 rounded-lg bg-slate-800 border border-white/10 px-2 text-white text-xs"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Komisen (RM)</label>
                      <input
                        type="number"
                        value={input.commissionAmount || ""}
                        onChange={e => updateEmployeeInput(emp.id, "commissionAmount", Number(e.target.value))}
                        className="w-full h-8 rounded-lg bg-slate-800 border border-white/10 px-2 text-white text-xs"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Custom Pay Items */}
                    {payItemTemplates.length > 0 && (
                      <div className="col-span-2 md:col-span-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Elaun / Potongan Custom</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {payItemTemplates.map(template => (
                            <div key={template.id}>
                              <label className="block text-[10px] text-slate-500 mb-0.5">
                                {template.name} ({template.type === "ALLOWANCE" ? "Elaun" : "Potongan"})
                              </label>
                              <input
                                type="number"
                                value={input.customPayItems[template.id] || ""}
                                onChange={e => updateCustomPayItem(emp.id, template.id, Number(e.target.value))}
                                className="w-full h-8 rounded-lg bg-slate-800 border border-white/10 px-2 text-white text-xs"
                                placeholder="0"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="col-span-2 md:col-span-4 rounded-lg bg-slate-800/50 p-3">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-500">Potongan Absen:</span>
                          <span className="ml-2 text-orange-400">-RM{input.attendanceDeduction.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Pinjaman:</span>
                          <span className="ml-2 text-amber-400">
                            -RM{(emp.loans?.reduce((s, l) => s + Number(l.monthlyDeduction), 0) || 0).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Gaji Dasar:</span>
                          <span className="ml-2 text-white">RM{basicSalary.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 mb-6">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-blue-400 font-bold text-sm">Pratonton Gaji</p>
                  <p className="text-slate-400 text-xs">Semak semula sebelum menyimpan</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">Jumlah Gaji Kasar</p>
                <p className="text-xl font-bold text-white">RM{totalGross.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">Jumlah Potongan</p>
                <p className="text-xl font-bold text-red-400">-RM{totalDeductions.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">Jumlah Gaji Bersih</p>
                <p className="text-xl font-bold text-emerald-400">RM{totalNet.toFixed(2)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-slate-900">
                      <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Pekerja</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">Kasar</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">KWSP</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">PERKESO</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">EIS</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">PCB</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">Pinjaman</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">Absen</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-emerald-400 uppercase">Bersih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((p, idx) => (
                      <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white">{p.employeeName}</p>
                          <p className="text-xs text-slate-500">{p.icNumber}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-white tabular-nums">{p.grossSalary.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-slate-400 tabular-nums">{p.epfEmployee.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-slate-400 tabular-nums">{p.socsoEmployee.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-slate-400 tabular-nums">{p.eisEmployee.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-slate-400 tabular-nums">{p.pcbAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-amber-400 tabular-nums">{p.loanDeduction.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-orange-400 tabular-nums">{p.attendanceDeduction.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-400 tabular-nums">{p.netSalary.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900">
                      <td className="px-4 py-3 font-bold text-white">JUMLAH</td>
                      <td className="px-4 py-3 text-right font-bold text-white tabular-nums">{totalGross.toFixed(2)}</td>
                      <td colSpan={6} />
                      <td className="px-4 py-3 text-right font-bold text-red-400 tabular-nums">{totalDeductions.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-400 tabular-nums">{totalNet.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
