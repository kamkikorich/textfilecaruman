import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payslip = await db.payrollEmployee.findUnique({
    where: { id: params.id },
    include: {
      employee: true,
      period: { include: { employer: true } },
      payItems: { orderBy: { name: "asc" } },
    },
  })

  if (!payslip || payslip.period.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({
    id: payslip.id,
    employeeId: payslip.employeeId,
    employeeName: payslip.employee.name,
    employeeIC: payslip.employee.icNumber,
    employerName: payslip.period.employer.employerName,
    employerCode: payslip.period.employer.employerCode,
    month: payslip.period.month,
    year: payslip.period.year,
    workingDays: payslip.workingDays,
    basicSalary: Number(payslip.basicSalary),
    allowanceAmount: Number(payslip.allowanceAmount),
    overtimeHours: Number(payslip.overtimeHours),
    overtimePay: Number(payslip.overtimePay),
    commissionAmount: Number(payslip.commissionAmount),
    bonusAmount: Number(payslip.bonusAmount),
    epfEmployee: Number(payslip.epfEmployee),
    epfEmployer: Number(payslip.epfEmployer),
    epfEmployeeRateUsed: Number(payslip.epfEmployeeRateUsed),
    epfEmployerRateUsed: Number(payslip.epfEmployerRateUsed),
    socsoEmployee: Number(payslip.socsoEmployee),
    socsoEmployer: Number(payslip.socsoEmployer),
    eisEmployee: Number(payslip.eisEmployee),
    eisEmployer: Number(payslip.eisEmployer),
    pcbAmount: Number(payslip.pcbAmount),
    loanDeduction: Number(payslip.loanDeduction),
    attendanceDeduction: Number(payslip.attendanceDeduction),
    otherDeductions: Number(payslip.otherDeductions),
    totalDeductions: Number(payslip.totalDeductions),
    grossSalary: Number(payslip.grossSalary),
    netSalary: Number(payslip.netSalary),
    payItems: payslip.payItems.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
      amount: Number(p.amount),
      epfTaxable: p.epfTaxable,
    })),
  })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const payslip = await db.payrollEmployee.findUnique({
    where: { id: params.id },
    include: { period: { include: { employer: true } } },
  })

  if (!payslip || payslip.period.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await db.payrollEmployee.update({
    where: { id: params.id },
    data: {
      basicSalary: body.basicSalary,
      allowanceAmount: body.allowanceAmount,
      overtimeHours: body.overtimeHours,
      overtimePay: body.overtimePay,
      commissionAmount: body.commissionAmount,
      bonusAmount: body.bonusAmount,
      epfEmployee: body.epfEmployee,
      epfEmployer: body.epfEmployer,
      socsoEmployee: body.socsoEmployee,
      socsoEmployer: body.socsoEmployer,
      eisEmployee: body.eisEmployee,
      eisEmployer: body.eisEmployer,
      pcbAmount: body.pcbAmount,
      loanDeduction: body.loanDeduction,
      attendanceDeduction: body.attendanceDeduction,
      otherDeductions: body.otherDeductions,
      totalDeductions: body.totalDeductions,
      grossSalary: body.grossSalary,
      netSalary: body.netSalary,
      workingDays: body.workingDays,
    },
  })

  // Update pay items
  if (body.payItems && Array.isArray(body.payItems)) {
    // Delete existing pay items
    await db.payslipPayItem.deleteMany({
      where: { payslipId: params.id },
    })

    // Create updated pay items
    for (const item of body.payItems) {
      if (item.name && item.amount > 0) {
        await db.payslipPayItem.create({
          data: {
            payslipId: params.id,
            templateId: null,
            name: item.name,
            type: item.type,
            amount: item.amount,
            epfTaxable: item.epfTaxable,
          },
        })
      }
    }
  }

  return NextResponse.json({ success: true })
}
