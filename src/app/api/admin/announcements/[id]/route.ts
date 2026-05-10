import { NextRequest, NextResponse } from "next/server"
import { requireSuperAdmin } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(5000).optional(),
  type: z.enum(["info", "warning", "success", "error"]).optional(),
  isDismissable: z.boolean().optional(),
  isActive: z.boolean().optional(),
  publishedAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
})

// GET — Get single announcement
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireSuperAdmin()

    const announcement = await db.announcement.findUnique({
      where: { id: params.id },
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

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(announcement)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }
    console.error("Error fetching announcement:", error)
    return NextResponse.json(
      { error: "Failed to fetch announcement" },
      { status: 500 }
    )
  }
}

// PATCH — Update announcement
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireSuperAdmin()

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)

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

    const announcement = await db.announcement.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(type && { type }),
        ...(typeof isDismissable === "boolean" && { isDismissable }),
        ...(typeof isActive === "boolean" && { isActive }),
        ...(publishedAt !== undefined && {
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        }),
        ...(expiresAt !== undefined && {
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        }),
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      if (error.message.includes("Record to update does not exist")) {
        return NextResponse.json(
          { error: "Announcement not found" },
          { status: 404 }
        )
      }
    }
    console.error("Error updating announcement:", error)
    return NextResponse.json(
      { error: "Failed to update announcement" },
      { status: 500 }
    )
  }
}

// DELETE — Delete announcement
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireSuperAdmin()

    await db.announcement.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      if (error.message.includes("Record to delete does not exist")) {
        return NextResponse.json(
          { error: "Announcement not found" },
          { status: 404 }
        )
      }
    }
    console.error("Error deleting announcement:", error)
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    )
  }
}
