import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { userProjectLibrary } from "@/modules/projects/service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const library = await userProjectLibrary(session.user.id);
  return NextResponse.json(library);
}
