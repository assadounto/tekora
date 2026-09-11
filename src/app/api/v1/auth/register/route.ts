import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(80),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
    .regex(/[A-Za-z]/, "Password must contain a letter.")
    .regex(/[0-9]/, "Password must contain a number."),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() }, { status: 422 });
  }

  const email = parsed.data.email.toLowerCase();

  try {
    const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return NextResponse.json({ error: "EMAIL_IN_USE" }, { status: 409 });

    const passwordHash = await hash(parsed.data.password, 12);
    const adminEmail = process.env.TEKORA_ADMIN_EMAIL?.trim().toLowerCase();
    const roles = adminEmail === email ? ["LEARNER" as const, "ADMIN" as const] : ["LEARNER" as const];

    const user = await db.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        roles: { create: roles.map((role) => ({ role })) },
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "EMAIL_IN_USE" }, { status: 409 });
    }

    console.error("Registration error", error);
    return NextResponse.json({ error: "REGISTRATION_FAILED" }, { status: 500 });
  }
}
