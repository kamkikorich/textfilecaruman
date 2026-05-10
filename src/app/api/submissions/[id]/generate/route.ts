import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateTextFile } from "@/lib/perkeso"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const submissionId = params.id

    const submission = await db.submission.findFirst({
      where: { id: submissionId },
      include: {
        employer: true,
        contributions: {
          include: { employee: true },
        },
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
    const isOwner = submission.employer.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ 
        error: "Forbidden",
        debug: { role: session.user.role, userId: session.user.id, employerUserId: submission.employer.userId }
      }, { status: 403 })
    }

    if (submission.contributions.length === 0) {
      return NextResponse.json({ error: "Tiada rekod caruman untuk dijana." }, { status: 400 })
    }

    const rows = submission.contributions.map((c) => ({
      ic: c.employee.icNumber,
      name: c.employee.nameMalay || c.employee.name,
      salary: Number(c.salary),
      age: c.employee.dateOfBirth
        ? new Date().getFullYear() - new Date(c.employee.dateOfBirth).getFullYear()
        : 30,
      category: c.employee.category,
      enteredAfter55: c.employee.enteredAfter55,
      eisNoContribution57: c.employee.eisNoContribution57,
      workerType: c.employee.workerType,
    }))

    const result = generateTextFile(
      submission.employer.employerCode,
      submission.contributionMonth,
      submission.contributionYear,
      rows
    )

    // Always overwrite stored content with freshly generated content
    await db.submission.update({
      where: { id: submissionId },
      data: { textFileContent: result.content },
    })

    return NextResponse.json({ 
      success: true,
      content: result.content, 
      filename: result.filename,
      rows: rows.length
    })
  } catch (error: any) {
    console.error("Generate text file error:", error)
    return NextResponse.json({ 
      error: error.message || "Ralat menjana fail teks" 
    }, { status: 500 })
  }
}
