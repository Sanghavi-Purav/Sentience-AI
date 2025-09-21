"use client";
import { useRouter } from "next/navigation";
import { MeetingsFilter } from "../../hooks/use-meetings-filters";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { MeetingsPagination } from "../components/meetings-pagination";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = MeetingsFilter();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ ...filters })
  );
  const router = useRouter();
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
      <MeetingsPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first Meeting"
          description="Create a meeting by clicking on the New Meeting button to be able to create meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};
