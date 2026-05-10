import { db } from "@/lib/db"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ShieldAlert, Clock, User, Terminal } from "lucide-react"
import { format } from "date-fns"

export default async function AdminLogsPage() {
  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: true,
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Sistem Log & Audit</h1>
        <p className="text-slate-500">Jejak aktiviti admin dan sistem TextFileSKBBK.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-400 w-[180px]">Masa</TableHead>
              <TableHead className="text-slate-400">Pengguna</TableHead>
              <TableHead className="text-slate-400">Tindakan</TableHead>
              <TableHead className="text-slate-400">Entiti</TableHead>
              <TableHead className="text-slate-400 text-right">Alamat IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3 text-slate-600">
                    <Terminal className="w-10 h-10 opacity-20" />
                    <p className="italic">Tiada log audit ditemui buat masa ini.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <TableCell className="text-slate-400 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {format(log.createdAt, "dd/MM/yyyy HH:mm:ss")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <User className="w-3 h-3 text-slate-500" />
                      {log.user?.email || "System"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-white font-medium uppercase text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-400 text-sm">
                    {log.entityType} <span className="text-[10px] opacity-50 font-mono">({log.entityId?.substring(0, 8)})</span>
                  </TableCell>
                  <TableCell className="text-right text-slate-500 text-xs font-mono">
                    {log.ipAddress || "N/A"}
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
