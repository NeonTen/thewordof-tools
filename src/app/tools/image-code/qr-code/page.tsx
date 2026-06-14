import { ToolHeader } from "@/components/tools/tool-header";
import { QRCodeGenerator } from "@/components/tools/qr-code";
import { auth } from "@/auth";
import { generateSeoMetadata } from "@/app/lib/seo";

export const metadata = generateSeoMetadata({
  title: "QR Code Generator",
  description:
    "Create customizable QR codes with custom size, background, and foreground colors.",
  keywords: ["qr generator", "qr code", "make qr", "free qr generator"],
});

export default async function QRCodeGeneratorPage() {
  const session = await auth();
  const isPro =
    session?.user?.role === "PRO" ||
    session?.user?.role === "BUSINESS" ||
    session?.user?.role === "ADMIN";
  const isBusiness =
    session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Image & Code"
          categoryHref="/tools/image-code"
          title="QR Code Generator"
        />
        <p className="text-muted-foreground mt-2">
          Create and download customizable QR codes with live preview.
        </p>
      </div>

      <QRCodeGenerator isPro={isPro} isBusiness={isBusiness} />
    </div>
  );
}
