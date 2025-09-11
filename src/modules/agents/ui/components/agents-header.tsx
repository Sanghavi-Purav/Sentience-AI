"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialogue } from "./new-agent-dialogue";
import { useState } from "react";

export const AgentsHeader = () => {
  const [dialogueOpen, setDialogueOpen] = useState(false);
  return (
    <>
      <NewAgentDialogue open={dialogueOpen} onOpenChange={setDialogueOpen} />
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
      </div>
    </>
  );
};
