export const PLAN_PRICING = {
  FREE: {
    name: "Free",
    credits: 20,
    monthly: { INR: 0, USD: 0 },
    yearly: { INR: 0, USD: 0 },
  },
  PREMIUM: { // UI calls this Pro
    name: "Pro",
    credits: 500,
    monthly: { INR: 499, USD: 5.99 },
    yearly: { INR: 4999, USD: 59.99 },
  },
  BUSINESS: {
    name: "Business",
    credits: 2000,
    monthly: { INR: 1499, USD: 19.99 },
    yearly: { INR: 14999, USD: 199.99 },
  }
} as const;
