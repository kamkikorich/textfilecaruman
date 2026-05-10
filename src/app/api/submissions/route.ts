import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { calculateContribution, generateTextFile } from "@/lib/perkeso"

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

  const submissions = await db.submission.findMany({
    where: { employerId },
    orderBy: [{ contributionYear: "desc" }, { contributionMonth: "desc" }],
    include: {
      contributions: {
        include: { employee: true },
      },
    },
  })

  return NextResponse.json(submissions)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { employerId, contributionMonth, contributionYear } = body

  const employer = await db.employer.findFirst({
    where: { id: employerId, userId: session.user.id },
    include: { employees: { where: { isActive: true } } },
  })

  if (!employer) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 })
  }

  // Note: Subscription gating removed — text file generation is the core function

  const deadlineDate = new Date(contributionYear, contributionMonth, 15)
  if (deadlineDate.getMonth() !== contributionMonth) {
    // Month overflow, use next month 15th
    deadlineDate.setDate(15)
  }

  // Check for existing submission
  const existing = await db.submission.findUnique({
    where: {
      employerId_contributionMonth_contributionYear: {
        employerId,
        contributionMonth,
        contributionYear,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: "Caruman untuk bulan ini sudah wujud." }, { status: 409 })
  }

  const totalSalary = employer.employees.reduce((sum, e) => sum + Number(e.salary), 0)

  const submission = await db.submission.create({
    data: {
      employerId,
      contributionMonth,
      contributionYear,
      deadlineDate,
      status: "draft",
      totalEmployees: employer.employees.length,
      totalSalary,
      totalEmployerContribution: 0,
      totalEmployeeContribution: 0,
      grandTotal: 0,
    },
  })

  // Create contributions for each employee
  let totalEmployerContribution = 0
  let totalEmployeeContribution = 0

  for (const emp of employer.employees) {
    const age = emp.dateOfBirth
      ? new Date().getFullYear() - emp.dateOfBirth.getFullYear()
      : 30

    const calc = calculateContribution(
      Number(emp.salary),
      age,
      emp.category,
      emp.enteredAfter55,
      emp.eisNoContribution57,
      emp.workerType === "FOREIGN",
      contributionMonth,
      contributionYear
    )

    totalEmployerContribution += calc.totalEmployer
    totalEmployeeContribution += calc.totalEmployee

    await db.contribution.create({
      data: {
        submissionId: submission.id,
        employeeId: emp.id,
        month: contributionMonth,
        year: contributionYear,
        salary: emp.salary,
        socsoEmployer: calc.socsoEmployer,
        socsoEmployee: calc.socsoEmployee,
        eisEmployer: calc.eisEmployer,
        eisEmployee: calc.eisEmployee,
        skbbkEmployee: calc.skbbkEmployee,
        totalEmployer: calc.totalEmployer,
        totalEmployee: calc.totalEmployee,
      },
    })
  }

  // Update submission totals and generate text file content
  const rows = employer.employees.map((emp) => {
    const age = emp.dateOfBirth
      ? new Date().getFullYear() - emp.dateOfBirth.getFullYear()
      : 30

    return {
      ic: emp.icNumber,
      name: emp.nameMalay || emp.name,
      salary: Number(emp.salary),
      age,
      category: emp.category,
      enteredAfter55: emp.enteredAfter55,
      eisNoContribution57: emp.eisNoContribution57,
      workerType: emp.workerType,
    }
  })

  const result = generateTextFile(
    employer.employerCode,
    contributionMonth,
    contributionYear,
    rows
  )

  const updatedSubmission = await db.submission.update({
    where: { id: submission.id },
    data: {
      totalEmployerContribution,
      totalEmployeeContribution,
      grandTotal: totalEmployerContribution + totalEmployeeContribution,
      textFileContent: result.content,
    },
    include: { contributions: { include: { employee: true } } },
  })

  return NextResponse.json(updatedSubmission)
}
