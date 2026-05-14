import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import { generateExpiringToken } from "@/lib/token"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email diperlukan" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    // But only send email if user exists
    if (user) {
      // Generate reset token
      const { token, expires } = generateExpiringToken()

      // Update user with reset token
      await db.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetExpires: expires,
        },
      })

      // Send password reset email
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`
      await sendPasswordResetEmail({
        email: user.email,
        name: user.name || "",
        resetUrl,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Jika email wujud dalam sistem kami, anda akan menerima link reset password.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Ralat berlaku. Sila cuba lagi." },
      { status: 500 }
    )
  }
}