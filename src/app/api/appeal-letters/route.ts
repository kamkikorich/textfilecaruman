import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createSchema = z.object({
  letterType: z.enum(["faedah", "kompaun"]),
  employerId: z.string().uuid(),
  penaltyAmount: z.string().min(1),
  penaltyPeriod: z.string().min(1),
  reason: z.string().min(1),
})

// POST — Create new appeal letter request
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak sah", details: parsed.error.errors },
        { status: 400 }
      )
    }

    const { letterType, employerId, penaltyAmount, penaltyPeriod, reason } = parsed.data

    // Get employer details
    const employer = await db.employer.findFirst({
      where: { id: employerId, userId: session.user.id, isActive: true },
    })

    if (!employer) {
      return NextResponse.json(
        { error: "Majikan tidak dijumpai" },
        { status: 404 }
      )
    }

    // Build WhatsApp message
    const waMessage = encodeURIComponent(
      `Salam, saya mohon perkhidmatan buat surat rayuan.\n\n` +
      `Nama: ${session.user.name}\n` +
      `Email: ${session.user.email}\n` +
      `Perusahaan: ${employer.employerName}\n` +
      `Kod Majikan: ${employer.employerCode}\n` +
      `Jenis: ${letterType === "faedah" ? "Faedah Caruman Lewat Bayar SOCSO dan EIS" : "Kompaun"}\n` +
      `Jumlah: ${formatRM(penaltyAmount)}\n` +
      `Tempoh: ${penaltyPeriod}\n` +
      `Sebab: ${reason}\n\n` +
      `Sila proses surat saya. Terima kasih.`
    )

    // Create appeal letter record
    const letter = await db.appealLetter.create({
      data: {
        userId: session.user.id,
        letterType,
        companyName: employer.employerName,
        employerCode: employer.employerCode,
        penaltyAmount: parseFloat(penaltyAmount),
        penaltyPeriod,
        reason,
        status: "requested",
        submittedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      letterId: letter.id,
      whatsappUrl: `https://wa.me/60123757460?text=${waMessage}`,
    })
  } catch (error) {
    console.error("Error creating appeal letter:", error)
    return NextResponse.json(
      { error: "Ralat server. Sila cuba lagi." },
      { status: 500 }
    )
  }
}

// GET — List user's appeal letters
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const letters = await db.appealLetter.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(letters)
  } catch (error) {
    console.error("Error fetching appeal letters:", error)
    return NextResponse.json(
      { error: "Ralat server" },
      { status: 500 }
    )
  }
}

function formatRM(amount: string): string {
  const num = parseFloat(amount)
  return `RM${num.toLocaleString("ms-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
