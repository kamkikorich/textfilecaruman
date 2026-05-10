"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle2, Calendar as CalendarIcon, Loader2, Edit2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface SubmissionPaymentStatusProps {
  submissionId: string
  initialStatus: string
  initialPaidAt: Date | null
  initialReference: string | null
}

export function SubmissionPaymentStatus({
  submissionId,
  initialStatus,
  initialPaidAt,
  initialReference,
}: SubmissionPaymentStatusProps) {
  const safeDate = (d: Date | string | null) => {
    if (!d) return null
    const date = new Date(d)
    return isNaN(date.getTime()) ? null : date
  }

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paidAt, setPaidAt] = useState(() => {
    const d = safeDate(initialPaidAt)
    return d ? format(d, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
  })
  const [reference, setReference] = useState(initialReference || "")
  const { toast } = useToast()
  const router = useRouter()

  const isPaid = initialStatus === "paid"

  async function handleUpdate(newStatus: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          paidAt: newStatus === "paid" ? paidAt : null,
          paymentReference: reference,
        }),
      })

      if (res.ok) {
        toast({
          title: "Berjaya",
          description: newStatus === "paid" ? "Caruman ditanda sebagai telah dibayar." : "Caruman ditukar ke draf.",
        })
        setOpen(false)
        router.refresh()
      } else {
        toast({
          title: "Ralat",
          description: "Gagal mengemaskini status caruman.",
          variant: "destructive",
        })
      }
    } catch (e) {
      toast({
        title: "Ralat",
        description: "Ralat rangkaian.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 no-print">
      <div className="flex items-center justify-between p-6 rounded-2xl border border-white/[0.08] bg-slate-900/80">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isPaid ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-800 border border-white/5"
          }`}>
            <CheckCircle2 className={`w-6 h-6 ${isPaid ? "text-emerald-400" : "text-slate-500"}`} />
          </div>
          <div>
            <h3 className="font-bold text-white">Status Pembayaran PERKESO</h3>
            <p className="text-sm text-slate-400">
              {isPaid 
                ? `Dibayar pada ${safeDate(initialPaidAt) ? format(safeDate(initialPaidAt)!, "dd/MM/yyyy") : "N/A"}` 
                : "Tandakan jika anda telah membuat bayaran di portal ASSIST."}
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              variant={isPaid ? "outline" : "default"}
              className={isPaid 
                ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10" 
                : "bg-blue-600 hover:bg-blue-500 text-white"}
            >
              {isPaid ? (
                <><Edit2 className="w-4 h-4 mr-2" /> Kemaskini Bayaran</>
              ) : (
                "Tanda Telah Bayar"
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Rekod Bayaran Caruman</DialogTitle>
              <DialogDescription className="text-slate-400">
                Sila masukkan tarikh bayaran sebenar seperti dalam resit PERKESO.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="paidAt">Tarikh Dibayar</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    id="paidAt"
                    type="date"
                    value={paidAt}
                    onChange={(e) => setPaidAt(e.target.value)}
                    className="bg-white/[0.04] border-white/[0.08] text-white pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ref">No. Rujukan / Resit (Opsional)</Label>
                <Input
                  id="ref"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Contoh: REF12345678"
                  className="bg-white/[0.04] border-white/[0.08] text-white h-11 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              {isPaid && (
                <Button 
                  variant="ghost" 
                  onClick={() => handleUpdate("draft")}
                  disabled={loading}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  Batal Rekod Bayaran
                </Button>
              )}
              <Button 
                onClick={() => handleUpdate("paid")} 
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white min-w-[120px]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Rekod"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
