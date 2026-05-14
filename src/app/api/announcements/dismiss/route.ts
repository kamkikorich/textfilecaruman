import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const dismissSchema = z.object({
  announcementId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = dismissSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid announcement ID" },
        { status: 400 }
      )
    }

    const { announcementId } = parsed.data

    // Check if announcement exists
    const announcement = await db.announcement.findUnique({
      where: { id: announcementId },
      select: { isDismissable: true },
    })

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      )
    }

    if (!announcement.isDismissable) {
      return NextResponse.json(
        { error: "This announcement cannot be dismissed" },
        { status: 400 }
      )
    }

    // Create or ignore dismissal (idempotent)
    await db.announcementDismissal.upsert({
      where: {
        announcementId_userId: {
          announcementId,
          userId: session.user.id,
        },
      },
      create: {
        announcementId,
        userId: session.user.id,
      },
      update: {}, // Already dismissed, do nothing
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error dismissing announcement:", error)
    return NextResponse.json(
      { error: "Failed to dismiss announcement" },
      { status: 500 }
    )
  }
}
