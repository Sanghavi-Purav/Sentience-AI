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

export const meetingsEditSchema = z.object({
  id: z.string().min(1, { message: "Meeting Id is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "Agent is required" }),
  status: z.enum([
    "active",
    "upcoming",
    "completed",
    "processing",
    "cancelled",
  ]),
  scheduledAt: z
    .union([z.date(), z.string().pipe(z.coerce.date()), z.null()])
    .optional()
    .transform((val) => {
      if (!val || val === null) return null;
      if (val instanceof Date) return val;
      return new Date(val);
    }),
  makeInstant: z.boolean().optional().default(false),
});

export const meetingsEditFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "Agent is required" }),
  status: z.enum([
    "upcoming",
    "active",
    "completed",
    "processing",
    "cancelled",
  ]),
  scheduledAt: z.date().nullable().optional(),
  makeInstant: z.boolean().optional(),
});
