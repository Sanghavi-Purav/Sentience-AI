import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import { meetingsInsertSchema } from "../schema";

export const meetingsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
        status: z
          .enum([
            "all",
            "upcoming",
            "active",
            "completed",
            "processing",
            "cancelled",
          ])
          .default("all"),
        agentName: z.string().default(""),
      })
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search, status, agentName } = input;

      const whereConditions = [
        eq(meetings.userId, ctx.auth.user.id),
        search.trim() ? ilike(meetings.name, `%${search}%`) : undefined,
        agentName.trim() ? ilike(agents.name, `%${agentName}%`) : undefined,
        status !== "all"
          ? eq(
              meetings.status,
              status as
                | "upcoming"
                | "active"
                | "completed"
                | "processing"
                | "cancelled"
            )
          : undefined,
      ];

      const baseQuery = db
        .select({
          meetings,
          agent: {
            id: agents.id,
            name: agents.name,
          },
        })
        .from(meetings)
        .leftJoin(agents, eq(meetings.agentId, agents.id));

      const data = await baseQuery
        .where(and(...whereConditions))
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .leftJoin(agents, eq(meetings.agentId, agents.id))
        .where(and(...whereConditions));

      const totalPages = Math.ceil(total.count / pageSize);
      return { items: data, total: total.count, totalPages };
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [currentMeeting] = await db
        .select({
          ...getTableColumns(meetings),
          agents: {
            name: agents.name,
          },
        })
        .from(meetings)
        .leftJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );
      if (!currentMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }
      return currentMeeting;
    }),
  createMeetings: protectedProcedure
    .input(meetingsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.agentId) {
        const [agent] = await db
          .select(getTableColumns(agents))
          .from(agents)
          .where(
            and(
              eq(agents.id, input.agentId),
              eq(agents.userId, ctx.auth.user.id)
            )
          );
        if (!agent) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This Agent does not exist",
          });
        }
      }

      if(input.status==="upcoming"){
        
      }

      const [createdMeeting] = await db
        .insert(meetings)
        .values({ ...input, agentId: input.agentId, userId: ctx.auth.user.id })
        .returning();
    }),
});
