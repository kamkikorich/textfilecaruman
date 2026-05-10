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
import { Building2, MapPin, Phone, Hash } from "lucide-react"

export default async function AdminEmployersPage() {
  const employers = await db.employer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      _count: {
        select: { employees: true, submissions: true }
      }
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Senarai Majikan</h1>
        <p className="text-slate-500">Semua entiti majikan yang didaftarkan oleh pengguna.</p>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-400">Majikan / Kod</TableHead>
              <TableHead className="text-slate-400">Pemilik (User)</TableHead>
              <TableHead className="text-slate-400">Lokasi</TableHead>
              <TableHead className="text-slate-400 text-right">Pekerja</TableHead>
              <TableHead className="text-slate-400 text-right">Caruman</TableHead>
              <TableHead className="text-slate-400 text-right">Status</TableHead>
              <TableHead className="text-slate-400 text-right w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employers.map((emp) => (
              <TableRow key={emp.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-white uppercase">{emp.employerName}</span>
                    <span className="text-xs text-blue-400 font-mono mt-0.5">
                      {emp.employerCode}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-400 text-sm">
                  {emp.user.email}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {emp.city}</span>
                    <span>{emp.state.replace(/_/g, ' ')}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-white">
                  {emp._count.employees}
                </TableCell>
                <TableCell className="text-right font-bold text-emerald-400">
                  {emp._count.submissions}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={emp.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}>
                    {emp.isActive ? "AKTIF" : "TIADA"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {/* Placeholder for employer actions if needed */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
