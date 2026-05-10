import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, CheckCircle2, AlertTriangle, FileText, Lock, Download, Printer } from "lucide-react"
import { calculateLatePenalty, formatDeadlineDisplay } from "@/lib/deadline-calculator"
import { PrintButton } from "@/components/print-button"
import { DeleteSubmissionButton } from "@/components/delete-submission-button"
import { TextFilesSection } from "@/components/text-files-section"
import { isSubscriptionActive } from "@/lib/subscription"
import { SubmissionPaymentStatus } from "@/components/submission-payment-status"

export default async function SubmissionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = session.user.id

  const subscription = await db.subscription.findUnique({
    where: { userId },
  })

  const employer = await db.employer.findFirst({
    where: { userId, isActive: true },
  })

  const submission = employer ? await db.submission.findFirst({
    where: { id: params.id, employerId: employer.id },
    include: {
      employer: true,
      contributions: {
        include: { employee: true },
      },
    },
  }) : null

  if (!submission) {
    redirect("/dashboard/submissions")
  }

  const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
  const isActive = isSubscriptionActive(subscription, isAdmin)

  const isPaid = submission.status === "paid"

  const isLate =
    submission.deadlineDate &&
    new Date() > submission.deadlineDate &&
    !isPaid

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/submissions">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
                <ArrowLeft className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Senarai</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-white/[0.08]" />
            <h1 className="font-bold text-lg text-white">Butiran Caruman</h1>
          </div>
          <div className="flex items-center gap-2">
            {isActive ? (
              <PrintButton label="Cetak / PDF" />
            ) : (
              <Link href="/dashboard/billing">
                <Button variant="outline" size="sm" className="gap-2 border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 focus-ring">
                  <Lock className="w-3.5 h-3.5" />
                  Cetak (Pro)
                </Button>
              </Link>
            )}
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white focus-ring">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Print header - only visible when printing */}
      <div className="print-only hidden p-8 pb-4">
        <h1 className="text-2xl font-bold text-black">Penyata Caruman PERKESO</h1>
        <p className="text-sm text-gray-600">
          {submission.employer.employerName} ({submission.employer.employerCode}) •{" "}
          {String(submission.contributionMonth).padStart(2, "0")}/{submission.contributionYear}
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-5">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Bulan/Tahun</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {String(submission.contributionMonth).padStart(2, "0")}/{submission.contributionYear}
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-5">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Pekerja</span>
            </div>
            <p className="text-2xl font-bold text-white">{submission.totalEmployees}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-5">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Jumlah Caruman</span>
            </div>
            <p className="text-2xl font-bold text-white">RM{Number(submission.grandTotal).toFixed(2)}</p>
          </div>
          <div className={`rounded-2xl border p-5 ${isLate ? "border-rose-500/20 bg-rose-500/[0.03]" : "border-white/[0.08] bg-slate-900/80"}`}>
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              {isPaid ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4" />}
              <span className="text-xs font-bold uppercase tracking-wider">Status</span>
            </div>
            <Badge className={
              isPaid
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : isLate
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-white/5 text-slate-400 border-white/10"
            }>
              {isPaid ? "Dibayar" : isLate ? "Lewat" : "Belum Dibayar"}
            </Badge>
          </div>
        </div>

        {/* Payment Status Section */}
        <div className="mb-8">
          <SubmissionPaymentStatus
            submissionId={submission.id}
            initialStatus={submission.status}
            initialPaidAt={submission.paidAt}
            initialReference={submission.paymentReference}
          />
        </div>

        {isLate && (
          <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-bold text-rose-300">Caruman Lewat</h3>
                  <p className="text-sm text-slate-400">
                    Tarikh akhir: {formatDeadlineDisplay(submission.contributionMonth, submission.contributionYear)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Denda Lewat</p>
                <p className="text-2xl font-black text-rose-400">RM{calculateLatePenalty(submission.deadlineDate).toFixed(2)}</p>
                <p className="text-xs text-slate-500">RM5/sebulan (atau sebahagian)</p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden mb-6">
          <div className="p-6 pb-4 flex flex-row items-center justify-between no-print">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Perincian Caruman</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <AlertTriangle className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">Info: Gaji Kasar Digunakan</span>
              </div>
            </div>
            <div className="flex gap-2">
              <DeleteSubmissionButton
                submissionId={submission.id}
                label={`${String(submission.contributionMonth).padStart(2, "0")}/${submission.contributionYear}`}
                redirectAfter="/dashboard"
              />
            </div>
          </div>

          {/* Print-only table header */}
          <div className="print-only hidden px-6 pb-2">
            <h2 className="text-lg font-bold text-black">Perincian Caruman</h2>
            <p className="text-sm text-gray-600">
              Majikan: {submission.employer.employerName} | Kod: {submission.employer.employerCode}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">No. KP</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Gaji</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">SOCSO(M)</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">SOCSO(P)</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">EIS(M)</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">EIS(P)</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">SKBBK</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/5">Jum(M)</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/5">Jum(P)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {submission.contributions.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-blue-400">{c.employee.icNumber}</td>
                    <td className="px-4 py-3 font-semibold text-white uppercase">{c.employee.name}</td>
                    <td className="px-4 py-3 text-right font-medium text-white">RM{Number(c.salary).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">RM{Number(c.socsoEmployer).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">RM{Number(c.socsoEmployee).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">RM{Number(c.eisEmployer).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">RM{Number(c.eisEmployee).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-slate-400">RM{Number(c.skbbkEmployee).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-400 bg-blue-500/[0.03]">RM{Number(c.totalEmployer).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400 bg-emerald-500/[0.03]">RM{Number(c.totalEmployee).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-950">
                <tr className="font-bold">
                  <td colSpan={2} className="px-4 py-4 text-white">JUMLAH</td>
                  <td className="px-4 py-4 text-right text-white">RM{Number(submission.totalSalary).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-slate-400">RM{submission.contributions.reduce((s, c) => s + Number(c.socsoEmployer), 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-slate-400">RM{submission.contributions.reduce((s, c) => s + Number(c.socsoEmployee), 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-slate-400">RM{submission.contributions.reduce((s, c) => s + Number(c.eisEmployer), 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-slate-400">RM{submission.contributions.reduce((s, c) => s + Number(c.eisEmployee), 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-slate-400">RM{submission.contributions.reduce((s, c) => s + Number(c.skbbkEmployee), 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-blue-400">RM{Number(submission.totalEmployerContribution).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right text-emerald-400">RM{Number(submission.totalEmployeeContribution).toFixed(2)}</td>
                </tr>
                <tr className="text-lg font-black bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-blue-600/20">
                  <td colSpan={8} className="px-4 py-4 text-right text-white">GRAND TOTAL:</td>
                  <td colSpan={2} className="px-4 py-4 text-right text-white">RM{Number(submission.grandTotal).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Text File Section - client component for interactivity */}
        <div className="no-print">
          <TextFilesSection
            submissionId={submission.id}
            initialContent={submission.textFileContent}
            employerCode={submission.employer.employerCode}
            month={submission.contributionMonth}
            year={submission.contributionYear}
          />
        </div>
      </div>
    </div>
  )
}