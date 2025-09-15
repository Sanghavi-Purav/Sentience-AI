"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialogue } from "./new-agent-dialogue";
import { useState } from "react";
import { AgentsFilter } from "../../hooks/use-agent-filters";
import { SearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsHeader = () => {
  const [filters, setFilters] = AgentsFilter();
  const [dialogueOpen, setDialogueOpen] = useState(false);

  const isSearchModified = !!filters.search;
  const onClearFilters = () => {
    setFilters({
      page: DEFAULT_PAGE,
      search: "",
    });
  };

  return (
    <>
      <NewAgentDialogue
        isEdit={false}
        open={dialogueOpen}
        onOpenChange={setDialogueOpen}
      />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between ">
          <h5 className="font-medium text-xl ">My Agents</h5>
          <Button
            onClick={() => {
              setDialogueOpen(true);
            }}
          >
            {" "}
            <PlusIcon /> New Agent{" "}
          </Button>
        </div>
        <div className="flex items-center  gap-x-2 p-1">
          <SearchFilter />
          {isSearchModified && (
            <Button onClick={onClearFilters} variant="outline">
              {" "}
              <XCircleIcon /> Clear
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
