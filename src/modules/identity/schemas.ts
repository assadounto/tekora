import { z } from "zod";

export const onboardingSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  roles: z.array(z.enum(["LEARNER","CREATOR","MENTOR","PROFESSIONAL","EMPLOYER"])).min(1),
  institution: z.string().max(160).optional(),
  program: z.string().max(160).optional(),
  level: z.string().max(80).optional(),
  goal: z.string().max(1000).optional(),
  skills: z.array(z.string().min(1).max(80)).max(30).default([]),
  interests: z.array(z.string().min(1).max(80)).max(30).default([]),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
