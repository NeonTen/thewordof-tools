import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          proExpiresAt: user.proExpiresAt
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.proExpiresAt = user.proExpiresAt
      }
      
      // Auto-expire PRO role if passed proExpiresAt
      if (token.role === "PRO" && token.proExpiresAt) {
        if (new Date(token.proExpiresAt as string | Date) < new Date()) {
          token.role = "USER"
          token.proExpiresAt = null
          // Fire and forget DB update
          prisma.user.update({
            where: { id: token.id as string },
            data: { role: "USER", proExpiresAt: null }
          }).catch(console.error)
        }
      }
      
      // If we trigger a manual update (like after payment sync)
      if (trigger === "update") {
        if (session?.role) {
          token.role = session.role
        } else {
          const identifier = (token.id || token.sub) as string
          const email = token.email as string
          
          if (identifier || email) {
            const dbUser = await prisma.user.findUnique({
              where: identifier ? { id: identifier } : { email: email },
              select: { role: true, name: true }
            })
            if (dbUser) {
              token.role = dbUser.role
            }
          }
        }
        if (session?.name) token.name = session.name
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as any
        session.user.id = token.id as string
        session.user.name = token.name as string
        if (token.proExpiresAt) {
          session.user.proExpiresAt = new Date(token.proExpiresAt as string | Date)
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  }
})
