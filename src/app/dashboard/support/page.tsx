"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, MessageCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface ChatMessage {
  id: string
  content: string
  senderId: string
  createdAt: string
  isRead: boolean
}

export default function SupportChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const userId = session?.user?.id

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    
    // Check subscription status
    const checkSubscription = async () => {
      try {
        const res = await fetch("/api/user/subscription")
        const data = await res.json()
        if (!data.isActive) {
          router.push("/dashboard/billing")
        }
      } catch (e) {
        console.error("Failed to check subscription", e)
      }
    }
    
    if (status === "authenticated") {
      checkSubscription()
    }
  }, [status, router])

  useEffect(() => {
    if (!userId) return

    fetchMessages()

    // Poll every 5 seconds
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function fetchMessages() {
    try {
      const res = await fetch("/api/chat")
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (e) {
      console.error("Failed to fetch messages", e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, data])
        setNewMessage("")
      }
    } catch (e) {
      console.error("Failed to send message", e)
    } finally {
      setSending(false)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 focus-ring">
              <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
            </Button>
          </Link>
          <div className="h-6 w-px bg-white/[0.08]" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white leading-tight">Bantuan Khidmat Pelanggan</h1>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Dalam talian
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-3xl flex flex-col relative h-[calc(100vh-64px)]">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <MessageCircle className="w-12 h-12 mb-3 text-slate-500" />
              <p className="text-slate-400">Tiada mesej setakat ini.</p>
              <p className="text-xs text-slate-500">Hantar mesej untuk mula berhubung dengan admin.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === userId
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isMine 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : "bg-slate-800 text-slate-200 border border-white/[0.06] rounded-tl-sm"
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMine ? "text-blue-200" : "text-slate-500"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="pt-4 pb-2 bg-slate-950 sticky bottom-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Taip mesej anda..."
              className="flex-1 bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 rounded-full h-12 px-6"
            />
            <Button 
              type="submit" 
              disabled={sending || !newMessage.trim()} 
              className="h-12 w-12 rounded-full p-0 bg-blue-600 hover:bg-blue-500 focus-ring shrink-0"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 -ml-0.5" />}
            </Button>
          </form>
        </div>

      </div>
    </div>
  )
}
