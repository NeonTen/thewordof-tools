import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    const response = await fetch(formattedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 SEO-Agent",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch webpage: ${response.statusText}` },
        { status: response.status },
      );
    }

    const html = await response.text();

    // Strip headers, scripts, styles, and format readable text
    let text = html
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
      .replace(/<header[^>]*>([\s\S]*?)<\/header>/gi, "")
      .replace(/<footer[^>]*>([\s\S]*?)<\/footer>/gi, "")
      .replace(/<nav[^>]*>([\s\S]*?)<\/nav>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to parse website text content" },
      { status: 500 },
    );
  }
}
