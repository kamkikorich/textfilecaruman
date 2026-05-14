import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const employeeId = searchParams.get("employeeId")

  if (!employeeId) return NextResponse.json({ error: "employeeId required" }, { status: 400 })

  const employee = await db.employee.findUnique({
    where: { id: employeeId },
    include: { employer: true },
  })
  if (!employee || employee.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const loans = await db.employeeLoan.findMany({
    where: { employeeId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(loans)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { employeeId, totalAmount, monthlyDeduction, description } = body

  if (!employeeId || !totalAmount || !monthlyDeduction) {
    return NextResponse.json({ error: "employeeId, totalAmount, monthlyDeduction required" }, { status: 400 })
  }

  const employee = await db.employee.findUnique({
    where: { id: employeeId },
    include: { employer: true },
  })
  if (!employee || employee.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const loan = await db.employeeLoan.create({
    data: {
      employeeId,
      totalAmount: Number(totalAmount),
      monthlyDeduction: Number(monthlyDeduction),
      balance: Number(totalAmount),
      description: description || null,
    },
  })

  return NextResponse.json(loan)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const loan = await db.employeeLoan.findUnique({
    where: { id },
    include: { employee: { include: { employer: true } } },
  })
  if (!loan || loan.employee.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await db.employeeLoan.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
