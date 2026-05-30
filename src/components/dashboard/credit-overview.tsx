import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreditOverviewProps {
  creditsRemaining: number
  creditsMax: number
  resetDate: Date
  isFree: boolean
}

export function CreditOverview({ creditsRemaining, creditsMax, resetDate, isFree }: CreditOverviewProps) {
  const usagePercent = Math.max(0, Math.min(100, (creditsRemaining / creditsMax) * 100))
  const formattedReset = new Date(resetDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })

  const isLow = usagePercent < 10

  return (
    <Card className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background border-primary/20 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-amber-500 fill-amber-500" /> AI Usage Credits
        </CardTitle>
        <span 
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
            isLow 
              ? "bg-red-500/10 text-red-600 dark:text-red-400" 
              : "bg-green-500/10 text-green-600 dark:text-green-400"
          )}
        >
          {isLow ? "Low Credits" : `${Math.round(usagePercent)}% Available`}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-black tracking-tight">{creditsRemaining}</span>
          <span className="text-sm text-muted-foreground font-semibold">/ {creditsMax} remaining</span>
        </div>
        <Progress value={usagePercent} className="h-2.5 bg-muted" />
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
          <span>Resets on {formattedReset}</span>
          {isFree && (
            <a href="/pricing" className="text-primary font-bold hover:underline transition-colors">
              Get more credits &rarr;
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
