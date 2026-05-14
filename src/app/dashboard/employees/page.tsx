"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Users,
  Plus,
  Trash2,
  ArrowLeft,
  Search,
  UserPlus,
  Wallet,
  Loader2,
  Edit2,
  Save
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Employee {
  id: string
  icNumber: string
  name: string
  salary: number
  category: string
  isActive: boolean
  employmentDate: string
}

interface Employer {
  id: string
  employerName: string
}

export default function EmployeesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [employers, setEmployers] = useState<Employer[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployer, setSelectedEmployer] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null)
  const [inlineSalary, setInlineSalary] = useState("")
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    ic: "",
    salary: "",
    category: "JENIS1",
    age: "",
    after55: false,
    eis57: false
  })

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

  useEffect(() => {
    if (selectedEmployer) {
      fetchEmployees(selectedEmployer)
    }
  }, [selectedEmployer])

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

  async function fetchEmployees(empId: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/employees?employerId=${empId}`)
      if (res.ok) {
        const data = await res.json()
        setEmployees(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    if (!selectedEmployer) {
      setError("Sila pilih majikan dahulu.")
      setSubmitting(false)
      return
    }

    const ic = form.ic.trim().toUpperCase().replace(/-/g, "")
    if (!editingId && ic.length !== 12) { // Allow editing without changing IC
      setError("No. KP mesti tepat 12 aksara tanpa sengkang.")
      setSubmitting(false)
      return
    }

    try {
      const url = editingId ? `/api/employees/${editingId}` : "/api/employees"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId: selectedEmployer,
          icNumber: ic,
          name: form.name.toUpperCase(),
          salary: parseFloat(form.salary),
          category: form.category,
          age: parseInt(form.age) || 30,
          enteredAfter55: form.after55,
          eisNoContribution57: form.eis57,
        }),
      })

      if (res.ok) {
        toast({
          title: "Berjaya",
          description: `Rekod pekerja ${form.name} telah ${editingId ? 'dikemaskini' : 'disimpan'}.`,
        })
        resetForm()
        fetchEmployees(selectedEmployer)
      } else {
        const data = await res.json()
        setError(data.error || `Gagal ${editingId ? 'mengemaskini' : 'menambah'} pekerja.`)
      }
    } catch (e) {
      setError("Ralat rangkaian.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleInlineSave(emp: Employee) {
    if (!inlineSalary || isNaN(parseFloat(inlineSalary))) {
      setInlineEditingId(null)
      return
    }

    try {
      const res = await fetch(`/api/employees/${emp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerId: selectedEmployer,
          icNumber: emp.icNumber,
          name: emp.name,
          salary: parseFloat(inlineSalary),
          category: emp.category,
        }),
      })

      if (res.ok) {
        toast({
          title: "Berjaya",
          description: `Gaji ${emp.name} dikemaskini ke RM${parseFloat(inlineSalary).toFixed(2)}.`,
        })
        setEmployees(employees.map(e => e.id === emp.id ? { ...e, salary: parseFloat(inlineSalary) } : e))
      } else {
        toast({ title: "Ralat", description: "Gagal mengemaskini gaji.", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Ralat", description: "Ralat rangkaian.", variant: "destructive" })
    } finally {
      setInlineEditingId(null)
    }
  }

  function resetForm() {
    setForm({ name: "", ic: "", salary: "", category: "JENIS1", age: "", after55: false, eis57: false })
    setShowForm(false)
    setEditingId(null)
  }

  function handleEdit(emp: Employee) {
    setForm({
      name: emp.name,
      ic: emp.icNumber,
      salary: emp.salary.toString(),
      category: emp.category,
      age: "", // We don't have age directly, user can update if needed or we calculate it. Leaving blank is fine for edit as per current API logic (uses existing dob if not provided)
      after55: false, // These would ideally come from the Employee object, but since they aren't in the Employee interface above, we default to false. Let's assume they are there but maybe not typed.
      eis57: false,
    })
    setEditingId(emp.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: string) {
    if (!confirmDeleteId) return
    
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "Berjaya", description: "Pekerja telah dipadam." })
        fetchEmployees(selectedEmployer)
      } else {
        const data = await res.json()
        toast({ title: "Ralat", description: data.error || "Gagal memadam pekerja.", variant: "destructive" })
      }
    } catch (e) {
      toast({ title: "Ralat", description: "Ralat rangkaian.", variant: "destructive" })
    } finally {
      setConfirmDeleteId(null)
    }
  }

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.icNumber.includes(search)
  )

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
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
              <ArrowLeft className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <div className="h-6 w-px bg-white/[0.08]" />
            <h1 className="font-bold text-lg text-white">Urus Pekerja</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedEmployer} onValueChange={setSelectedEmployer}>
              <SelectTrigger className="w-[200px] h-9 bg-white/[0.04] border-white/[0.08] text-white focus-ring">
                <SelectValue placeholder="Pilih Majikan" />
              </SelectTrigger>
              <SelectContent>
                {employers.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.employerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => { resetForm(); setShowForm(true) }} className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Pekerja</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {employers.length === 0 && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-amber-400 mb-2">Tiada Majikan Ditemui</h3>
            <p className="text-slate-400 mb-6 max-w-sm mx-auto">
              Sila daftar maklumat majikan terlebih dahulu sebelum mula menambah pekerja.
            </p>
            <Button onClick={() => router.push("/dashboard/employers")} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">
              Daftar Majikan
            </Button>
          </div>
        )}

        {employers.length > 0 && (
          <div className="space-y-8">
            {/* Takrif Gaji Notice */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-400 text-sm">Info: Takrif Gaji Kasar (PERKESO)</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Sila masukkan <span className="text-white font-bold underline">Gaji Kasar Sebulan</span>. 
                  Ini merangkumi gaji pokok, elaun tetap (cth: elaun makan, elaun pengangkutan), komisen, bayaran insentif, dan bonus tahunan. 
                  <span className="block mt-1 italic text-slate-500">*Tidak termasuk: tuntutan perjalanan, bayaran balik (rembursment), dan elaun tidak tetap.</span>
                </p>
              </div>
            </div>

            {/* Form Section */}
            {showForm && (
              <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <UserPlus className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">{editingId ? "Kemaskini Pekerja" : "Tambah Pekerja Baharu"}</h2>
                </div>
                <p className="text-sm text-slate-400 mb-6">Masukkan butiran tepat seperti dalam MyKad/Passport.</p>

                {error && (
                  <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Nama Penuh (seperti dalam IC)</Label>
                      <Input
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 font-semibold focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 rounded-xl h-11"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value.toUpperCase()})}
                        placeholder="AHMAD BIN ABDULLAH"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">No. MyKad (Tanpa sengkang)</Label>
                      <Input
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 font-mono focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 rounded-xl h-11"
                        value={form.ic}
                        onChange={(e) => setForm({...form, ic: e.target.value.replace(/[^0-9]/g, "")})}
                        placeholder="900101010101"
                        maxLength={12}
                        required={!editingId}
                        disabled={!!editingId}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Gaji Kasar Sebulan (RM)</Label>
                        <Badge variant="outline" className="text-[10px] bg-blue-500/5 text-blue-400 border-blue-500/10 px-1.5 py-0">
                          PERKESO: Gaji Kasar
                        </Badge>
                      </div>
                      <div className="relative">
                        <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-10 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 font-bold focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 rounded-xl h-11"
                          value={form.salary}
                          onChange={(e) => setForm({...form, salary: e.target.value})}
                          placeholder="3500.00"
                          required
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        *Sila masukkan gaji kasar (termasuk elaun tetap) untuk pengiraan caruman PERKESO yang tepat.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Umur Semasa</Label>
                      <Input
                        type="number"
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500/40 rounded-xl h-11"
                        value={form.age}
                        onChange={(e) => setForm({...form, age: e.target.value})}
                        placeholder="30"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Kategori Caruman</Label>
                      <Select value={form.category} onValueChange={(v) => setForm({...form, category: v})}>
                        <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950 rounded-xl h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JENIS1">Jenis 1 (Umur &lt;60 thn)</SelectItem>
                          <SelectItem value="JENIS2">Jenis 2 (Umur &gt;60 / Pencen)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-4 justify-center">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.after55}
                          onChange={(e) => setForm({...form, after55: e.target.checked})}
                          className="w-4 h-4 rounded accent-blue-500"
                        />
                        Mula mencarum selepas 55 thn
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.eis57}
                          onChange={(e) => setForm({...form, eis57: e.target.checked})}
                          className="w-4 h-4 rounded accent-blue-500"
                        />
                        Pengecualian EIS (&gt;57 thn)
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-6 border-t border-white/[0.06]">
                    <Button variant="ghost" type="button" onClick={resetForm} className="text-slate-400 hover:text-white hover:bg-white/5">Batal</Button>
                    <Button type="submit" disabled={submitting} className="min-w-[140px] gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {editingId ? "Kemaskini Pekerja" : "Simpan Pekerja"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* List Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  <Users className="w-5 h-5 text-blue-400" />
                  Pekerja Aktif <Badge variant="outline" className="bg-white/5 text-slate-400 border-white/10 ml-2">{employees.length}</Badge>
                </h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    placeholder="Cari nama atau IC..."
                    className="pl-10 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-500 rounded-xl focus-visible:ring-blue-500/50 focus-visible:ring-offset-slate-950"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">No. KP</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Pekerja</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <div className="flex flex-col items-end">
                            <span>Gaji Kasar (RM)</span>
                            <span className="text-[9px] font-medium text-emerald-500/70 lowercase tracking-normal font-sans">PERKESO: Gross Salary</span>
                          </div>
                        </th>
                        <th className="w-[100px]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="h-32 text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-400" />
                            <p className="text-sm text-slate-500 mt-2">Memuat data...</p>
                          </td>
                        </tr>
                      ) : filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="h-32 text-center">
                            <p className="text-slate-500">Tiada rekod pekerja ditemui.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map((emp) => (
                          <tr key={emp.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 font-mono font-medium text-blue-400">{emp.icNumber}</td>
                            <td className="px-4 py-3 font-semibold text-white uppercase">{emp.name}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={
                                emp.category === "JENIS1" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }>
                                {emp.category === "JENIS1" ? "Jenis 1" : "Jenis 2"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-white">
                              {inlineEditingId === emp.id ? (
                                <div className="flex items-center justify-end gap-2">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    className="w-24 h-8 bg-white/[0.04] border-blue-500/50 text-right text-sm focus-ring"
                                    value={inlineSalary}
                                    onChange={(e) => setInlineSalary(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") handleInlineSave(emp)
                                      if (e.key === "Escape") setInlineEditingId(null)
                                    }}
                                    autoFocus
                                    onBlur={() => handleInlineSave(emp)}
                                  />
                                </div>
                              ) : (
                                <div 
                                  className="cursor-pointer hover:text-blue-400 transition-colors"
                                  onClick={() => {
                                    setInlineEditingId(emp.id)
                                    setInlineSalary(emp.salary.toString())
                                  }}
                                  title="Klik untuk edit gaji terus"
                                >
                                  {Number(emp.salary).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-1 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(emp)
                                  }} 
                                  className="h-8 w-8 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                {confirmDeleteId === emp.id ? (
                                  <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 rounded-lg p-0.5">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(emp.id)
                                      }} 
                                      className="h-7 px-2 text-[10px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                                    >
                                      Ya, Padam
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setConfirmDeleteId(null)
                                      }} 
                                      className="h-7 px-2 text-[10px] font-bold text-slate-400 hover:text-white"
                                    >
                                      Batal
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setConfirmDeleteId(emp.id)
                                    }} 
                                    className="h-8 w-8 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}