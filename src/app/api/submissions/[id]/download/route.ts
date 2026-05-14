import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateTextFile } from "@/lib/perkeso"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const submission = await db.submission.findFirst({
      where: { id: params.id },
      include: {
        employer: true,
        contributions: { include: { employee: true } },
      },
    })

    if (!submission) {
      return new Response("Submission not found", { status: 404 })
    }

    const isAdmin = session.user.role === "admin" || session.user.role === "super_admin"
    const isOwner = submission.employer.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return new Response("Forbidden", { status: 403 })
    }

    // Always regenerate fresh content from contributions
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

    if (rows.length === 0) {
      return new Response("Tiada rekod caruman", { status: 400 })
    }

    const result = generateTextFile(
      submission.employer.employerCode,
      submission.contributionMonth,
      submission.contributionYear,
      rows
    )

    // Save to DB
    await db.submission.update({
      where: { id: params.id },
      data: { textFileContent: result.content },
    })

    const monthYear =
      String(submission.contributionMonth).padStart(2, "0") +
      submission.contributionYear
    const filename = `PERKESO_${submission.employer.employerCode}_${monthYear}.txt`
    const encodedFilename = encodeURIComponent(filename)

    return new Response(result.content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    })
  } catch (error: any) {
    console.error("Download error:", error)
    return new Response(`Ralat: ${error.message}`, { status: 500 })
  }
}