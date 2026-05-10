"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react"

interface DeleteSubmissionButtonProps {
  submissionId: string
  label?: string // e.g. "06/2026"
  redirectAfter?: string // where to redirect after delete
  variant?: "icon" | "full"
}

export function DeleteSubmissionButton({
  submissionId,
  label,
  redirectAfter = "/dashboard",
  variant = "full",
}: DeleteSubmissionButtonProps) {
  const router = useRouter()
  const [showDialog, setShowDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  async function handleDelete() {
    setIsDeleting(true)
    setError("")
    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: "DELETE",
      })
      
      let data: any = {}
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await res.json()
      }

      if (!res.ok) throw new Error(data.error || data.message || `Ralat ${res.status}: Gagal memadam.`)
      
      setShowDialog(false)
      router.push(redirectAfter)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Trigger Button */}
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="h-8 w-8 p-0 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 transition-all"
          title="Padam caruman"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="gap-2 border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-300 focus-ring"
        >
          <Trash2 className="w-4 h-4" />
          Padam
        </Button>
      )}

      {/* Confirmation Dialog Overlay */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/[0.08] rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Padam Caruman?</h3>
                  <p className="text-sm text-slate-500">Tindakan ini tidak boleh dibatalkan</p>
                </div>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="text-slate-600 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="bg-rose-500/[0.05] border border-rose-500/20 rounded-xl p-4 mb-5">
              <p className="text-sm text-slate-300">
                Anda akan memadam rekod caruman{" "}
                {label && (
                  <span className="font-bold text-rose-300">bulan {label}</span>
                )}{" "}
                berserta semua data caruman pekerja yang berkaitan.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Fail teks yang telah dijana juga akan dipadam secara kekal.
              </p>
            </div>

            {error && (
              <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 border border-white/10 hover:bg-white/5 text-slate-300"
                onClick={() => setShowDialog(false)}
                disabled={isDeleting}
              >
                Batal
              </Button>
              <Button
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 gap-2"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Memadam...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Ya, Padam
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
