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
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status },
      );
    }

    const html = await response.text();

    // Parse title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Parse meta description
    const descMatch =
      html.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
      ) ||
      html.match(
        /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i,
      );
    const description = descMatch ? descMatch[1].trim() : "";

    return NextResponse.json({ title, description });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch page metadata" },
      { status: 500 },
    );
  }
}
