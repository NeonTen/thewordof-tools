import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency = "INR" } = await req.json();

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise for INR)
      currency,
      receipt: `rcpt_${Date.now()}_${session.user.id.slice(-10)}`,
    };

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys are missing");
      return NextResponse.json({ error: "Razorpay credentials not configured" }, { status: 500 });
    }

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("[RAZORPAY_ORDER_ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
