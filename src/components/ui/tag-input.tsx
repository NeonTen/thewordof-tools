import React, { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
}

export function TagInput({ tags, onChange, placeholder = "Type tag and press Enter...", className }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const addTag = () => {
    const trimmed = inputValue.trim().replace(/,$/, "")
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
      setInputValue("")
    }
  }

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div 
      className={`flex flex-wrap gap-1.5 p-2 bg-muted/30 border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all ${className || ""}`}
    >
      {tags.map((tag, idx) => (
        <span 
          key={idx} 
          className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-lg border border-primary/20"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(idx)}
            className="text-primary/70 hover:text-primary hover:bg-primary/25 rounded p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 bg-transparent border-0 outline-none focus:ring-0 p-0 text-sm min-w-[100px] text-foreground placeholder:text-muted-foreground/60"
      />
    </div>
  )
}
