const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.NODE_ENV === "production" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("PayPal credentials missing");
  }

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();
  return data.access_token;
}

export async function createPayPalOrder(amount: string, currency: string = "USD") {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
        },
      ],
    }),
  });

  return await response.json();
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

export async function createPayPalSubscription(planId: string, userId: string, emailAddress?: string) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      plan_id: planId,
      custom_id: userId,
      subscriber: emailAddress ? {
        email_address: emailAddress
      } : undefined,
      application_context: {
        brand_name: "TheWordOf Tools",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=cancel`,
      }
    }),
  });

  return await response.json();
}

export async function cancelPayPalSubscription(subscriptionId: string, reason: string = "User requested cancellation") {
  const accessToken = await getAccessToken();
  const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: reason
    }),
  });

  if (response.status === 204) {
    return { success: true };
  }
  return await response.json();
}
