import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { addMonths } from "date-fns"

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    // Check if user is admin
    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "super_admin"
    if (!session?.user?.id || !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const subscriptionId = formData.get("subscriptionId") as string
    const userId = formData.get("userId") as string
    const duration = parseInt(formData.get("duration") as string) || 1

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: "Subscription ID and User ID required" },
        { status: 400 }
      )
    }

    // Validate duration (1, 3, 6, or 12 months)
    const validDurations = [1, 3, 6, 12]
    if (!validDurations.includes(duration)) {
      return NextResponse.json(
        { error: "Invalid duration. Must be 1, 3, 6, or 12 months" },
        { status: 400 }
      )
    }

    // Update subscription
    const now = new Date()
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    // Calculate new end date based on current period end or now
    let currentEnd = subscription.currentPeriodEnd
    if (!currentEnd || currentEnd < now) {
      // If no current period end or already expired, start from now
      currentEnd = now
    }

    const newPeriodEnd = addMonths(currentEnd, duration)

    await db.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: newPeriodEnd,
        cancelAtPeriodEnd: false,
        cancelledAt: null,
      },
    })

    // Revalidate cache and redirect back
    return NextResponse.redirect(
      new URL("/admin/subscriptions?reactivated=true", request.url)
    )
  } catch (error) {
    console.error("Reactivate subscription error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
