"use client";

import { useTRPC } from "@/trpc/client";
import { MeetingsGetOne } from "../../types";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { meetingsFormSchema, meetingsInsertSchema } from "../../schema";
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
import { MeetingsAgentsDropdown } from "./meetings-agents-dropdown";
import { MeetingsDayDropdown } from "./meetings-day-dropdown";
import { MeetingsTimeDropdown } from "./meetings-time-dropdown";
import { Button } from "@/components/ui/button";
interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
  isInstant: boolean;
  initialValues?: MeetingsGetOne;
}

export const MeetingsForm = ({
  onSuccess,
  onCancel,
  isInstant,
  initialValues,
}: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  type meetingsFormData = z.infer<typeof meetingsInsertSchema>;
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
  const form = useForm<meetingsFormData>({
    resolver: zodResolver(meetingsFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      agentId: initialValues?.agentId || "",
      scheduledAt: initialValues?.scheduledAt
        ? typeof initialValues.scheduledAt === "string"
          ? new Date(initialValues.scheduledAt)
          : initialValues.scheduledAt
        : new Date(),
      status: !isInstant ? "upcoming" : "active",
    },
  });

  const createMeetings = useMutation(
    trpc.meetings.createMeetings.mutationOptions({
      onSuccess: () => {
        console.log("meeting created successfully", data);
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        onSuccess?.();
      },
      onError: (error) => {
        console.error("❌ Error creating meeting:", error);
        console.error("Error details:", {
          message: error.message,
          data: error.data,
          
        });
      },
    })
  );

  const isPending = createMeetings.isPending;

  const onSubmit = ({
    name,
    agentId,
    scheduledAt,
    status,
  }: z.infer<typeof meetingsInsertSchema>) => {
    if (initialValues?.id) {
      console.log("Edit meeting still in progress");
    } else {
      createMeetings.mutate({ name, agentId, scheduledAt, status });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Meeting Name" />
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
              <FormControl>
                <MeetingsAgentsDropdown
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {!isInstant && (
          <FormField
            name="scheduledAt"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Meeting Date</FormLabel>
                  <MeetingsDayDropdown field={field} />
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Meeting Time</FormLabel>
                  <MeetingsTimeDropdown field={field} />
                </FormItem>
              </div>
            )}
          />
        )}
        <div className="space-x-2">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {initialValues?.agentId ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
