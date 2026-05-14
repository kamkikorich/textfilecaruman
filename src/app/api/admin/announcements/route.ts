import { NextRequest, NextResponse } from "next/server"
import { requireAnyAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  type: z.enum(["info", "warning", "success", "error"]).default("info"),
  isDismissable: z.boolean().default(true),
  isActive: z.boolean().default(true),
  publishedAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
})

export const dynamic = "force-dynamic"

// GET — List all announcements (admin view)
export async function GET() {
  try {
    await requireAnyAdmin()

    const announcements = await db.announcement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            dismissals: true,
          },
        },
      },
    })

    return NextResponse.json(announcements)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }
    console.error("Error fetching announcements:", error)
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    )
  }
}

// POST — Create new announcement
export async function POST(request: NextRequest) {
  try {
    const session = await requireAnyAdmin()

    const body = await request.json()
    const parsed = createSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.errors },
        { status: 400 }
      )
    }

    const {
      title,
      content,
      type,
      isDismissable,
      isActive,
      publishedAt,
      expiresAt,
    } = parsed.data

    const announcement = await db.announcement.create({
      data: {
        title,
        content,
        type,
        isDismissable,
        isActive,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdBy: session.user.id,
      },
    })

    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }
    console.error("Error creating announcement:", error)
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    )
  }
}
