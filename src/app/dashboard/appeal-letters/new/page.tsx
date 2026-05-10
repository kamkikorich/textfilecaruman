import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { AppealLetterForm } from "./form"

export default async function NewAppealLetterPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const employers = await db.employer.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { employerName: "asc" },
    select: {
      id: true,
      employerCode: true,
      employerName: true,
    },
  })

  return <AppealLetterForm employers={employers} />
}
