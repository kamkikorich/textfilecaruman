import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CreditCard, Calendar, CheckCircle2, Clock, XCircle, RotateCcw } from "lucide-react"
import { format } from "date-fns"

export default async function AdminSubscriptionsPage() {
  const subscriptions = await db.subscription.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: true,
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Pengurusan Langganan</h1>
        <p className="text-slate-500">Senarai status langganan bagi semua pengguna.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-400">Pengguna</TableHead>
              <TableHead className="text-slate-400">Pelan</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Mula</TableHead>
              <TableHead className="text-slate-400">Tamat</TableHead>
              <TableHead className="text-slate-400 text-right">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-500 italic">
                  Tiada data langganan ditemui.
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((sub) => (
                <TableRow key={sub.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white uppercase">{sub.user.name || "N/A"}</span>
                      <span className="text-xs text-slate-500">{sub.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5">
                      {sub.planType.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {sub.status === "active" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> AKTIF</Badge>
                    ) : sub.status === "trial" ? (
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20"><Clock className="w-3 h-3 mr-1" /> PERCUBAAN</Badge>
                    ) : (
                      <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20"><XCircle className="w-3 h-3 mr-1" /> NYAHAKTIF</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {sub.currentPeriodStart ? format(sub.currentPeriodStart, "dd/MM/yyyy") : (sub.trialStart ? format(sub.trialStart, "dd/MM/yyyy") : "-")}
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {sub.currentPeriodEnd ? format(sub.currentPeriodEnd, "dd/MM/yyyy") : (sub.trialEnd ? format(sub.trialEnd, "dd/MM/yyyy") : "-")}
                  </TableCell>
                  <TableCell className="text-right">
                    {sub.status !== "active" && (
                      <form action="/api/admin/subscriptions/reactivate" method="POST">
                        <input type="hidden" name="subscriptionId" value={sub.id} />
                        <input type="hidden" name="userId" value={sub.userId} />
                        <select 
                          name="duration" 
                          className="text-sm bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 mr-2 focus:ring-2 focus:ring-rose-500"
                          defaultValue="1"
                        >
                          <option value="1">1 Bulan</option>
                          <option value="3">3 Bulan</option>
                          <option value="6">6 Bulan</option>
                          <option value="12">12 Bulan</option>
                        </select>
                        <Button 
                          type="submit" 
                          size="sm" 
                          variant="outline"
                          className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 h-8"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reactivate
                        </Button>
                      </form>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
