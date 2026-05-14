import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Users,
  Building2,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
  CreditCard,
  Target,
  AlertTriangle,
  Bell,
  ShieldAlert,
  MessageCircle,
  Lock,
} from "lucide-react"
import { DeleteSubmissionButton } from "@/components/delete-submission-button"
import { LogoutButton } from "@/components/logout-button"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { checkAndCreateLateAlerts, formatDeadlineDisplay, calculateLatePenalty, getContributionDeadline } from "@/lib/deadline-calculator"
import { getSubscriptionStatus, isSubscriptionActive } from "@/lib/subscription"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id

  const employer = await db.employer.findFirst({
    where: { userId, isActive: true },
  })

  // Security: Use employerId filter only if employer exists, otherwise return empty
  const employees = employer ? await db.employee.findMany({
    where: { employerId: employer.id, isActive: true },
    orderBy: { createdAt: "desc" },
  }) : []

  const submissions = employer ? await db.submission.findMany({
    where: { employerId: employer.id },
    orderBy: [{ contributionYear: "desc" }, { contributionMonth: "desc" }],
    take: 6,
  }) : []

  // Check for late payment alerts
  await checkAndCreateLateAlerts(userId)

  const alerts = await db.alert.findMany({
    where: { userId, isRead: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const subscription = await db.subscription.findUnique({
    where: { userId },
  })

  const totalEmployees = employees.length
  const totalSubmissions = submissions.length
  const totalSalary = employees.reduce((sum, e) => sum + Number(e.salary), 0)


  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  const subStatus = getSubscriptionStatus(subscription, isAdmin)
  const isTrial = subStatus === "trial"
  const isActive = isSubscriptionActive(subscription, isAdmin)
  const trialDaysLeft = isTrial && subscription?.trialEnd
    ? Math.max(
        0,
        Math.ceil(
          (subscription.trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : 0

  const onboardingSteps = [
    { title: "Daftar Maklumat Majikan", done: !!employer, link: "/dashboard/employers" },
    { title: "Tambah Rekod Pekerja", done: totalEmployees > 0, link: "/dashboard/employees" },
    { title: "Jana Caruman PERKESO", done: totalSubmissions > 0, link: "/dashboard/submissions/new" },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-white hidden sm:inline-block">
              TextFile<span className="gradient-text-subtle">SKBBK</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isTrial && (
              <Link href="/dashboard/billing">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 py-1 cursor-pointer hover:bg-amber-500/20 transition-colors hidden md:flex">
                  <Clock className="w-3 h-3 mr-1" /> Percubaan: {trialDaysLeft} hari lagi
                </Badge>
              </Link>
            )}
            {isActive && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-1 hidden md:flex">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Akaun Pro
              </Badge>
            )}
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 focus-ring">
                  <ShieldAlert className="w-4 h-4" /> <span className="hidden sm:inline">Admin</span>
                </Button>
              </Link>
            )}
            <Link href={isActive ? "/dashboard/support" : "/dashboard/billing"}>
              <Button variant="ghost" size="sm" className={`gap-2 ${isActive ? "text-blue-400 hover:text-blue-300" : "text-slate-500 hover:text-slate-400"} hover:bg-white/5 focus-ring relative`}>
                <MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">Bantuan</span>
                {!isActive && <Lock className="w-2.5 h-2.5 absolute top-1 right-1 text-slate-600" />}
              </Button>
            </Link>
            <div className="h-6 w-px bg-white/[0.08]" />
            <LogoutButton />
            <div className="h-6 w-px bg-white/[0.08]" />
            <Link href="/dashboard/submissions/new">
              <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Caruman</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Announcement Banner */}
        <AnnouncementBanner />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Takrif Gaji Notice */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-400 text-sm">Peringatan: Takrif Gaji Kasar</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Sila pastikan gaji yang dimasukkan adalah <span className="text-white font-bold underline">Gaji Kasar</span>. 
                  Ini merangkumi gaji pokok, elaun tetap, komisen, bayaran insentif, dan bonus tahunan. 
                  <span className="block mt-1">Tidak termasuk: tuntutan perjalanan, bayaran balik (rembursment), dan elaun tidak tetap.</span>
                  Kegagalan memasukkan gaji kasar yang tepat akan menjejaskan jumlah caruman PERKESO & EIS.
                </p>
              </div>
            </div>

            {/* Onboarding Checklist */}
            {(onboardingSteps.some(s => !s.done)) && (
              <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-slate-900 to-slate-900 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Langkah Onboarding</h2>
                </div>
                <p className="text-sm text-slate-400 mb-5">
                  Lengkapkan langkah berikut untuk mula menggunakan sistem sepenuhnya.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {onboardingSteps.map((step, i) => (
                    <Link href={step.link} key={i}>
                      <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all hover:-translate-y-0.5 ${
                        step.done
                          ? "bg-white/[0.03] border-emerald-500/20"
                          : "bg-white/[0.04] border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5"
                      }`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            step.done ? "text-emerald-400" : "text-blue-400"
                          }`}>
                            Langkah {i + 1}
                          </span>
                          {step.done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className={`font-semibold text-sm ${step.done ? "text-slate-500" : "text-white"}`}>
                          {step.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Pekerja", value: totalEmployees, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                { label: "Gaji Kasar", value: `RM${totalSalary.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                { label: "Jumlah Caruman", value: totalSubmissions, icon: FileText, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6 card-hover relative overflow-hidden">
                  {stat.label === "Gaji Kasar" && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-emerald-500/10 border-b border-l border-emerald-500/20 px-2 py-0.5 rounded-bl-lg">
                        <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter">PERKESO Std</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.border} border`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Submissions */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
              <div className="flex flex-row items-center justify-between p-6 pb-0">
                <div>
                  <h2 className="text-lg font-bold text-white">Caruman Terkini</h2>
                  <p className="text-sm text-slate-400">Senarai 6 caruman terakhir anda.</p>
                </div>
                <div className="flex gap-2">
                  <Link href="/dashboard/submissions/new">
                    <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-500 text-white focus-ring">
                      <Plus className="w-4 h-4" /> Bina Caruman
                    </Button>
                  </Link>
                  <Link href="/dashboard/submissions">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">
                      Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {submissions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-slate-500 mb-4">Tiada rekod caruman ditemui.</p>
                    <Link href="/dashboard/submissions/new">
                      <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white focus-ring">Jana Caruman Baharu</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-2">
                        <Link href={`/dashboard/submissions/${sub.id}`} className="flex-1 min-w-0">
                          <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-400" />
                              </div>
                              <div>
                                <p className="font-bold text-white">
                                  {String(sub.contributionMonth).padStart(2, '0')}/{sub.contributionYear}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {sub.totalEmployees} Pekerja · RM{Number(sub.grandTotal).toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={
                                sub.status === 'paid' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10" :
                                sub.status === 'draft' || sub.status === 'submitted' ? "bg-white/5 text-slate-400 border-white/10 hover:bg-white/5" :
                                "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
                              }>
                                {sub.status === 'paid' ? "Dibayar" : (sub.status === 'draft' || sub.status === 'submitted') ? "Belum Dibayar" : "Lewat"}
                              </Badge>
                              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                            </div>
                          </div>
                        </Link>
                        <DeleteSubmissionButton
                          submissionId={sub.id}
                          label={`${String(sub.contributionMonth).padStart(2, '0')}/${sub.contributionYear}`}
                          redirectAfter="/dashboard"
                          variant="icon"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Employer Card */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden card-hover">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <div className="p-6 pb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Maklumat Majikan
                </h3>
              </div>
              <div className="px-6 pb-6 space-y-4">
                {employer ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nama Majikan</p>
                      <p className="font-bold text-sm text-white truncate">{employer.employerName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Kod Majikan</p>
                      <p className="font-mono text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-lg w-fit">{employer.employerCode}</p>
                    </div>
                    <Link href="/dashboard/employers" className="block pt-2">
                      <Button variant="outline" size="sm" className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white focus-ring">
                        Urus Butiran
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-500 mb-4">Sila daftar maklumat majikan.</p>
                    <Link href="/dashboard/employers/new">
                      <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">Daftar Sekarang</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Appeal Letters - Perkhidmatan Surat Rayuan */}
            <Link href="/dashboard/appeal-letters">
              <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900 p-6 card-hover cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 7h3a5 5 0 0 1 0 10h-3m-6 0H6a5 5 0 0 1 0-10h3"/><path d="M8 12H.5"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">Surat Rayuan PERKESO</h3>
                    <p className="text-xs text-slate-400">Perkhidmatan pembuatan surat</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400">Rayu faedah lewat bayar dan kompaun. Profesional dan pantas.</p>
                <p className="text-sm font-bold text-purple-400 mt-2">RM10 / surat</p>
              </div>
            </Link>

            {/* Alerts Card - Premium Feature */}
            {isActive && alerts.length > 0 && (
              <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-900 overflow-hidden card-hover">
                <div className="p-6 pb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-bold text-white">Amaran Caruman Lewat</h3>
                </div>
                <div className="px-6 pb-6 space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-xl bg-rose-500/[0.06] border border-rose-500/10">
                      <p className="font-bold text-sm text-rose-300">{alert.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Late Submissions Warning - Premium Feature */}
            {isActive && submissions.filter(s => {
              const deadline = getContributionDeadline(s.contributionMonth, s.contributionYear)
              return new Date() > deadline && s.status !== "paid"
            }).length > 0 && (
              <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-900 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-amber-300">Denda Lewat</h3>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Caruman lewat dikenakan denda RM5/sebulan (atau sebahagian).
                </p>
                <div className="space-y-2">
                  {submissions.filter(s => {
                    const deadline = getContributionDeadline(s.contributionMonth, s.contributionYear)
                    return new Date() > deadline && s.status !== "paid"
                  }).map(s => {
                    const deadline = getContributionDeadline(s.contributionMonth, s.contributionYear)
                    const penalty = calculateLatePenalty(deadline)
                    return (
                      <div key={s.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{String(s.contributionMonth).padStart(2, "0")}/{s.contributionYear}</span>
                        <span className="font-bold text-amber-400">+RM{penalty.toFixed(2)}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  Tarikh akhir: Hari ke-15 bulan berikutnya.
                </p>
              </div>
            )}

            {/* Billing Card - Enhanced CTA */}
            {!isAdmin && (
              <div className={`relative overflow-hidden rounded-2xl border ${
                isActive 
                  ? "border-white/[0.08] bg-slate-900/80" 
                  : "border-blue-500/40 bg-gradient-to-br from-blue-600/20 via-slate-900 to-indigo-950/40 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]"
              } card-hover group`}>
                {!isActive && (
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/30 transition-all duration-500" />
                )}
                
                <div className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                      <CreditCard className={`w-5 h-5 ${isActive ? "text-slate-400" : "text-blue-400 animate-pulse"}`} />
                      Pelan & Bil
                    </h3>
                    {!isActive && (
                      <Badge className="bg-blue-500 text-[10px] font-black uppercase tracking-tighter px-1.5 py-0 h-5">
                        Recommend
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 space-y-4 relative z-10">
                  <div className={`p-4 rounded-xl border ${
                    isActive 
                      ? "bg-white/[0.04] border-white/[0.06]" 
                      : "bg-blue-500/10 border-blue-500/20"
                  }`}>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Status Akaun</p>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-lg flex items-center gap-2 text-white">
                        {isActive ? "PRO MEMBER" : "FREE USER"}
                      </p>
                      {isActive && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    </div>
                  </div>
                  
                  {!isActive && (
                    <div className="space-y-3">
                      <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Target className="w-3 h-3" /> Kelebihan Pro:
                      </p>
                      <ul className="space-y-2">
                        {[
                          "Cetakan PDF Borang Caruman",
                          "Amaran & Notifikasi Lewat",
                          "Bantuan Chat Langsung (Priority)"
                        ].map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link href="/dashboard/billing" className="block">
                    <Button className={`w-full h-11 rounded-xl font-bold transition-all ${
                      isActive 
                        ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white" 
                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    }`}>
                       {isActive ? "Urus Langganan" : "Upgrade ke Pro — RM10"}
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-3">Pautan Pantas</p>
              {[
                { label: "Urus Pekerja", icon: Users, link: "/dashboard/employees" },
                { label: "Sejarah Caruman", icon: Calendar, link: "/dashboard/submissions" },
                { label: "Tetapan Akaun", icon: Building2, link: "/dashboard/profile" },
              ].map((item, i) => (
                <Link key={i} href={item.link}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06] transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                        <item.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
