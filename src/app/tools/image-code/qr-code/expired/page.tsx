import { generateSeoMetadata } from "@/app/lib/seo";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "QR Code Expired — TheWordOf Tools",
  description: "This QR code has expired.",
  canonical: "/tools/image-code/qr-code/expired",
});

export default function QrCodeExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-md w-full space-y-6 bg-card border rounded-2xl p-8 shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">QR Code Expired</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This QR code was generated under a temporary free tier and has expired
          after 15 days. If you are the owner, upgrade to Pro to instantly
          reactivate this QR code and unlock analytics!
        </p>
        <div className="flex flex-col gap-2 pt-4">
          <Button asChild className="w-full font-bold">
            <Link href="/pricing">Upgrade to Pro</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Back to Tools</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
