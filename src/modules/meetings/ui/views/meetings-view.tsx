"use client";
import { useRouter } from "next/navigation";
import { MeetingsFilter } from "../../hooks/use-meetings-filters";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = MeetingsFilter();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ ...filters })
  );
  return (
    <div className="flex items-center justify-center">
      {JSON.stringify(data.items, null, 2)}
    </div>
  );
};
