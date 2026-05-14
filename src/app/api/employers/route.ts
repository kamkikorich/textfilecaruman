import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { validateEmployerCode } from "@/lib/perkeso"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const employers = await db.employer.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(employers)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { employerCode, employerName, addressLine1, city, state, postcode, phonePrimary, emailPrimary } = body

  const codeCheck = validateEmployerCode(employerCode)
  if (!codeCheck.valid) {
    return NextResponse.json({ error: codeCheck.error }, { status: 400 })
  }

  try {
    const employer = await db.employer.create({
      data: {
        userId: session.user.id,
        employerCode: employerCode.toUpperCase(),
        employerName,
        addressLine1,
        city,
        state,
        postcode,
        phonePrimary,
        emailPrimary,
        isActive: true,
      },
    })
    return NextResponse.json(employer)
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Kod majikan sudah wujud untuk akaun ini." }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
