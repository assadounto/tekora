import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { acquireFreeProject } from "@/modules/projects/service";

export async function POST(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId } = await params;
  const result = await acquireFreeProject(session.user.id, projectId);

  if (!result.ok) {
    const status = result.error === "PAYMENT_REQUIRED" ? 402 : 404;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, projectId });
}
