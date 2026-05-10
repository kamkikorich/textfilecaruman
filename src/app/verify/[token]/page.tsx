"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Mail, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [status, setStatus] = useState<"verifying" | "success" | "error" | "expired">("verifying")
  const [message, setMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    verifyEmail()
  }, [])

  async function verifyEmail() {
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params.token }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage(data.message)
        setUserEmail(data.email || "")
      } else if (data.error?.includes("expired")) {
        setStatus("expired")
        setMessage(data.error)
      } else {
        setStatus("error")
        setMessage(data.error)
      }
    } catch (error) {
      setStatus("error")
      setMessage("Ralat sambungan. Sila cuba lagi.")
    }
  }

  async function handleResend() {
    if (!userEmail) return

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })

      if (res.ok) {
        setMessage("✅ Email pengesahan telah dihantar semula!")
      }
    } catch (error) {
      console.error("Resend error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md glass rounded-2xl p-8 animate-in fade-in zoom-in duration-500">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 group justify-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">
            TextFile<span className="gradient-text-subtle">SKBBK</span>
          </span>
        </Link>

        {/* Status Icon */}
        <div className="flex justify-center mb-6">
          {status === "verifying" && (
            <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
            </div>
          )}
          {status === "success" && (
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
          )}
          {status === "error" && (
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-rose-400" />
            </div>
          )}
          {status === "expired" && (
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Mail className="w-10 h-10 text-amber-400" />
            </div>
          )}
        </div>

        {/* Title & Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {status === "verifying" && "Mengesahkan Email..."}
            {status === "success" && "✅ Email Disahkan!"}
            {status === "error" && "❌ Pengesahan Gagal"}
            {status === "expired" && "⏰ Link Tamat Tempoh"}
          </h1>
          <p className="text-slate-400 text-sm">
            {status === "verifying" && "Sila tunggu sebentar..."}
            {status === "success" && message}
            {status === "error" && message}
            {status === "expired" && (
              <>
                Link pengesahan ini telah tamat tempoh (24 jam).<br />
                Sila minta link pengesahan baru.
              </>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        {status === "success" && (
          <div className="space-y-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/25 rounded-xl">
                🚀 Ke Dashboard
              </Button>
            </Link>
            <Link href="/login" className="w-full block">
              <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl">
                Log Masuk
              </Button>
            </Link>
          </div>
        )}

        {status === "expired" && (
          <div className="space-y-3">
            <Button
              onClick={handleResend}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/25 rounded-xl"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Hantar Link Baru
            </Button>
            <Link href="/login" className="w-full block">
              <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl">
                Kembali ke Log Masuk
              </Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <Link href="/register" className="w-full block">
              <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 rounded-xl">
                Daftar Semula
              </Button>
            </Link>
            <Link href="/login" className="w-full block">
              <Button variant="outline" className="w-full h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl">
                Log Masuk
              </Button>
            </Link>
          </div>
        )}

        {/* Footer Link */}
        <Link href="/" className="mt-8 text-sm text-slate-500 flex items-center gap-2 hover:text-slate-300 transition-colors justify-center">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Laman Utama
        </Link>
      </div>
    </div>
  )
}
