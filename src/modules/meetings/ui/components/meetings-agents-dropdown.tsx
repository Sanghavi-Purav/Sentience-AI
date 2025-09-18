"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { MAX_PAGE_SIZE } from "@/constants";


interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MeetingsAgentsDropdown = ({
  value,
  onChange,
  placeholder = "Select your agent",
  disabled = false,
}: Props) => {
  const trpc = useTRPC();
  const { data: agentsData, isLoading } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({
      pageSize:MAX_PAGE_SIZE
    })
  );
  const [open, setOpen] = useState(false);
  const selectedAgent = agentsData?.items.find((agent) => agent.id === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {value && selectedAgent ? (
            <div className="flex items-center gap-2">
              <Image
                src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${selectedAgent.name}`}
                width={20}
                height={20}
                alt={selectedAgent.name}
                className="rounded-full"
              />
              <span className="truncate">{selectedAgent.name}</span>
            </div>
          ) : (
            <span>{isLoading ? "Loading Agents..." : placeholder}</span>
          )}
          {open ? (
            <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          ) : (
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search Agents" />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading Agents" : "No Agents Found"}
            </CommandEmpty>
            <CommandGroup>
              {agentsData?.items.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.name}
                  onSelect={() => {
                    onChange(agent.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === agent.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Image
                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${agent.name}`}
                    width={20}
                    height={20}
                    alt={agent.name}
                    className="mr-2 rounded-full"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {agent.instructions}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
