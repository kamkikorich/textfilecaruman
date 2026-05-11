"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  FileText,
  Download,
  Eye,
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Clock,
  Coins,
  UserCheck,
  Loader2,
  FileDown,
  RefreshCw,
  Copy
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Employer {
  id: string
  employerCode: string
  employerName: string
}

interface Contribution {
  id: string
  salary: number
  socsoEmployer: number
  socsoEmployee: number
  eisEmployer: number
  eisEmployee: number
  skbbkEmployee: number
  totalEmployer: number
  totalEmployee: number
  employee: {
    id: string
    icNumber: string
    name: string
  }
}

interface Submission {
  id: string
  contributionMonth: number
  contributionYear: number
  totalEmployees: number
  totalSalary: number
  totalEmployerContribution: number
  totalEmployeeContribution: number
  grandTotal: number
  status: string
  textFileContent: string | null
  contributions: Contribution[]
}

export default function NewSubmissionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [employers, setEmployers] = useState<Employer[]>([])
  const [selectedEmployer, setSelectedEmployer] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()))
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(false)

  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Mac" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Julai" },
    { value: "08", label: "Ogos" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Disember" },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i))

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchEmployers()
    }
  }, [session])

  async function fetchEmployers() {
    try {
      const res = await fetch("/api/employers")
      if (res.ok) {
        const data = await res.json()
        setEmployers(data)
        if (data.length > 0 && !selectedEmployer) {
          setSelectedEmployer(data[0].id)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleGenerate() {
    if (!selectedEmployer) {
      setError("Sila pilih majikan.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId: selectedEmployer,
          contributionMonth: parseInt(selectedMonth),
          contributionYear: parseInt(selectedYear),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSubmission(data)
        toast({
          title: "Berjaya",
          description: "Caruman dan Fail Teks telah dijana.",
        })
      } else {
        const data = await res.json()
        setError(data.error || "Gagal menjana caruman.")
      }
    } catch (e) {
      setError("Ralat rangkaian.")
    } finally {
      setLoading(false)
    }
  }

  function handleDownload(sub?: Submission) {
    const target = sub || submission
    if (!target) return
    window.location.href = `/api/submissions/${target.id}/download`
  }

  async function handleRegenerateTextFile() {
    if (!submission) return
    setLoading(true)

    try {
      const res = await fetch(`/api/submissions/${submission?.id}/generate`, {
        method: "POST",
      })
      if (res.ok) {
        const data = await res.json()
        setSubmission((prev) => (prev ? { ...prev, textFileContent: data.content } : null))
        toast({
          title: "Fail Dikemas Kini",
          description: "Fail 278-aksara telah dijana semula.",
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/submissions")} className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
              <ArrowLeft className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Senarai</span>
            </Button>
            <div className="h-6 w-px bg-white/[0.08]" />
            <h1 className="font-bold text-lg text-white">Jana Caruman Baharu</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Config Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
              <div className="p-6 pb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Konfigurasi</h2>
              </div>
              <div className="px-6 pb-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Majikan</Label>
                  <Select value={selectedEmployer} onValueChange={setSelectedEmployer}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 rounded-xl h-11">
                      <SelectValue placeholder="Pilih majikan" />
                    </SelectTrigger>
                    <SelectContent>
                      {employers.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.employerName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Bulan Caruman</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Tahun</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={loading || !selectedEmployer}
                  className="w-full gap-2 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                  Kira & Jana
                </Button>
              </div>
            </div>

            {submission && (
              <div className="rounded-2xl border-0 overflow-hidden relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-xl shadow-blue-500/20">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Coins className="w-24 h-24 rotate-12" />
                </div>
                <div className="p-6 relative z-10">
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Grand Total</p>
                  <h3 className="text-3xl font-black text-white">RM {Number(submission?.grandTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                  <div className="mt-4 pt-4 border-t border-blue-500/30 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Majikan</span>
                      <span className="font-bold text-white">RM {Number(submission?.totalEmployerContribution).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Pekerja</span>
                      <span className="font-bold text-white">RM {Number(submission?.totalEmployeeContribution).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-3 space-y-8">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {!submission ? (
              <div className="h-full flex flex-col items-center justify-center p-20 rounded-2xl border-2 border-dashed border-white/[0.08] text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sedia Untuk Menjana?</h3>
                <p className="text-slate-500 max-w-sm">
                  Pilih majikan dan bulan caruman di sebelah kiri untuk melihat pengiraan dan menjana fail 278-aksara.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl border border-white/[0.08] bg-slate-900/80">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <UserCheck className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Pekerja</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{submission?.totalEmployees}</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/[0.08] bg-slate-900/80">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Status</span>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Disemak
                    </Badge>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/[0.08] bg-slate-900/80 col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Coins className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Jumlah Gaji</span>
                    </div>
                    <p className="text-2xl font-bold text-white">RM {Number(submission?.totalSalary).toLocaleString()}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
                  <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white">Perincian Caruman</h2>
                      <p className="text-sm text-slate-400">Berdasarkan kadar jadual PERKESO terkini.</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">Info: Gaji Kasar Digunakan</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Pekerja</th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Gaji (RM)</th>
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
                        {submission?.contributions.map((c) => (
                          <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3">
                              <p className="font-bold text-white uppercase truncate max-w-[120px]">{c.employee.name}</p>
                              <p className="text-[10px] font-mono text-slate-500">{c.employee.icNumber}</p>
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-white">{Number(c.salary).toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-slate-400">{Number(c.socsoEmployer).toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-slate-400">{Number(c.socsoEmployee).toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-slate-400">{Number(c.eisEmployer).toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-slate-400">{Number(c.eisEmployee).toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-slate-400">{Number(c.skbbkEmployee).toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-bold text-blue-400 bg-blue-500/[0.03]">{Number(c.totalEmployer).toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-bold text-emerald-400 bg-emerald-500/[0.03]">{Number(c.totalEmployee).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-950">
                        <tr className="font-bold">
                          <td className="px-4 py-4 text-white">JUMLAH</td>
                          <td className="px-4 py-4 text-right text-white">RM {Number(submission.totalSalary).toLocaleString()}</td>
                          <td colSpan={5} />
                          <td className="px-4 py-4 text-right text-blue-400">RM {Number(submission.totalEmployerContribution).toFixed(2)}</td>
                          <td className="px-4 py-4 text-right text-emerald-400">RM {Number(submission.totalEmployeeContribution).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
                  <div className="p-6 pb-4 flex flex-row items-center justify-between border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">Fail Teks 278-Aksara</h2>
                        <p className="text-sm text-slate-400">Standard muat naik portal PERKESO ASSIST.</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreview(!preview)}
                        className="gap-2 text-slate-400 hover:text-white hover:bg-white/5"
                      >
                        {preview ? <Clock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {preview ? "Sembunyi" : "Pratonton"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownload()}
                        className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring"
                        disabled={!submission?.textFileContent}
                      >
                        <FileDown className="w-4 h-4" />
                        Muat Turun
                      </Button>
                    </div>
                  </div>
                  <div className="p-0">
                    {!submission?.textFileContent ? (
                      <div className="text-center py-12">
                        <p className="text-slate-500">Menjana fail teks...</p>
                      </div>
                    ) : preview ? (
                      <div className="relative group">
                        <pre className="p-6 text-[11px] overflow-x-auto font-mono text-emerald-400/90 leading-relaxed max-h-[300px] bg-slate-950/50">
                          {submission?.textFileContent}
                        </pre>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 text-slate-500 hover:text-white hover:bg-white/5"
                          onClick={() => {
                            navigator.clipboard.writeText(submission?.textFileContent || "")
                            toast({ title: "Disalin", description: "Kandungan fail disalin ke clipboard." })
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h4 className="font-bold text-xl text-white">Fail Sedia Diunduh</h4>
                        <p className="text-slate-400 text-sm mt-1 mb-6">
                          Sila klik butang Muat Turun dan muat naik ke portal PERKESO ASSIST.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}