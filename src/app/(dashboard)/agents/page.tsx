import { LoadingState } from "@/components/loading-state";
import { AgentsHeader } from "@/modules/agents/ui/components/agents-header";
import { AgentsView } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const Page = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <>
      <AgentsHeader  />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <LoadingState
              title="Loading Agents"
              description="This may take a while"
            />
          }
        >
          <AgentsView />
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
