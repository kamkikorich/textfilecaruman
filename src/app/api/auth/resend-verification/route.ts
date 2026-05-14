import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"
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

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Email tidak dijumpai" },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email telah disahkan" },
        { status: 400 }
      )
    }

    // Generate new token
    const { token, expires } = generateExpiringToken()

    // Update user with new token
    await db.user.update({
      where: { id: user.id },
      data: {
        verificationToken: token,
        verificationExpires: expires,
      },
    })

    // Send verification email
    await sendVerificationEmail({
      email: user.email,
      name: user.name || "Pengguna",
      verificationToken: token,
    })

    return NextResponse.json({
      message: "Email pengesahan telah dihantar semula",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json(
      { error: "Ralat server. Sila cuba lagi." },
      { status: 500 }
    )
  }
}
