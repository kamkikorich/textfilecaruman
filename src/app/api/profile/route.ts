import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, phone, companyName, companyRegistration, newPassword } = body

    const updateData: any = {
      name,
      phone,
      companyName,
      companyRegistration,
    }

    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        companyName: true,
        companyRegistration: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Ralat semasa mengemaskini profil." }, { status: 500 })
  }
}
