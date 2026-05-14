"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, User, Mail, Building, Lock, Loader2, ArrowLeft } from "lucide-react"
import { registerUser } from "./actions"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const result = await registerUser({ name, email, password, companyName })

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.requiresVerification) {
      setSuccess(result.message || "Pendaftaran berjaya! Sila semak email anda.")
      setLoading(false)
      return
    }

    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (loginResult?.error) {
      setError("Pendaftaran berjaya tetapi log masuk automatik gagal. Sila log masuk secara manual.")
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <span className="font-bold text-2xl tracking-tight text-white">
          TextFile<span className="gradient-text-subtle">SKBBK</span>
        </span>
      </Link>

      <div className="w-full max-w-md glass rounded-2xl p-8 animate-fade-in">
        <div className="space-y-1 mb-8">
          <h1 className="text-2xl font-bold text-white">Daftar Akaun</h1>
          <p className="text-slate-400 text-sm">
            Mula mengurus caruman syarikat anda hari ini
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300 text-sm font-medium">Nama Penuh</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="name"
                className="pl-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 transition-all"
                placeholder="Ahmad bin Abdullah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Alamat Email</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                className="pl-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 transition-all"
                placeholder="admin@syarikat.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-slate-300 text-sm font-medium">Nama Syarikat</Label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="company"
                className="pl-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 transition-all"
                placeholder="ABC Sdn Bhd"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Kata Laluan</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                className="pl-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 transition-all"
                placeholder="Minimum 6 aksara"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all rounded-xl focus-ring mt-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Mendaftar...
              </>
            ) : (
              "Cipta Akaun"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <p className="text-sm text-slate-500">
            Sudah ada akaun?{" "}
            <Link href="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Log masuk
            </Link>
          </p>
        </div>
      </div>

      <Link href="/" className="mt-8 text-sm text-slate-500 flex items-center gap-2 hover:text-slate-300 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Laman Utama
      </Link>
    </div>
  )
}