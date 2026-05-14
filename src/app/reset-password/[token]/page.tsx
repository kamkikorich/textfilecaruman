"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password.length < 6) {
      setError("Kata laluan mesti sekurang-kurangnya 6 aksara.")
      return
    }

    if (password !== confirmPassword) {
      setError("Kata laluan tidak sepadan.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError(data.error || "Ralat berlaku. Sila cuba lagi.")
      }
    } catch (err) {
      console.error("Reset password error:", err)
      setError("Ralat sambungan. Sila cuba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
          <h1 className="text-2xl font-bold text-white">Reset Kata Laluan</h1>
          <p className="text-slate-400 text-sm">
            Tetapkan kata laluan baru untuk akaun anda
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 text-emerald-400 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p>{success}</p>
                <p className="text-slate-400 text-xs">
                  Anda akan dihalakan ke halaman log masuk...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Kata Laluan Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 transition-all"
                  placeholder="Minimum 6 aksara"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-medium">Sahkan Kata Laluan Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="confirmPassword"
                  type="password"
                  className="pl-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 transition-all"
                  placeholder="Ulang kata laluan baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
                  Menyimpan...
                </>
              ) : (
                "Simpan Kata Laluan Baru"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
