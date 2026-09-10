import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { publishProject } from "@/modules/projects/service";

export async function POST(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId } = await params;
  const project = await publishProject(session.user.id, projectId);
  if (!project) {
    return NextResponse.json({ error: "PROJECT_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ project });
}
