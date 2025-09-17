"use client";

import { useTRPC } from "@/trpc/client";
import { MeetingsGetOne } from "../../types";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { meetingsInsertSchema } from "../../schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
  isInitial: boolean;
  initialValues: MeetingsGetOne;
}

export const MeetingsForm = ({
  onSuccess,
  onCancel,
  isInitial,
  initialValues,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  type meetingsFormData = z.infer<typeof meetingsInsertSchema>;
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
  const form = useForm<meetingsFormData>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name || "",
      agentId: initialValues?.agentId || "",
      scheduledAt: new Date() || initialValues?.scheduledAt,
      status: "active",
    },
  });
  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Agent Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="agentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl></FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
