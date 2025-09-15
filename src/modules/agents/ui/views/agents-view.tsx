"use client";
import { LoadingState } from "@/components/loading-state";
import { ResponsiveDialogue } from "@/components/responsive-dialogue";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns, Payment } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { AgentsFilter } from "../../hooks/use-agent-filters";
import { AgentsPagination } from "../components/agents-pagination";
import { useRouter } from "next/navigation";

export const AgentsView = () => {
  const trpc = useTRPC();

  const [filters, setFilters] = AgentsFilter();
  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      ...filters,
    })
  );
  const router = useRouter();

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-4 ">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/agents/${row.id}`)}
      />
      <AgentsPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first Agent"
          description="Create an agent by clicking on the new agent button to be able to join meetings. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
};
