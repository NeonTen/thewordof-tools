import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const session = await auth()
    let isPro = false
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { subscriptions: true }
      })
      isPro = user?.role === "PRO" || user?.role === "BUSINESS" || user?.role === "ADMIN" || user?.subscriptions?.[0]?.plan === "PREMIUM" || user?.subscriptions?.[0]?.plan === "BUSINESS"
    }

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`
    let base: URL
    try {
      base = new URL(formattedUrl)
    } catch {
      return NextResponse.json({ error: "Invalid URL structure provided." }, { status: 400 })
    }

    const response = await fetch(formattedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(8000)
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch webpage: ${response.statusText}` }, { status: response.status })
    }

    const html = await response.text()
    
    // Simple robust regex to extract links and anchor texts
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi
    const parsedLinks: { href: string; text: string; type: "internal" | "external" }[] = []
    const seenUrls = new Set<string>()

    let match
    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[1].trim()
      
      // Filter anchors, mailto, tel, javascript links
      if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        continue
      }

      // Resolve relative URLs
      let resolvedUrl = href
      if (href.startsWith("/")) {
        resolvedUrl = `${base.origin}${href}`
      } else if (!href.startsWith("http")) {
        resolvedUrl = `${base.origin}/${href}`
      }

      // De-duplicate URLs
      if (seenUrls.has(resolvedUrl)) {
        continue
      }
      seenUrls.add(resolvedUrl)

      // Determine internal/external
      let type: "internal" | "external" = "external"
      try {
        const parsedResolved = new URL(resolvedUrl)
        if (parsedResolved.hostname === base.hostname) {
          type = "internal"
        }
      } catch {
        continue
      }

      // Strip inner tags from anchor text
      const anchorText = match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || "[No Text / Icon Link]"

      parsedLinks.push({ href: resolvedUrl, text: anchorText, type })
    }

    const limit = isPro ? parsedLinks.length : 30
    const linksToScan = parsedLinks.slice(0, limit)

    // Batch checks in parallel groups of 10 to avoid connection pooling issues or rate limits
    const batchSize = 10
    const scannedLinks: any[] = []
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

    for (let i = 0; i < linksToScan.length; i += batchSize) {
      const batch = linksToScan.slice(i, i + batchSize)
      const results = await Promise.all(
        batch.map(async (link) => {
          let status = 0
          try {
            const headResponse = await fetch(link.href, {
              method: "HEAD",
              headers: { "User-Agent": userAgent },
              signal: AbortSignal.timeout(4000)
            })
            status = headResponse.status
          } catch {
            // ignore and fallback to GET
          }

          if (status < 200 || status >= 400) {
            try {
              const getResponse = await fetch(link.href, {
                method: "GET",
                headers: { "User-Agent": userAgent },
                signal: AbortSignal.timeout(4000)
              })
              status = getResponse.status
            } catch {
              status = 0 // network/connection issue
            }
          }

          return { ...link, status }
        })
      )
      scannedLinks.push(...results)
    }

    return NextResponse.json({ links: scannedLinks })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to audit webpage links" }, { status: 500 })
  }
}
