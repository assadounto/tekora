import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";
import { publishProject } from "@/modules/projects/service";

export async function POST(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!(await isAdminUser(session.user.id))) return NextResponse.json({ error: "ADMIN_REQUIRED" }, { status: 403 });

  const { projectId } = await params;
  const project = await publishProject(session.user.id, projectId);
  if (!project) return NextResponse.json({ error: "PROJECT_NOT_FOUND" }, { status: 404 });

  return NextResponse.json({ project });
}
