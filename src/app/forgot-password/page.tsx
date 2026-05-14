"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setEmail("")
      } else {
        setError(data.error || "Ralat berlaku. Sila cuba lagi.")
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      setError("Ralat berlaku. Sila cuba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
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
          <h1 className="text-2xl font-bold text-white">Lupa Kata Laluan?</h1>
          <p className="text-slate-400 text-sm">
            Masukkan email anda untuk menerima link reset password
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-emerald-400 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Email telah dihantar!</p>
              <p className="text-emerald-300">
                Jika email wujud dalam sistem kami, anda akan menerima link reset password.
                Sila semak inbox dan folder spam anda.
              </p>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 text-sm font-medium">Email</Label>
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
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all rounded-xl focus-ring"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Menghantar...
                </>
              ) : (
                "Hantar Link Reset"
              )}
            </Button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center space-y-2">
          <p className="text-sm text-slate-500">
            Ingat password anda?{" "}
            <Link href="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Log masuk
            </Link>
          </p>
          <p className="text-sm text-slate-500">
            Tiada akaun?{" "}
            <Link href="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Daftar sekarang
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