import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "LEGACY_ONBOARDING_DISABLED",
      message: "Create a Tekora account with email and password at /sign-up.",
    },
    { status: 410 }
  );
}
