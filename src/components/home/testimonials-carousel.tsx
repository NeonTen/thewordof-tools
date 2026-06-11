"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  { name: "Rahul Sharma", role: "Digital Marketer", text: "The AI Caption Generator has saved me hours. The captions are actually high quality and viral-ready." },
  { name: "Jessica Chen", role: "Frontend Developer", text: "The SVG Compressor and Image Converter are my go-to tools now. Super fast and no quality loss." },
  { name: "Priya Patel", role: "Content Creator", text: "I love the branded invoice generator and LLMs.txt builder. This toolkit is a complete game-changer." },
  { name: "Marcus Vance", role: "SEO Specialist", text: "The readability grader and schema builder have significantly boosted our optimization workflow." },
  { name: "Sarah Jenkins", role: "SaaS Founder", text: "Having all these quick utilities in one place without signing up for 10 different sites is amazing." },
  { name: "David K.", role: "Freelance Copywriter", text: "The readability improvements feature is a lifesaver. My text gets simplified in seconds without losing style." },
  { name: "Elena Rostova", role: "Graphic Designer", text: "Generating dynamic QR codes with expiration limits is extremely handy for my marketing campaigns." },
  { name: "Kenji Sato", role: "Growth Marketer", text: "Simple, fast, and secure. Everything processed inside the browser feels incredibly snappy." },
]

export function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Get 3 visible items starting from activeIndex
  const visibleTestimonials = [
    testimonials[activeIndex],
    testimonials[(activeIndex + 1) % testimonials.length],
    testimonials[(activeIndex + 2) % testimonials.length],
  ]

  return (
    <div className="space-y-8 relative">
      {/* Testimonials grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {visibleTestimonials.map((item, idx) => (
          <Card 
            key={idx} 
            className={cn(
              "bg-muted/30 border-none shadow-none p-8 space-y-6 relative overflow-hidden transition-all duration-300 h-full flex flex-col justify-between",
              idx > 0 && "hidden md:block" // hide 2nd and 3rd on mobile
            )}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Star className="h-20 w-20 fill-primary text-primary" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="italic text-base">&ldquo;{item.text}&rdquo;</p>
            </div>
            <div className="pt-4 border-t border-border/50 mt-auto">
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.role}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation controls */}
      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          onClick={prev}
          className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer bg-card"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {/* Dots */}
        <div className="flex gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                activeIndex === i ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer bg-card"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
