"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Settings } from "lucide-react"

interface PayItem {
  id: string
  name: string
  type: string
  epfTaxable: boolean
}

export default function PayItemsPage() {
  const [items, setItems] = useState<PayItem[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [type, setType] = useState("ALLOWANCE")
  const [epfTaxable, setEpfTaxable] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    const res = await fetch("/api/payroll/pay-items")
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name.trim()) { setError("Nama diperlukan"); return }
    const res = await fetch("/api/payroll/pay-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), type, epfTaxable }),
    })
    if (!res.ok) { setError((await res.json()).error); return }
    setName("")
    load()
  }

  async function remove(id: string) {
    await fetch(`/api/payroll/pay-items?id=${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/dashboard/payroll" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <h1 className="text-xl font-bold mb-1">Pay Items (Elaun & Potongan Custom)</h1>
        <p className="text-xs text-slate-400 mb-6">Tambah jenis elaun/potongan yang akan muncul dalam setiap slip gaji</p>

        <form onSubmit={add} className="flex flex-wrap gap-2 mb-6 p-4 rounded-xl border border-white/[0.08] bg-slate-900/80">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama item..." className="h-10 flex-1 min-w-[150px] rounded-lg bg-slate-800 border border-white/10 px-3 text-white text-sm" />
          <select value={type} onChange={e => setType(e.target.value)} className="h-10 rounded-lg bg-slate-800 border border-white/10 px-3 text-white text-sm">
            <option value="ALLOWANCE">Elaun</option>
            <option value="DEDUCTION">Potongan</option>
          </select>
          <label className="flex items-center gap-2 text-xs text-slate-400 h-10">
            <input type="checkbox" checked={epfTaxable} onChange={e => setEpfTaxable(e.target.checked)} className="rounded" /> KWSP
          </label>
          <button type="submit" className="h-10 px-4 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold hover:bg-blue-500/30">
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-slate-900/60">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.type === "ALLOWANCE" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  {item.type === "ALLOWANCE" ? "ELAUN" : "POTONGAN"}
                </span>
                <span className="text-sm text-white">{item.name}</span>
                {item.epfTaxable && <span className="text-[10px] text-blue-400">KWSP</span>}
              </div>
              <button onClick={() => remove(item.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {!loading && items.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">Tiada pay item. Tambah satu untuk bermula.</p>
          )}
        </div>
      </div>
    </div>
  )
}
