import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "./db"
import { z } from "zod"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) {
          throw new Error("Email dan password tidak sah")
        }

        const { email, password } = parsed.data

        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          throw new Error("Email atau password tidak sah")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          throw new Error("Email atau password tidak sah")
        }

        // Check if email is verified (skip for admin/super_admin users)
        if (!user.emailVerified && user.role !== "admin" && user.role !== "super_admin") {
          throw new Error("Email belum disahkan. Sila semak email anda dan klik link pengesahan.")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        // @ts-expect-error - Override default emailVerified type
        session.user.emailVerified = Boolean(token.emailVerified)
      }
      return session
    },
  },
})

/**
 * Require any admin role (admin or super_admin)
 */
export async function requireAnyAdmin() {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  
  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    throw new Error("Forbidden: Admin access required")
  }
  
  return session
}

/**
 * Require super admin role for sensitive management
 */
export async function requireSuperAdmin() {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  
  if (session.user.role !== "super_admin") {
    throw new Error("Forbidden: Super admin access required")
  }
  
  return session
}