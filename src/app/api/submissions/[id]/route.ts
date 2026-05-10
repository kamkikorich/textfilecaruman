import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { status, paidAt, paymentReference } = await req.json()

    const submission = await db.submission.findUnique({
      where: { id: params.id },
      include: { employer: true }
    })

    if (!submission) {
      return new NextResponse("Submission not found", { status: 404 })
    }

    const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
    const isOwner = submission.employer.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    console.log("Updating submission (RAW):", params.id, { status, paidAt, paymentReference })

    // Workaround for Prisma Client lock on Windows: use raw SQL to update the new fields
    const finalStatus = status || submission.status
    const finalPaidAt = paidAt ? new Date(paidAt) : submission.paidAt
    const finalRef = paymentReference !== undefined ? paymentReference : submission.paymentReference

    await db.$executeRawUnsafe(
      `UPDATE submissions SET status = $1, "paidAt" = $2, "paymentReference" = $3 WHERE id = $4`,
      finalStatus,
      finalPaidAt,
      finalRef,
      params.id
    )

    // Clean up late payment alerts if paid
    if (finalStatus === "paid") {
      await db.alert.deleteMany({
        where: {
          submissionId: params.id,
          type: "late_payment"
        }
      })
    }

    const updated = await db.submission.findUnique({ where: { id: params.id } })
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Submission update error detail:", error)
    return new NextResponse(`Ralat: ${error.message}`, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const submission = await db.submission.findUnique({
      where: { id: params.id },
      include: { employer: true },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
    const isOwner = submission.employer.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete related alerts first
    await db.alert.deleteMany({
      where: { submissionId: params.id },
    })

    await db.submission.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Submission delete error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

