import { Input } from "@/components/ui/input";
import { AgentsFilter } from "../../hooks/use-agent-filters";
import { SearchIcon } from "lucide-react";

export const SearchFilter = () => {
  const [filters, setFilters] = AgentsFilter();
  return (
    <div className="relative">
      <Input
        placeholder="Search by name"
        value={filters.search}
        onChange={(e) => {
          setFilters({ search: e.target.value, page: 1 });
        }}
        className="h-9 bg-white w-[200px] pl-7"
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};
