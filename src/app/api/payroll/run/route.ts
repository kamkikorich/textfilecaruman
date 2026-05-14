import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { calculatePayroll, getDefaultConfig, StatutoryConfig } from "@/lib/payroll-calculator"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { employerId, month, year } = body

  if (!employerId || !month || !year) {
    return NextResponse.json({ error: "employerId, month, year required" }, { status: 400 })
  }

  const employer = await db.employer.findFirst({
    where: { id: employerId, userId: session.user.id },
  })
  if (!employer) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 })
  }

  const existing = await db.payrollPeriod.findUnique({
    where: {
      employerId_month_year: { employerId, month, year },
    },
  })
  if (existing) {
    return NextResponse.json({ error: "Slip gaji untuk bulan ini sudah wujud" }, { status: 409 })
  }

  const employees = await db.employee.findMany({
    where: { employerId, isActive: true },
  })

  const config = await db.payrollStatutoryConfig.findFirst({
    where: { isActive: true },
  })

  const statutoryConfig: StatutoryConfig = config
    ? {
        epfEmployeeRate: Number(config.epfEmployeeRate),
        epfEmployerRate: Number(config.epfEmployerRate),
        epfEmployerRate2: Number(config.epfEmployerRate2),
        epfWageCeiling: Number(config.epfWageCeiling),
        socsoEmployeeRate: Number(config.socsoEmployeeRate),
        socsoEmployerRate: Number(config.socsoEmployerRate),
        socsoWageCeiling: Number(config.socsoWageCeiling),
        eisEmployeeRate: Number(config.eisEmployeeRate),
        eisEmployerRate: Number(config.eisEmployerRate),
        eisWageCeiling: Number(config.eisWageCeiling),
        pcbEpfReliefCap: Number(config.pcbEpfReliefCap),
      }
    : getDefaultConfig()

  const overtimeEntries = await db.overtimeEntry.findMany({
    where: {
      employeeId: { in: employees.map((e) => e.id) },
      periodId: null,
    },
  })

  const period = await db.payrollPeriod.create({
    data: {
      employerId,
      month,
      year,
      status: "draft",
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
    },
  })

  let totalGross = 0
  let totalDeductions = 0
  let totalNet = 0

  for (const emp of employees) {
    const empOvertime = overtimeEntries.filter((o) => o.employeeId === emp.id)
    const overtimePay = empOvertime.reduce((sum, o) => sum + Number(o.amount), 0)
    const overtimeHours = empOvertime.reduce((sum, o) => sum + Number(o.hours), 0)

    const basicSalary = emp.basicSalary ? Number(emp.basicSalary) : Number(emp.salary)

    const payroll = calculatePayroll({
      basicSalary,
      allowanceAmount: Number(emp.allowanceAmount),
      overtimePay,
      commissionAmount: 0,
      epfEmployeeRate: emp.epfEmployeeRate ? Number(emp.epfEmployeeRate) : 0.11,
      enteredAfter55: emp.enteredAfter55,
      eisNoContribution57: emp.eisNoContribution57,
      pcbMaritalStatus: emp.pcbMaritalStatus,
      pcbChildrenCount: emp.pcbChildrenCount,
      config: statutoryConfig,
    })

    await db.payrollEmployee.create({
      data: {
        periodId: period.id,
        employeeId: emp.id,
        basicSalary: payroll.basicSalary,
        allowanceAmount: payroll.allowanceAmount,
        overtimeHours,
        overtimePay: payroll.overtimePay,
        commissionAmount: payroll.commissionAmount,
        grossSalary: payroll.grossSalary,
        epfEmployee: payroll.epfEmployee,
        socsoEmployee: payroll.socsoEmployee,
        eisEmployee: payroll.eisEmployee,
        pcbAmount: payroll.pcbAmount,
        otherDeductions: 0,
        epfEmployer: payroll.epfEmployer,
        socsoEmployer: payroll.socsoEmployer,
        eisEmployer: payroll.eisEmployer,
        totalDeductions: payroll.totalDeductions,
        netSalary: payroll.netSalary,
      },
    })

    totalGross += payroll.grossSalary
    totalDeductions += payroll.totalDeductions
    totalNet += payroll.netSalary
  }

  if (overtimeEntries.length > 0) {
    await db.overtimeEntry.updateMany({
      where: { id: { in: overtimeEntries.map((o) => o.id) } },
      data: { periodId: period.id },
    })
  }

  const updated = await db.payrollPeriod.update({
    where: { id: period.id },
    data: {
      totalGross,
      totalDeductions,
      totalNet,
      status: "finalised",
    },
    include: {
      payrollEmployees: { include: { employee: true } },
    },
  })

  return NextResponse.json(updated)
}
