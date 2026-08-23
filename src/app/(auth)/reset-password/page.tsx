import { generateSeoMetadata } from "@/app/lib/seo";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import * as React from "react";
import { Loader2 } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Reset Password",
  description: "Set a new password for your account",
  canonical: "/reset-password",
});

export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container flex h-screen w-screen flex-col items-center justify-center text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordForm />
    </React.Suspense>
  );
}
