import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Check, Clock } from "lucide-react";
import { meetingsFormSchema } from "../../schema";
import { z } from "zod";

type MeetingsFormData = z.infer<typeof meetingsFormSchema>;

interface Props {
  field: ControllerRenderProps<MeetingsFormData, "scheduledAt">;
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

export const MeetingsTimeDropdown = ({ field }: Props) => {
  const [openTimePicker, setOpenTimePicker] = useState(false);
  
  // Get current time from field value
  const getCurrentTime = (): string => {
    if (!field.value) return "";
    const date = new Date(field.value);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const selectedTime = getCurrentTime();

  const handleTimeSelect = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const currentDate = field.value ? new Date(field.value) : new Date();
    currentDate.setHours(hours, minutes, 0, 0);
    field.onChange(currentDate);
    setOpenTimePicker(false);
  };

  return (
    <Popover open={openTimePicker} onOpenChange={setOpenTimePicker}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            type="button" 
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedTime && "text-muted-foreground"
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            {selectedTime ? selectedTime : <span>Pick a time</span>}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Command>
          <CommandInput placeholder="Search time..." />
          <CommandList>
            <CommandEmpty>No time slot found.</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-2 gap-1">
                {timeSlots.map((time) => (
                  <CommandItem
                    key={time}
                    value={time}
                    onSelect={() => handleTimeSelect(time)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTime === time ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {time}
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};