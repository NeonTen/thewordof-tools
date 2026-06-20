"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  { name: "Rahul Sharma", role: "Digital Marketer", text: "Thanks to the AI Caption Generator, I cut my social media processing time in half and doubled our engagement rate." },
  { name: "Jessica Chen", role: "Frontend Developer", text: "The SVG Compressor is a lifesaver. It automatically minified 50+ icons for my project without any visible quality loss." },
  { name: "Priya Patel", role: "Content Creator", text: "The branded invoice generator literally got me paid faster. Professional, customized PDFs generated in literally 30 seconds." },
  { name: "Marcus Vance", role: "SEO Specialist", text: "My team's organic traffic jumped 15% after we started using the Schema Builder and Keyword Density analyzer." },
  { name: "Sarah Jenkins", role: "SaaS Founder", text: "Finally, a toolkit that doesn't require switching between 10 different tabs. We use the QR code and image tools daily." },
  { name: "David K.", role: "Freelance Copywriter", text: "The readability grader completely transformed my writing. It simplifies complex text instantly, making my copy convert way better." },
  { name: "Elena Rostova", role: "Graphic Designer", text: "Generating dynamic QR codes with live tracking analytics has been a massive value-add for my print campaigns." },
  { name: "Kenji Sato", role: "Growth Marketer", text: "Everything runs blazing fast entirely in the browser. Zero privacy concerns and massive productivity gains." },
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
