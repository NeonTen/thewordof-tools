import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency = "USD" } = await req.json();

    const order = await createPayPalOrder(amount, currency);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("[PAYPAL_CREATE_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal Error" },
      { status: 500 },
    );
  }
}
