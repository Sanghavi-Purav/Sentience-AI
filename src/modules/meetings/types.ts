import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type MeetingsGetOne =
  inferRouterOutputs<AppRouter>["meetings"]["getOne"];

export type MeetingsGetMany =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"];
