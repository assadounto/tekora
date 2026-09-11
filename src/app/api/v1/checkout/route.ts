import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { initializeCheckout, type CheckoutTarget } from "@/modules/payments/service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const body = await request.json().catch(() => null) as { targetType?: CheckoutTarget; targetId?: string } | null;
  if (!body?.targetId || !body.targetType || !["PROJECT", "COURSE"].includes(body.targetType)) {
    return NextResponse.json({ error: "INVALID_CHECKOUT" }, { status: 400 });
  }

  try {
    const result = await initializeCheckout(session.user.id, body.targetType, body.targetId);
    if (!result.ok) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "PAYSTACK_NOT_CONFIGURED") {
      return NextResponse.json({ error: "PAYSTACK_NOT_CONFIGURED" }, { status: 503 });
    }
    return NextResponse.json({ error: "CHECKOUT_FAILED" }, { status: 500 });
  }
}
