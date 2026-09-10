import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getProgrammeCatalog } from "@/lib/academic-catalog";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      profile: {
        select: {
          level: true,
          institution: { select: { name: true, slug: true } },
          program: { select: { name: true, slug: true } },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
  }

  const catalog = getProgrammeCatalog(user.profile?.program?.name);

  return NextResponse.json({
    programme: {
      name: user.profile?.program?.name ?? catalog.name,
      slug: user.profile?.program?.slug ?? catalog.key,
      level: user.profile?.level ?? null,
      institution: user.profile?.institution ?? null,
    },
    catalog,
  });
}
