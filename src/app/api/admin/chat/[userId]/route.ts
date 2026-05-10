import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const messages = await db.chatMessage.findMany({
    where: { userId: params.userId },
    orderBy: { createdAt: "asc" },
  })

  // Mark messages from this user as read by admin
  await db.chatMessage.updateMany({
    where: { 
      userId: params.userId,
      senderId: params.userId,
      isRead: false
    },
    data: { isRead: true }
  })

  return NextResponse.json(messages)
}

export async function POST(req: Request, { params }: { params: { userId: string } }) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { content } = await req.json()
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })
  }

  const message = await db.chatMessage.create({
    data: {
      userId: params.userId, // The thread owner
      senderId: session.user.id, // The admin sending it
      content: content.trim(),
    }
  })

  return NextResponse.json(message)
}
