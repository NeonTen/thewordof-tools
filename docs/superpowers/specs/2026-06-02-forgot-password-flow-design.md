# Spec: Forgot Password Flow and Register Email Notice

## Goal Description
Implement a complete token-based password reset flow for credential-based logins on `thewordof.com/login`. Additionally, show a clear warning/helper notice under the email field on the Register page so users know the email will be used for logins and password resets.

## Proposed Changes

### 1. Database Schema
#### [MODIFY] [schema.prisma](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/prisma/schema.prisma)
Add the `PasswordResetToken` model to store time-limited secure tokens.

### 2. Email Deliverability
#### [MODIFY] [email.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/lib/email.ts)
Add a helper function `sendPasswordResetEmail` to deliver the reset link to the user using Resend.

### 3. Backend Controllers / API Routes
#### [NEW] [route.ts (forgot-password)](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/auth/forgot-password/route.ts)
Generates the token, saves it, and invokes the email sender.
#### [NEW] [route.ts (reset-password)](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/auth/reset-password/route.ts)
Verifies the token, hashes the new password, and updates the user record.

### 4. User Interface Pages & Components
#### [NEW] [page.tsx (forgot-password)](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/(auth)/forgot-password/page.tsx)
Displays a form asking for the user's email address to request a password reset.
#### [NEW] [page.tsx (reset-password)](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/(auth)/reset-password/page.tsx)
Displays a form to input and submit the new password.
#### [MODIFY] [page.tsx (login)](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/(auth)/login/page.tsx)
Updates footer links to include "Forgot Password?".
#### [MODIFY] [user-auth-form.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/auth/user-auth-form.tsx)
Displays the helper text notice underneath the email field during registration.

## Verification Plan
* Run prisma db push or migration.
* Request a reset link for an email and verify email delivery via logs/resend.
* Reset password using the link and verify credentials login works with the new password.
