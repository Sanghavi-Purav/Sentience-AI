import { z } from "zod";

export const meetingsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "Agent is required" }),
  status: z.enum(["active", "upcoming"]),
  scheduledAt: z
    .union([z.date(), z.string().pipe(z.coerce.date())])
    .transform((val) => {
      if (val instanceof Date) return val;
      return new Date(val);
    }),
});

export const meetingsFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "Agent is required" }),
  status: z.enum(["active", "upcoming"]),
  scheduledAt: z.date(),
});
