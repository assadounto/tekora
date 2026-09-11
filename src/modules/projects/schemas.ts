import { z } from "zod";

export const createProjectSchema = z
  .object({
    title: z.string().trim().min(3).max(120),
    summary: z.string().trim().min(20).max(500),
    description: z.string().trim().max(5000).optional(),
    field: z.string().trim().min(2).max(100),
    area: z.string().trim().max(100).optional(),
    difficulty: z.enum(["SIMPLE", "INTERMEDIATE", "ADVANCED"]).default("INTERMEDIATE"),
    modes: z.array(z.enum(["DIY", "GUIDED", "KIT_READY"])).min(1).default(["GUIDED"]),
    access: z.enum(["FREE", "PAID"]).default("FREE"),
    price: z.number().int().nonnegative().optional(),
    currency: z.string().trim().length(3).default("GHS"),
  })
  .superRefine((value, ctx) => {
    if (value.access === "PAID" && (!value.price || value.price < 100)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Paid projects need a price of at least GHS 1.00.",
      });
    }
  });

export const projectRequestSchema = z.object({
  title: z.string().trim().min(3).max(120),
  field: z.string().trim().min(2).max(100),
  area: z.string().trim().max(100).optional(),
  difficulty: z.enum(["SIMPLE", "INTERMEDIATE", "ADVANCED"]).default("INTERMEDIATE"),
  description: z.string().trim().min(20).max(3000),
  support: z.string().trim().max(2000).optional(),
  budget: z.number().int().nonnegative().optional(),
  currency: z.string().trim().length(3).default("GHS"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;
