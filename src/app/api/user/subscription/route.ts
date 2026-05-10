import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json({
    status: subscription?.status || "trial",
    planType: subscription?.planType || "basic",
    isActive: session.user.role === "admin" || subscription?.status === "active",
  })
}
