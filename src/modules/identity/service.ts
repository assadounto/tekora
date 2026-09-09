import { db } from "@/lib/db";
import type { OnboardingInput } from "./schemas";

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function createTekoraIdentity(input: OnboardingInput) {
  return db.$transaction(async (tx) => {
    const institution = input.institution
      ? await tx.institution.upsert({
          where: { slug: slugify(input.institution) },
          update: {},
          create: { name: input.institution, slug: slugify(input.institution) },
        })
      : null;

    const program = input.program
      ? await tx.program.create({
          data: {
            name: input.program,
            slug: slugify(input.program),
            institutionId: institution?.id,
          },
        }).catch(() =>
          tx.program.findFirstOrThrow({
            where: { slug: slugify(input.program!), institutionId: institution?.id ?? null },
          })
        )
      : null;

    const user = await tx.user.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name,
        username: input.username.toLowerCase(),
        onboardingCompleted: true,
        roles: { create: input.roles.map((role) => ({ role })) },
        profile: {
          create: {
            institutionId: institution?.id,
            programId: program?.id,
            level: input.level,
            goal: input.goal,
          },
        },
      },
    });

    for (const name of input.skills) {
      const skill = await tx.skill.upsert({
        where: { slug: slugify(name) },
        update: {},
        create: { name, slug: slugify(name) },
      });
      await tx.userSkill.create({ data: { userId: user.id, skillId: skill.id } });
    }

    for (const name of input.interests) {
      const interest = await tx.interest.upsert({
        where: { slug: slugify(name) },
        update: {},
        create: { name, slug: slugify(name) },
      });
      await tx.userInterest.create({ data: { userId: user.id, interestId: interest.id } });
    }

    return tx.user.findUniqueOrThrow({
      where: { id: user.id },
      include: {
        roles: true,
        profile: { include: { institution: true, program: true } },
        skills: { include: { skill: true } },
        interests: { include: { interest: true } },
      },
    });
  });
}
