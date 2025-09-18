import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { meetingsFormSchema } from "../../schema";
import { z } from "zod";

type MeetingsFormData = z.infer<typeof meetingsFormSchema>;

interface Props {
  field: ControllerRenderProps<MeetingsFormData, "scheduledAt">;
}

export const MeetingsDayDropdown = ({ field }: Props) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      field.onChange(date);
      // Small delay to ensure the selection is processed before closing
      setTimeout(() => setOpenDatePicker(false), 100);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpenDatePicker(open);
  };

  return (
    <Popover open={openDatePicker} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
            onClick={() => setOpenDatePicker(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        align="start"
        onInteractOutside={(e) => {
          // Prevent closing when clicking inside the calendar
          const target = e.target as Element;
          if (target.closest('[role="dialog"]')) {
            e.preventDefault();
          }
        }}
      >
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={handleDateSelect}
          disabled={(date) =>
            date < new Date(new Date().setHours(0, 0, 0, 0))
          }
          initialFocus
          fixedWeeks
        />
      </PopoverContent>
    </Popover>
  );
};