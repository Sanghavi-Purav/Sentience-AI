"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentsGetOne } from "../../types";
import Image from "next/image";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<AgentsGetOne>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <Image
            src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${row.original.name}`}
            width={40}
            height={40}
            alt="avatar"
            className="rounded-full"
          />
          <span className="capitalize font-semibold ">{row.original.name}</span>
        </div>

        <div className="flex items-center gap-x-2">
          <CornerDownRightIcon className="size-3 text-muted-foreground" />
          <span className="text-small text-muted-foreground max-w-[200px] truncate capitalize">
            {row.original.instructions}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "Meeting Count",
    header: "Meetings",
    cell: ({ row }) => (
      <Badge
        className="flex items-center gap-x-2 [&>svg]:size-4 "
        variant="outline"
      >
        <VideoIcon className="text-blue-700" />5 Meetings
      </Badge>
    ),
  },
];
