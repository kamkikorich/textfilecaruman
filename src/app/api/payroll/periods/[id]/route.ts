import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const period = await db.payrollPeriod.findUnique({
    where: { id: params.id },
    include: {
      employer: true,
      payrollEmployees: {
        include: { employee: true },
        orderBy: { employee: { name: "asc" } },
      },
    },
  })

  if (!period) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (period.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(period)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const period = await db.payrollPeriod.findUnique({
    where: { id: params.id },
    include: { employer: true },
  })

  if (!period) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (period.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await db.payrollPeriod.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
