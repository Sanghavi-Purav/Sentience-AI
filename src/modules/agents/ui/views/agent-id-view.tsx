"use client";

import { useTRPC } from "@/trpc/client";
import {
  QueryClient,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { AgentIdHeader } from "../components/agents-id-header";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const queryclient = useQueryClient();
  const router = useRouter();
  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const removeAgent = useMutation(
    trpc.agents.Remove.mutationOptions({
      onSuccess: async () => {
        await queryclient.invalidateQueries(
          trpc.agents.getMany.queryOptions({})
        );
        router.push("/agents");
      },
    })
  );
  return (
    <div className="flex-1 py-4 pz-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdHeader
        name={data.name}
        id={agentId}
        onRemove={() => {
          removeAgent.mutate({ id: agentId });
        }}
        meetingCount={data.meetingCount}
        currentAgent={data}
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
            <Image
              src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${data.name}`}
              width={40}
              height={40}
              alt="avatar"
              className="rounded-full"
            />
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <VideoIcon className="text-blue-700" />
            {data.meetingCount}{" "}
            {data.meetingCount === 1 ? "Meeting" : "Meetings"}
          </Badge>
          <div className="flex flex-col gap-y-2">
            <p className="textt-lg font-medium">Instructions</p>
            <p className="text-neutral-800">{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
