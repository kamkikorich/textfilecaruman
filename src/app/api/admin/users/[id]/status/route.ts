import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Tidak dibenarkan" }, { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    if (!["active", "inactive", "trial"].includes(status)) {
      return NextResponse.json({ error: "Status tidak sah" }, { status: 400 })
    }

    // Update the subscription status
    const subscription = await db.subscription.findUnique({
      where: { userId: params.id },
    })

    if (!subscription) {
      // If they don't have a subscription yet, create one
      await db.subscription.create({
        data: {
          userId: params.id,
          status: status,
          planType: "basic",
        }
      })
    } else {
      await db.subscription.update({
        where: { userId: params.id },
        data: { status: status },
      })
    }

    return NextResponse.json({ success: true, message: `Status pengguna dikemaskini kepada ${status}` })
  } catch (error) {
    console.error("Update user status error:", error)
    return NextResponse.json({ error: "Ralat dalaman pelayan" }, { status: 500 })
  }
}
