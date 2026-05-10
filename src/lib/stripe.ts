import Stripe from "stripe"

const apiKey = process.env.STRIPE_SECRET_KEY

export const stripe = apiKey 
  ? new Stripe(apiKey, {
      // @ts-ignore
      apiVersion: null, 
      typescript: true,
    })
  : null as any
