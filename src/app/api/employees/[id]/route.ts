import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

// Helper to verify employee ownership
async function verifyOwnership(employeeId: string, userId: string) {
  return db.employee.findFirst({
    where: {
      id: employeeId,
      employer: { userId },
    },
    include: { employer: true },
  })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak dibenarkan" }, { status: 401 })
  }

  const employee = await verifyOwnership(params.id, session.user.id)
  if (!employee) {
    return NextResponse.json({ error: "Rekod tidak dijumpai" }, { status: 404 })
  }

  const body = await req.json()
  const { name, salary, category, age, enteredAfter55, eisNoContribution57, workerType } = body

  try {
    const dob = age ? new Date(new Date().getFullYear() - parseInt(age), 0, 1) : employee.dateOfBirth

    const updated = await db.employee.update({
      where: { id: params.id },
      data: {
        name: name?.toUpperCase() || employee.name,
        nameMalay: name?.toUpperCase() || employee.nameMalay,
        salary: salary !== undefined ? salary : employee.salary,
        category: category || employee.category,
        dateOfBirth: dob,
        enteredAfter55: enteredAfter55 ?? employee.enteredAfter55,
        eisNoContribution57: eisNoContribution57 ?? employee.eisNoContribution57,
        workerType: workerType || employee.workerType,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Employee update error:", error)
    return NextResponse.json(
      { error: error.message || "Gagal mengemaskini maklumat pekerja" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak dibenarkan" }, { status: 401 })
  }

  const employee = await verifyOwnership(params.id, session.user.id)
  if (!employee) {
    return NextResponse.json({ error: "Rekod tidak dijumpai" }, { status: 404 })
  }

  // Soft delete — mark as inactive instead of hard delete to preserve contribution history
  await db.employee.update({
    where: { id: params.id },
    data: {
      isActive: false,
      deletedAt: new Date(),
      terminationDate: new Date(),
      terminationReason: "Dipadam oleh pengguna",
    },
  })

  // Update employer employee count
  await db.employer.update({
    where: { id: employee.employerId },
    data: { totalEmployees: { decrement: 1 } },
  })

  return NextResponse.json({ success: true, message: "Rekod pekerja berjaya dipadam" })
}
