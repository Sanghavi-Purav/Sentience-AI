import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterInputs } from "@trpc/server";

export type AgentsGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];

