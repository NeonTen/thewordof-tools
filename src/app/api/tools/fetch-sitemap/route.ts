import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }
    
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 0 }
    })
    
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch sitemap: ${res.statusText}` }, { status: res.status })
    }
    
    const text = await res.text()
    return NextResponse.json({ xml: text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch sitemap" }, { status: 500 })
  }
}
