"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Building2,
  ArrowLeft,
  Save,
  MapPin,
  Phone,
  Mail,
  Hash,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Employer {
  id: string
  employerCode: string
  employerName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postcode: string
  phonePrimary: string
  emailPrimary: string
  perkesoBranch?: string
  ssmNumber?: string
}

export default function EmployersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [employers, setEmployers] = useState<Employer[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    code: "",
    name: "",
    address1: "",
    address2: "",
    city: "",
    state: "WILAYAH_PERSEKUTUAN",
    postcode: "",
    phone: "",
    email: "",
    branch: "",
    ssm: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchEmployers()
    }
  }, [session])

  async function fetchEmployers() {
    setLoading(true)
    try {
      const res = await fetch("/api/employers")
      if (res.ok) {
        const data = await res.json()
        setEmployers(data)
        if (data.length > 0) {
          const e = data[0]
          setForm({
            code: e.employerCode,
            name: e.employerName,
            address1: e.addressLine1 || "",
            address2: e.addressLine2 || "",
            city: e.city || "",
            state: e.state || "",
            postcode: e.postcode || "",
            phone: e.phonePrimary || "",
            email: e.emailPrimary || "",
            branch: e.perkesoBranch || "",
            ssm: e.ssmNumber || ""
          })
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const res = await fetch("/api/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerCode: form.code,
          employerName: form.name,
          addressLine1: form.address1,
          addressLine2: form.address2,
          city: form.city,
          state: form.state,
          postcode: form.postcode,
          phonePrimary: form.phone,
          emailPrimary: form.email,
          perkesoBranch: form.branch,
          ssmNumber: form.ssm
        }),
      })

      if (res.ok) {
        toast({
          title: "Berjaya",
          description: "Maklumat majikan telah dikemas kini.",
        })
        setShowForm(false)
        fetchEmployers()
      } else {
        const data = await res.json()
        setError(data.error || "Gagal menyimpan majikan.")
      }
    } catch (e) {
      setError("Ralat rangkaian.")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "loading" || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
    </div>
  )

  const employer = employers[0]
  const inputClass = "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 rounded-xl h-11 transition-all"

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
            <ArrowLeft className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Dashboard</span>
          </Button>
          <div className="h-6 w-px bg-white/[0.08]" />
          <h1 className="font-bold text-lg text-white">Maklumat Majikan</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!showForm && employer ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white">{employer.employerName}</h2>
                <p className="text-slate-400 flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-mono">
                    {employer.employerCode}
                  </Badge>
                  {employer.ssmNumber && <span>· SSM: {employer.ssmNumber}</span>}
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">
                Ubah Maklumat
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
                <div className="p-6 pb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">Alamat Berdaftar</h3>
                </div>
                <div className="px-6 pb-6">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="font-medium text-white">{employer.addressLine1}</p>
                    {employer.addressLine2 && <p className="text-slate-400">{employer.addressLine2}</p>}
                    <p className="text-slate-400">{employer.postcode} {employer.city}</p>
                    <p className="text-slate-400">{employer.state.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
                <div className="p-6 pb-4">
                  <h3 className="text-lg font-bold text-white">Info PERKESO</h3>
                </div>
                <div className="px-6 pb-6 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cawangan</p>
                    <p className="font-semibold text-white">{employer.perkesoBranch || "Tidak Ditetapkan"}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Status Aktif</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
                <div className="p-6 pb-4">
                  <h3 className="text-lg font-bold text-white">Maklumat Hubungan</h3>
                </div>
                <div className="px-6 pb-6 grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] group hover:border-blue-500/20 hover:bg-blue-500/[0.03] transition-all">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <Phone className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No. Telefon</p>
                      <p className="font-semibold text-white">{employer.phonePrimary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] group hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                      <Mail className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Email</p>
                      <p className="font-semibold text-white">{employer.emailPrimary}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6">
            <h2 className="text-2xl font-bold text-white mb-1">
              {employer ? "Ubah Maklumat Majikan" : "Daftar Majikan Baharu"}
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              Maklumat ini akan digunakan untuk menjana Header fail 278-aksara PERKESO.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Kod Majikan (12 aksara)</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      className={`pl-10 font-mono uppercase ${inputClass}`}
                      value={form.code}
                      onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                      placeholder="E2303381K"
                      maxLength={12}
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 italic">Contoh: E2303381K (ikut surat pendaftaran PERKESO)</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Nama Syarikat / Majikan</Label>
                  <Input
                    className={`font-semibold ${inputClass}`}
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value.toUpperCase()})}
                    placeholder="ABC SDN BHD"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Alamat Penuh (Baris 1)</Label>
                  <Input
                    className={inputClass}
                    value={form.address1}
                    onChange={(e) => setForm({...form, address1: e.target.value})}
                    placeholder="No. 123, Jalan Example"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-300">Alamat (Baris 2)</Label>
                  <Input
                    className={inputClass}
                    value={form.address2}
                    onChange={(e) => setForm({...form, address2: e.target.value})}
                    placeholder="Taman Business Park"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Bandar</Label>
                  <Input
                    className={inputClass}
                    value={form.city}
                    onChange={(e) => setForm({...form, city: e.target.value.toUpperCase()})}
                    placeholder="KUALA LUMPUR"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Negeri</Label>
                  <Input
                    className={inputClass}
                    value={form.state}
                    onChange={(e) => setForm({...form, state: e.target.value.toUpperCase()})}
                    placeholder="WILAYAH_PERSEKUTUAN"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Poskod</Label>
                  <Input
                    className={inputClass}
                    value={form.postcode}
                    onChange={(e) => setForm({...form, postcode: e.target.value})}
                    placeholder="50000"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">No. Telefon Utama</Label>
                  <Input
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    placeholder="+60123456789"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Email Utama</Label>
                  <Input
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder="admin@syarikat.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">No. Pendaftaran SSM</Label>
                  <Input
                    className={inputClass}
                    value={form.ssm}
                    onChange={(e) => setForm({...form, ssm: e.target.value})}
                    placeholder="202401001234"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Cawangan PERKESO</Label>
                  <Input
                    className={inputClass}
                    value={form.branch}
                    onChange={(e) => setForm({...form, branch: e.target.value.toUpperCase()})}
                    placeholder="KUALA LUMPUR"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6 border-t border-white/[0.06]">
                <Button type="submit" disabled={submitting} className="flex-1 sm:flex-none h-11 px-8 gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Maklumat
                </Button>
                {employer && (
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="h-11 px-6 text-slate-400 hover:text-white hover:bg-white/5">
                    Batal
                  </Button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}