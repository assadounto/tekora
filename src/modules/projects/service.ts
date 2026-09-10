import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import type { CreateProjectInput } from "./schemas";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const defaultPhases = [
  ["Understand", "Clarify the problem, expected outcome and the main concepts behind the project."],
  ["Plan", "Define the architecture, tools, components, materials and implementation approach."],
  ["Build", "Assemble, fabricate or implement the core system one part at a time."],
  ["Program / Configure", "Add the software, control logic, configuration or calculations required by the build."],
  ["Test", "Verify the project against its expected behavior and record the results."],
  ["Document", "Explain what you built, what worked, limitations, improvements and evidence for presentation or portfolio use."],
] as const;

export async function createProject(creatorId: string, input: CreateProjectInput) {
  const suffix = randomUUID().slice(0, 8);
  const slug = `${slugify(input.title) || "project"}-${suffix}`;

  return db.project.create({
    data: {
      title: input.title,
      slug,
      summary: input.summary,
      description: input.description,
      field: input.field,
      area: input.area,
      difficulty: input.difficulty,
      modes: input.modes,
      access: input.access,
      price: input.access === "PAID" ? input.price : null,
      currency: input.currency.toUpperCase(),
      creatorId,
      phases: {
        create: defaultPhases.map(([title, description], index) => ({
          title,
          description,
          position: index + 1,
        })),
      },
      entitlements: {
        create: {
          userId: creatorId,
          acquisition: "OWNER",
        },
      },
    },
    include: { phases: { orderBy: { position: "asc" } } },
  });
}

export async function publishProject(userId: string, projectId: string) {
  const project = await db.project.findFirst({ where: { id: projectId, creatorId: userId } });
  if (!project) return null;

  return db.project.update({
    where: { id: projectId },
    data: { status: "PUBLISHED", publishedAt: project.publishedAt ?? new Date() },
  });
}

export async function listPublishedProjects() {
  return db.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: {
      creator: { select: { id: true, name: true, username: true } },
      _count: { select: { entitlements: true, favorites: true } },
    },
  });
}

export async function publicProject(slug: string) {
  return db.project.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      creator: { select: { id: true, name: true, username: true, headline: true } },
      phases: { orderBy: { position: "asc" } },
      components: { orderBy: { position: "asc" } },
      _count: { select: { entitlements: true, favorites: true } },
    },
  });
}

export async function acquireFreeProject(userId: string, projectId: string) {
  const project = await db.project.findFirst({ where: { id: projectId, status: "PUBLISHED" } });
  if (!project) return { ok: false as const, error: "PROJECT_NOT_FOUND" as const };

  if (project.creatorId === userId) {
    return { ok: true as const, project };
  }

  if (project.access === "PAID") {
    return { ok: false as const, error: "PAYMENT_REQUIRED" as const, project };
  }

  await db.projectEntitlement.upsert({
    where: { userId_projectId: { userId, projectId } },
    update: {},
    create: { userId, projectId, acquisition: "FREE" },
  });

  return { ok: true as const, project };
}

export async function userProjectLibrary(userId: string) {
  const [created, acquired] = await Promise.all([
    db.project.findMany({
      where: { creatorId: userId },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { entitlements: true } } },
    }),
    db.projectEntitlement.findMany({
      where: { userId, acquisition: { in: ["FREE", "PURCHASE"] } },
      orderBy: { acquiredAt: "desc" },
      include: {
        project: {
          include: {
            creator: { select: { name: true, username: true } },
            phases: { orderBy: { position: "asc" } },
          },
        },
      },
    }),
  ]);

  return { created, acquired };
}

export async function userCanAccessProject(userId: string, projectId: string) {
  const project = await db.project.findUnique({ where: { id: projectId }, select: { creatorId: true } });
  if (!project) return false;
  if (project.creatorId === userId) return true;

  const entitlement = await db.projectEntitlement.findUnique({
    where: { userId_projectId: { userId, projectId } },
    select: { id: true },
  });
  return Boolean(entitlement);
}
