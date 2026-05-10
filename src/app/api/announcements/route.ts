import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get active announcements that are published and not expired
    const now = new Date()
    const announcements = await db.announcement.findMany({
      where: {
        isActive: true,
        publishedAt: {
          lte: now, // published now or in the past
        },
        OR: [
          { expiresAt: null }, // no expiry
          { expiresAt: { gte: now } }, // not expired yet
        ],
      },
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        content: true,
        type: true,
        isDismissable: true,
        publishedAt: true,
        expiresAt: true,
      },
    })

    // Filter out dismissed announcements for this user
    const userId = session.user.id
    const dismissedAnnouncements = await db.announcementDismissal.findMany({
      where: { userId },
      select: { announcementId: true },
    })

    const dismissedIds = new Set(dismissedAnnouncements.map((d) => d.announcementId))
    const filteredAnnouncements = announcements.filter(
      (announcement) => !dismissedIds.has(announcement.id)
    )

    return NextResponse.json(filteredAnnouncements)
  } catch (error) {
    console.error("Error fetching announcements:", error)
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    )
  }
}
