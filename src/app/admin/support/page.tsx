"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, MessageCircle, Loader2, User, Search } from "lucide-react"
import Link from "next/link"

interface ChatMessage {
  id: string
  content: string
  senderId: string
  createdAt: string
  isRead: boolean
}

interface ActiveChat {
  user: {
    id: string
    name: string | null
    email: string | null
  }
  latestMessage: ChatMessage | null
  unreadCount: number
}

export default function AdminSupportPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  
  const [loadingChats, setLoadingChats] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user && session.user.role !== "admin")) {
      router.push("/dashboard")
    }
  }, [status, router, session])

  useEffect(() => {
    fetchActiveChats()
    // Poll for new chats/messages every 5 seconds
    const interval = setInterval(() => {
      fetchActiveChats(false) // Don't show loading indicator on poll
      if (selectedUserId) {
        fetchMessages(selectedUserId, false)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [selectedUserId]) // re-bind interval when selectedUserId changes

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function fetchActiveChats(showLoading = true) {
    if (showLoading) setLoadingChats(true)
    try {
      const res = await fetch("/api/admin/chat")
      if (res.ok) {
        const data = await res.json()
        setActiveChats(data)
      }
    } catch (e) {
      console.error("Failed to fetch active chats", e)
    } finally {
      setLoadingChats(false)
    }
  }

  async function fetchMessages(userId: string, showLoading = true) {
    if (showLoading) setLoadingMessages(true)
    try {
      const res = await fetch(`/api/admin/chat/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
        
        // Update local unread count
        setActiveChats(prev => prev.map(chat => 
          chat.user.id === userId ? { ...chat, unreadCount: 0 } : chat
        ))
      }
    } catch (e) {
      console.error("Failed to fetch messages", e)
    } finally {
      setLoadingMessages(false)
    }
  }

  function handleSelectUser(userId: string) {
    setSelectedUserId(userId)
    fetchMessages(userId)
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || sending || !selectedUserId) return

    setSending(true)
    try {
      const res = await fetch(`/api/admin/chat/${selectedUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, data])
        setNewMessage("")
        fetchActiveChats(false) // Refresh chat list to update latest message
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

  const selectedUser = activeChats.find(c => c.user.id === selectedUserId)?.user

  if (loadingChats && activeChats.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-140px)] flex bg-slate-900/50 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Sidebar: Chat List */}
      <div className="w-1/3 border-r border-white/[0.08] flex flex-col bg-slate-900/80">
        <div className="p-4 border-b border-white/[0.06]">
          <h2 className="font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            Senarai Bantuan
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeChats.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Tiada perbualan aktif.
            </div>
          ) : (
            activeChats.map((chat) => (
              <div 
                key={chat.user.id} 
                onClick={() => handleSelectUser(chat.user.id)}
                className={`p-4 border-b border-white/[0.04] cursor-pointer hover:bg-white/[0.02] transition-colors ${
                  selectedUserId === chat.user.id ? "bg-blue-500/10 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm text-white truncate pr-2">
                    {chat.user.name || "Pengguna"}
                  </h3>
                  {chat.latestMessage && (
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {new Date(chat.latestMessage.createdAt).toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-400 truncate pr-4">
                    {chat.latestMessage?.content || "Mesej baru..."}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Area: Chat Window */}
      <div className="w-2/3 flex flex-col bg-slate-950/50">
        {selectedUserId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/[0.06] bg-slate-900/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="font-bold text-white">{selectedUser?.name || "Pengguna"}</h2>
                <p className="text-xs text-slate-400">{selectedUser?.email}</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === session?.user?.id
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

            {/* Chat Input */}
            <div className="p-4 bg-slate-900/80 border-t border-white/[0.06]">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Taip balasan..."
                  className="flex-1 bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-blue-500/50 rounded-xl h-11 px-4"
                />
                <Button 
                  type="submit" 
                  disabled={sending || !newMessage.trim()} 
                  className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 focus-ring shrink-0 gap-2 font-medium"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Hantar
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 p-6">
            <MessageCircle className="w-16 h-16 mb-4 text-slate-600" />
            <p className="text-slate-400 font-medium">Pilih perbualan dari senarai di sebelah kiri</p>
            <p className="text-xs text-slate-500 mt-1">Anda boleh membalas pertanyaan dan masalah pengguna di sini.</p>
          </div>
        )}
      </div>
      
    </div>
  )
}
