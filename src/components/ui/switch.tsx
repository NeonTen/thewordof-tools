"use client"

import * as React from "react"
import { Switch as BaseSwitch } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof BaseSwitch.Root>,
  React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>
>(({ className, ...props }, ref) => (
  // Base UI Switch renders a <span> by default which supports enclosing labels.
  // Use nativeButton + render={<button />} for label siblings (htmlFor/id pattern).
  <BaseSwitch.Root
    nativeButton
    render={<button type="button" />}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-primary/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=not-checked]:bg-muted data-[state=not-checked]:border-muted-foreground/30 shadow-inner",
      className
    )}
    {...props}
    ref={ref}
  >
    <BaseSwitch.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=not-checked]:translate-x-0 border border-black/5"
      )}
    />
  </BaseSwitch.Root>
))
Switch.displayName = "Switch"

export { Switch }
