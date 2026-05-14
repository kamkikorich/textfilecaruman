import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const employer = await db.employer.findFirst({ where: { userId: session.user.id } })
  if (!employer) return NextResponse.json({ error: "Employer not found" }, { status: 404 })

  const items = await db.payItemTemplate.findMany({
    where: { employerId: employer.id, isActive: true },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const employer = await db.employer.findFirst({ where: { userId: session.user.id } })
  if (!employer) return NextResponse.json({ error: "Employer not found" }, { status: 404 })

  const body = await req.json()
  const { name, type, epfTaxable } = body

  if (!name || !type) return NextResponse.json({ error: "name, type required" }, { status: 400 })
  if (!["ALLOWANCE", "DEDUCTION"].includes(type)) {
    return NextResponse.json({ error: "type must be ALLOWANCE or DEDUCTION" }, { status: 400 })
  }

  const item = await db.payItemTemplate.create({
    data: {
      employerId: employer.id,
      name,
      type,
      epfTaxable: epfTaxable !== false,
    },
  })

  return NextResponse.json(item)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const item = await db.payItemTemplate.findUnique({
    where: { id },
    include: { employer: true },
  })
  if (!item || item.employer.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await db.payItemTemplate.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
