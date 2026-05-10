import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 print:hidden">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2 px-8 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} TheWordOf Tools. All rights reserved.
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:underline underline-offset-4">Terms</Link>
          <Link href="/privacy" className="hover:underline underline-offset-4">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
