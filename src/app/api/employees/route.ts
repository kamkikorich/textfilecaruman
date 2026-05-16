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

  if (!employerId) {
    return NextResponse.json({ error: "employerId required" }, { status: 400 })
  }

  // Verify ownership
  const employer = await db.employer.findFirst({
    where: { id: employerId, userId: session.user.id },
  })
  if (!employer) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 })
  }

  const employees = await db.employee.findMany({
    where: { employerId, isActive: true },
    include: {
      salaryConfig: true,
      loans: { where: { status: "ACTIVE" } },
    },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(employees)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { employerId, icNumber, name, salary, category, age, enteredAfter55, eisNoContribution57 } = body

  // Verify ownership
  const employer = await db.employer.findFirst({
    where: { id: employerId, userId: session.user.id },
  })
  if (!employer) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 })
  }

  const dob = age ? new Date(new Date().getFullYear() - age, 0, 1) : null

  try {
    const employee = await db.employee.create({
      data: {
        employerId,
        icNumber: icNumber.toUpperCase().replace(/-/g, ""),
        name,
        nameMalay: name.toUpperCase(),
        salary,
        category: category || "JENIS1",
        dateOfBirth: dob,
        employmentDate: new Date(),
        enteredAfter55: enteredAfter55 || false,
        eisNoContribution57: eisNoContribution57 || false,
        isSkbbkEligible: true,
        isActive: true,
      },
    })

    // Update employer totalEmployees
    await db.employer.update({
      where: { id: employerId },
      data: {
        totalEmployees: { increment: 1 },
      },
    })

    return NextResponse.json(employee)
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "No. KP sudah wujud untuk majikan ini." }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
