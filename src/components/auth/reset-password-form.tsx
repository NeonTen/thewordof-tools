"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const txt = await res.text();
        setError(txt || "Failed to reset password. Token may have expired.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center text-center">
        <h1 className="text-xl font-bold">Invalid Link</h1>
        <p className="text-sm text-muted-foreground mt-2">
          No reset token found in link.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/login">Return to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container relative mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSuccess
              ? "Your password has been successfully reset! Redirecting to login..."
              : "Enter your new password below."}
          </p>
        </div>

        {!isSuccess && (
          <form onSubmit={onSubmit}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  New Password
                </Label>
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
                <Label className="sr-only" htmlFor="confirmPassword">
                  Confirm Password
                </Label>
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
  );
}
