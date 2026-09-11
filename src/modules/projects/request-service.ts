import { db } from "@/lib/db";
import type { ProjectRequestInput } from "./schemas";

export function createProjectRequest(userId: string, input: ProjectRequestInput) {
  return db.projectRequest.create({
    data: {
      userId,
      title: input.title,
      field: input.field,
      area: input.area,
      difficulty: input.difficulty,
      description: input.description,
      support: input.support,
      budget: input.budget,
      currency: input.currency.toUpperCase(),
    },
  });
}

export function userProjectRequests(userId: string) {
  return db.projectRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function adminProjectRequests() {
  return db.projectRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true, username: true } },
    },
  });
}

export function updateProjectRequestStatus(requestId: string, status: "SUBMITTED" | "REVIEWING" | "APPROVED" | "DECLINED" | "FULFILLED") {
  return db.projectRequest.update({
    where: { id: requestId },
    data: { status },
  });
}
