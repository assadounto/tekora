import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "tekora",
    api: "v1",
    timestamp: new Date().toISOString(),
  });
}
