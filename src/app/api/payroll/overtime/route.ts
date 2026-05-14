import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const employerId = searchParams.get("employerId")
  const periodId = searchParams.get("periodId")

  if (!employerId) {
    return NextResponse.json({ error: "employerId required" }, { status: 400 })
  }

  const employer = await db.employer.findFirst({
    where: { id: employerId, userId: session.user.id },
  })
  if (!employer) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 })
  }

  const where: Record<string, unknown> = {}
  if (periodId) {
    const period = await db.payrollPeriod.findFirst({
      where: { id: periodId, employerId },
    })
    if (!period) {
      return NextResponse.json({ error: "Period not found" }, { status: 404 })
    }
    where.periodId = periodId
  }

  const entries = await db.overtimeEntry.findMany({
    where: {
      ...(periodId ? { periodId } : { periodId: null }),
      employee: { employerId },
    },
    include: { employee: true },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(entries)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { employeeId, date, hours, rate, description } = body

  if (!employeeId || !date || !hours || !rate) {
    return NextResponse.json({ error: "employeeId, date, hours, rate required" }, { status: 400 })
  }

  const employee = await db.employee.findUnique({
    where: { id: employeeId },
    include: { employer: true },
  })

  if (!employee || employee.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 })
  }

  const amount = Number(hours) * Number(rate)

  const entry = await db.overtimeEntry.create({
    data: {
      employeeId,
      date: new Date(date),
      hours: Number(hours),
      rate: Number(rate),
      amount,
      description,
    },
  })

  return NextResponse.json(entry)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 })
  }

  const entry = await db.overtimeEntry.findUnique({
    where: { id },
    include: { employee: { include: { employer: true } } },
  })

  if (!entry || entry.employee.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await db.overtimeEntry.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
