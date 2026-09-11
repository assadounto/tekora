import { db } from "@/lib/db";

export type CheckoutTarget = "PROJECT" | "COURSE";

type PaystackVerifyData = {
  status?: string;
  amount?: number;
  currency?: string;
  metadata?: unknown;
};

function parseMetadata(value: unknown) {
  if (!value) return {} as Record<string, unknown>;
  if (typeof value === "string") {
    try { return JSON.parse(value) as Record<string, unknown>; } catch { return {}; }
  }
  if (typeof value === "object") return value as Record<string, unknown>;
  return {};
}

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_NOT_CONFIGURED");
  return key;
}

export async function initializeCheckout(userId: string, targetType: CheckoutTarget, targetId: string) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
  if (!user) return { ok: false as const, error: "USER_NOT_FOUND" as const };

  let amount = 0;
  let currency = "GHS";
  let returnPath = "/dashboard";

  if (targetType === "PROJECT") {
    const project = await db.project.findFirst({ where: { id: targetId, status: "PUBLISHED" } });
    if (!project) return { ok: false as const, error: "PROJECT_NOT_FOUND" as const };
    if (project.access !== "PAID" || !project.price) return { ok: false as const, error: "PROJECT_NOT_PAID" as const };
    const existing = await db.projectEntitlement.findUnique({ where: { userId_projectId: { userId, projectId: targetId } } });
    if (existing || project.creatorId === userId) return { ok: true as const, alreadyHasAccess: true, redirect: `/projects/${project.slug}` };
    amount = project.price;
    currency = project.currency;
    returnPath = `/projects/${project.slug}`;
  } else {
    const course = await db.course.findFirst({ where: { id: targetId, status: "PUBLISHED" } });
    if (!course) return { ok: false as const, error: "COURSE_NOT_FOUND" as const };
    if (course.access !== "PAID" || !course.price) return { ok: false as const, error: "COURSE_NOT_PAID" as const };
    const existing = await db.enrollment.findUnique({ where: { userId_courseId: { userId, courseId: targetId } } });
    if (existing) return { ok: true as const, alreadyHasAccess: true, redirect: `/learn/course/${course.id}` };
    amount = course.price;
    currency = course.currency;
    returnPath = `/learn/course/${course.id}`;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const reference = `TK-${targetType}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: String(amount),
      currency,
      reference,
      callback_url: `${baseUrl}/checkout/verify`,
      metadata: JSON.stringify({ userId, targetType, targetId, returnPath }),
    }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null) as { status?: boolean; data?: { authorization_url?: string; reference?: string } } | null;
  if (!response.ok || !payload?.status || !payload.data?.authorization_url) {
    return { ok: false as const, error: "PAYSTACK_INITIALIZE_FAILED" as const };
  }

  return {
    ok: true as const,
    authorizationUrl: payload.data.authorization_url,
    reference: payload.data.reference ?? reference,
  };
}

export async function verifyCheckout(userId: string, reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null) as { status?: boolean; data?: PaystackVerifyData } | null;
  if (!response.ok || !payload?.status || payload.data?.status !== "success") {
    return { ok: false as const, error: "PAYMENT_NOT_SUCCESSFUL" as const };
  }

  const metadata = parseMetadata(payload.data.metadata);
  const metadataUserId = String(metadata.userId ?? "");
  const targetType = String(metadata.targetType ?? "") as CheckoutTarget;
  const targetId = String(metadata.targetId ?? "");
  if (metadataUserId !== userId || !["PROJECT", "COURSE"].includes(targetType) || !targetId) {
    return { ok: false as const, error: "INVALID_PAYMENT_METADATA" as const };
  }

  if (targetType === "PROJECT") {
    const project = await db.project.findFirst({ where: { id: targetId, status: "PUBLISHED", access: "PAID" } });
    if (!project?.price) return { ok: false as const, error: "PROJECT_NOT_FOUND" as const };
    if (payload.data.amount !== project.price || String(payload.data.currency ?? "").toUpperCase() !== project.currency.toUpperCase()) {
      return { ok: false as const, error: "PAYMENT_MISMATCH" as const };
    }
    await db.projectEntitlement.upsert({
      where: { userId_projectId: { userId, projectId: project.id } },
      update: { acquisition: "PURCHASE", amountPaid: project.price, currency: project.currency },
      create: { userId, projectId: project.id, acquisition: "PURCHASE", amountPaid: project.price, currency: project.currency },
    });
    return { ok: true as const, redirect: `/projects/${project.slug}` };
  }

  const course = await db.course.findFirst({ where: { id: targetId, status: "PUBLISHED", access: "PAID" } });
  if (!course?.price) return { ok: false as const, error: "COURSE_NOT_FOUND" as const };
  if (payload.data.amount !== course.price || String(payload.data.currency ?? "").toUpperCase() !== course.currency.toUpperCase()) {
    return { ok: false as const, error: "PAYMENT_MISMATCH" as const };
  }
  await db.enrollment.upsert({
    where: { userId_courseId: { userId, courseId: course.id } },
    update: {},
    create: { userId, courseId: course.id },
  });
  return { ok: true as const, redirect: `/learn/course/${course.id}` };
}
