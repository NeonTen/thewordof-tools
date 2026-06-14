import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscriptions: true },
    });

    const isPro =
      user?.role === "PRO" ||
      user?.role === "BUSINESS" ||
      user?.role === "ADMIN" ||
      user?.subscriptions?.[0]?.plan === "PREMIUM" ||
      user?.subscriptions?.[0]?.plan === "BUSINESS";

    if (!isPro) {
      return new NextResponse("Pro subscription required", { status: 403 });
    }

    const { url } = await req.json();
    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    console.log("FETCH_SCHEMA_REQUEST", { url });

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch URL: ${response.statusText}`, {
        status: response.status,
      });
    }

    const html = await response.text();

    // Regex matching structured JSON-LD scripts
    const regex =
      /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const schemas: any[] = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1].trim());
        if (parsed) {
          if (parsed["@graph"] && Array.isArray(parsed["@graph"])) {
            parsed["@graph"].forEach((item) => {
              if (item && item["@type"]) {
                const itemType = Array.isArray(item["@type"])
                  ? item["@type"][0]
                  : item["@type"];
                schemas.push({ type: itemType, data: item });
              }
            });
          } else if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              if (item && item["@type"]) {
                const itemType = Array.isArray(item["@type"])
                  ? item["@type"][0]
                  : item["@type"];
                schemas.push({ type: itemType, data: item });
              }
            });
          } else if (parsed["@type"]) {
            const itemType = Array.isArray(parsed["@type"])
              ? parsed["@type"][0]
              : parsed["@type"];
            schemas.push({ type: itemType, data: parsed });
          }
        }
      } catch (e) {
        console.warn("Failed to parse script tag JSON-LD block", e);
      }
    }

    return NextResponse.json({ success: true, schemas });
  } catch (error: any) {
    console.error("FETCH_SCHEMA_ERROR", error.message || error);
    return new NextResponse(error.message || "Internal Error", { status: 500 });
  }
}
