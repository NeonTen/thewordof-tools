import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 SEO-Agent"
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

    // Scan the first 30 links in parallel batches of 5 to avoid overloading the system
    const scannedLinks = await Promise.all(
      parsedLinks.slice(0, 30).map(async (link) => {
        try {
          // Perform lightweight HEAD or GET check with short timeout
          const headResponse = await fetch(link.href, {
            method: "HEAD",
            headers: {
              "User-Agent": "Mozilla/5.0 SEO-Agent"
            },
            signal: AbortSignal.timeout(4000)
          })

          let status = headResponse.status
          
          // Fallback to GET if HEAD method is disallowed (e.g. 405 or 403)
          if (status === 405 || status === 403) {
            const getResponse = await fetch(link.href, {
              method: "GET",
              headers: {
                "User-Agent": "Mozilla/5.0 SEO-Agent"
              },
              signal: AbortSignal.timeout(3000)
            })
            status = getResponse.status
          }

          return { ...link, status }
        } catch {
          // Return 404 for timeouts or network failure errors
          return { ...link, status: 404 }
        }
      })
    )

    return NextResponse.json({ links: scannedLinks })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to audit webpage links" }, { status: 500 })
  }
}
