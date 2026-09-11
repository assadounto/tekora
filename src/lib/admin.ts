import { db } from "@/lib/db";

export async function isAdminUser(userId: string) {
  const role = await db.userRoleLink.findUnique({
    where: { userId_role: { userId, role: "ADMIN" } },
    select: { id: true },
  });
  return Boolean(role);
}

export async function requireAdminUser(userId: string) {
  const allowed = await isAdminUser(userId);
  if (!allowed) throw new Error("ADMIN_REQUIRED");
}
