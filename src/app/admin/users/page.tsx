import { db } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Mail, Calendar, Shield, CheckCircle2, Clock, XCircle } from "lucide-react"
import { UserActions } from "./user-actions"

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { employers: true }
      },
      subscriptions: {
        take: 1,
        orderBy: { createdAt: "desc" }
      }
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Pengurusan Pengguna</h1>
        <p className="text-slate-500">Senarai semua pengguna yang berdaftar di dalam platform.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-400">Nama / Email</TableHead>
              <TableHead className="text-slate-400">Peranan</TableHead>
              <TableHead className="text-slate-400">Status Akses</TableHead>
              <TableHead className="text-slate-400">Syarikat</TableHead>
              <TableHead className="text-slate-400 text-right">Majikan</TableHead>
              <TableHead className="text-slate-400 text-right">Tarikh Daftar</TableHead>
              <TableHead className="text-slate-400 text-right w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-white uppercase">{user.name || "N/A"}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={
                    (user.role === "admin" || user.role === "super_admin")
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }>
                    {(user.role === "admin" || user.role === "super_admin") ? <Shield className="w-3 h-3 mr-1" /> : null}
                    {user.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(() => {
                    if (user.role === "admin" || user.role === "super_admin") {
                      return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> ROOT</Badge>
                    }
                    const status = user.subscriptions[0]?.status || "trial"
                    if (status === "active") {
                      return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> AKTIF</Badge>
                    } else if (status === "trial") {
                      return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20"><Clock className="w-3 h-3 mr-1" /> PERCUBAAN</Badge>
                    } else {
                      return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20"><XCircle className="w-3 h-3 mr-1" /> NYAHAKTIF</Badge>
                    }
                  })()}
                </TableCell>
                <TableCell className="text-slate-400 text-sm">
                  {user.companyName || "-"}
                </TableCell>
                <TableCell className="text-right font-mono text-white">
                  {user._count.employers}
                </TableCell>
                <TableCell className="text-right text-slate-500 text-xs">
                  <div className="flex items-center justify-end gap-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(user.createdAt).toLocaleDateString("ms-MY")}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {!(user.role === "admin" || user.role === "super_admin") && (
                    <UserActions 
                      userId={user.id} 
                      currentStatus={user.subscriptions[0]?.status || "trial"} 
                      userName={user.name} 
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
