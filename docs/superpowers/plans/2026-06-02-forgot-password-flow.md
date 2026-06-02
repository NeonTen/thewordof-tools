# Password Reset Flow & Register Notice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a complete token-based password reset flow and add a warning helper notice on the Register page.

**Architecture:** We will create a `PasswordResetToken` table in Prisma to save temporary hashes. Then, we will create new email utilities (using Resend), API endpoints (`forgot-password` and `reset-password`), UI forms, and login/register updates.

**Tech Stack:** React, Next.js, Prisma, bcryptjs, Resend

---

### Task 1: Update Database Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add PasswordResetToken model to schema.prisma**

Add this model block to `prisma/schema.prisma`:
```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expires   DateTime
  createdAt DateTime @default(now())

  @@unique([email, token])
}
```

- [ ] **Step 2: Generate client and push schema updates to the database**

Run: `npx prisma db push` or `npx prisma generate`
Expected: Database schema successfully updated.

---

### Task 2: Create Email Deliverability Helper

**Files:**
- Modify: `src/lib/email.ts`

- [ ] **Step 1: Add sendPasswordResetEmail to email.ts**

At the end of `src/lib/email.ts`, append:
```typescript
export async function sendPasswordResetEmail({
  toEmail,
  token,
}: {
  toEmail: string;
  token: string;
}) {
  if (!resendKey) {
    console.warn("RESEND_API_KEY not found. Skipping reset email delivery.");
    return;
  }

  const resend = new Resend(resendKey);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thewordof.com";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset your password — TheWordOf Tools</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #fafafa; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { padding: 40px; background: linear-gradient(135deg, #11182710, #11182705); border-bottom: 1px solid #f3f4f6; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.05em; color: #111827; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 800; margin-bottom: 16px; }
        .intro { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
        .cta-button { display: inline-block; text-align: center; background-color: #111827; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-weight: 800; font-size: 15px; border-radius: 12px; margin-top: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .footer { padding: 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; background-color: #f9fafb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TheWordOf Tools</div>
        </div>
        <div class="content">
          <div class="greeting">Hello,</div>
          <p class="intro">
            We received a request to reset the password for your account. Please click the button below to choose a new password. This link is valid for 1 hour.
          </p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="cta-button">Reset Password</a>
          </div>
          <p class="intro" style="margin-top: 24px;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TheWordOf Tools. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "TheWordOf Tools <noreply@thewordof.com>",
      to: toEmail,
      subject: "Reset your password — TheWordOf Tools",
      html
    });
  } catch (err) {
    console.error("Failed to deliver reset email:", err);
  }
}
```

---

### Task 3: Create API Routes

**Files:**
- Create: `src/app/api/auth/forgot-password/route.ts`
- Create: `src/app/api/auth/reset-password/route.ts`

- [ ] **Step 1: Implement forgot-password API handler**

Create `src/app/api/auth/forgot-password/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return new NextResponse("Email is required", { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // For security, return success even if user isn't found to avoid email enumeration
      return NextResponse.json({ success: true })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour expiration

    await prisma.passwordResetToken.upsert({
      where: { email_token: { email, token } },
      update: { token, expires },
      create: { email, token, expires },
    })

    await sendPasswordResetEmail({ toEmail: email, token })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
```

- [ ] **Step 2: Implement reset-password API handler**

Create `src/app/api/auth/reset-password/route.ts`:
```typescript
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) {
      return new NextResponse("Token and password are required", { status: 400 })
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken || resetToken.expires < new Date()) {
      return new NextResponse("Invalid or expired token", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({
      where: { token },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
```

---

### Task 4: Implement Password Reset Pages

**Files:**
- Create: `src/app/(auth)/forgot-password/page.tsx`
- Create: `src/app/(auth)/reset-password/page.tsx`

- [ ] **Step 1: Create forgot-password page UI**

Create `src/app/(auth)/forgot-password/page.tsx`:
```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setIsSubmitted(true)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            {isSubmitted 
              ? "Check your inbox for a password reset link." 
              : "Enter your email address to request a reset link."
            }
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={onSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </div>
          </form>
        ) : (
          <Button asChild variant="outline">
            <Link href="/login">Return to Login</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create reset-password page UI**

Create `src/app/(auth)/reset-password/page.tsx`:
```tsx
"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get("token")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      if (res.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        const txt = await res.text()
        setError(txt || "Failed to reset password. Token may have expired.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center text-center">
        <h1 className="text-xl font-bold">Invalid Link</h1>
        <p className="text-sm text-muted-foreground mt-2">No reset token found in link.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/login">Return to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            {isSuccess 
              ? "Your password has been successfully reset! Redirecting to login..." 
              : "Enter your new password below."
            }
          </p>
        </div>

        {!isSuccess && (
          <form onSubmit={onSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="New Password"
                  type="password"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  type="password"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
```

---

### Task 5: Form Page UI Layout Adjustments

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/components/auth/user-auth-form.tsx`

- [ ] **Step 1: Add Forgot Password link to Login Page footer**

In `src/app/(auth)/login/page.tsx`, add a link to `/forgot-password` in the bottom footer row alongside the register link.

- [ ] **Step 2: Add Email notice helper text to UserAuthForm register state**

In `src/components/auth/user-auth-form.tsx` (around lines 138-143), right below the Email input for registration:
```tsx
            {type === "register" && (
              <p className="px-1 text-[10px] text-muted-foreground leading-normal mt-1">
                ℹ️ Used for login credentials and secure password resets. Please double-check it.
              </p>
            )}
```

- [ ] **Step 3: Run project build verification**

Run: `npm run build`
Expected: Successful compile of all client and server code.
