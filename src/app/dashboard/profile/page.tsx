import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { ProfileForm } from "./profile-form"
import { ArrowLeft, User, Building, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      companyName: true,
      companyRegistration: true,
      role: true,
    }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
          <div className="h-6 w-px bg-white/[0.08]" />
          <h1 className="font-bold text-lg text-white">Tetapan Akaun</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Sidebar / Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/80 p-6">
              <div className="flex flex-col items-center text-center pb-6 border-b border-white/[0.06] mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg shadow-blue-500/25">
                  {user.name?.charAt(0) || "U"}
                </div>
                <h2 className="font-bold text-lg text-white">{user.name}</h2>
                <p className="text-sm text-slate-400">{user.email}</p>
                {user.role === "admin" && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                    <Shield className="w-3.5 h-3.5" />
                    Super Admin
                  </div>
                )}
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-slate-300">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>{user.phone || "Tiada no telefon"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Building className="w-4 h-4 text-slate-500" />
                  <div>
                    <p>{user.companyName || "Tiada nama syarikat"}</p>
                    {user.companyRegistration && (
                      <p className="text-xs text-slate-500">{user.companyRegistration}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <ProfileForm user={user} />
          </div>

        </div>
      </div>
    </div>
  )
}
