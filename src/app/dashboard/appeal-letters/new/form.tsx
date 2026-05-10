"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileText, Loader2, AlertCircle } from "lucide-react"

interface Employer {
  id: string
  employerCode: string
  employerName: string
}

interface AppealLetterFormProps {
  employers: Employer[]
}

export function AppealLetterForm({ employers }: AppealLetterFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    letterType: "faedah" as "faedah" | "kompaun",
    employerId: employers[0]?.id || "",
    penaltyAmount: "",
    penaltyPeriod: "",
    reason: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/appeal-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        // Redirect to WhatsApp
        window.open(data.whatsappUrl, "_blank")
        // Then redirect to letter list
        router.push("/dashboard/appeal-letters")
        router.refresh()
      } else {
        setError(data.error || "Gagal memohon surat rayuan.")
      }
    } catch (err) {
      console.error("Error submitting appeal letter:", err)
      setError("Ralat berlaku. Sila cuba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-12">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard/appeal-letters">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
          <h1 className="font-bold text-lg text-white">Mohon Surat Rayuan Baru</h1>
        </div>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Letter Type */}
          <div className="space-y-2">
            <Label className="text-slate-300">Jenis Surat Rayuan</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, letterType: "faedah" })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.letterType === "faedah"
                    ? "bg-purple-500/15 border-purple-500/40 text-white"
                    : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.05]"
                }`}
              >
                <p className="font-semibold text-sm">Faedah Caruman Lewat Bayar</p>
                <p className="text-xs text-slate-500 mt-1">SOCSO dan EIS</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, letterType: "kompaun" })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.letterType === "kompaun"
                    ? "bg-purple-500/15 border-purple-500/40 text-white"
                    : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:bg-white/[0.05]"
                }`}
              >
                <p className="font-semibold text-sm">Kompaun</p>
                <p className="text-xs text-slate-500 mt-1">Denda di bawah Akta PERKESO</p>
              </button>
            </div>
          </div>

          {/* Employer Selection */}
          <div className="space-y-2">
            <Label htmlFor="employer" className="text-slate-300">Perusahaan</Label>
            <select
              id="employer"
              value={formData.employerId}
              onChange={(e) => setFormData({ ...formData, employerId: e.target.value })}
              className="w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white px-4 focus-visible:ring-purple-500/50 focus-visible:ring-offset-slate-950"
              required
            >
              <option value="">Pilih perusahaan...</option>
              {employers.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.employerName} ({emp.employerCode})
                </option>
              ))}
            </select>
          </div>

          {/* Penalty Amount */}
          <div className="space-y-2">
            <Label htmlFor="penaltyAmount" className="text-slate-300">Jumlah Faedah / Kompaun (RM)</Label>
            <Input
              id="penaltyAmount"
              type="number"
              step="0.01"
              placeholder="e.g., 250.00"
              value={formData.penaltyAmount}
              onChange={(e) => setFormData({ ...formData, penaltyAmount: e.target.value })}
              className="bg-white/[0.04] border-white/[0.08] text-white h-12 rounded-xl"
              required
            />
          </div>

          {/* Penalty Period */}
          <div className="space-y-2">
            <Label htmlFor="penaltyPeriod" className="text-slate-300">Tempoh Terlibat</Label>
            <Input
              id="penaltyPeriod"
              type="text"
              placeholder="e.g., Jan 2024 - Mac 2024"
              value={formData.penaltyPeriod}
              onChange={(e) => setFormData({ ...formData, penaltyPeriod: e.target.value })}
              className="bg-white/[0.04] border-white/[0.08] text-white h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-slate-300">Sebab Kelewatan</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Terangkan sebab kelewatan atau punca rayuan secara terperinci..."
              rows={4}
              className="bg-white/[0.04] border-white/[0.08] text-white resize-none rounded-xl"
              required
            />
          </div>

          {/* Info */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-semibold mb-1">Cara Permohonan:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-200/80">
                  <li>Klik &quot;Mohon Perkhidmatan&quot; di bawah</li>
                  <li>Anda akan diarahkan ke WhatsApp admin</li>
                  <li>Scan DuitNow QR dan bayar RM10</li>
                  <li>Hantar screenshot resit ke WhatsApp</li>
                  <li>Admin akan proses dan hantar PDF surat</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Link href="/dashboard/appeal-letters">
              <Button variant="outline" type="button" className="border-white/[0.08] text-slate-300 hover:bg-white/[0.05] rounded-xl">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading || !formData.employerId || !formData.penaltyAmount || !formData.penaltyPeriod || !formData.reason}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 shadow-lg shadow-purple-500/25 rounded-xl h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Memproses...
                </>
              ) : (
                "Mohon Perkhidmatan — RM10"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
