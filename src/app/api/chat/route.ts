import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get messages for the current user
  const messages = await db.chatMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  })

  // Mark admin messages as read
  await db.chatMessage.updateMany({
    where: { 
      userId: session.user.id,
      senderId: { not: session.user.id },
      isRead: false
    },
    data: { isRead: true }
  })

  return NextResponse.json(messages)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { content } = await req.json()
  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })
  }

  const message = await db.chatMessage.create({
    data: {
      userId: session.user.id,
      senderId: session.user.id,
      content: content.trim(),
    }
  })

  return NextResponse.json(message)
}
