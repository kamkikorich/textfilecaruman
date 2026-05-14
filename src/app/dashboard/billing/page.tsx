import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreditCard, CheckCircle2, AlertTriangle, ArrowLeft, MessageCircle, Calculator, X, Target, Calendar } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { isSubscriptionActive, getSubscriptionStatus } from "@/lib/subscription"

export default async function BillingPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptions: true,
      payments: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!user) redirect("/login")

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  const sub = user.subscriptions[0]
  const subStatus = getSubscriptionStatus(sub, isAdmin)
  const isActive = isSubscriptionActive(sub, isAdmin)
  const isTrial = subStatus === "trial"

  const PRICE_PER_MONTH = 20

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-12">
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
          <h1 className="font-bold text-lg text-white">Langganan & Bil</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
            Pilih Pelan <span className="gradient-text">TextFileSKBBK</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Satu pelan untuk semua keperluan caruman anda. Jimat masa, elak denda, dan urus pekerja dengan profesional.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-20">
          {/* Basic Tier */}
          <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 p-8 flex flex-col hover:border-white/20 transition-all duration-500 glass-subtle group">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">Asas</h3>
              <p className="text-sm text-slate-500">Sesuai untuk majikan kecil dengan bajet terhad.</p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">RM0</span>
                <span className="text-slate-500">/selamanya</span>
              </div>
            </div>

            <ul className="space-y-4 mb-12 flex-1">
              {[
                { label: "Jana Fail Teks 278-Aksara", active: true },
                { label: "Pengiraan Automatik SKBBK", active: true },
                { label: "Tambah Pekerja & Majikan", active: true },
                { label: "Cetakan PDF Borang Caruman", active: false },
                { label: "Amaran Caruman Lewat", active: false },
                { label: "Bantuan Chat Langsung", active: false },
              ].map((feat, i) => (
                <li key={i} className={`flex items-center gap-3 text-sm ${feat.active ? "text-slate-300" : "text-slate-600"}`}>
                  {feat.active ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500/50" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                  {feat.label}
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-bold" disabled>
              Pelan Aktif
            </Button>
          </div>

          {/* Pro Tier - THE STAR */}
          <div className="relative rounded-3xl p-[2px] mesh-gradient-pro animate-float glow-border-pro">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl shadow-blue-500/40 z-20">
              Paling Popular
            </div>
            
            <div className="h-full w-full rounded-[22px] bg-slate-950/80 backdrop-blur-3xl p-8 flex flex-col relative overflow-hidden group">
              {/* Background glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700" />
              
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-400" /> PRO PLAN
                </h3>
                <p className="text-sm text-blue-100/60">Segala fungsi premium untuk memudahkan urusan anda.</p>
              </div>
              
              <div className="mb-8 relative z-10">
                <div className="flex items-baseline gap-1">
                   <span className="text-6xl font-black text-white neon-text-blue tracking-tighter">RM10</span>
                  <span className="text-blue-300/50 font-bold">/bulan</span>
                </div>
                <p className="text-[10px] text-blue-400 font-black mt-2 tracking-[0.2em] uppercase">Pilih Tempoh Langganan Anda</p>
              </div>

              {/* 4 Duration Options - Re-introduced */}
              <div className="grid grid-cols-2 gap-3 mb-8 relative z-10">
                {[
                   { months: 1, price: 10, disc: null, label: "1 Bulan" },
                   { months: 3, price: 27, disc: "-10%", label: "3 Bulan" },
                   { months: 6, price: 48, disc: "-20%", label: "6 Bulan" },
                   { months: 12, price: 84, disc: "-30%", label: "12 Bulan" },
                ].map((opt, i) => (
                  <a
                    key={i}
                    href={`https://wa.me/PLACEHOLDER_WHATSAPP?text=${encodeURIComponent(`Salam, saya ingin aktifkan TextFileSKBBK Pro.\n\nNama: ${user.name || ''}\nEmail: ${user.email}\nTempoh: ${opt.label}\nJumlah: RM${opt.price}.00\n\nSila berikan maklumat akaun. Terima kasih.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="text-[10px] font-bold text-slate-500 group-hover:text-blue-300 transition-colors">{opt.label}</div>
                    <div className="text-xl font-black text-white group-hover:scale-110 transition-transform">RM{opt.price}</div>
                    {opt.disc && (
                      <div className="absolute top-1 right-1 bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                        {opt.disc}
                      </div>
                    )}
                  </a>
                ))}
              </div>

              <ul className="space-y-3 mb-8 flex-1 relative z-10">
                {[
                  "Cetakan PDF Borang Caruman Rasmi",
                  "Amaran & Notifikasi Lewat (Auto)",
                  "Bantuan Chat Langsung (Priority)",
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-blue-100/90 font-medium">
                    <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              <div className="space-y-6 relative z-10">
                {/* QR Code Section - Enhanced Size */}
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 flex flex-col items-center gap-4 text-center">
                  <div className="bg-white p-3 rounded-2xl shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] transform hover:scale-105 transition-transform duration-500">
                    <img
                      src="https://i.postimg.cc/KvBSW18s/qrbaru.png"
                      alt="DuitNow QR"
                      className="w-48 h-48 md:w-56 md:h-56 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Scan & Bayar via DuitNow</p>
                     <p className="text-xl font-black text-white">RM10.00 / Bulan</p>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Justinah Binti Buki (AmBank)</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/PLACEHOLDER_WHATSAPP?text=${encodeURIComponent(`Salam, saya ingin aktifkan TextFileSKBBK Pro.\n\nNama: ${user.name || ''}\nEmail: ${user.email}\n\nSila berikan maklumat akaun. Terima kasih.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black text-lg shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]">
                    AKTIFKAN PRO SEKARANG
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Info Footer */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-slate-900/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Status Langganan</h4>
              <p className="text-sm text-slate-400">{isActive ? "Aktif" : "Belum Aktif"}</p>
              {isActive && (
                <p className="text-xs text-emerald-400 font-bold mt-1">
                  Baki: {(() => {
                    const end = sub?.currentPeriodEnd || sub?.trialEnd
                    if (!end) return "-"
                    const days = Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    return days > 0 ? `${days} Hari Lagi` : "Tamat"
                  })()}
                </p>
              )}
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-slate-900/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Auto-Extend</h4>
              <p className="text-sm text-slate-400">Penyambungan tempoh automatik selepas bayaran disahkan.</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-white/[0.06] bg-slate-900/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Bantuan 24/7</h4>
              <p className="text-sm text-slate-400">Priority support untuk pengguna Pro melalui WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/[0.06] bg-white/[0.02]">
            <h2 className="text-xl font-bold text-white">Sejarah Transaksi</h2>
          </div>
          <div className="p-8">
            {user.payments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Tiada rekod transaksi buat masa ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {user.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-white">RM{Number(p.amount).toFixed(2)}</p>
                        <p className="text-xs text-slate-500">{format(p.createdAt, "dd/MM/yyyy HH:mm")}</p>
                      </div>
                    </div>
                    <Badge className={p.status === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}>
                      {p.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}