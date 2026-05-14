/**
 * Utility to track and enforce daily usage limits for free users using localStorage.
 */

export type UsageData = {
  date: string;
  count: number;
};

/**
 * Gets the current daily usage for a specific tool.
 * Resets automatically if the date has changed.
 */
export function getDailyUsage(toolKey: string): number {
  if (typeof window === "undefined") return 0;

  const today = new Date().toISOString().split("T")[0];
  const storageKey = `thewordof_usage_${toolKey}`;
  const rawData = localStorage.getItem(storageKey);

  if (!rawData) return 0;

  try {
    const data: UsageData = JSON.parse(rawData);
    if (data.date !== today) {
      // It's a new day, reset usage
      localStorage.removeItem(storageKey);
      return 0;
    }
    return data.count;
  } catch (e) {
    return 0;
  }
}

/**
 * Increments the daily usage count for a tool.
 */
export function incrementDailyUsage(toolKey: string, amount: number = 1): number {
  if (typeof window === "undefined") return 0;

  const today = new Date().toISOString().split("T")[0];
  const storageKey = `thewordof_usage_${toolKey}`;
  const currentCount = getDailyUsage(toolKey);
  const newCount = currentCount + amount;

  const newData: UsageData = {
    date: today,
    count: newCount,
  };

  localStorage.setItem(storageKey, JSON.stringify(newData));
  return newCount;
}

/**
 * Gets the current monthly usage for a specific tool.
 * Resets automatically if the month has changed.
 */
export function getMonthlyUsage(toolKey: string): number {
  if (typeof window === "undefined") return 0;

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const storageKey = `thewordof_monthly_usage_${toolKey}`;
  const rawData = localStorage.getItem(storageKey);

  if (!rawData) return 0;

  try {
    const data: UsageData = JSON.parse(rawData);
    if (data.date !== currentMonth) {
      localStorage.removeItem(storageKey);
      return 0;
    }
    return data.count;
  } catch (e) {
    return 0;
  }
}

/**
 * Increments the monthly usage count for a tool.
 */
export function incrementMonthlyUsage(toolKey: string, amount: number = 1): number {
  if (typeof window === "undefined") return 0;

  const currentMonth = new Date().toISOString().slice(0, 7);
  const storageKey = `thewordof_monthly_usage_${toolKey}`;
  const currentCount = getMonthlyUsage(toolKey);
  const newCount = currentCount + amount;

  const newData: UsageData = {
    date: currentMonth,
    count: newCount,
  };

  localStorage.setItem(storageKey, JSON.stringify(newData));
  return newCount;
}

/**
 * Checks if the user has reached their daily limit.
 */
export function isLimitReached(toolKey: string, limit: number): boolean {
  return getDailyUsage(toolKey) >= limit;
}
