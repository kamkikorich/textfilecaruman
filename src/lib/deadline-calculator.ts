import { db } from "./db"

export const LATE_PENALTY_PER_MONTH = 5 // RM5 per month or part thereof

export function getContributionDeadline(month: number, year: number): Date {
  return new Date(year, month, 15)
}

export function calculateMonthsLate(deadline: Date, now: Date = new Date()): number {
  if (now <= deadline) return 0

  const d1 = new Date(deadline)
  const d2 = new Date(now)

  // Calculate difference in months
  let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())

  // If the current day is after the deadline day, it counts as an additional month (part thereof)
  if (d2.getDate() > d1.getDate()) {
    months += 1
  } else if (months === 0 && now > deadline) {
    // If it's the same month but past the deadline time on the same day
    months = 1
  }

  return Math.max(0, months)
}

export function calculateLatePenalty(deadline: Date, now: Date = new Date()): number {
  const months = calculateMonthsLate(deadline, now)
  if (months <= 0) return 0
  return months * LATE_PENALTY_PER_MONTH
}

export function formatDeadlineDisplay(month: number, year: number): string {
  const deadline = getContributionDeadline(month, year)
  const bulan = [
    "", "Januari", "Februari", "Mac", "April", "Mei", "Jun",
    "Julai", "Ogos", "September", "Oktober", "November", "Disember",
  ]
  return `${deadline.getDate()} ${bulan[month]} ${year}`
}

export async function checkAndCreateLateAlerts(userId: string): Promise<number> {
  const now = new Date()

  const employers = await db.employer.findMany({
    where: { userId, isActive: true },
  })

  let created = 0

  for (const employer of employers) {
    const submissions = await db.submission.findMany({
      where: {
        employerId: employer.id,
        status: { not: "paid" },
      },
    })

    for (const sub of submissions) {
      const deadline = getContributionDeadline(
        sub.contributionMonth,
        sub.contributionYear
      )

      if (now > deadline) {
        const monthsLate = calculateMonthsLate(deadline, now)
        const penalty = monthsLate * LATE_PENALTY_PER_MONTH

        const existingAlert = await db.alert.findFirst({
          where: {
            submissionId: sub.id,
            type: "late_payment",
          },
        })

        if (existingAlert) {
          await db.alert.update({
            where: { id: existingAlert.id },
            data: {
              message: `Caruman ${String(sub.contributionMonth).padStart(2, "0")}/${sub.contributionYear} lewat ${monthsLate} bulan. Denda lewat: RM${penalty.toFixed(2)}.`,
              title: `Amaran Caruman Lewat - ${String(sub.contributionMonth).padStart(2, "0")}/${sub.contributionYear}`,
            },
          })
        } else {
          await db.alert.create({
            data: {
              userId,
              employerId: employer.id,
              submissionId: sub.id,
              type: "late_payment",
              title: `Amaran Caruman Lewat - ${String(sub.contributionMonth).padStart(2, "0")}/${sub.contributionYear}`,
              message: `Caruman ${String(sub.contributionMonth).padStart(2, "0")}/${sub.contributionYear} lewat ${monthsLate} bulan. Denda lewat: RM${penalty.toFixed(2)}. Tarikh akhir: ${formatDeadlineDisplay(sub.contributionMonth, sub.contributionYear)}.`,
            },
          })
          created++
        }

        await db.submission.update({
          where: { id: sub.id },
          data: {
            latePenalty: penalty,
            monthsLate,
          },
        })
      }
    }
  }

  // Cleanup: Remove alerts for submissions that no longer exist or are now paid
  const allUserAlerts = await db.alert.findMany({
    where: { userId, type: "late_payment", submissionId: { not: null } }
  })

  for (const alert of allUserAlerts) {
    const sub = await db.submission.findUnique({
      where: { id: alert.submissionId! }
    })
    if (!sub || sub.status === "paid") {
      await db.alert.delete({ where: { id: alert.id } })
    }
  }

  return created
}