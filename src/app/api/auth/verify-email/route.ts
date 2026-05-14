import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendWelcomeEmail, sendAdminNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: "Token tidak sah" },
        { status: 400 }
      )
    }

    // Find user with this verification token
    const user = await db.user.findFirst({
      where: { verificationToken: token },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Token tidak dijumpai" },
        { status: 404 }
      )
    }

    // Check if token is expired
    if (user.verificationExpires && user.verificationExpires < new Date()) {
      // Delete expired token
      await db.user.update({
        where: { id: user.id },
        data: { verificationToken: null, verificationExpires: null },
      })

      return NextResponse.json(
        { error: "Token telah tamat tempoh. Sila minta link baru." },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email telah disahkan sebelumnya", email: user.email },
        { status: 200 }
      )
    }

    // Mark email as verified
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    })

    // Activate trial subscription
    await db.subscription.updateMany({
      where: { userId: user.id },
      data: {
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      },
    })

    // Send welcome email
    await sendWelcomeEmail({
      email: user.email,
      name: user.name || "Pengguna",
    })

    // Send notification to admin (now that user is verified)
    await sendAdminNotification({
      name: user.name || "",
      email: user.email,
      companyName: user.companyName || "",
      isVerified: true,
    })

    return NextResponse.json({
      message: "Email berjaya disahkan! Selamat datang ke TextFile SKBBK.",
      email: user.email,
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { error: "Ralat server. Sila cuba lagi." },
      { status: 500 }
    )
  }
}
