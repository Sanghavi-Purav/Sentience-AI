import { z } from "zod";

export const agentsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  instructions: z.string().min(1, { message: "Instructions are required" }),
});

export const agentsEditSchema = z.object({
  id: z.string().min(1, { message: "Id is required" }),
  name: z.string().min(1, { message: "name is required" }),
  instructions: z.string().min(1, { message: "Instructions are required" }),
});
