import { generateSeoMetadata } from "@/app/lib/seo";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = generateSeoMetadata({
  title: "Forgot Password",
  description: "Reset your account password",
  canonical: "/forgot-password",
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
