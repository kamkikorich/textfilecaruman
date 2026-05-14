import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { calculatePayroll, getDefaultConfig, StatutoryConfig, PayItem } from "@/lib/payroll-calculator"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { employerId, month, year, workingDays, attendanceMap } = body

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
    where: { employerId_month_year: { employerId, month, year } },
  })
  if (existing) {
    return NextResponse.json({ error: "Slip gaji untuk bulan ini sudah wujud" }, { status: 409 })
  }

  const employees = await db.employee.findMany({
    where: { employerId, isActive: true },
    include: { salaryConfig: true, loans: { where: { status: "ACTIVE" } } },
  })

  const config = await db.payrollStatutoryConfig.findFirst({ where: { isActive: true } })
  const statutoryConfig: StatutoryConfig = config
    ? {
        epfEmployeeRate: Number(config.epfEmployeeRate),
        epfEmployerRate: Number(config.epfEmployerRate),
        epfEmployerRate2: Number(config.epfEmployerRate2),
        pcbEpfReliefCap: Number(config.pcbEpfReliefCap),
      }
    : getDefaultConfig()

  const payTemplates = await db.payItemTemplate.findMany({
    where: { employerId, isActive: true },
  })

  const overtimeEntries = await db.overtimeEntry.findMany({
    where: { employeeId: { in: employees.map(e => e.id) }, periodId: null },
  })

  const effectiveWorkingDays = workingDays || 26

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
    const empOvertime = overtimeEntries.filter(o => o.employeeId === emp.id)
    const overtimePay = empOvertime.reduce((s, o) => s + Number(o.amount), 0)
    const overtimeHours = empOvertime.reduce((s, o) => s + Number(o.hours), 0)

    const basicSalary = emp.basicSalary ? Number(emp.basicSalary) : Number(emp.salary)

    const salaryConfig = emp.salaryConfig
      ? {
          epfEmployeeRate: emp.salaryConfig.epfEmployeeRate ? Number(emp.salaryConfig.epfEmployeeRate) : null,
          epfEmployerRate: emp.salaryConfig.epfEmployerRate ? Number(emp.salaryConfig.epfEmployerRate) : null,
        }
      : null

    const loanDeductionTotal = emp.loans.reduce((s, loan) => s + Number(loan.monthlyDeduction), 0)

    const attKey = emp.id
    const att = attendanceMap?.[attKey]
    let attendanceDeduction = 0
    if (att && (att.absentDays > 0 || att.lateHours > 0)) {
      const dailyRate = basicSalary / effectiveWorkingDays
      const absentAmount = (att.absentDays || 0) * dailyRate
      const hourlyRate = dailyRate / 8
      const lateAmount = (att.lateHours || 0) * hourlyRate
      attendanceDeduction = Math.round((absentAmount + lateAmount) * 100) / 100

      await db.attendancePenalty.create({
        data: {
          periodId: period.id,
          employeeId: emp.id,
          absentDays: att.absentDays || 0,
          lateHours: att.lateHours || 0,
          deductionAmount: attendanceDeduction,
          note: att.note || null,
        },
      })
    }

    const age = emp.dateOfBirth
      ? new Date().getFullYear() - new Date(emp.dateOfBirth).getFullYear()
      : 30

    const customItems: PayItem[] = payTemplates.map(t => ({
      name: t.name,
      type: t.type as "ALLOWANCE" | "DEDUCTION",
      amount: 0,
      epfTaxable: t.epfTaxable,
    }))

    const payroll = calculatePayroll({
      basicSalary,
      allowanceAmount: Number(emp.allowanceAmount),
      overtimePay,
      overtimeHours,
      commissionAmount: 0,
      bonusAmount: 0,
      customItems,
      enteredAfter55: emp.enteredAfter55,
      eisNoContribution57: emp.eisNoContribution57,
      workerType: emp.workerType,
      age,
      category: emp.category,
      month,
      year,
      pcbMaritalStatus: emp.pcbMaritalStatus,
      pcbChildrenCount: emp.pcbChildrenCount,
      salaryConfig,
      statutoryConfig,
      loanDeductionTotal,
      attendanceDeduction,
      workingDays: effectiveWorkingDays,
    })

    const payslip = await db.payrollEmployee.create({
      data: {
        periodId: period.id,
        employeeId: emp.id,
        basicSalary: payroll.basicSalary,
        allowanceAmount: payroll.allowanceAmount,
        overtimeHours: payroll.overtimeHours,
        overtimePay: payroll.overtimePay,
        commissionAmount: payroll.commissionAmount,
        bonusAmount: payroll.bonusAmount,
        grossSalary: payroll.grossSalary,
        epfEmployee: payroll.epfEmployee,
        socsoEmployee: payroll.socsoEmployee,
        eisEmployee: payroll.eisEmployee,
        pcbAmount: payroll.pcbAmount,
        loanDeduction: payroll.loanDeduction,
        attendanceDeduction: payroll.attendanceDeduction,
        otherDeductions: 0,
        epfEmployer: payroll.epfEmployer,
        socsoEmployer: payroll.socsoEmployer,
        eisEmployer: payroll.eisEmployer,
        totalDeductions: payroll.totalDeductions,
        netSalary: payroll.netSalary,
        epfEmployerRateUsed: payroll.epfEmployerRateUsed,
        epfEmployeeRateUsed: payroll.epfEmployeeRateUsed,
        workingDays: effectiveWorkingDays,
      },
    })

    for (const item of [...payroll.customAllowances, ...payroll.customDeductions]) {
      const template = payTemplates.find(t => t.name === item.name)
      await db.payslipPayItem.create({
        data: {
          payslipId: payslip.id,
          templateId: template?.id || null,
          name: item.name,
          type: item.amount > 0 ? "ALLOWANCE" : (item as any).type || "DEDUCTION",
          amount: Math.abs(item.amount),
          epfTaxable: item.epfTaxable,
        },
      })
    }

    for (const loan of emp.loans) {
      const deductionAmount = Math.min(Number(loan.monthlyDeduction), Number(loan.balance))
      await db.loanDeduction.create({
        data: {
          loanId: loan.id,
          periodId: period.id,
          amount: deductionAmount,
        },
      })
      const newBalance = Number(loan.balance) - deductionAmount
      await db.employeeLoan.update({
        where: { id: loan.id },
        data: {
          balance: newBalance,
          status: newBalance <= 0 ? "PAID" : "ACTIVE",
        },
      })
    }

    totalGross += payroll.grossSalary
    totalDeductions += payroll.totalDeductions
    totalNet += payroll.netSalary
  }

  if (overtimeEntries.length > 0) {
    await db.overtimeEntry.updateMany({
      where: { id: { in: overtimeEntries.map(o => o.id) } },
      data: { periodId: period.id },
    })
  }

  const updated = await db.payrollPeriod.update({
    where: { id: period.id },
    data: { totalGross, totalDeductions, totalNet, status: "finalised" },
    include: {
      payrollEmployees: {
        include: { employee: true, payItems: true },
        orderBy: { employee: { name: "asc" } },
      },
    },
  })

  return NextResponse.json(updated)
}
