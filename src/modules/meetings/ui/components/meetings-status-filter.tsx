import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MeetingsFilter } from "../../hooks/use-meetings-filters";

const statusOptions = [
  { value: "all", label: "All Status", color: "" },
  { value: "upcoming", label: "Upcoming", color: "text-blue-600" },
  { value: "active", label: "Active", color: "text-green-600" },
  { value: "completed", label: "Completed", color: "text-gray-600" },
  { value: "processing", label: "Processing", color: "text-yellow-600" },
  { value: "cancelled", label: "Cancelled", color: "text-red-600" },
];

export const MeetingsStatusFilter = () => {
  const [filters, setFilters] = MeetingsFilter();

  return (
    <Select
      value={filters.status}
      onValueChange={(value) => {
        setFilters({
          status: value as typeof filters.status,
          page: 1,
        });
      }}
    >
      <SelectTrigger className="h-9 w-[150px] bg-white">
        <SelectValue placeholder="Filter by status">
          {(() => {
            const selected = statusOptions.find(
              (opt) => opt.value === filters.status
            );
            return <span className={selected?.color}>{selected?.label}</span>;
          })()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className={option.color}>{option.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
