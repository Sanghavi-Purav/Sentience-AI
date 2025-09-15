import { ResponsiveDialogue } from "@/components/responsive-dialogue";
import { Button } from "@/components/ui/button";
import { Dispatch } from "react";
import { AgentForm } from "./agents-form";
import { AgentsGetOne } from "../../types";

interface NewResponsiveDialogue {
  open: boolean;
  isEdit: boolean;
  onOpenChange: Dispatch<React.SetStateAction<boolean>>;
  initialAgent?: AgentsGetOne;
}

export const NewAgentDialogue = ({
  open,
  isEdit,
  onOpenChange,
  initialAgent,
}: NewResponsiveDialogue) => {
  return (
    <ResponsiveDialogue
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Agent" : "New Agent"}
      description={isEdit ? "Edit your Agent" : "Create a New Agent"}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialAgent}
      />
    </ResponsiveDialogue>
  );
};
