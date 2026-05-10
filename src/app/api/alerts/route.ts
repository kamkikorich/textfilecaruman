import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { checkAndCreateLateAlerts } from "@/lib/deadline-calculator"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await checkAndCreateLateAlerts(session.user.id)

  const alerts = await db.alert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(alerts)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { alertId } = await req.json()

  if (!alertId) {
    return NextResponse.json({ error: "alertId required" }, { status: 400 })
  }

  const alert = await db.alert.updateMany({
    where: { id: alertId, userId: session.user.id },
    data: { isRead: true, readAt: new Date() },
  })

  return NextResponse.json(alert)
}