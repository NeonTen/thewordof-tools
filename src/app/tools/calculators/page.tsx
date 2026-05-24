import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Percent, 
  Coins, 
  Scale, 
  Monitor, 
  Type, 
  FileCode, 
  TrendingUp, 
  Briefcase,
  Palette
} from "lucide-react"

export const metadata = {
  title: "Interactive Calculators Suite | TheWordOf Tools",
  description: "A comprehensive collection of free finance, design, utility, and health calculators.",
}

const calculators = [
  {
    title: "EMI Calculator",
    description: "Calculate your monthly EMI payments for home, car, or personal loans.",
    href: "/tools/calculators/emi",
    icon: Percent,
    category: "Finance",
  },
  {
    title: "SIP / Mutual Fund",
    description: "Project future returns of your Systematic Investment Plan (SIP) investments.",
    href: "/tools/calculators/sip",
    icon: Coins,
    category: "Finance",
  },
  {
    title: "Compound Interest",
    description: "Calculate compound interest returns with annual inflation adjustments.",
    href: "/tools/calculators/compound-interest",
    icon: TrendingUp,
    category: "Finance",
  },
  {
    title: "Salary to Hourly Converter",
    description: "Convert annual/monthly salary to hourly rates, daily rates, and vice-versa.",
    href: "/tools/calculators/salary-to-hourly",
    icon: Briefcase,
    category: "Finance",
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index (BMI) using metric or imperial units.",
    href: "/tools/calculators/bmi",
    icon: Scale,
    category: "Health",
  },
  {
    title: "Aspect Ratio Calculator",
    description: "Compute dimension resizes and aspect ratios for layouts and images.",
    href: "/tools/calculators/aspect-ratio",
    icon: Monitor,
    category: "Developer",
  },
  {
    title: "Line-height Converter",
    description: "Convert line-height pixels, rems, or percentages into relative CSS values.",
    href: "/tools/calculators/line-height",
    icon: Type,
    category: "Developer",
  },
  {
    title: "PX to REM Converter",
    description: "Convert pixels to REM units bidirectionally with a Tailwind CSS utility lookup sheet.",
    href: "/tools/calculators/px-to-rem",
    icon: FileCode,
    category: "Developer",
  },
  {
    title: "GST Calculator",
    description: "Calculate regional Goods and Services Tax (GST) for baseline or gross sums.",
    href: "/tools/gst-calculator",
    icon: Percent,
    category: "Finance",
  },
  {
    title: "Word Counter",
    description: "Get real-time statistics including word, character, and line counts with reading time.",
    href: "/tools/word-counter",
    icon: Type,
    category: "Developer",
  },
  {
    title: "HEX/RGB/HSL Converter",
    description: "Convert colors between different spaces with interactive sliders and a visual picker.",
    href: "/tools/color-converter",
    icon: Palette,
    category: "Developer",
  },
]

export default function CalculatorsPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Interactive Calculators</h1>
        <p className="text-muted-foreground mt-2 text-base">
          A premium suite of tools for finance planning, design utilities, and health tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((calc) => {
          const Icon = calc.icon
          return (
            <Link key={calc.href} href={calc.href} className="group block h-full">
              <Card className="h-full border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {calc.category}
                    </span>
                    <CardTitle className="text-lg font-black group-hover:text-primary transition-colors duration-200 mt-1">
                      {calc.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {calc.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
