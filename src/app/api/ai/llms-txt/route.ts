import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { verifyAndDeductCredits } from "@/lib/credits";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Authentication required", { status: 401 });
    }

    const body = await req.json();
    const {
      sitemapUrl,
      websiteUrl,
      specificUrls,
    } = body;

    if (!sitemapUrl && !websiteUrl && !specificUrls) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Deduct 3 credits for llms.txt generation (Crawling)
    const deduction = await verifyAndDeductCredits(session.user.id, 3);
    if (!deduction.success) {
      return new NextResponse(
        "Quota Exceeded: You do not have enough credits.",
        { status: 403 },
      );
    }

    let gatheredUrls: string[] = [];

    try {
      if (sitemapUrl) {
        const res = await fetch(sitemapUrl, { headers: { 'User-Agent': 'TheWordOfBot/1.0' } });
        if (res.ok) {
          const xml = await res.text();
          const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
          gatheredUrls = matches.map(m => m[1]);
        }
      } else if (websiteUrl) {
        const res = await fetch(websiteUrl, { headers: { 'User-Agent': 'TheWordOfBot/1.0' } });
        if (res.ok) {
          const html = await res.text();
          const matches = [...html.matchAll(/href=["']([^"']+)["']/gi)];
          gatheredUrls = matches.map(m => m[1]);
        }
      } else if (specificUrls) {
        gatheredUrls = specificUrls.split('\n').map((u: string) => u.trim()).filter(Boolean);
      }
    } catch (e) {
      console.error("Crawling failed", e);
      // Fallback if fetch fails, pass empty
    }

    const baseDomainUrl = websiteUrl || sitemapUrl || gatheredUrls[0] || "";
    const cleanedUrls = cleanAndFilterUrls(gatheredUrls, baseDomainUrl);

    // Cap at 150 URLs to prevent timeouts and excessive context
    const cappedUrls = cleanedUrls.slice(0, 150);

    const prompt = `You are an AI SEO expert. Generate a professional llms.txt file strictly following the official llmstxt.org specification.

    Here are the URLs crawled from the user's website/sitemap:
    ${cappedUrls.length > 0 ? cappedUrls.join('\n') : "No URLs could be fetched."}

    The llms.txt format MUST strictly follow these rules:
    1. Infer the Brand Name from the URLs and start the first line with an H1 header (e.g. # Brand Name).
    2. The second block MUST be a blockquote (> ) containing a concise 1-2 sentence summary of what this website is about, inferred from the URL paths.
    3. Categorize the provided URLs into appropriate H2 (##) sections (e.g. ## Getting Started, ## API Reference, ## Documentation, ## Products, ## Optional).
    4. Format all URLs as markdown lists with a brief descriptive name based on the URL path: - [Link Name](URL). Optional: add a brief note if obvious.
    5. Do not include introductory text, conversational filler, or wrap the response in markdown code blocks (\`\`\`markdown). Output ONLY the raw markdown content.`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI_LLMS_TXT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export function cleanAndFilterUrls(urls: string[], baseUrlString: string): string[] {
  if (!baseUrlString) return [];
  try {
    const baseUrl = new URL(baseUrlString);
    const filtered = urls.map(u => {
      try {
        const url = new URL(u, baseUrlString);
        
        // 1. Must match hostname of the base URL
        if (url.hostname !== baseUrl.hostname) {
          return null;
        }
        
        // 2. Remove hash anchors completely
        url.hash = "";
        
        // 3. No query parameters allowed
        if (url.search) {
          return null;
        }
        
        // 4. No static files/assets
        const pathname = url.pathname.toLowerCase();
        const fileExtensions = [
          ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp",
          ".pdf", ".xml", ".ico", ".txt", ".woff", ".woff2", ".ttf", ".eot",
          ".mp4", ".mp3", ".wav", ".zip", ".tar", ".gz"
        ];
        if (fileExtensions.some(ext => pathname.endsWith(ext))) {
          return null;
        }
        
        // 5. Exclude feeds, RSS, API and other non-content endpoints
        const excludePatterns = [
          /feed/i,
          /rss/i,
          /xmlrpc/i,
          /wp-json/i,
          /wp-admin/i,
          /wp-content\/plugins/i,
          /wp-content\/themes/i,
          /oembed/i,
          /rest_route/i
        ];
        if (excludePatterns.some(pattern => pattern.test(url.href))) {
          return null;
        }
        
        return url.href;
      } catch {
        return null;
      }
    }).filter(Boolean) as string[];
    
    return Array.from(new Set(filtered));
  } catch {
    return [];
  }
}
