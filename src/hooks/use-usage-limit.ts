import { useState, useEffect, useCallback } from "react"
import { getMonthlyUsage, incrementMonthlyUsage, getDailyUsage, incrementDailyUsage } from "@/lib/usage-limit"

export function useUsageLimit(toolKey: string, period: "daily" | "monthly" = "daily") {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch(`/api/usage?toolKey=${toolKey}&period=${period}`)
      if (res.ok) {
        const data = await res.json()
        setCount(data.count)
      } else {
        throw new Error("API call unsuccessful")
      }
    } catch (e) {
      // Safe fallback to local storage
      console.warn("Failed to fetch usage from server, falling back to LocalStorage:", e)
      setCount(period === "daily" ? getDailyUsage(toolKey) : getMonthlyUsage(toolKey))
    } finally {
      setLoading(false)
    }
  }, [toolKey, period])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsage()
  }, [fetchUsage])

  const increment = useCallback(async (amount: number = 1) => {
    try {
      const res = await fetch(`/api/usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolKey, period, amount }),
      })
      if (res.ok) {
        const data = await res.json()
        setCount(data.count)
        return data.count
      }
    } catch (e) {
      console.error("Failed to increment usage on server, falling back to LocalStorage:", e)
    }
    
    // Fallback
    const newCount = period === "daily" 
      ? incrementDailyUsage(toolKey, amount) 
      : incrementMonthlyUsage(toolKey, amount)
    setCount(newCount)
    return newCount
  }, [toolKey, period])

  return { count, increment, loading, refresh: fetchUsage }
}
