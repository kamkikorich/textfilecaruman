import { randomBytes } from "crypto"

/**
 * Generate a secure random token for email verification
 * @returns Hex string token (64 characters)
 */
export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex")
}

/**
 * Generate a token that expires in 24 hours
 * @returns Object with token and expiry date
 */
export function generateExpiringToken(): { token: string; expires: Date } {
  return {
    token: randomBytes(32).toString("hex"),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  }
}
