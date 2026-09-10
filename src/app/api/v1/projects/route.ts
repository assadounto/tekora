import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createProjectSchema } from "@/modules/projects/schemas";
import { createProject, listPublishedProjects } from "@/modules/projects/service";

export async function GET() {
  const projects = await listPublishedProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_PROJECT", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const project = await createProject(session.user.id, parsed.data);
  return NextResponse.json({ project }, { status: 201 });
}
