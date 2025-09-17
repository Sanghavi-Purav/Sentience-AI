"use client";

import { Button } from "@/components/ui/button";
import { Calendar, PlusIcon } from "lucide-react";
import { useState } from "react";
import { NewMeetingsDialogue } from "./new-meetings-dialogue";
import { MeetingsFilter } from "../../hooks/use-meetings-filters";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const MeetingsHeader = () => {
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [isInstant, setisInstant] = useState(false);
  const [filters, setFilter] = MeetingsFilter();
  return (
    <>
      <NewMeetingsDialogue
        open={dialogueOpen}
        onOpenChange={setDialogueOpen}
        isEdit={false}
      />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between ">
          <h5 className="font-medium text-xl ">My Meetings</h5>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button>
                {" "}
                <PlusIcon /> New Meeting{" "}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setisInstant(true);
                  setDialogueOpen(true);
                }}
              >
                <PlusIcon className="text-black size-4" />
                Start Meeting Instantly
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setisInstant(false);
                  setDialogueOpen(true);
                }}
              >
                <Calendar className="size-4 text-black" />
                Schedule later
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

// <DropdownMenu modal={false}>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost">
//             <MoreVerticalIcon />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuItem
//             onClick={() => {

//             }}
//           >
//             <PencilIcon className="text-black size-4" />
//             Edit
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={() => {

//             }}
//           >
//             <TrashIcon className="text-black size-4" />
//             Remove
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
