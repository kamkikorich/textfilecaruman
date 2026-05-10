import { db } from "@/lib/db"
import {
  Users,
  Building2,
  FileText,
  CreditCard,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Megaphone
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboardPage() {
  const [
    userCount,
    employerCount,
    submissionCount,
    totalCollection
  ] = await Promise.all([
    db.user.count(),
    db.employer.count(),
    db.submission.count(),
    db.submission.aggregate({
      _sum: {
        grandTotal: true
      }
    })
  ])

  const stats = [
    { label: "Jumlah Pengguna", value: userCount, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Jumlah Majikan", value: employerCount, icon: Building2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Jumlah Fail Dijana", value: submissionCount, icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Jumlah Caruman (RM)", value: Number(totalCollection._sum.grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }), icon: CreditCard, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Ringkasan Platform</h1>
        <p className="text-slate-500">Gambaran keseluruhan aktiviti sistem TextFileSKBBK.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-2xl border border-white/[0.08] bg-slate-900/50 group hover:border-white/20 transition-all shadow-xl shadow-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <Activity className="w-4 h-4 text-slate-700" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Quick Access */}
      <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Access</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/announcements">
            <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">Announcements</p>
                  <p className="text-xs text-slate-400">Manage system announcements</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> Aktiviti Terbaru
          </h3>
          <div className="space-y-4">
            {/* Placeholder for recent activities */}
            <p className="text-sm text-slate-500 italic">Data aktiviti masa nyata akan dipaparkan di sini.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/50 p-6">
          <h3 className="text-lg font-bold text-white mb-6">Status Sistem</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-slate-400 text-sm">Database Connection</span>
              <span className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-slate-400 text-sm">Prisma Client</span>
              <span className="text-emerald-400 text-xs font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
