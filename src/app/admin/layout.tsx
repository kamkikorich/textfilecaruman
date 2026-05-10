import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  MessageCircle
} from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin"

  if (!session?.user?.id || !isAdmin) {
    redirect("/dashboard")
  }

  const navItems = [
    { label: "Ringkasan", icon: LayoutDashboard, href: "/admin" },
    { label: "Pengguna", icon: Users, href: "/admin/users" },
    { label: "Majikan", icon: Building2, href: "/admin/employers" },
    { label: "Semua Caruman", icon: FileText, href: "/admin/submissions" },
    { label: "Langganan", icon: CreditCard, href: "/admin/subscriptions" },
    { label: "Sistem Log", icon: ShieldAlert, href: "/admin/logs" },
    { label: "Chat Bantuan", icon: MessageCircle, href: "/admin/support" },
  ]

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.06] bg-slate-900/50 hidden md:flex flex-col">
        <div className="p-6 h-16 flex items-center gap-3 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Super Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-white/5 text-slate-400 hover:text-white transition-all h-11 px-4 rounded-xl"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 h-11 rounded-xl">
              Kembali ke App
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-6">
          <h2 className="font-semibold text-slate-400">Panel Kawalan Keseluruhan</h2>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-400 uppercase tracking-widest">
              Root Access
            </div>
            <div className="h-6 w-px bg-white/[0.08]" />
            <LogoutButton />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
