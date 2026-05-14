"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, User, Building, Lock, AlertCircle } from "lucide-react"

interface ProfileFormProps {
  user: {
    id: string
    name: string | null
    email: string | null
    phone: string | null
    companyName: string | null
    companyRegistration: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    companyName: user.companyName || "",
    companyRegistration: user.companyRegistration || "",
    newPassword: "",
    confirmPassword: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("Kata laluan baru dan pengesahan tidak sepadan.")
      return
    }

    if (form.newPassword && form.newPassword.length < 8) {
      setError("Kata laluan mesti sekurang-kurangnya 8 aksara.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Ralat semasa menyimpan profil.")
      }

      toast({
        title: "Berjaya",
        description: "Profil anda telah dikemaskini.",
      })
      
      setForm(prev => ({ ...prev, newPassword: "", confirmPassword: "" }))
      router.refresh()
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
      <div className="p-6 pb-4 border-b border-white/[0.06]">
        <h2 className="text-lg font-bold text-white">Kemaskini Profil</h2>
        <p className="text-sm text-slate-400">Ubah maklumat peribadi dan kata laluan anda di sini.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Maklumat Peribadi
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nama Penuh</Label>
              <Input
                className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 rounded-xl"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Emel (Tidak boleh diubah)</Label>
              <Input
                className="bg-white/[0.02] border-white/[0.04] text-slate-500 rounded-xl"
                value={user.email || ""}
                disabled
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-slate-300">No Telefon</Label>
              <Input
                className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 rounded-xl"
                value={form.phone}
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4" /> Maklumat Syarikat
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Nama Syarikat</Label>
              <Input
                className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 rounded-xl"
                value={form.companyName}
                onChange={e => setForm({...form, companyName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">No Pendaftaran Syarikat</Label>
              <Input
                className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 rounded-xl"
                value={form.companyRegistration}
                onChange={e => setForm({...form, companyRegistration: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Security */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4" /> Keselamatan
          </h3>
          <p className="text-xs text-slate-500 mb-2">Biarkan kosong jika tidak mahu menukar kata laluan.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Kata Laluan Baru</Label>
              <Input
                type="password"
                className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 rounded-xl"
                value={form.newPassword}
                onChange={e => setForm({...form, newPassword: e.target.value})}
                placeholder="********"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Sahkan Kata Laluan Baru</Label>
              <Input
                type="password"
                className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 rounded-xl"
                value={form.confirmPassword}
                onChange={e => setForm({...form, confirmPassword: e.target.value})}
                placeholder="********"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={loading} className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring px-8">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </Button>
        </div>

      </form>
    </div>
  )
}
