"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react"

interface PayrollPeriod {
  id: string
  month: number
  year: number
  status: string
  totalGross: number
  totalDeductions: number
  totalNet: number
  payrollEmployees: {
    id: string
    grossSalary: number
    netSalary: number
    employee: { name: string }
  }[]
}

export default function RunPayrollPage() {
  const router = useRouter()
  const params = useSearchParams()
  const month = Number(params.get("month")) || new Date().getMonth() + 1
  const year = Number(params.get("year")) || new Date().getFullYear()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<PayrollPeriod | null>(null)

  const monthNames = [
    "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember",
  ]

  useEffect(() => {
    runPayroll()
  }, [])

  async function runPayroll() {
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

      const payrollRes = await fetch("/api/payroll/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId: employers[0].id,
          month,
          year,
        }),
      })

      const data = await payrollRes.json()

      if (!payrollRes.ok) {
        setError(data.error || "Gagal menjana slip gaji")
      } else {
        setResult(data)
      }
    } catch {
      setError("Ralat sambungan. Sila cuba lagi.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-lg font-bold">Menjana Slip Gaji...</p>
          <p className="text-sm text-slate-400 mt-1">
            {monthNames[month - 1]} {year}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/dashboard/payroll"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        {error ? (
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
        ) : result ? (
          <>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 mb-6 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-emerald-400 mb-1">
                Slip Gaji Berjaya Dijana
              </h2>
              <p className="text-slate-400 text-sm">
                {monthNames[result.month - 1]} {result.year} &middot;{" "}
                {result.payrollEmployees.length} pekerja
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">Gaji Kasar</p>
                <p className="text-lg font-bold text-white">
                  RM{Number(result.totalGross).toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">Potongan</p>
                <p className="text-lg font-bold text-red-400">
                  -RM{Number(result.totalDeductions).toFixed(2)}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">Gaji Bersih</p>
                <p className="text-lg font-bold text-emerald-400">
                  RM{Number(result.totalNet).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/dashboard/payroll/periods/${result.id}`}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold text-center hover:from-blue-400 hover:to-indigo-500 transition-all"
              >
                Lihat Slip Gaji Penuh
              </Link>
              <Link
                href="/dashboard/payroll"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
              >
                Selesai
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
