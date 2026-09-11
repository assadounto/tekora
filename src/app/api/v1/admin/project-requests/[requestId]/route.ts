import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminUser } from "@/lib/admin";
import { updateProjectRequestStatus } from "@/modules/projects/request-service";

const statuses = ["SUBMITTED", "REVIEWING", "APPROVED", "DECLINED", "FULFILLED"] as const;

type RequestStatus = typeof statuses[number];

export async function PATCH(request: Request, { params }: { params: Promise<{ requestId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!(await isAdminUser(session.user.id))) return NextResponse.json({ error: "ADMIN_REQUIRED" }, { status: 403 });

  const body = await request.json().catch(() => null) as { status?: string } | null;
  if (!body?.status || !statuses.includes(body.status as RequestStatus)) {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const { requestId } = await params;
  try {
    const projectRequest = await updateProjectRequestStatus(requestId, body.status as RequestStatus);
    return NextResponse.json({ request: projectRequest });
  } catch {
    return NextResponse.json({ error: "REQUEST_NOT_FOUND" }, { status: 404 });
  }
}
