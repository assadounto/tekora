import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { onboardingSchema } from "@/modules/identity/schemas";
import { createTekoraIdentity } from "@/modules/identity/service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const user = await createTekoraIdentity(parsed.data);
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "IDENTITY_ALREADY_EXISTS", message: "Email or username is already in use." },
        { status: 409 }
      );
    }

    console.error("Onboarding error", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
