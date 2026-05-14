"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, CreditCard } from "lucide-react"

interface Loan {
  id: string
  totalAmount: number
  monthlyDeduction: number
  balance: number
  status: string
  description: string | null
}

interface Employee {
  id: string
  name: string
}

export default function LoansPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmp, setSelectedEmp] = useState("")
  const [employeeLoans, setEmployeeLoans] = useState<Loan[]>([])
  const [totalAmount, setTotalAmount] = useState("")
  const [monthly, setMonthly] = useState("")
  const [desc, setDesc] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/employees").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setEmployees(data)
      setLoading(false)
    })
  }, [])

  async function loadLoans(empId: string) {
    if (!empId) { setEmployeeLoans([]); return }
    const res = await fetch(`/api/payroll/loans?employeeId=${empId}`)
    if (res.ok) setEmployeeLoans(await res.json())
  }

  async function addLoan(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!selectedEmp || !totalAmount || !monthly) {
      setError("Semua ruangan wajib diisi"); return
    }
    const res = await fetch("/api/payroll/loans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: selectedEmp,
        totalAmount: Number(totalAmount),
        monthlyDeduction: Number(monthly),
        description: desc || null,
      }),
    })
    if (!res.ok) { setError((await res.json()).error); return }
    setTotalAmount("")
    setMonthly("")
    setDesc("")
    loadLoans(selectedEmp)
  }

  async function removeLoan(id: string) {
    await fetch(`/api/payroll/loans?id=${id}`, { method: "DELETE" })
    loadLoans(selectedEmp)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/dashboard/payroll" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-xl font-bold mb-1">Pengurusan Pinjaman Pekerja</h1>
        <p className="text-xs text-slate-400 mb-6">Pinjaman akan ditolak automatik setiap kali gaji dijana. Berhenti bila baki RM0.</p>

        <form onSubmit={addLoan} className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/80 mb-6 space-y-3">
          <select value={selectedEmp} onChange={e => { setSelectedEmp(e.target.value); loadLoans(e.target.value) }} className="w-full h-10 rounded-lg bg-slate-800 border border-white/10 px-3 text-white text-sm">
            <option value="">Pilih pekerja...</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Jumlah Pinjaman (RM)</label>
              <input value={totalAmount} onChange={e => setTotalAmount(e.target.value)} type="number" step="0.01" className="w-full h-10 rounded-lg bg-slate-800 border border-white/10 px-3 text-white text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Potongan Bulanan (RM)</label>
              <input value={monthly} onChange={e => setMonthly(e.target.value)} type="number" step="0.01" className="w-full h-10 rounded-lg bg-slate-800 border border-white/10 px-3 text-white text-sm" />
            </div>
          </div>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Keterangan (optional)" className="w-full h-10 rounded-lg bg-slate-800 border border-white/10 px-3 text-white text-sm" />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" className="w-full h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-bold hover:bg-amber-500/30 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Pinjaman
          </button>
        </form>

        {selectedEmp && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pinjaman Sedia Ada</h3>
            {employeeLoans.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">Tiada pinjaman untuk pekerja ini.</p>
            ) : employeeLoans.map(loan => (
              <div key={loan.id} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-slate-900/60">
                <div>
                  <p className="text-sm font-bold text-white">
                    RM{Number(loan.totalAmount).toFixed(2)} &rarr; RM{Number(loan.monthlyDeduction).toFixed(2)}/bulan
                  </p>
                  <p className="text-xs text-slate-400">
                    Baki: <span className={Number(loan.balance) <= 0 ? "text-emerald-400" : "text-amber-400"}>
                      RM{Number(loan.balance).toFixed(2)}
                    </span>
                    {loan.status === "PAID" && <span className="text-emerald-400 ml-2">(Selesai)</span>}
                    {loan.description && <span className="text-slate-500 ml-2">- {loan.description}</span>}
                  </p>
                </div>
                <button onClick={() => removeLoan(loan.id)} className="text-slate-600 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
