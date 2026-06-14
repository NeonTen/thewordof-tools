import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import QRCode from "qrcode";

// POST /api/tools/generate-qr
// Expected body: { text: string, size?: number, fgColor?: string, bgColor?: string }
// Returns: { dataUrl: string }
export async function POST(req: NextRequest) {
  try {
    const {
      text,
      size = 256,
      fgColor = "#000000",
      bgColor = "#ffffff",
    } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: 'Invalid or missing "text" field' },
        { status: 400 },
      );
    }

    const opts = {
      width: size,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      margin: 2,
    } as QRCode.QRCodeToDataURLOptions;

    const dataUrl = await QRCode.toDataURL(text, opts);
    return NextResponse.json({ dataUrl });
  } catch (err) {
    console.error("QR generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 },
    );
  }
}
