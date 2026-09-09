import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(5).max(140),
  description: z.string().min(20).max(3000),
  category: z.string().min(2).max(80),
  level: z.string().max(60).optional(),
  access: z.enum(["FREE", "PAID"]).default("FREE"),
  price: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default("GHS"),
}).superRefine((data, ctx) => {
  if (data.access === "PAID" && (!data.price || data.price < 100)) {
    ctx.addIssue({ code: "custom", path: ["price"], message: "Paid courses require a price in the smallest currency unit." });
  }
});
