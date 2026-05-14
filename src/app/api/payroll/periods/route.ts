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

  const employer = await db.employer.findFirst({
    where: { id: employerId, userId: session.user.id },
  })
  if (!employer) {
    return NextResponse.json({ error: "Employer not found" }, { status: 404 })
  }

  const periods = await db.payrollPeriod.findMany({
    where: { employerId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: {
      payrollEmployees: { include: { employee: true } },
    },
  })

  return NextResponse.json(periods)
}
