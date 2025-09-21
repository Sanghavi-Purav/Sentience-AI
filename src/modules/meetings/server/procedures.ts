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
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { meetingsEditSchema, meetingsInsertSchema } from "../schema";
import { boolean } from "drizzle-orm/gel-core";

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
      ].filter(boolean);

      const baseQuery = db
        .select({
          ...getTableColumns(meetings),
          agent: {
            id: agents.id,
            name: agents.name,
          },
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
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
          agent: {
            id: agents.id,
            name: agents.name,
          },
          duration: sql<number>`EXTRACT(EPOCH FROM(ended_at-started_at))`.as(
            "duration"
          ),
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

      const scheduledTime =
        input.status === "upcoming" ? new Date(input?.scheduledAt) : new Date();
      const startTime = input.status === "active" ? new Date() : null;

      const [createdMeeting] = await db
        .insert(meetings)
        .values({
          ...input,
          agentId: input.agentId,
          userId: ctx.auth.user.id,
          scheduledAt: scheduledTime,
          startedAt: startTime,
        })
        .returning();
    }),
  ReomveMeeting: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [removedMeeting] = await db
        .delete(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();

      if (!removedMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
      }
    }),

  EditMeeting: protectedProcedure
    .input(meetingsEditSchema)
    .mutation(async ({ input, ctx }) => {
      const { name, agentId, id, scheduledAt, status, makeInstant } = input;

      const [currentMeeting] = await db
        .select()
        .from(meetings)
        .where(and(eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)));

      if (!currentMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Meeting not found or you are not authorized to update this meeting",
        });
      }
      if (agentId != currentMeeting.agentId) {
        const [agent] = await db
          .select()
          .from(agents)
          .where(
            and(eq(agents.id, agentId), eq(agents.userId, ctx.auth.user.id))
          );

        if (!agent) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Selected agent does not exist or does not belong to you",
          });
        }
      }

      type MeetingStatus =
        | "upcoming"
        | "active"
        | "completed"
        | "processing"
        | "cancelled";

      const validTransitions: Record<MeetingStatus, MeetingStatus[]> = {
        completed: [],
        cancelled: [],
        processing: ["cancelled"],
        upcoming: ["active", "cancelled"],
        active: ["processing", "completed"],
      };
      if (
        currentMeeting.status !== status &&
        !validTransitions[currentMeeting.status].includes(status)
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `The transition from ${currentMeeting.status} to ${status} is not possible`,
        });
      }

      const updateData: any = {
        name,
        agentId,
        updatedAt: new Date(),
      };

      if (currentMeeting.status !== status) {
        updateData.status = status;
      }

      switch (true) {
        case currentMeeting.status === "upcoming" && status === "active":
          updateData.startedAt = new Date();
          updateData.scheduledAt = new Date();
          break;
        case currentMeeting.status === "upcoming" && status === "cancelled":
          updateData.endedAt = new Date();
          break;
        case status === "upcoming" && !!scheduledAt:
          updateData.scheduledAt = scheduledAt;
          break;
        case currentMeeting.status === "active" &&
          (status === "completed" || status === "processing"):
          updateData.endedAt = new Date();
          break;
        case currentMeeting.status === "processing" && status === "cancelled":
          break;
        // yet to implement what will be done for status cancelled
      }

      const [updatedMeeting] = await db
        .update(meetings)
        .set(updateData)
        .where(and(eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)))
        .returning();

      return updatedMeeting;
    }),
});
