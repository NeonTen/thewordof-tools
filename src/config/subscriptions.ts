export const SUBSCRIPTION_PLANS = {
  paypal: {
    PRO_MONTHLY: process.env.PAYPAL_PLAN_PRO_MONTHLY || "",
    PRO_YEARLY: process.env.PAYPAL_PLAN_PRO_YEARLY || "",
    BUSINESS_MONTHLY: process.env.PAYPAL_PLAN_BUSINESS_MONTHLY || "",
    BUSINESS_YEARLY: process.env.PAYPAL_PLAN_BUSINESS_YEARLY || "",
  },
  razorpay: {
    PRO_MONTHLY: process.env.RAZORPAY_PLAN_PRO_MONTHLY || "",
    PRO_YEARLY: process.env.RAZORPAY_PLAN_PRO_YEARLY || "",
    BUSINESS_MONTHLY: process.env.RAZORPAY_PLAN_BUSINESS_MONTHLY || "",
    BUSINESS_YEARLY: process.env.RAZORPAY_PLAN_BUSINESS_YEARLY || "",
  }
};
