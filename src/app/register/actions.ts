"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { sendVerificationEmail, sendAdminNotification } from "@/lib/email"
import { generateExpiringToken } from "@/lib/token"

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  companyName: z.string().optional(),
})

export async function registerUser(data: {
  name: string
  email: string
  password: string
  companyName?: string
}) {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Data tidak sah. Pastikan semua medan diisi dengan betul." }
  }

  const existing = await db.user.findUnique({
    where: { email: data.email },
  })

  if (existing) {
    return { error: "Email sudah didaftarkan. Sila log masuk." }
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  // Generate verification token
  const { token, expires } = generateExpiringToken()

  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      companyName: data.companyName || data.name,
      emailVerified: false,
      verificationToken: token,
      verificationExpires: expires,
    },
  })

  // Create trial subscription (inactive until verified)
  await db.subscription.create({
    data: {
      userId: user.id,
      status: "trial",
      planType: "basic",
      trialStart: new Date(),
      trialEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  // Send verification email to user
  await sendVerificationEmail({
    email: user.email,
    name: user.name || "",
    verificationToken: token,
  })

  // Send notification to admin (user not verified yet)
  await sendAdminNotification({
    name: user.name || "",
    email: user.email,
    companyName: user.companyName || "",
    isVerified: false,
  })

  return { 
    success: true, 
    userId: user.id,
    requiresVerification: true,
    message: "Pendaftaran berjaya! Sila semak email anda untuk mengesahkan akaun.",
  }
}
