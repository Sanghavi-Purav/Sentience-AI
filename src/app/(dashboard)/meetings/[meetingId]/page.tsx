import { LoadingState } from "@/components/loading-state";
import { MeetingsIdView } from "@/modules/meetings/ui/views/meetings-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,
  HydrationBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{ meetingId: string }>;
}

const Page = async ({ params }: Props) => {
  const { meetingId } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="Loading Agent"
            description="This may take a while"
          />
        }
      >
        <MeetingsIdView meetingId={meetingId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
