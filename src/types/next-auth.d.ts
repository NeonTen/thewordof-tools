import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "USER" | "PRO" | "ADMIN"
      proExpiresAt?: Date | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: "USER" | "PRO" | "ADMIN"
    proExpiresAt?: Date | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "USER" | "PRO" | "ADMIN"
    proExpiresAt?: Date | string | null
  }
}
