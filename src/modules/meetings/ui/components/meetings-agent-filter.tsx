import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { MAX_PAGE_SIZE } from "@/constants";
import { Check, ChevronDownIcon, ChevronUpIcon, BotIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MeetingsFilter } from "../../hooks/use-meetings-filters";

export const MeetingsAgentsFilter = () => {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = MeetingsFilter();
  const { data: agentsData, isLoading } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ pageSize: MAX_PAGE_SIZE })
  );

  const selectedAgent = agentsData?.items.find((agent) => {
    return agent.name === filter.agentName;
  });

  const handleSelect = (agentName: string) => {
    if (filter.agentName === agentName) {
      setFilter({ ...filter, agentName: "", page: 1 });
    } else {
      setFilter({ ...filter, agentName: agentName, page: 1 });
    }
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-9 w-[200px] justify-between bg-white",
            !filter.agentName && "text-muted-foreground"
          )}
        >
          {filter.agentName && selectedAgent ? (
            <div className="flex items-center gap-2 truncate">
              <Image
                src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${selectedAgent.name}`}
                width={16}
                height={16}
                alt={selectedAgent.name}
                className="rounded-full shrink-0"
              />
              <span className="truncate text-sm">{selectedAgent.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <BotIcon className="size-4" />
              <span className="text-sm">
                {!!selectedAgent ? selectedAgent.name : "All Agents"}
              </span>
            </div>
          )}
          {open ? (
            <ChevronUpIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          ) : (
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search agents..." className="h-9" />
          <CommandList>
            <CommandEmpty>No agents found</CommandEmpty>
            <CommandGroup>
              {/* Option to show all agents */}
              <CommandItem
                value="all"
                onSelect={() => {
                  setFilter({ agentName: "", page: 1 });
                  setOpen(false);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    !filter.agentName ? "opacity-100" : "opacity-0"
                  )}
                />
                <BotIcon className="mr-2 size-4" />
                <span className="text-sm">All Agents</span>
              </CommandItem>

              {/* List all agents */}
              {agentsData?.items.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.name}
                  onSelect={() => handleSelect(agent.name)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      filter.agentName === agent.name
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <Image
                    src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${agent.name}`}
                    width={16}
                    height={16}
                    alt={agent.name}
                    className="mr-2 rounded-full"
                  />
                  <span className="text-sm truncate">{agent.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
