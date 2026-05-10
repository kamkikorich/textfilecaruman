import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get distinct userIds who have sent or received messages
  const threads = await db.chatMessage.groupBy({
    by: ['userId'],
    _max: {
      createdAt: true
    }
  })

  // Fetch user details and latest message for each thread
  const activeChats = await Promise.all(
    threads.map(async (t) => {
      const user = await db.user.findUnique({
        where: { id: t.userId },
        select: { id: true, name: true, email: true }
      })
      
      const latestMsg = await db.chatMessage.findFirst({
        where: { userId: t.userId },
        orderBy: { createdAt: "desc" }
      })

      const unreadCount = await db.chatMessage.count({
        where: { userId: t.userId, senderId: t.userId, isRead: false }
      })

      return {
        user,
        latestMessage: latestMsg,
        unreadCount
      }
    })
  )

  // Sort by latest message
  activeChats.sort((a, b) => {
    const dateA = a.latestMessage?.createdAt.getTime() || 0
    const dateB = b.latestMessage?.createdAt.getTime() || 0
    return dateB - dateA
  })

  return NextResponse.json(activeChats)
}
