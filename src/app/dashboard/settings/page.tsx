import { generateSeoMetadata } from "@/app/lib/seo";
import { auth } from "@/auth";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { redirect } from "next/navigation";

export const metadata = generateSeoMetadata({
  title: "Settings",
  description: "Manage your account settings.",
});

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <SettingsForm user={session.user} />
        </Card>
      </div>
    </div>
  );
}
