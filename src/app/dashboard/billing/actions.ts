"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function createCheckoutSession() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Placeholder for any future manual payment logging logic
  return { error: "Sila gunakan DuitNow QR untuk pembayaran." }
}
