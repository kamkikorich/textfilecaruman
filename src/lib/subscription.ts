import { Subscription } from "@prisma/client"

/**
 * Checks if a user has an active subscription or is within their valid trial period.
 */
export function isSubscriptionActive(subscription: Subscription | null | undefined, isAdmin: boolean = false) {
  if (isAdmin) return true
  if (!subscription) return false

  // If status is "active", check if period has expired
  if (subscription.status === "active") {
    if (!subscription.currentPeriodEnd) return true // Legacy support
    return new Date(subscription.currentPeriodEnd) > new Date()
  }

  // If status is "trial", check if trial has expired
  if (subscription.status === "trial") {
    if (!subscription.trialEnd) return true
    return new Date(subscription.trialEnd) > new Date()
  }

  return false
}

/**
 * Returns the status label for the subscription
 */
export function getSubscriptionStatus(subscription: Subscription | null | undefined, isAdmin: boolean = false) {
  if (isAdmin) return "active"
  if (!subscription) return "basic"

  const now = new Date()

  if (subscription.status === "active") {
    if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < now) {
      return "expired"
    }
    return "active"
  }
  
  if (subscription.status === "trial") {
    const isActiveTrial = !subscription.trialEnd || new Date(subscription.trialEnd) > new Date()
    return isActiveTrial ? "trial" : "expired"
  }

  return "expired"
}
