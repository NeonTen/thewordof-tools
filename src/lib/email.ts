import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;

export async function sendPaymentSuccessEmail({
  toEmail,
  userName,
  planName,
  amount,
  currency,
  orderId,
  paymentProvider
}: {
  toEmail: string;
  userName: string;
  planName: string;
  amount: number;
  currency: string;
  orderId: string;
  paymentProvider: string;
}) {
  if (!resendKey) {
    console.warn("RESEND_API_KEY not found. Skipping success email delivery.");
    return;
  }

  const resend = new Resend(resendKey);
  const isBusiness = planName.toUpperCase() === "BUSINESS";
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency === 'INR' ? 'INR' : 'USD'
  }).format(amount);

  const brandColor = isBusiness ? "#6366f1" : "#f59e0b"; // Indigo for Business, Amber for Pro
  const badgeText = isBusiness ? "Business" : "Pro";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.thewordof.com";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to TheWordOf Tools ${badgeText}!</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #fafafa; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { padding: 40px; background: linear-gradient(135deg, ${brandColor}10, ${brandColor}05); border-bottom: 1px solid #f3f4f6; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.05em; color: #111827; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background-color: ${brandColor}; color: #ffffff; margin-top: 8px; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 800; margin-bottom: 16px; }
        .intro { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
        .receipt { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .receipt-row:last-child { margin-bottom: 0; border-top: 1px solid #e5e7eb; padding-top: 12px; font-weight: 800; }
        .receipt-label { color: #6b7280; }
        .receipt-value { color: #111827; font-family: monospace; }
        .cta-button { display: inline-block; width: 100%; text-align: center; background-color: #111827; color: #ffffff !important; text-decoration: none; padding: 14px; font-weight: 800; font-size: 15px; border-radius: 12px; margin-top: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .footer { padding: 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; background-color: #f9fafb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TheWordOf Tools</div>
          <div class="badge">${badgeText} Active</div>
        </div>
        <div class="content">
          <div class="greeting">Hey ${userName || "there"},</div>
          <p class="intro">
            Thank you for upgrading! Your subscription to <strong>TheWordOf Tools ${badgeText}</strong> has been successfully activated. You now have full, unrestricted access to our growing suite of premium AI utilities.
          </p>
          
          <div class="receipt">
            <div class="receipt-row">
              <span class="receipt-label">Plan</span>
              <span class="receipt-value" style="font-weight: bold; text-transform: uppercase;">${planName}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Provider</span>
              <span class="receipt-value">${paymentProvider}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Reference ID</span>
              <span class="receipt-value" style="font-size: 12px;">${orderId}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Total Paid</span>
              <span class="receipt-value" style="font-size: 16px; color: ${brandColor}; font-weight: 900;">${formattedAmount}</span>
            </div>
          </div>

          <p class="intro">
            Your daily limits have been successfully lifted. Try building high-fidelity SEO schemas, generating unlimited image conversions, minifying CSS blocks, or creating viral social captions right away!
          </p>

          <a href="${baseUrl}/dashboard" class="cta-button">Go to Dashboard</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TheWordOf Tools. All rights reserved.<br />
          Need help? Reach out directly to <a href="mailto:support@thewordof.com" style="color: #4b5563;">support@thewordof.com</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Pro/Business Upgrade Notification</title>
      <style>
        body { font-family: sans-serif; padding: 20px; line-height: 1.5; color: #333; }
        .receipt { border: 1px solid #ccc; padding: 15px; border-radius: 8px; max-width: 500px; background: #fafafa; }
        .receipt-row { margin-bottom: 8px; }
        .receipt-label { font-weight: bold; }
      </style>
    </head>
    <body>
      <h2>🎉 New Subscription Upgrade!</h2>
      <p>A user has successfully upgraded to TheWordOf Tools <strong>${badgeText}</strong>.</p>
      <div class="receipt">
        <div class="receipt-row"><span class="receipt-label">User Name:</span> ${userName || "N/A"}</div>
        <div class="receipt-row"><span class="receipt-label">User Email:</span> ${toEmail}</div>
        <div class="receipt-row"><span class="receipt-label">Plan Name:</span> ${planName}</div>
        <div class="receipt-row"><span class="receipt-label">Payment Provider:</span> ${paymentProvider}</div>
        <div class="receipt-row"><span class="receipt-label">Reference ID:</span> ${orderId}</div>
        <div class="receipt-row"><span class="receipt-label">Total Paid:</span> ${formattedAmount}</div>
        <div class="receipt-row"><span class="receipt-label">Date/Time:</span> ${new Date().toISOString()}</div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "TheWordOf Tools <noreply@thewordof.com>",
      to: toEmail,
      subject: `Payment Successful! Welcome to TheWordOf Tools ${badgeText} 🎉`,
      html
    });
  } catch (err) {
    console.error("Failed to deliver success email to user:", err);
  }

  try {
    await resend.emails.send({
      from: "TheWordOf Tools Notifications <noreply@thewordof.com>",
      to: "info@thewordof.com",
      subject: `[Admin Notification] New Subscription Activated — ${badgeText}`,
      html: adminHtml
    });
  } catch (err) {
    console.error("Failed to deliver success email notification to admin:", err);
  }
}

export async function sendPaymentFailedEmail({
  toEmail,
  userName,
  planName,
  amount,
  currency,
  paymentProvider,
  errorMsg
}: {
  toEmail: string;
  userName: string;
  planName: string;
  amount: number;
  currency: string;
  paymentProvider: string;
  errorMsg?: string;
}) {
  if (!resendKey) {
    console.warn("RESEND_API_KEY not found. Skipping failed email delivery.");
    return;
  }

  const resend = new Resend(resendKey);
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency === 'INR' ? 'INR' : 'USD'
  }).format(amount);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.thewordof.com";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Attempt Failed</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #fafafa; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { padding: 40px; background: linear-gradient(135deg, #ef444410, #ef444405); border-bottom: 1px solid #f3f4f6; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.05em; color: #111827; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background-color: #ef4444; color: #ffffff; margin-top: 8px; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 800; margin-bottom: 16px; }
        .intro { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
        .details { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
        .details-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .details-label { color: #6b7280; }
        .details-value { color: #111827; font-family: monospace; }
        .cta-button { display: inline-block; width: 100%; text-align: center; background-color: #111827; color: #ffffff !important; text-decoration: none; padding: 14px; font-weight: 800; font-size: 15px; border-radius: 12px; margin-top: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .footer { padding: 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; background-color: #f9fafb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TheWordOf Tools</div>
          <div class="badge">Payment Failed</div>
        </div>
        <div class="content">
          <div class="greeting">Hey ${userName || "there"},</div>
          <p class="intro">
            We noticed an issue with your recent payment attempt for <strong>TheWordOf Tools ${planName}</strong> subscription. Don't worry—no charges were captured, and your free account remains fully active.
          </p>
          
          <div class="details">
            <div class="details-row">
              <span class="details-label">Intended Plan</span>
              <span class="details-value" style="font-weight: bold; text-transform: uppercase;">${planName}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Amount</span>
              <span class="details-value">${formattedAmount}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Gateway</span>
              <span class="details-value">${paymentProvider}</span>
            </div>
            ${errorMsg ? `
            <div class="details-row" style="margin-top: 12px; border-top: 1px solid #e5e7eb; padding-top: 12px; flex-direction: column; gap: 4px;">
              <span class="details-label" style="display: block;">Decline Reason</span>
              <span class="details-value" style="color: #ef4444; word-break: break-all; display: block; font-size: 12px;">${errorMsg}</span>
            </div>
            ` : ''}
          </div>

          <p class="intro">
            Please double-check your payment credentials or try an alternative method. If you believe this is an error or are having trouble completing the transaction, reach out to our team at any time!
          </p>

          <a href="${baseUrl}/pricing" class="cta-button">Try Again</a>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TheWordOf Tools. All rights reserved.<br />
          Need support? Contact <a href="mailto:support@thewordof.com" style="color: #4b5563;">support@thewordof.com</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Attempt Failed Alert</title>
      <style>
        body { font-family: sans-serif; padding: 20px; line-height: 1.5; color: #333; }
        .details { border: 1px solid #ccc; padding: 15px; border-radius: 8px; max-width: 500px; background: #fafafa; }
        .details-row { margin-bottom: 8px; }
        .details-label { font-weight: bold; }
      </style>
    </head>
    <body>
      <h2>⚠️ Payment Attempt Failed</h2>
      <p>A checkout attempt has failed on the site.</p>
      <div class="details">
        <div class="details-row"><span class="details-label">User Name:</span> ${userName || "N/A"}</div>
        <div class="details-row"><span class="details-label">User Email:</span> ${toEmail}</div>
        <div class="details-row"><span class="details-label">Intended Plan:</span> ${planName}</div>
        <div class="details-row"><span class="details-label">Payment Provider:</span> ${paymentProvider}</div>
        <div class="details-row"><span class="details-label">Amount:</span> ${formattedAmount}</div>
        <div class="details-row"><span class="details-label">Error/Reason:</span> ${errorMsg || "None specified"}</div>
        <div class="details-row"><span class="details-label">Date/Time:</span> ${new Date().toISOString()}</div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "TheWordOf Tools <noreply@thewordof.com>",
      to: toEmail,
      subject: `Payment Attempt Failed: TheWordOf Tools ${planName} ⚠️`,
      html
    });
  } catch (err) {
    console.error("Failed to deliver failure email to user:", err);
  }

  try {
    await resend.emails.send({
      from: "TheWordOf Tools Notifications <noreply@thewordof.com>",
      to: "info@thewordof.com",
      subject: `[Admin Notification] Payment Failed — ${planName}`,
      html: adminHtml
    });
  } catch (err) {
    console.error("Failed to deliver failure email notification to admin:", err);
  }
}

export async function sendPasswordResetEmail({
  toEmail,
  token,
}: {
  toEmail: string;
  token: string;
}) {
  if (!resendKey) {
    console.warn("RESEND_API_KEY not found. Skipping reset email delivery.");
    return;
  }

  const resend = new Resend(resendKey);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.thewordof.com";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset your password — TheWordOf Tools</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #fafafa; color: #1f2937; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { padding: 40px; background: linear-gradient(135deg, #11182710, #11182705); border-bottom: 1px solid #f3f4f6; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: -0.05em; color: #111827; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 800; margin-bottom: 16px; }
        .intro { font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }
        .cta-button { display: inline-block; text-align: center; background-color: #111827; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-weight: 800; font-size: 15px; border-radius: 12px; margin-top: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .footer { padding: 24px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; background-color: #f9fafb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TheWordOf Tools</div>
        </div>
        <div class="content">
          <div class="greeting">Hello,</div>
          <p class="intro">
            We received a request to reset the password for your account. Please click the button below to choose a new password. This link is valid for 1 hour.
          </p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="cta-button">Reset Password</a>
          </div>
          <p class="intro" style="margin-top: 24px;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} TheWordOf Tools. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: "TheWordOf Tools <noreply@thewordof.com>",
      to: toEmail,
      subject: "Reset your password — TheWordOf Tools",
      html
    });
  } catch (err) {
    console.error("Failed to deliver reset email:", err);
  }
}
