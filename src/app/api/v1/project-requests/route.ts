import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { projectRequestSchema } from "@/modules/projects/schemas";
import { createProjectRequest, userProjectRequests } from "@/modules/projects/request-service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  return NextResponse.json({ requests: await userProjectRequests(session.user.id) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const parsed = projectRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_REQUEST", issues: parsed.error.flatten() }, { status: 422 });
  }

  const projectRequest = await createProjectRequest(session.user.id, parsed.data);
  return NextResponse.json({ request: projectRequest }, { status: 201 });
}
