import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Calculator,
  FileText,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Database,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-48">
          {/* Background effects */}
          <div className="absolute inset-0 -z-10 mesh-gradient-pro opacity-40" />
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
          </div>
          {/* Grid overlay */}
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Kemas kini PERKESO Jun 2026 Ready</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Pengurusan Caruman{" "}
              <br />
              <span className="gradient-text">Semudah Klik Sahaja</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Platform SaaS pertama di Malaysia yang mengautomasikan pengiraan caruman
              SOCSO, EIS, dan SKBBK serta menjana fail teks 278-aksara yang sempurna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all animate-pulse-glow">
                  Mula Percubaan Percuma <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/#pricing">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white focus-ring">
                  Lihat Harga
                </Button>
              </Link>
            </div>
            <div className="mt-16 flex items-center justify-center gap-8 opacity-40">
              <span className="font-bold text-xl italic text-slate-500">Trusted by SMEs</span>
              <div className="h-6 w-px bg-slate-700" />
              <div className="flex gap-4 font-mono font-bold text-slate-500">
                <span>[WAJUTECH]</span>
                <span>[PERKESO READY]</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Features Section */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">Ciri-ciri Utama</p>
              <h2 className="text-4xl font-bold mb-4">Kenapa Majikan Pilih Kami?</h2>
              <p className="text-slate-400 max-w-lg mx-auto">Jimat masa, kurangkan ralat, dan elak penalti lewat bayar.</p>
            </div>

            <div className="bento-grid">
              {/* Large feature card */}
              <div className="md:col-span-2 md:row-span-2 group relative rounded-2xl bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-900 border border-white/[0.08] p-8 card-hover overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-6 glow-blue">
                    <Calculator className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Kiraan Tepat 100%</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    Algoritma kami sentiasa dikemas kini mengikut jadual caruman PERKESO terkini,
                    termasuk integrasi SKBBK mengikut fasa. Tiada lagi ralat pengiraan manual.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-3xl font-black gradient-text">100%</p>
                      <p className="text-xs text-slate-500 mt-1">Ketepatan</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-3xl font-black gradient-text">278</p>
                      <p className="text-xs text-slate-500 mt-1">Aksara Fail</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature card 2 */}
              <div className="group relative rounded-2xl bg-slate-900/80 border border-white/[0.08] p-6 card-hover overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 glow-emerald">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Fail Teks Sedia-Hantar</h3>
                  <p className="text-sm text-slate-400">
                    Jana fail 278-aksara mematuhi spesifikasi PERKESO v2.0 secara automatik.
                  </p>
                </div>
              </div>

              {/* Feature card 3 */}
              <div className="group relative rounded-2xl glass border border-white/[0.08] p-6 card-hover overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px]" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4 glow-amber">
                    <Clock className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Sistem Peringatan</h3>
                  <p className="text-sm text-slate-400">
                    Notifikasi automatik sebelum tarikh akhir (15hb). Elak penalti RM5 sebulan.
                  </p>
                </div>
              </div>

              {/* Wide feature card */}
              <div className="md:col-span-2 group relative rounded-2xl bg-slate-900/80 border border-white/[0.08] p-6 card-hover overflow-hidden">
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/8 rounded-full blur-[80px]" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Dashboard Analitik</h3>
                    <p className="text-sm text-slate-400">
                      Paparkan ringkasan caruman, jumlah pekerja, dan status pembayaran dalam satu paparan. Semua data dikemas kini secara langsung.
                    </p>
                  </div>
                </div>
              </div>

              {/* Small stats cards */}
              <div className="group relative rounded-2xl bg-slate-900/80 border border-white/[0.08] p-6 card-hover overflow-hidden text-center">
                <div className="relative z-10">
                  <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-sm font-bold mb-1">Data Dienkripsi</h3>
                  <p className="text-xs text-slate-500">SSL & AES-256</p>
                </div>
              </div>

              <div className="group relative rounded-2xl bg-slate-900/80 border border-white/[0.08] p-6 card-hover overflow-hidden text-center">
                <div className="relative z-10">
                  <Database className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-sm font-bold mb-1">Auto Backup</h3>
                  <p className="text-xs text-slate-500">Harian ke awan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 relative">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
          <div className="container mx-auto px-4 text-center mb-16">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">Harga</p>
            <h2 className="text-4xl font-bold mb-4">Pelan Langganan Mudah</h2>
            <p className="text-slate-400">Tiada kontrak tersembunyi. Batalkan bila-bila masa.</p>
          </div>
          <div className="container mx-auto px-4 flex justify-center">
            <div className="w-full max-w-xl">
              <div className="relative p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-slate-900 to-slate-900 shadow-2xl shadow-blue-500/10 overflow-hidden">
                {/* Glow border effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/20 pointer-events-none" />
                <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-bl-2xl shadow-lg shadow-blue-500/25">
                  PALING POPULAR
                </div>
                <div className="relative z-10 mb-8">
                  <h3 className="text-2xl font-bold mb-2">Pelan Pro Majikan</h3>
                  <p className="text-slate-400">Sesuai untuk syarikat dengan 1-100 pekerja.</p>
                </div>
                <div className="relative z-10 flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-extrabold text-white">RM20</span>
                  <span className="text-xl text-slate-400">/bulan</span>
                </div>
                <div className="relative z-10 space-y-4 mb-10 text-left">
                  {[
                    { label: "Jana Fail Teks 278-Aksara", pro: true, basic: true },
                    { label: "Kiraan Automatik SKBBK", pro: true, basic: true },
                    { label: "Cetakan PDF Borang Caruman", pro: true, basic: false },
                    { label: "Amaran & Notifikasi Lewat", pro: true, basic: false },
                    { label: "Bantuan Chat Langsung", pro: true, basic: false },
                    { label: "Sejarah Caruman 12 Bulan", pro: true, basic: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full ${item.pro ? "bg-emerald-500/20 border-emerald-500/30" : "bg-slate-500/20 border-slate-500/30"} flex items-center justify-center`}>
                        <CheckCircle className={`w-3 h-3 ${item.pro ? "text-emerald-400" : "text-slate-500"}`} />
                      </div>
                      <span className={`${item.pro ? "text-slate-300" : "text-slate-500 line-through"}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <Link href="/register">
                  <Button className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">
                    Mula Percubaan 30 Hari
                  </Button>
                </Link>
                <p className="text-center text-sm text-slate-500 mt-4 italic">
                  *Pembayaran mudah melalui DuitNow QR.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 border-t border-white/[0.06]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 items-center">
              {[
                { icon: Globe, label: "Cloud Based" },
                { icon: Shield, label: "Encrypted Data" },
                { icon: Database, label: "Auto Backup" },
                { icon: Users, label: "QR Ready" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-3 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all">
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="font-semibold text-slate-300 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-bold text-xl text-white">TextFile<span className="gradient-text-subtle">SKBBK</span></span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Syarat Perkhidmatan</Link>
            <Link href="#" className="hover:text-white transition-colors">Polisi Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Hubungi Kami</Link>
          </div>
          <p className="text-sm text-slate-600">
            &copy; 2026 WajuTech™. Semua hak cipta terpelihara.
          </p>
        </div>
      </footer>
    </div>
  )
}