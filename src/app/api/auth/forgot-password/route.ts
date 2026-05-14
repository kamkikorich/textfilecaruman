import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import { randomBytes } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email diperlukan" },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({
        message: "Jika email wujud dalam sistem, link reset telah dihantar. Sila semak inbox anda.",
      })
    }

    const resetToken = randomBytes(32).toString("hex")
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000)

    await db.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`

    await sendPasswordResetEmail({
      email: user.email,
      name: user.name || "Pengguna",
      resetUrl,
    })

    return NextResponse.json({
      message: "Jika email wujud dalam sistem, link reset telah dihantar. Sila semak inbox anda.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Ralat server. Sila cuba lagi." },
      { status: 500 }
    )
  }
}
