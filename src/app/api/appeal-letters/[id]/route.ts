import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getTemplate } from "@/lib/appeal-letter-templates"

// GET — Preview appeal letter HTML
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const letter = await db.appealLetter.findUnique({
      where: { id: params.id },
    })

    if (!letter) {
      return NextResponse.json(
        { error: "Surat tidak dijumpai" },
        { status: 404 }
      )
    }

    if (letter.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if employer address is available
    const employer = await db.employer.findFirst({
      where: { employerCode: letter.employerCode },
    })

    const html = getTemplate(letter.letterType, {
      companyName: letter.companyName,
      employerCode: letter.employerCode,
      companyAddress: employer?.addressLine1 || "",
      companyCity: employer?.city || "",
      companyState: employer?.state || "",
      companyPostcode: employer?.postcode || "",
      penaltyAmount: letter.penaltyAmount.toString(),
      penaltyPeriod: letter.penaltyPeriod,
      reason: letter.reason,
      customReason: letter.customReason || undefined,
      currentDate: new Date().toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    })

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  } catch (error) {
    console.error("Error previewing letter:", error)
    return NextResponse.json(
      { error: "Ralat server" },
      { status: 500 }
    )
  }
}
