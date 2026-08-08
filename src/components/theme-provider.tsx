"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return
    if (typeof args[0] === "string" && args[0].includes("Failed to load the PayPal JS SDK script")) return
    orig.apply(console, args)
  }
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
