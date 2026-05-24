"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  label?: string
  value: string
  onChange: (color: string) => void
  className?: string
  id?: string
}

export function ColorPicker({
  label,
  value,
  onChange,
  className,
  id = "color-picker",
}: ColorPickerProps) {
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Validate simple hex format if they type it in manually
    if (/^#[0-9A-F]{6}$/i.test(val) || val === "") {
      onChange(val)
    } else if (val.startsWith("#") && val.length <= 7) {
      onChange(val)
    } else if (!val.startsWith("#") && val.length <= 6) {
      onChange(`#${val}`)
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">{label}</Label>}
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border cursor-pointer shadow-sm hover:scale-105 transition-transform">
          <input
            type="color"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-none p-0 outline-none"
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={handleHexChange}
          placeholder="#ffffff"
          className="font-mono text-sm max-w-[120px]"
          maxLength={7}
        />
      </div>
    </div>
  )
}
