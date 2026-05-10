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
import { FileText, Calendar, DollarSign, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminSubmissionsPage() {
  const submissions = await db.submission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      employer: true
    },
    take: 50 // Limit to latest 50
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Semua Caruman</h1>
          <p className="text-slate-500">Rekod semua fail caruman yang telah dijana merentas semua majikan.</p>
        </div>
        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
           <FileText className="w-8 h-8 text-indigo-400" />
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02]">
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-slate-400">Majikan</TableHead>
              <TableHead className="text-slate-400">Bulan/Tahun</TableHead>
              <TableHead className="text-slate-400 text-right">Pekerja</TableHead>
              <TableHead className="text-slate-400 text-right">Jumlah (RM)</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400 text-right">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-white uppercase">{sub.employer.employerName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{sub.employer.employerCode}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white font-medium">
                  {String(sub.contributionMonth).padStart(2, '0')}/{sub.contributionYear}
                </TableCell>
                <TableCell className="text-right text-slate-400 font-mono">
                  {sub.totalEmployees}
                </TableCell>
                <TableCell className="text-right font-bold text-white">
                  {Number(sub.grandTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <Badge className={
                    sub.status === "submitted" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }>
                    {sub.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/submissions/${sub.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 text-slate-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
