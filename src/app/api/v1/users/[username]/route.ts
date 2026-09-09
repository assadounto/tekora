import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Props = { params: Promise<{ username: string }> };

export async function GET(_: Request, { params }: Props) {
  const { username } = await params;
  const user = await db.user.findUnique({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      username: true,
      name: true,
      bio: true,
      headline: true,
      location: true,
      avatarUrl: true,
      roles: { select: { role: true } },
      profile: {
        select: {
          level: true,
          goal: true,
          institution: { select: { name: true, country: true } },
          program: { select: { name: true } },
        },
      },
      skills: {
        select: { level: true, verified: true, skill: { select: { name: true, slug: true } } },
      },
      interests: { select: { interest: { select: { name: true, slug: true } } } },
    },
  });

  if (!user) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ data: user });
}
