import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = resetSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data tidak sah. Pastikan token dan kata laluan baru disediakan." },
        { status: 400 }
      )
    }

    const { token, password } = parsed.data

    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Link reset tidak sah atau telah tamat tempoh. Sila minta link reset baru." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })

    return NextResponse.json({
      message: "Kata laluan berjaya ditukar. Anda kini boleh log masuk dengan kata laluan baru.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Ralat server. Sila cuba lagi." },
      { status: 500 }
    )
  }
}
