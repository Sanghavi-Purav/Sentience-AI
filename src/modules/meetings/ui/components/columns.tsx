import { ColumnDef } from "@tanstack/react-table";
import {  MeetingsGetOne } from "../../types";
import { format } from "date-fns";
import Image from "next/image";
import humanizeDuration from "humanize-duration";
import { cn } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

const statusIconMap = {
  active: LoaderIcon,
  upcoming: ClockArrowUpIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap = {
  active: "text-green-600",
  upcoming: "text-blue-600",
  completed: "text-gray-600",
  processing: "text-yellow-600",
  cancelled: "text-red-600",
};

export const columns: ColumnDef<MeetingsGetOne>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <span className="font-semibold capitalize">{row.original.name}</span>
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-1">
              <CornerDownRightIcon className="size-4" />
              <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize ">
                {row.original.agent?.name}
              </span>
            </div>
            <Image
              src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${row.original.agent?.name}`}
              width={20}
              height={20}
              alt={row.original.agent?.name || ""}
              className="rounded-full"
            />
            <span>
              {row.original.startedAt
                ? format(row.original.startedAt, "MM d")
                : ""}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const StatusIcon =
        statusIconMap[row.original.status as keyof typeof statusIconMap];

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            statusColorMap[row.original.status as keyof typeof statusColorMap]
          )}
        >
          <StatusIcon
            className={cn(
              "size-4 mr-1",
              row.original.status === "processing" && "animate-spin"
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className={cn("[&>svg]:size-4 flex items-center gap-x-2 capitalize")}
        >
          {row.original.duration
            ? formatDuration(row.original.duration)
            : "No duration"}
        </Badge>
      );
    },
  },
];
