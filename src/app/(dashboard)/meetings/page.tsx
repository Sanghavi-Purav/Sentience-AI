import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchParams } from "nuqs";
import { LoadingState } from "@/components/loading-state";
import { loadMeetingsSearchParams } from "@/modules/meetings/params";
import { MeetingsHeader } from "@/modules/meetings/ui/components/meetings-header";
import { MeetingsView } from "@/modules/meetings/ui/views/meetings-view";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadMeetingsSearchParams(searchParams);
  const queryClient = getQueryClient();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  await queryClient.prefetchQuery(
    trpc.meetings.getMany.queryOptions({ ...filters })
  );

  if (!session) {
    redirect("/sign-in");
  }
  return (
    <>
      <MeetingsHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <LoadingState
              title="Loading Meetings"
              description="This may take a while"
            />
          }
        ></Suspense>
      </HydrationBoundary>
    </>
  );
};

export default Page;
