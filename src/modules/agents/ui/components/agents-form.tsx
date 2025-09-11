import { useTRPC } from "@/trpc/client";
import { AgentsGetOne } from "../../types";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface AgentFormProps {
  onSucces?: () => void;
  onCancel?: () => void;
  initialValues?: AgentsGetOne;
}

export const AgentForm = ({
  onSucces,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC;
  const router = useRouter();
  const queryClient = useQueryClient();
  return <> </>;
};
