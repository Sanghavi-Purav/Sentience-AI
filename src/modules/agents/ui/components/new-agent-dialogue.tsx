import { ResponsiveDialogue } from "@/components/responsive-dialogue";
import { Button } from "@/components/ui/button";
import { Dispatch } from "react";
import { AgentForm } from "./agents-form";

interface NewResponsiveDialogue {
  open: boolean;
  onOpenChange: Dispatch<React.SetStateAction<boolean>>;
}

export const NewAgentDialogue = ({
  open,
  onOpenChange,
}: NewResponsiveDialogue) => {
  return (
    <ResponsiveDialogue
      open={open}
      onOpenChange={onOpenChange}
      title="New Agent"
      description="Create a new Agent"
    >
      <AgentForm/>
    </ResponsiveDialogue>
  );
};
