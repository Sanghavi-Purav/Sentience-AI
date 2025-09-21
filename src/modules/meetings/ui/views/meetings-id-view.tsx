"use client";

import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MeetingsIdHeader } from "../components/meetings-id-header";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";

interface Props {
  meetingId: string;
}
export const MeetingsIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const removeAgent = useMutation(
    trpc.meetings.ReomveMeeting.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        router.push("/meetings");
      },
    })
  );

  return (
    <div className="flex-1 py-4 pz-4 md:px-8 flex flex-col gap-y-4">
      <MeetingsIdHeader
        id={meetingId}
        name={data.name}
        currentMeeting={data}
        onRemove={() => removeAgent.mutate({ id: meetingId })}
      />
    </div>
  );
};
