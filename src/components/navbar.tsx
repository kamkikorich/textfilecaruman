"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            TextFile<span className="gradient-text-subtle">SKBBK</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="nav-link">Ciri-ciri</Link>
          <Link href="/#pricing" className="nav-link">Harga</Link>
          <div className="h-6 w-px bg-white/[0.08]" />
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white focus-ring">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-400 hover:text-white focus-ring"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-slate-300 hover:text-white focus-ring">Log Masuk</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-lg shadow-blue-500/25 focus-ring">Mula Percuma</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-white/[0.06] p-6 space-y-4 animate-fade-in">
          <Link href="/#features" className="block nav-link text-lg" onClick={() => setMobileMenuOpen(false)}>Ciri-ciri</Link>
          <Link href="/#pricing" className="block nav-link text-lg" onClick={() => setMobileMenuOpen(false)}>Harga</Link>
          <div className="h-px bg-white/[0.06]" />
          {session?.user ? (
            <div className="space-y-3">
              <Link href="/dashboard" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">Dashboard</Button>
              </Link>
              <Button variant="ghost" className="w-full text-slate-400" onClick={() => signOut({ callbackUrl: "/" })}>
                Log Keluar
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-white hover:bg-white/10">Log Masuk</Button>
              </Link>
              <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">Daftar</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}